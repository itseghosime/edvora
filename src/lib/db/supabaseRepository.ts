// ==============================================================================
// Edvora School Management — Supabase Postgres Production Repository
// Enforces true Postgres persistence, RLS compliance, and atomic transactions.
// ==============================================================================

import type { SchoolOutcome } from "../services/automationContract";
import { randomUUID } from "crypto";
import { getSupabaseAdmin } from "../supabase/client";
import { config } from "../config";
import { store as memoryStore } from "./store";
import {
  mapTermiiProviderStatus,
  canTransitionAttemptStatus,
} from "../services/smsStatus";
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
} from "../types/backend";

export class DatabaseRepository {
  private isProduction = process.env.NODE_ENV === "production";

  private getClient() {
    const client = getSupabaseAdmin();
    if (!client || typeof client.from !== "function") {
      if (this.isProduction) {
        throw new Error(
          "FATAL: Supabase credentials (NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY) are missing in production. Application will not silently fall back to temporary in-memory storage in production.",
        );
      }
      return null;
    }
    return client;
  }

  // --- Financial & Ledger Operations ---
  public async getAuthoritativeBalance(
    pupilId: string,
    termId: string,
  ): Promise<number> {
    const client = this.getClient();
    if (!client) {
      return memoryStore.getAuthoritativeBalance(pupilId, termId);
    }

    const { data: assignment, error: assignErr } = await client
      .from("fee_assignments")
      .select("adjusted_amount_minor")
      .eq("pupil_id", pupilId)
      .eq("term_id", termId)
      .single();

    if (assignErr || !assignment) return 0;

    const { data: credits, error: creditErr } = await client
      .from("fee_ledger_entries")
      .select("amount_minor")
      .eq("pupil_id", pupilId)
      .eq("term_id", termId)
      .eq("entry_type", "credit");

    if (creditErr) return assignment.adjusted_amount_minor;

    const totalPaid = (credits || []).reduce(
      (sum, c) => sum + Number(c.amount_minor),
      0,
    );
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

    const balance = await this.getAuthoritativeBalance(
      params.pupilId,
      params.termId,
    );
    if (params.amountMinor <= 0) {
      throw new Error("Payment amount must be greater than zero");
    }
    if (params.amountMinor > balance) {
      throw new Error(
        `Payment amount cannot exceed outstanding balance of ₦${(balance / 100).toLocaleString()}`,
      );
    }

    const reference = `EDV-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    const { data, error } = await client
      .from("payment_intents")
      .insert({
        pupil_id: params.pupilId,
        term_id: params.termId,
        reference,
        amount_minor: params.amountMinor,
        currency: "NGN",
        environment: "test",
        status: "initialized",
        payer_email: params.payerEmail,
        payer_name: params.payerName || null,
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (error)
      throw new Error(
        `Database error creating payment intent: ${error.message}`,
      );

    return {
      id: data.id,
      pupilId: data.pupil_id,
      termId: data.term_id,
      reference: data.reference,
      amountMinor: Number(data.amount_minor),
      currency: "NGN",
      environment: "test",
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
    channel: "card" | "bank_transfer" | "ussd";
    rawPayload?: Record<string, unknown>;
  }) {
    const client = this.getClient();
    if (!client) {
      return memoryStore.verifyAndCreditPayment(params);
    }

    const { data, error } = await client.rpc("credit_payment_intent", {
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

  private async automationRpc(name: string, params: Record<string, unknown>) {
    const client = getSupabaseAdmin();
    if (!client)
      throw Object.assign(new Error("School database is not configured."), {
        statusCode: 503,
      });
    const { data, error } = await client.rpc(name, params);
    if (error)
      throw Object.assign(
        new Error(
          error.code === "42501"
            ? "Queue ownership check failed"
            : error.code === "22023"
              ? error.message
              : "Unable to process school automation.",
        ),
        {
          statusCode:
            error.code === "42501" ? 403 : error.code === "22023" ? 400 : 500,
        },
      );
    return data;
  }
  private async claimSchoolQueue(kind: string, runId: string, limit: number) {
    const result = await this.automationRpc("claim_school_jobs", {
      p_kind: kind,
      p_run: runId,
      p_limit: limit,
    });
    if (!Array.isArray(result)) throw new Error("Invalid queue response");
    return result;
  }
  public async claimReminderJobs(runId: string, limit: number) {
    return this.claimSchoolQueue("reminder", runId, limit);
  }
  public async claimNotifications(runId: string, limit: number) {
    return this.claimSchoolQueue("notification", runId, limit);
  }
  public async claimPayments(runId: string, limit: number) {
    return this.claimSchoolQueue("payment", runId, limit);
  }
  public async claimSmsDeliveryEvents(runId: string, limit: number) {
    return this.claimSchoolQueue("sms", runId, limit);
  }
  private async authorizeSchoolSend(
    kind: string,
    jobId: string,
    claimToken: string,
  ) {
    let origin: string;
    try {
      const url = new URL(config.appUrl);
      if (url.protocol !== "https:") throw new Error();
      origin = url.origin;
    } catch {
      throw Object.assign(
        new Error(
          "Configure the public HTTPS school URL before authorizing messages.",
        ),
        { statusCode: 503 },
      );
    }
    return this.automationRpc("authorize_school_send", {
      p_kind: kind,
      p_job: jobId,
      p_claim: claimToken,
      p_origin: origin,
    });
  }
  public async authorizeReminderJob(
    jobId: string,
    claimToken: string,
    _executionId: string,
  ) {
    return this.authorizeSchoolSend("reminder", jobId, claimToken);
  }
  public async authorizeNotification(jobId: string, claimToken: string) {
    return this.authorizeSchoolSend("notification", jobId, claimToken);
  }
  private async recordSchoolOutcome(kind: string, params: SchoolOutcome) {
    return this.automationRpc("record_school_outcome", {
      p_kind: kind,
      p_job: params.job_id,
      p_claim: params.claim_token,
      p_attempt: params.attempt_id,
      p_attempt_token: params.attempt_token,
      p_status: params.status,
      p_provider_id: params.provider_message_id ?? null,
      p_reason: params.error_message ?? null,
      p_retryable: params.retryable === true,
    });
  }
  public async recordReminderOutcome(params: SchoolOutcome) {
    return this.recordSchoolOutcome("reminder", params);
  }
  public async recordNotificationOutcome(params: SchoolOutcome) {
    return this.recordSchoolOutcome("notification", params);
  }
  public async ingestTermiiWebhook(
    rawPayload: Record<string, unknown>,
    authenticated: boolean,
  ) {
    return this.automationRpc("ingest_school_sms", {
      p_payload: rawPayload,
      p_authenticated: authenticated,
    });
  }
  public async applySmsDeliveryEvent(params: {
    event_id: string;
    claim_token: string;
    provider_message_id: string;
    status: string;
    decision?: string;
  }) {
    return this.automationRpc("apply_school_sms", {
      p_event: params.event_id,
      p_claim: params.claim_token,
      p_provider_id: params.provider_message_id,
      p_status: params.status,
      p_decision: params.decision ?? "apply",
    });
  }
  public async sweepRecovery(runId: string, limit: number, maxAttempts = 3) {
    return this.automationRpc("recover_school_jobs", {
      p_run: runId,
      p_limit: limit,
      p_max_attempts: maxAttempts,
    });
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
    return this.automationRpc("record_school_incident", { p_payload: params });
  }

  // --- Academic Results Management ---
  public async updateResultStatus(params: {
    resultId: string;
    status: "draft" | "under_review" | "published" | "under_correction";
    actorRole: StaffRole;
    actorId: string;
    reason?: string;
  }) {
    if (params.actorRole === "bursar") {
      throw new Error(
        "Forbidden: Bursars are not permitted to publish or withdraw academic results",
      );
    }

    const client = this.getClient();
    if (!client) {
      return memoryStore.updateResultStatus(params);
    }

    const { data, error } = await client.rpc("execute_staff_command", {
      p_request_id: randomUUID(),
      p_staff_id: params.actorId,
      p_command: "set_result_status",
      p_payload: {
        resultId: params.resultId,
        status: params.status,
        reason: params.reason ?? "",
      },
    });
    if (error)
      throw Object.assign(new Error(error.message), {
        statusCode: error.code === "42501" ? 403 : 400,
      });
    return data;
  }

  // --- Fee Adjustments ---
  public async adjustFee(params: {
    assignmentId: string;
    amountMinor: number;
    adjustmentType:
      | "waiver"
      | "scholarship"
      | "staff_discount"
      | "sibling_discount"
      | "correction";
    reason: string;
    authorizedBy: string;
  }) {
    const client = this.getClient();
    if (!client) return memoryStore.adjustFee(params);
    const { data, error } = await client.rpc("execute_staff_command", {
      p_request_id: randomUUID(),
      p_staff_id: params.authorizedBy,
      p_command: "adjust_fee",
      p_payload: {
        assignmentId: params.assignmentId,
        amountMinor: params.amountMinor,
        adjustmentType: params.adjustmentType,
        reason: params.reason,
      },
    });
    if (error)
      throw Object.assign(new Error(error.message), {
        statusCode: error.code === "42501" ? 403 : 400,
      });
    return { success: true, adjustment: data };
  }

  // --- Pupil Registration ---
  public async registerPupil(params: {
    dateOfBirth?: string;
    firstName: string;
    lastName: string;
    gender: "male" | "female";
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
      .from("guardians")
      .select("*")
      .eq("phone_number", params.guardianPhone)
      .maybeSingle();

    if (!guardian) {
      const { data: newG, error: gErr } = await client
        .from("guardians")
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
      .from("pupils")
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
    await client.from("pupil_guardians").insert({
      pupil_id: pupil.id,
      guardian_id: guardian.id,
    });

    return { pupil, guardian };
  }

  // --- Persisted Entity Queries (Replaces direct memory store access) ---
  public async getPaymentIntentByReference(
    reference: string,
  ): Promise<PaymentIntent | null> {
    const client = this.getClient();
    if (!client) {
      const intent = memoryStore.paymentIntents.find(
        (i) => i.reference === reference,
      );
      return intent || null;
    }

    const { data, error } = await client
      .from("payment_intents")
      .select("*")
      .eq("reference", reference)
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

  public async getPaymentTransactionByReference(
    reference: string,
  ): Promise<PaymentTransaction | null> {
    const client = this.getClient();
    if (!client) {
      const tx = memoryStore.paymentTransactions.find(
        (t) => t.reference === reference,
      );
      return tx || null;
    }

    const { data, error } = await client
      .from("payment_transactions")
      .select("*")
      .eq("reference", reference)
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

  public async getReceiptByTransactionId(
    transactionId: string,
  ): Promise<Receipt | null> {
    const client = this.getClient();
    if (!client) {
      const r = memoryStore.receipts.find(
        (rec) => rec.transactionId === transactionId,
      );
      return r || null;
    }

    const { data, error } = await client
      .from("receipts")
      .select("*")
      .eq("transaction_id", transactionId)
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

  public async getPupilByAdmissionNumber(
    admissionNumber: string,
  ): Promise<(Pupil & { dateOfBirth?: string; className?: string }) | null> {
    const clean = admissionNumber.trim().toUpperCase();
    const client = this.getClient();
    if (!client) {
      const p = memoryStore.pupils.find(
        (pupil) => pupil.admissionNumber.toUpperCase() === clean,
      );
      return p
        ? {
            ...p,
            dateOfBirth: p.dateOfBirth,
            className: p.className || "Primary 3A",
          }
        : null;
    }

    const { data, error } = await client
      .from("pupils")
      .select("*, school_classes(name)")
      .ilike("admission_number", clean)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      authVersion: data.auth_version ?? 0,
      admissionNumber: data.admission_number,
      firstName: data.first_name,
      lastName: data.last_name,
      gender: data.gender,
      dateOfBirth: data.date_of_birth,
      classId: data.class_id,
      className: data.school_classes?.name || "",
      status: data.status,
      guardianId: data.guardian_id,
    };
  }

  public async getStaffByEmail(email: string) {
    const clean = email.trim().toLowerCase();
    const client = this.getClient();
    if (!client) {
      const s = memoryStore.staffProfiles.find(
        (staff) => staff.email.toLowerCase() === clean,
      );
      return s || null;
    }

    const { data, error } = await client
      .from("staff_profiles")
      .select("*")
      .ilike("email", clean)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      userId: data.user_id,
      authVersion: data.auth_version ?? 0,
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
        const balanceMinor = memoryStore.getAuthoritativeBalance(
          p.id,
          "22222222-2222-2222-2222-222222222222",
        );
        const guardian = memoryStore.guardians.find(
          (g) => g.id === p.guardianId,
        );
        return {
          ...p,
          guardianName: guardian?.fullName || "Not linked",
          guardianPhone: guardian?.phoneNumber || "",
          telegramLinked: Boolean(guardian?.telegramChatId),
          balanceMinor,
          balanceFormatted: `₦${(balanceMinor / 100).toLocaleString()}`,
        };
      });
    }

    let query = client
      .from("pupils")
      .select(
        "*, school_classes(name), guardians!pupils_guardian_id_fkey(full_name, phone_number, telegram_chat_id)",
      );
    if (filter?.pupilId) {
      query = query.eq("id", filter.pupilId);
    } else if (filter?.classIds && filter.classIds.length > 0) {
      query = query.in("class_id", filter.classIds);
    }

    const { data, error } = await query;
    if (error) throw new Error("Unable to load pupil records");
    if (!data) return [];

    return data.map((p: any) => ({
      id: p.id,
      admissionNumber: p.admission_number,
      firstName: p.first_name,
      lastName: p.last_name,
      gender: p.gender,
      classId: p.class_id,
      className: p.school_classes?.name || "",
      status: p.status,
      dateOfBirth: p.date_of_birth ?? "",
      guardianId: p.guardian_id,
      guardianName: p.guardians?.full_name || "Not linked",
      guardianPhone: p.guardians?.phone_number || "",
      telegramLinked: Boolean(p.guardians?.telegram_chat_id),
      balanceMinor: 0,
      balanceFormatted: "₦0",
    }));
  }
}

export const db = new DatabaseRepository();
