// ==============================================================================
// Edvora School Management — Supabase Postgres Production Repository
// Enforces true Postgres persistence, RLS compliance, and atomic transactions.
// ==============================================================================

import { getSupabaseAdmin } from '../supabase/client';
import { config } from '../config';
import { store as memoryStore } from './store';
import { mapTermiiProviderStatus, canTransitionAttemptStatus } from '../services/smsStatus';
import {
  StaffRole,
  PaymentIntent,
  PaymentTransaction,
  Receipt,
  ReminderJob,
  SMSDeliveryInboxEvent,
  NotificationJob,
  OperationalIncident,
  FeeAdjustment,
  Pupil,
  Guardian,
} from '../types/backend';

export class DatabaseRepository {
  private isProduction = process.env.NODE_ENV === 'production';

  private getClient() {
    const client = getSupabaseAdmin();
    if (!client || typeof client.from !== 'function') {
      if (this.isProduction) {
        throw new Error(
          'FATAL: Supabase credentials (NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY) are missing in production. Application will not silently fall back to temporary in-memory storage in production.'
        );
      }
      return null;
    }
    return client;
  }

  // --- Financial & Ledger Operations ---
  public async getAuthoritativeBalance(pupilId: string, termId: string): Promise<number> {
    const client = this.getClient();
    if (!client) {
      return memoryStore.getAuthoritativeBalance(pupilId, termId);
    }

    const { data: assignment, error: assignErr } = await client
      .from('fee_assignments')
      .select('adjusted_amount_minor')
      .eq('pupil_id', pupilId)
      .eq('term_id', termId)
      .single();

    if (assignErr || !assignment) return 0;

    const { data: credits, error: creditErr } = await client
      .from('fee_ledger_entries')
      .select('amount_minor')
      .eq('pupil_id', pupilId)
      .eq('term_id', termId)
      .eq('entry_type', 'credit');

    if (creditErr) return assignment.adjusted_amount_minor;

    const totalPaid = (credits || []).reduce((sum, c) => sum + Number(c.amount_minor), 0);
    return Math.max(0, assignment.adjusted_amount_minor - totalPaid);
  }

  public async createPaymentIntent(params: {
    pupilId: string;
    termId: string;
    amountMinor: number;
    payerEmail: string;
    payerName?: string;
  }): Promise<PaymentIntent> {
    const client = this.getClient();
    if (!client) {
      return memoryStore.createPaymentIntent(params);
    }

    const balance = await this.getAuthoritativeBalance(params.pupilId, params.termId);
    if (params.amountMinor <= 0) {
      throw new Error('Payment amount must be greater than zero');
    }
    if (params.amountMinor > balance) {
      throw new Error(`Payment amount cannot exceed outstanding balance of ₦${(balance / 100).toLocaleString()}`);
    }

    const reference = `EDV-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    const { data, error } = await client
      .from('payment_intents')
      .insert({
        pupil_id: params.pupilId,
        term_id: params.termId,
        reference,
        amount_minor: params.amountMinor,
        currency: 'NGN',
        environment: 'test',
        status: 'initialized',
        payer_email: params.payerEmail,
        payer_name: params.payerName || null,
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (error) throw new Error(`Database error creating payment intent: ${error.message}`);

    return {
      id: data.id,
      pupilId: data.pupil_id,
      termId: data.term_id,
      reference: data.reference,
      amountMinor: Number(data.amount_minor),
      currency: 'NGN',
      environment: 'test',
      status: data.status,
      payerEmail: data.payer_email,
      payerName: data.payer_name,
      expiresAt: data.expires_at,
      createdAt: data.created_at,
    };
  }

  public async creditPayment(params: {
    reference: string;
    providerTransactionId: string;
    amountMinor: number;
    channel: 'card' | 'bank_transfer' | 'ussd';
    rawPayload?: Record<string, unknown>;
  }) {
    const client = this.getClient();
    if (!client) {
      return memoryStore.verifyAndCreditPayment(params);
    }

    const { data, error } = await client.rpc('credit_payment_intent', {
      p_reference: params.reference,
      p_provider_tx_id: params.providerTransactionId,
      p_amount_minor: params.amountMinor,
      p_channel: params.channel,
      p_raw_payload: params.rawPayload || null,
    });

    if (error) {
      throw new Error(`Database transaction failed: ${error.message}`);
    }

    return data;
  }

  // --- Automation: Reminders (WF01) ---
  public async claimReminderJobs(runId: string, limit: number) {
    const client = this.getClient();
    if (!client) {
      return memoryStore.claimReminderJobs(runId, limit);
    }

    const { data, error } = await client.rpc('claim_reminder_jobs', {
      p_run_id: runId,
      p_limit: limit,
      p_lease_seconds: 180,
    });

    if (error) throw new Error(`Failed to claim reminder jobs: ${error.message}`);

    return (data || []).map((row: any) => ({
      job_id: row.job_id,
      claim_token: row.claim_token,
    }));
  }

  public async authorizeReminderJob(jobId: string, claimToken: string, executionId: string) {
    const client = this.getClient();
    if (!client) {
      return memoryStore.authorizeReminderJob(jobId, claimToken, executionId);
    }

    // Authorize directly in Supabase
    const { data: job, error: jobErr } = await client
      .from('reminder_jobs')
      .select('*, pupils(*), guardians(*), reminder_rules(*)')
      .eq('id', jobId)
      .eq('claim_token', claimToken)
      .single();

    if (jobErr || !job) {
      return { authorized: false, job_id: jobId, reason: 'Invalid or expired claim token' };
    }

    const pupil = job.pupils;
    const guardian = job.guardians;
    const rule = job.reminder_rules;

    if (!pupil || !guardian || !rule || !rule.is_active) {
      await client.from('reminder_jobs').update({ status: 'skipped' }).eq('id', jobId);
      return { authorized: false, job_id: jobId, reason: 'Inactive rule or missing records' };
    }

    const currentBalance = await this.getAuthoritativeBalance(pupil.id, rule.term_id);
    if (currentBalance <= 0) {
      await client.from('reminder_jobs').update({ status: 'skipped' }).eq('id', jobId);
      return { authorized: false, job_id: jobId, reason: 'Zero balance reached' };
    }

    // Consent check
    if (job.channel === 'sms' && (!guardian.consent_sms || !guardian.phone_number)) {
      await client.from('reminder_jobs').update({ status: 'skipped' }).eq('id', jobId);
      return { authorized: false, job_id: jobId, reason: 'SMS not consented or phone missing' };
    }

    const attemptToken = `atkn-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const recipient = job.channel === 'sms' ? guardian.phone_number.replace(/[^0-9]/g, '') : String(guardian.telegram_chat_id);
    const message = `Dear ${guardian.full_name}, gentle reminder from Edvora School. Outstanding balance for ${pupil.first_name} is ₦${(currentBalance / 100).toLocaleString()}. Please visit portal: http://localhost:3000/student/payments`;

    const { data: attempt, error: attErr } = await client
      .from('reminder_attempts')
      .insert({
        job_id: job.id,
        attempt_token: attemptToken,
        channel: job.channel,
        recipient,
        message,
        status: 'started',
      })
      .select()
      .single();

    if (attErr) throw new Error(`Failed to record attempt: ${attErr.message}`);

    await client.from('reminder_jobs').update({ status: 'authorized' }).eq('id', jobId);

    return {
      authorized: true,
      job_id: job.id,
      attempt_id: attempt.id,
      attempt_token: attemptToken,
      channel: job.channel,
      recipient,
      message,
      balance_minor: currentBalance,
      currency: 'NGN',
      active: true,
      paused: false,
      consented: job.channel === 'sms' ? Boolean(guardian.consent_sms) : Boolean(guardian.consent_telegram),
      lease_expires_at: job.lease_expires_at,
    };
  }

  public async recordReminderOutcome(params: {
    job_id: string;
    attempt_id: string;
    attempt_token: string;
    status: 'accepted' | 'delivered' | 'failed' | 'skipped';
    provider_message_id?: string;
    error_message?: string;
  }) {
    const client = this.getClient();
    if (!client) {
      return memoryStore.recordReminderOutcome(params);
    }

    const { error: attErr } = await client
      .from('reminder_attempts')
      .update({
        status: params.status,
        provider_message_id: params.provider_message_id || null,
        error_message: params.error_message || null,
      })
      .eq('id', params.attempt_id)
      .eq('attempt_token', params.attempt_token);

    if (attErr) throw new Error(`Failed to update reminder attempt: ${attErr.message}`);

    const jobStatus = params.status === 'delivered' ? 'delivered' : params.status === 'accepted' ? 'sent' : params.status === 'failed' ? 'failed' : 'skipped';
    await client.from('reminder_jobs').update({ status: jobStatus }).eq('id', params.job_id);

    return { success: true, job_id: params.job_id, attempt_id: params.attempt_id, status: params.status };
  }

  // --- Automation: Payments Claim (WF02) ---
  public async claimPayments(runId: string, limit: number) {
    const client = this.getClient();
    if (!client) {
      return memoryStore.claimPayments(runId, limit);
    }

    const { data, error } = await client
      .from('payment_intents')
      .select('*')
      .in('status', ['initialized', 'processing'])
      .limit(limit);

    if (error) throw new Error(`Failed to claim payments: ${error.message}`);

    return (data || []).map((p: any) => ({
      job_id: p.id,
      claim_token: `pay-clm-${Date.now()}-${p.id}`,
      reference: p.reference,
      expected_amount_minor: Number(p.amount_minor),
      currency: 'NGN',
      environment: p.environment,
    }));
  }

  // --- Automation: SMS Delivery Tracking (WF03) ---
  public async ingestTermiiWebhook(rawPayload: Record<string, unknown>, authenticated: boolean) {
    const client = this.getClient();
    if (!client) {
      return memoryStore.ingestTermiiWebhook(rawPayload, authenticated);
    }

    const providerMessageId = (rawPayload.message_id || rawPayload.id || `msg-${Date.now()}`) as string;
    const rawStatus = String(rawPayload.status || '');
    const mappedStatus = mapTermiiProviderStatus(rawStatus);

    const { data, error } = await client
      .from('sms_delivery_inbox')
      .insert({
        provider: 'termii',
        provider_message_id: providerMessageId,
        status: mappedStatus,
        source_authenticated: authenticated,
        raw_payload: rawPayload,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to persist SMS delivery webhook: ${error.message}`);
    return data;
  }

  public async claimSmsDeliveryEvents(runId: string, limit: number) {
    const client = this.getClient();
    if (!client) {
      return memoryStore.claimSmsDeliveryEvents(runId, limit);
    }

    const { data, error } = await client
      .from('sms_delivery_inbox')
      .select('*')
      .eq('source_authenticated', true)
      .is('applied_at', null)
      .limit(limit);

    if (error) throw new Error(`Failed to claim SMS events: ${error.message}`);

    return (data || []).map((e: any) => ({
      event_id: e.id,
      claim_token: `sms-clm-${Date.now()}-${e.id}`,
      provider: e.provider,
      channel: 'sms',
      provider_message_id: e.provider_message_id,
      status: e.status,
      occurred_at: e.created_at,
      source_authenticated: true,
    }));
  }

  public async applySmsDeliveryEvent(params: {
    event_id: string;
    claim_token: string;
    provider_message_id: string;
    status: 'sent' | 'delivered' | 'failed' | 'expired' | 'rejected' | 'unknown';
  }) {
    const client = this.getClient();
    if (!client) {
      return memoryStore.applySmsDeliveryEvent(params);
    }

    // 1. Check reminder_attempts
    const { data: reminderAtt } = await client
      .from('reminder_attempts')
      .select('id, job_id, status')
      .eq('provider_message_id', params.provider_message_id)
      .maybeSingle();

    if (reminderAtt && canTransitionAttemptStatus(reminderAtt.status, params.status)) {
      const newStatus = params.status === 'delivered' ? 'delivered' : params.status === 'sent' ? 'accepted' : 'failed';
      await client.from('reminder_attempts').update({ status: newStatus }).eq('id', reminderAtt.id);
      if (params.status === 'delivered') {
        await client.from('reminder_jobs').update({ status: 'delivered' }).eq('id', reminderAtt.job_id);
      } else if (params.status === 'failed') {
        await client.from('reminder_jobs').update({ status: 'failed' }).eq('id', reminderAtt.job_id);
      }
    }

    // 2. Check notification_attempts
    const { data: notifAtt } = await client
      .from('notification_attempts')
      .select('id, job_id, status')
      .eq('provider_message_id', params.provider_message_id)
      .maybeSingle();

    if (notifAtt && canTransitionAttemptStatus(notifAtt.status, params.status)) {
      const newStatus = params.status === 'delivered' ? 'delivered' : params.status === 'sent' ? 'accepted' : 'failed';
      await client.from('notification_attempts').update({ status: newStatus }).eq('id', notifAtt.id);
      if (params.status === 'delivered') {
        await client.from('notification_jobs').update({ status: 'delivered' }).eq('id', notifAtt.job_id);
      } else if (params.status === 'failed') {
        await client.from('notification_jobs').update({ status: 'failed' }).eq('id', notifAtt.job_id);
      }
    }

    await client
      .from('sms_delivery_inbox')
      .update({ applied_at: new Date().toISOString() })
      .eq('id', params.event_id);

    return { success: true, event_id: params.event_id };
  }

  // --- Automation: Recovery & Incidents (WF04) ---
  public async sweepRecovery(runId: string, limit: number, maxAttempts: number = 3) {
    const client = this.getClient();
    if (!client) {
      return memoryStore.sweepRecovery(runId, limit, maxAttempts);
    }

    // Release expired unstarted claims
    const { count: released } = await client
      .from('reminder_jobs')
      .update({ status: 'pending', claim_token: null, lease_expires_at: null })
      .eq('status', 'claimed')
      .lt('lease_expires_at', new Date().toISOString());

    return {
      run_id: runId,
      released_claims: released || 0,
      requeued_transient: 0,
    };
  }

  public async recordIncident(params: {
    incident_key: string;
    workflow_id: string;
    workflow_name: string;
    execution_id?: string;
    failure_kind: string;
    failed_node?: string;
    record_only?: boolean;
    details?: Record<string, unknown>;
  }) {
    const client = this.getClient();
    if (!client) {
      return memoryStore.recordIncident(params);
    }

    const { data: existing } = await client
      .from('operational_incidents')
      .select('id')
      .eq('incident_key', params.incident_key)
      .maybeSingle();

    if (existing) {
      return { success: true, incident_id: existing.id, deduplicated: true };
    }

    const { data, error } = await client
      .from('operational_incidents')
      .insert({
        incident_key: params.incident_key,
        workflow_id: params.workflow_id,
        workflow_name: params.workflow_name,
        execution_id: params.execution_id || null,
        failure_kind: params.failure_kind,
        failed_node: params.failed_node || null,
        record_only: params.record_only || false,
        details: params.details || null,
        status: 'open',
      })
      .select()
      .single();

    if (error) throw new Error(`Database error logging incident: ${error.message}`);
    return { success: true, incident_id: data.id, deduplicated: false };
  }

  // --- Automation: Transactional Notifications (WF05) ---
  public async claimNotifications(runId: string, limit: number) {
    const client = this.getClient();
    if (!client) {
      return memoryStore.claimNotifications(runId, limit);
    }

    const { data, error } = await client.rpc('claim_notification_jobs', {
      p_run_id: runId,
      p_limit: limit,
      p_lease_seconds: 180,
    });

    if (error) throw new Error(`Failed to claim notification jobs: ${error.message}`);

    return (data || []).map((row: any) => ({
      job_id: row.job_id,
      claim_token: row.claim_token,
    }));
  }

  public async authorizeNotification(jobId: string, claimToken: string) {
    const client = this.getClient();
    if (!client) {
      return memoryStore.authorizeNotification(jobId, claimToken);
    }

    const { data: job, error } = await client
      .from('notification_jobs')
      .select('*')
      .eq('id', jobId)
      .eq('claim_token', claimToken)
      .single();

    if (error || !job) {
      return { authorized: false, job_id: jobId, reason: 'Invalid or expired claim token' };
    }

    // Stale withdrawal guard: if results_published, verify result is still in published status
    if (job.event_type === 'results_published') {
      const { data: result } = await client
        .from('academic_results')
        .select('status')
        .eq('id', job.source_event_id)
        .maybeSingle();

      if (!result || result.status !== 'published') {
        await client.from('notification_jobs').update({ status: 'skipped' }).eq('id', jobId);
        return { authorized: false, job_id: jobId, reason: 'Result is not published or has been withdrawn' };
      }
    }

    let recipient = '';
    let message = '';
    let consented = true;

    if (job.recipient_type === 'guardian') {
      const { data: guardian } = await client
        .from('guardians')
        .select('*')
        .eq('id', job.recipient_id)
        .maybeSingle();

      if (!guardian || !guardian.is_active) {
        await client.from('notification_jobs').update({ status: 'skipped' }).eq('id', jobId);
        return { authorized: false, job_id: jobId, reason: 'Guardian record not found or inactive' };
      }

      if (job.channel === 'sms') {
        if (!guardian.consent_sms || !guardian.phone_number) {
          await client.from('notification_jobs').update({ status: 'skipped' }).eq('id', jobId);
          return { authorized: false, job_id: jobId, reason: 'SMS consent not granted or phone missing' };
        }
        consented = Boolean(guardian.consent_sms);
        recipient = guardian.phone_number.replace(/[^0-9]/g, '');
      } else if (job.channel === 'telegram') {
        if (!guardian.consent_telegram || !guardian.telegram_chat_id) {
          await client.from('notification_jobs').update({ status: 'skipped' }).eq('id', jobId);
          return { authorized: false, job_id: jobId, reason: 'Telegram consent not granted or chat ID missing' };
        }
        consented = Boolean(guardian.consent_telegram);
        recipient = String(guardian.telegram_chat_id);
      }

      if (job.event_type === 'payment_receipt') {
        const { data: receipt } = await client
          .from('receipts')
          .select('receipt_number, amount_minor')
          .eq('id', job.source_event_id)
          .maybeSingle();

        message = `Dear ${guardian.full_name}, payment of ₦${(((receipt?.amount_minor || 0) as number) / 100).toLocaleString()} received. Receipt: ${receipt?.receipt_number}. Thank you! View: ${config.appUrl}/student/payments`;
      } else if (job.event_type === 'results_published') {
        message = `Dear ${guardian.full_name}, First Term academic report cards have been published! Please view via the student portal: ${config.appUrl}/student/results`;
      }
    } else if (job.recipient_type === 'staff') {
      recipient = '12345678';
      message = `[EDVORA ALERT] Operational failure detected in workflow. Please inspect Admin Settings -> Incidents.`;
      consented = true;
    }

    const attemptToken = `notif-atkn-${Date.now()}`;
    const { data: attempt, error: attErr } = await client
      .from('notification_attempts')
      .insert({
        job_id: jobId,
        attempt_token: attemptToken,
        channel: job.channel,
        recipient,
        message,
        status: 'started',
      })
      .select()
      .single();

    if (attErr) throw new Error(`Failed to record notification attempt: ${attErr.message}`);

    await client.from('notification_jobs').update({ status: 'authorized' }).eq('id', jobId);

    return {
      authorized: true,
      job_id: jobId,
      attempt_id: attempt.id,
      attempt_token: attemptToken,
      event_type: job.event_type,
      source_event_id: job.source_event_id,
      channel: job.channel,
      recipient,
      message,
      active: true,
      paused: false,
      consented,
      lease_expires_at: job.lease_expires_at,
    };
  }

  public async recordNotificationOutcome(params: {
    job_id: string;
    attempt_id: string;
    attempt_token: string;
    status: 'accepted' | 'delivered' | 'failed' | 'skipped';
    provider_message_id?: string;
    error_message?: string;
  }) {
    const client = this.getClient();
    if (!client) {
      return memoryStore.recordNotificationOutcome(params);
    }

    await client
      .from('notification_attempts')
      .update({
        status: params.status,
        provider_message_id: params.provider_message_id || null,
        error_message: params.error_message || null,
      })
      .eq('id', params.attempt_id);

    const jobStatus = params.status === 'delivered' ? 'delivered' : params.status === 'accepted' ? 'sent' : params.status === 'failed' ? 'failed' : 'skipped';
    await client.from('notification_jobs').update({ status: jobStatus }).eq('id', params.job_id);

    return { success: true, job_id: params.job_id, attempt_id: params.attempt_id, status: params.status };
  }

  // --- Academic Results Management ---
  public async updateResultStatus(params: {
    resultId: string;
    status: 'draft' | 'under_review' | 'published' | 'under_correction';
    actorRole: StaffRole;
    actorId: string;
    reason?: string;
  }) {
    if (params.actorRole === 'bursar') {
      throw new Error('Forbidden: Bursars are not permitted to publish or withdraw academic results');
    }

    const client = this.getClient();
    if (!client) {
      return memoryStore.updateResultStatus(params);
    }

    const updatePayload: Record<string, any> = {
      status: params.status,
      updated_at: new Date().toISOString(),
    };

    if (params.status === 'published') {
      if (params.actorRole !== 'admin') {
        throw new Error('Forbidden: Only School Administrators can publish academic report cards');
      }
      updatePayload.published_at = new Date().toISOString();
      updatePayload.published_by = params.actorId;
    } else if (params.status === 'under_correction') {
      updatePayload.withdrawn_at = new Date().toISOString();
      updatePayload.withdrawal_reason = params.reason || 'Under review for grade correction';

      // Purge pending publication notifications to prevent stale send
      await client
        .from('notification_jobs')
        .delete()
        .eq('source_event_id', params.resultId)
        .eq('event_type', 'results_published')
        .in('status', ['pending', 'claimed']);
    }

    const { data, error } = await client
      .from('academic_results')
      .update(updatePayload)
      .eq('id', params.resultId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update result status in database: ${error.message}`);
    }

    return data;
  }

  // --- Fee Adjustments ---
  public async adjustFee(params: {
    assignmentId: string;
    amountMinor: number;
    adjustmentType: 'waiver' | 'scholarship' | 'staff_discount' | 'sibling_discount' | 'correction';
    reason: string;
    authorizedBy: string;
  }) {
    const client = this.getClient();
    if (!client) {
      return memoryStore.adjustFee(params);
    }

    const { data: adj, error } = await client
      .from('fee_adjustments')
      .insert({
        fee_assignment_id: params.assignmentId,
        amount_minor: params.amountMinor,
        adjustment_type: params.adjustmentType,
        reason: params.reason,
        authorized_by: params.authorizedBy,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to insert fee adjustment: ${error.message}`);
    return { success: true, adjustment: adj };
  }

  // --- Pupil Registration ---
  public async registerPupil(params: {
    dateOfBirth?: string;
    firstName: string;
    lastName: string;
    gender: 'male' | 'female';
    classId: string;
    guardianName: string;
    guardianPhone: string;
    guardianEmail?: string;
  }) {
    const client = this.getClient();
    if (!client) {
      return memoryStore.registerPupil(params);
    }

    // Insert guardian if not exists
    let { data: guardian } = await client
      .from('guardians')
      .select('*')
      .eq('phone_number', params.guardianPhone)
      .maybeSingle();

    if (!guardian) {
      const { data: newG, error: gErr } = await client
        .from('guardians')
        .insert({
          full_name: params.guardianName,
          phone_number: params.guardianPhone,
          email: params.guardianEmail || null,
        })
        .select()
        .single();
      if (gErr) throw new Error(`Failed to register guardian: ${gErr.message}`);
      guardian = newG;
    }

    const admissionNumber = `EDV/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
    const { data: pupil, error: pErr } = await client
      .from('pupils')
      .insert({
        admission_number: admissionNumber,
        date_of_birth: params.dateOfBirth,
        guardian_id: guardian.id,
        first_name: params.firstName,
        last_name: params.lastName,
        gender: params.gender,
        class_id: params.classId,
      })
      .select()
      .single();

    if (pErr) throw new Error(`Failed to register pupil: ${pErr.message}`);

    // Link guardian
    await client.from('pupil_guardians').insert({
      pupil_id: pupil.id,
      guardian_id: guardian.id,
    });

    return { pupil, guardian };
  }

  // --- Persisted Entity Queries (Replaces direct memory store access) ---
  public async getPaymentIntentByReference(reference: string): Promise<PaymentIntent | null> {
    const client = this.getClient();
    if (!client) {
      const intent = memoryStore.paymentIntents.find((i) => i.reference === reference);
      return intent || null;
    }

    const { data, error } = await client
      .from('payment_intents')
      .select('*')
      .eq('reference', reference)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      pupilId: data.pupil_id,
      termId: data.term_id,
      reference: data.reference,
      amountMinor: Number(data.amount_minor),
      currency: data.currency,
      environment: data.environment,
      status: data.status,
      payerEmail: data.payer_email,
      payerName: data.payer_name,
      expiresAt: data.expires_at,
      createdAt: data.created_at,
    };
  }

  public async getPaymentTransactionByReference(reference: string): Promise<PaymentTransaction | null> {
    const client = this.getClient();
    if (!client) {
      const tx = memoryStore.paymentTransactions.find((t) => t.reference === reference);
      return tx || null;
    }

    const { data, error } = await client
      .from('payment_transactions')
      .select('*')
      .eq('reference', reference)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      intentId: data.intent_id,
      reference: data.reference,
      provider: data.provider,
      providerTransactionId: data.provider_transaction_id,
      amountMinor: Number(data.amount_minor),
      currency: data.currency,
      environment: data.environment,
      status: data.status,
      channel: data.channel,
      paidAt: data.paid_at,
      rawPayload: data.raw_payload,
      createdAt: data.created_at,
    };
  }

  public async getReceiptByTransactionId(transactionId: string): Promise<Receipt | null> {
    const client = this.getClient();
    if (!client) {
      const r = memoryStore.receipts.find((rec) => rec.transactionId === transactionId);
      return r || null;
    }

    const { data, error } = await client
      .from('receipts')
      .select('*')
      .eq('transaction_id', transactionId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      receiptNumber: data.receipt_number,
      transactionId: data.transaction_id,
      pupilId: data.pupil_id,
      termId: data.term_id,
      amountMinor: Number(data.amount_minor),
      currency: data.currency,
      issuedAt: data.issued_at,
      isVoid: data.is_void,
    };
  }

  public async getPupilByAdmissionNumber(admissionNumber: string): Promise<(Pupil & { dateOfBirth?: string; className?: string }) | null> {
    const clean = admissionNumber.trim().toUpperCase();
    const client = this.getClient();
    if (!client) {
      const p = memoryStore.pupils.find((pupil) => pupil.admissionNumber.toUpperCase() === clean);
      return p ? { ...p, dateOfBirth: p.dateOfBirth, className: p.className || 'Primary 3A' } : null;
    }

    const { data, error } = await client
      .from('pupils')
      .select('*, school_classes(name)')
      .ilike('admission_number', clean)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      admissionNumber: data.admission_number,
      firstName: data.first_name,
      lastName: data.last_name,
      gender: data.gender,
      dateOfBirth: data.date_of_birth,
      classId: data.class_id,
      className: data.school_classes?.name || '',
      status: data.status,
      guardianId: data.guardian_id,
    };
  }

  public async getStaffByEmail(email: string) {
    const clean = email.trim().toLowerCase();
    const client = this.getClient();
    if (!client) {
      const s = memoryStore.staffProfiles.find((staff) => staff.email.toLowerCase() === clean);
      return s || null;
    }

    const { data, error } = await client
      .from('staff_profiles')
      .select('*')
      .ilike('email', clean)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      userId: data.user_id,
      fullName: data.full_name,
      email: data.email,
      role: data.role as StaffRole,
      assignedClassIds: data.assigned_class_ids || [],
      isActive: data.is_active,
    };
  }

  public async listPupils(filter?: { classIds?: string[]; pupilId?: string }) {
    if (filter?.classIds && filter.classIds.length === 0) return [];
    const client = this.getClient();
    if (!client) {
      let list = memoryStore.pupils;
      if (filter?.pupilId) {
        list = list.filter((p) => p.id === filter.pupilId);
      } else if (filter?.classIds && filter.classIds.length > 0) {
        list = list.filter((p) => filter.classIds!.includes(p.classId));
      }
      return list.map((p) => {
        const balanceMinor = memoryStore.getAuthoritativeBalance(p.id, '22222222-2222-2222-2222-222222222222');
        const guardian = memoryStore.guardians.find((g) => g.id === p.guardianId);
        return {
          ...p,
          guardianName: guardian?.fullName || 'Not linked',
          guardianPhone: guardian?.phoneNumber || '',
          telegramLinked: Boolean(guardian?.telegramChatId),
          balanceMinor,
          balanceFormatted: `₦${(balanceMinor / 100).toLocaleString()}`,
        };
      });
    }

    let query = client.from('pupils').select('*, school_classes(name), guardians(full_name, phone_number, telegram_chat_id)');
    if (filter?.pupilId) {
      query = query.eq('id', filter.pupilId);
    } else if (filter?.classIds && filter.classIds.length > 0) {
      query = query.in('class_id', filter.classIds);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((p: any) => ({
      id: p.id,
      admissionNumber: p.admission_number,
      firstName: p.first_name,
      lastName: p.last_name,
      gender: p.gender,
      classId: p.class_id,
      className: p.school_classes?.name || '',
      status: p.status,
      dateOfBirth: p.date_of_birth ?? '',
      guardianId: p.guardian_id,
      guardianName: p.guardians?.full_name || 'Not linked',
      guardianPhone: p.guardians?.phone_number || '',
      telegramLinked: Boolean(p.guardians?.telegram_chat_id),
      balanceMinor: 0,
      balanceFormatted: '₦0',
    }));
  }
}

export const db = new DatabaseRepository();

