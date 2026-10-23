// ==============================================================================
// Edvora School Management — Authoritative In-Memory State & DB Store
// Provides atomicity, minor currency math, RLS simulation, and canonical datasets.
// ==============================================================================

import { config } from '../config';
import { mapTermiiProviderStatus, canTransitionAttemptStatus } from '../services/smsStatus';
import {
  StaffRole,
  StaffProfile,
  Pupil,
  Guardian,
  SchoolClass,
  AcademicTerm,
  FeePlan,
  FeeAssignment,
  FeeAdjustment,
  PaymentIntent,
  PaymentTransaction,
  LedgerEntry,
  Receipt,
  AcademicResult,
  ReminderRule,
  ReminderJob,
  ReminderAttempt,
  SMSDeliveryInboxEvent,
  NotificationJob,
  NotificationAttempt,
  OperationalIncident,
} from '../types/backend';

class EdvoraStore {
  public sessions = [
    { id: '11111111-1111-1111-1111-111111111111', name: '2026/2027', isCurrent: true },
  ];

  public terms: AcademicTerm[] = [
    {
      id: '22222222-2222-2222-2222-222222222222',
      sessionId: '11111111-1111-1111-1111-111111111111',
      name: 'First Term',
      termCode: '2026-2027-T1',
      startDate: '2026-09-08',
      endDate: '2026-12-18',
      isCurrent: true,
    },
  ];

  public classes: SchoolClass[] = [
    { id: '33333333-3333-3333-3333-000000000001', name: 'Nursery 1', stage: 'nursery', capacity: 20 },
    { id: '33333333-3333-3333-3333-000000000002', name: 'Nursery 2A', stage: 'nursery', capacity: 20 },
    { id: '33333333-3333-3333-3333-000000000003', name: 'Primary 1A', stage: 'primary', capacity: 28 },
    { id: '33333333-3333-3333-3333-000000000004', name: 'Primary 2A', stage: 'primary', capacity: 28 },
    { id: '33333333-3333-3333-3333-000000000005', name: 'Primary 3A', stage: 'primary', capacity: 28 },
    { id: '33333333-3333-3333-3333-000000000006', name: 'Primary 4A', stage: 'primary', capacity: 28 },
    { id: '33333333-3333-3333-3333-000000000007', name: 'Primary 5A', stage: 'primary', capacity: 28 },
  ];

  public staffProfiles: StaffProfile[] = [
    {
      id: '44444444-4444-4444-4444-000000000001',
      fullName: 'Mrs. Folashade Adeyemi',
      email: 'admin@edvora.ng',
      role: 'admin',
      assignedClassIds: [],
      isActive: true,
    },
    {
      id: '44444444-4444-4444-4444-000000000002',
      fullName: 'Mr. Chukwuma Obi',
      email: 'bursar@edvora.ng',
      role: 'bursar',
      assignedClassIds: [],
      isActive: true,
    },
    {
      id: '44444444-4444-4444-4444-000000000003',
      fullName: 'Mrs. Amina Danjuma',
      email: 'teacher@edvora.ng',
      role: 'teacher',
      assignedClassIds: ['33333333-3333-3333-3333-000000000005'], // Primary 3A
      isActive: true,
    },
  ];

  public guardians: Guardian[] = [
    {
      id: '66666666-6666-6666-6666-000000000001',
      fullName: 'Dr. & Mrs. Ehigiator',
      phoneNumber: '+2348031234567',
      email: 'guardian.ehigiator@gmail.com',
      telegramChatId: 987654321,
      relationship: 'parent',
      consentSms: true,
      consentTelegram: true,
      isActive: true,
    },
  ];

  public pupils: Pupil[] = [
    {
      id: '77777777-7777-7777-7777-000000000001',
      admissionNumber: 'EDV/2024/0042',
      firstName: 'Osasere',
      lastName: 'Ehigiator',
      gender: 'male',
      classId: '33333333-3333-3333-3333-000000000005',
      className: 'Primary 3A',
      status: 'active',
      guardianId: '66666666-6666-6666-6666-000000000001',
    },
    {
      id: '77777777-7777-7777-7777-000000000002',
      admissionNumber: 'EDV/2025/0118',
      firstName: 'Tamara',
      lastName: 'Ehigiator',
      gender: 'female',
      classId: '33333333-3333-3333-3333-000000000002',
      className: 'Nursery 2A',
      status: 'active',
      guardianId: '66666666-6666-6666-6666-000000000001',
    },
  ];

  public feePlans: FeePlan[] = [
    {
      id: '55555555-5555-5555-5555-000000000005',
      termId: '22222222-2222-2222-2222-222222222222',
      classId: '33333333-3333-3333-3333-000000000005',
      name: 'Primary 3 Standard Fee Plan',
      totalAmountMinor: 12000000, // ₦120,000 in kobo
      components: [
        { name: 'Tuition Fee', amountMinor: 7000000 },
        { name: 'Books & Learning Materials', amountMinor: 2500000 },
        { name: 'Co-curricular & Sports', amountMinor: 1500000 },
        { name: 'Continuous Assessment & Exam', amountMinor: 1000000 },
      ],
    },
  ];

  public feeAssignments: FeeAssignment[] = [
    {
      id: '88888888-8888-8888-8888-000000000001',
      pupilId: '77777777-7777-7777-7777-000000000001',
      termId: '22222222-2222-2222-2222-222222222222',
      feePlanId: '55555555-5555-5555-5555-000000000005',
      baseAmountMinor: 12000000,
      adjustedAmountMinor: 12000000,
      isPaused: false,
    },
  ];

  public feeAdjustments: FeeAdjustment[] = [];

  public paymentIntents: PaymentIntent[] = [
    {
      id: '99999999-9999-9999-9999-000000000001',
      pupilId: '77777777-7777-7777-7777-000000000001',
      termId: '22222222-2222-2222-2222-222222222222',
      reference: 'EDV-PAY-202610-0042',
      amountMinor: 7000000,
      currency: 'NGN',
      environment: 'test',
      status: 'successful',
      payerEmail: 'guardian.ehigiator@gmail.com',
      payerName: 'Dr. Ehigiator',
      expiresAt: '2026-10-15T12:00:00Z',
      createdAt: '2026-10-12T13:30:00Z',
    },
  ];

  public paymentTransactions: PaymentTransaction[] = [
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001',
      intentId: '99999999-9999-9999-9999-000000000001',
      reference: 'EDV-PAY-202610-0042',
      provider: 'paystack',
      providerTransactionId: 'PSTK_TX_9823412',
      amountMinor: 7000000,
      currency: 'NGN',
      environment: 'test',
      status: 'success',
      channel: 'card',
      paidAt: '2026-10-12T14:32:00Z',
      createdAt: '2026-10-12T14:32:00Z',
    },
  ];

  public ledgerEntries: LedgerEntry[] = [
    {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-000000000001',
      pupilId: '77777777-7777-7777-7777-000000000001',
      termId: '22222222-2222-2222-2222-222222222222',
      transactionId: 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001',
      entryType: 'credit',
      amountMinor: 7000000,
      runningBalanceMinor: 5000000,
      reference: 'EDV-PAY-202610-0042',
      description: 'First Term Tuition & Materials - Part Payment',
      createdAt: '2026-10-12T14:32:00Z',
    },
  ];

  public receipts: Receipt[] = [
    {
      id: 'cccccccc-cccc-cccc-cccc-000000000001',
      receiptNumber: 'REC-2026-0042',
      transactionId: 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001',
      pupilId: '77777777-7777-7777-7777-000000000001',
      termId: '22222222-2222-2222-2222-222222222222',
      amountMinor: 7000000,
      currency: 'NGN',
      issuedAt: '2026-10-12T14:32:05Z',
      isVoid: false,
    },
  ];

  public academicResults: AcademicResult[] = [
    {
      id: 'dddddddd-dddd-dddd-dddd-000000000001',
      pupilId: '77777777-7777-7777-7777-000000000001',
      termId: '22222222-2222-2222-2222-222222222222',
      classId: '33333333-3333-3333-3333-000000000005',
      subjects: [
        { subject: 'Mathematics', ca: 36, exam: 56, total: 92, grade: 'A+', remarks: 'Exceptional numeracy' },
        { subject: 'English Language', ca: 34, exam: 54, total: 88, grade: 'A', remarks: 'Very strong comprehension' },
        { subject: 'Basic Science & Technology', ca: 35, exam: 55, total: 90, grade: 'A+', remarks: 'Active scientific inquiry' },
        { subject: 'Social & Civic Studies', ca: 32, exam: 52, total: 84, grade: 'A', remarks: 'Good civic understanding' },
        { subject: 'ICT & Computer Studies', ca: 38, exam: 56, total: 94, grade: 'A+', remarks: 'Outstanding practical aptitude' },
        { subject: 'Creative Arts & Craft', ca: 30, exam: 46, total: 76, grade: 'B+', remarks: 'Creative participation' },
      ],
      totalScore: 524,
      maxScore: 600,
      averageScore: 87.33,
      positionInClass: 3,
      classSize: 28,
      teacherRemarks: 'Osasere has demonstrated commendable diligence and academic excellence throughout this term.',
      headRemarks: 'An inspiring performance. Keep striving for greater heights.',
      status: 'published',
      publishedAt: '2026-10-14T10:00:00Z',
      publishedBy: '44444444-4444-4444-4444-000000000001',
      updatedAt: '2026-10-14T10:00:00Z',
    },
  ];

  public reminderRules: ReminderRule[] = [
    {
      id: 'rrrrrrrr-rrrr-rrrr-rrrr-000000000001',
      name: 'First Term Balance Reminder (7-Day)',
      termId: '22222222-2222-2222-2222-222222222222',
      triggerDaysBeforeDue: 7,
      channels: ['sms', 'telegram'],
      minBalanceMinor: 100000, // ₦1,000 min balance
      isActive: true,
    },
  ];

  public reminderJobs: ReminderJob[] = [];
  public reminderAttempts: ReminderAttempt[] = [];
  public smsDeliveryInbox: SMSDeliveryInboxEvent[] = [];
  public notificationJobs: NotificationJob[] = [];
  public notificationAttempts: NotificationAttempt[] = [];
  public operationalIncidents: OperationalIncident[] = [];

  // Initialize helper jobs if empty
  constructor() {
    this.populateInitialJobs();
  }

  private populateInitialJobs() {
    // A sample reminder job for Osasere's guardian
    this.reminderJobs.push({
      id: 'job-rem-001',
      ruleId: 'rrrrrrrr-rrrr-rrrr-rrrr-000000000001',
      pupilId: '77777777-7777-7777-7777-000000000001',
      guardianId: '66666666-6666-6666-6666-000000000001',
      channel: 'sms',
      balanceAtCreationMinor: 5000000,
      status: 'pending',
      retryCount: 0,
    });
    this.reminderJobs.push({
      id: 'job-rem-002',
      ruleId: 'rrrrrrrr-rrrr-rrrr-rrrr-000000000001',
      pupilId: '77777777-7777-7777-7777-000000000001',
      guardianId: '66666666-6666-6666-6666-000000000001',
      channel: 'telegram',
      balanceAtCreationMinor: 5000000,
      status: 'pending',
      retryCount: 0,
    });
  }

  // --- Financial Calculations (Authoritative) ---
  public getAuthoritativeBalance(pupilId: string, termId: string): number {
    const assignment = this.feeAssignments.find((a) => a.pupilId === pupilId && a.termId === termId);
    if (!assignment) return 0;

    let balance = assignment.adjustedAmountMinor;
    // Subtract all successful verified ledger credits
    const credits = this.ledgerEntries.filter((l) => l.pupilId === pupilId && l.termId === termId && l.entryType === 'credit');
    for (const c of credits) {
      balance -= c.amountMinor;
    }
    return Math.max(0, balance);
  }

  // Create payment intent (server-side only)
  public createPaymentIntent(params: {
    pupilId: string;
    termId: string;
    amountMinor: number;
    payerEmail: string;
    payerName?: string;
  }): PaymentIntent {
    const pupil = this.pupils.find((p) => p.id === params.pupilId);
    if (!pupil) throw new Error('Pupil not found');

    const balanceMinor = this.getAuthoritativeBalance(params.pupilId, params.termId);
    if (params.amountMinor <= 0) {
      throw new Error('Payment amount must be greater than zero');
    }
    if (params.amountMinor > balanceMinor) {
      throw new Error(`Payment amount (₦${(params.amountMinor / 100).toLocaleString()}) cannot exceed outstanding balance (₦${(balanceMinor / 100).toLocaleString()})`);
    }

    const reference = `EDV-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 mins

    const intent: PaymentIntent = {
      id: `intent-${Date.now()}`,
      pupilId: params.pupilId,
      termId: params.termId,
      reference,
      amountMinor: params.amountMinor,
      currency: 'NGN',
      environment: 'test',
      status: 'initialized',
      payerEmail: params.payerEmail,
      payerName: params.payerName,
      expiresAt,
      createdAt: new Date().toISOString(),
    };

    this.paymentIntents.push(intent);
    return intent;
  }

  // Credit payment atomically (single credit guarantee)
  public verifyAndCreditPayment(params: {
    reference: string;
    providerTransactionId: string;
    amountMinor: number;
    channel: 'card' | 'bank_transfer' | 'ussd';
    rawPayload?: Record<string, unknown>;
  }): { success: boolean; transaction: PaymentTransaction; receipt: Receipt; newBalanceMinor: number } {
    // 1. Check intent exists
    const intent = this.paymentIntents.find((i) => i.reference === params.reference);
    if (!intent) {
      throw new Error(`Payment intent not found for reference ${params.reference}`);
    }

    // 2. Check if reference or transaction was already credited
    const existingTx = this.paymentTransactions.find((tx) => tx.reference === params.reference || tx.providerTransactionId === params.providerTransactionId);
    if (existingTx) {
      // Idempotent return: already credited
      const existingReceipt = this.receipts.find((r) => r.transactionId === existingTx.id);
      const curBalance = this.getAuthoritativeBalance(intent.pupilId, intent.termId);
      return {
        success: true,
        transaction: existingTx,
        receipt: existingReceipt!,
        newBalanceMinor: curBalance,
      };
    }

    // 3. Amount integrity check
    if (intent.amountMinor !== params.amountMinor) {
      intent.status = 'failed';
      throw new Error(`Amount mismatch: expected ${intent.amountMinor} kobo, received ${params.amountMinor} kobo`);
    }

    // 4. Create transaction
    const txId = `tx-${Date.now()}`;
    const transaction: PaymentTransaction = {
      id: txId,
      intentId: intent.id,
      reference: params.reference,
      provider: 'paystack',
      providerTransactionId: params.providerTransactionId,
      amountMinor: params.amountMinor,
      currency: 'NGN',
      environment: 'test',
      status: 'success',
      channel: params.channel,
      paidAt: new Date().toISOString(),
      rawPayload: params.rawPayload,
      createdAt: new Date().toISOString(),
    };
    this.paymentTransactions.push(transaction);

    // 5. Update intent status
    intent.status = 'successful';

    // 6. Compute new balance & append immutable ledger entry
    const previousBalance = this.getAuthoritativeBalance(intent.pupilId, intent.termId);
    const newBalanceMinor = Math.max(0, previousBalance - params.amountMinor);

    const ledgerEntry: LedgerEntry = {
      id: `led-${Date.now()}`,
      pupilId: intent.pupilId,
      termId: intent.termId,
      transactionId: txId,
      entryType: 'credit',
      amountMinor: params.amountMinor,
      runningBalanceMinor: newBalanceMinor,
      reference: params.reference,
      description: `Installment Payment via Paystack (${params.channel})`,
      createdAt: new Date().toISOString(),
    };
    this.ledgerEntries.push(ledgerEntry);

    // 7. Generate receipt
    const receiptNumber = `REC-${new Date().getFullYear()}-${String(this.receipts.length + 43).padStart(4, '0')}`;
    const receipt: Receipt = {
      id: `rec-${Date.now()}`,
      receiptNumber,
      transactionId: txId,
      pupilId: intent.pupilId,
      termId: intent.termId,
      amountMinor: params.amountMinor,
      currency: 'NGN',
      issuedAt: new Date().toISOString(),
      isVoid: false,
    };
    this.receipts.push(receipt);

    // 8. Enqueue transactional notification for WF05 (receipt notice)
    const pupil = this.pupils.find((p) => p.id === intent.pupilId);
    if (pupil && pupil.guardianId) {
      this.notificationJobs.push({
        id: `job-notif-${Date.now()}-sms`,
        eventType: 'payment_receipt',
        sourceEventId: receipt.id,
        recipientType: 'guardian',
        recipientId: pupil.guardianId,
        channel: 'sms',
        status: 'pending',
        retryCount: 0,
      });
      const guardian = this.guardians.find((g) => g.id === pupil.guardianId);
      if (guardian?.telegramChatId) {
        this.notificationJobs.push({
          id: `job-notif-${Date.now()}-tg`,
          eventType: 'payment_receipt',
          sourceEventId: receipt.id,
          recipientType: 'guardian',
          recipientId: pupil.guardianId,
          channel: 'telegram',
          status: 'pending',
          retryCount: 0,
        });
      }
    }

    return { success: true, transaction, receipt, newBalanceMinor };
  }

  // --- Automation: Reminders (WF01) ---
  public claimReminderJobs(runId: string, limit: number): { job_id: string; claim_token: string }[] {
    const now = Date.now();
    const claimed: { job_id: string; claim_token: string }[] = [];

    for (const job of this.reminderJobs) {
      if (claimed.length >= limit) break;

      const isExpired = job.leaseExpiresAt && new Date(job.leaseExpiresAt).getTime() < now;
      if (job.status === 'pending' || (job.status === 'claimed' && isExpired)) {
        const claimToken = `clm-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
        job.status = 'claimed';
        job.claimToken = claimToken;
        job.claimedAt = new Date().toISOString();
        job.leaseExpiresAt = new Date(now + 180 * 1000).toISOString(); // 180s lease
        claimed.push({ job_id: job.id, claim_token: claimToken });
      }
    }
    return claimed;
  }

  public authorizeReminderJob(jobId: string, claimToken: string, executionId: string) {
    const job = this.reminderJobs.find((j) => j.id === jobId);
    if (!job || job.claimToken !== claimToken) {
      return { authorized: false, job_id: jobId, reason: 'Invalid or expired claim token' };
    }

    const pupil = this.pupils.find((p) => p.id === job.pupilId);
    const guardian = this.guardians.find((g) => g.id === job.guardianId);
    const rule = this.reminderRules.find((r) => r.id === job.ruleId);

    if (!pupil || !guardian || !rule || !rule.isActive) {
      job.status = 'skipped';
      return { authorized: false, job_id: jobId, reason: 'Inactive rule or missing records' };
    }

    // Recheck authoritative balance immediately
    const currentBalanceMinor = this.getAuthoritativeBalance(pupil.id, rule.termId);
    if (currentBalanceMinor <= 0) {
      // Stopped at zero balance
      job.status = 'skipped';
      return { authorized: false, job_id: jobId, reason: 'Zero balance reached' };
    }

    // Check fee assignment pause
    const assignment = this.feeAssignments.find((a) => a.pupilId === pupil.id && a.termId === rule.termId);
    if (assignment?.isPaused) {
      job.status = 'skipped';
      return { authorized: false, job_id: jobId, reason: 'Fee reminders paused for pupil' };
    }

    // Check consent & recipient validity
    if (job.channel === 'sms') {
      if (!guardian.consentSms || !guardian.phoneNumber) {
        job.status = 'skipped';
        return { authorized: false, job_id: jobId, reason: 'SMS not consented or phone missing' };
      }
    } else if (job.channel === 'telegram') {
      if (!guardian.consentTelegram || !guardian.telegramChatId) {
        job.status = 'skipped';
        return { authorized: false, job_id: jobId, reason: 'Telegram not consented or chat ID not linked' };
      }
    }

    // Lock one attempt
    const attemptId = `att-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const attemptToken = `atkn-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const recipient = job.channel === 'sms' ? guardian.phoneNumber.replace(/[^0-9]/g, '') : String(guardian.telegramChatId);
    const message = `Dear ${guardian.fullName}, this is a gentle reminder from Edvora School. The outstanding balance for ${pupil.firstName} (${pupil.className}) is ₦${(currentBalanceMinor / 100).toLocaleString()}. Please visit the portal to pay: ${config.appUrl}/student/payments. Thank you!`;

    const attempt: ReminderAttempt = {
      id: attemptId,
      jobId: job.id,
      attemptToken,
      channel: job.channel,
      recipient,
      message,
      status: 'started',
      createdAt: new Date().toISOString(),
    };
    this.reminderAttempts.push(attempt);
    job.status = 'authorized';

    return {
      authorized: true,
      job_id: job.id,
      attempt_id: attemptId,
      attempt_token: attemptToken,
      channel: job.channel,
      recipient,
      message,
      balance_minor: currentBalanceMinor,
      currency: 'NGN',
      active: true,
      paused: false,
      consented: job.channel === 'sms' ? Boolean(guardian.consentSms) : Boolean(guardian.consentTelegram),
      lease_expires_at: job.leaseExpiresAt,
    };
  }

  public recordReminderOutcome(params: {
    job_id: string;
    attempt_id: string;
    attempt_token: string;
    status: 'accepted' | 'delivered' | 'failed' | 'skipped';
    provider_message_id?: string;
    error_message?: string;
  }) {
    const job = this.reminderJobs.find((j) => j.id === params.job_id);
    const attempt = this.reminderAttempts.find((a) => a.id === params.attempt_id && a.attemptToken === params.attempt_token);

    if (!job || !attempt) {
      return { success: false, reason: 'Job or attempt not found' };
    }

    attempt.status = params.status;
    attempt.providerMessageId = params.provider_message_id;
    attempt.errorMessage = params.error_message;

    if (params.status === 'delivered') {
      job.status = 'delivered';
    } else if (params.status === 'accepted') {
      job.status = 'sent';
    } else if (params.status === 'failed') {
      job.status = 'failed';
      job.retryCount += 1;
    }

    return { success: true, job_id: job.id, attempt_id: attempt.id, status: params.status };
  }

  // --- Automation: Payments Reconcile (WF02) ---
  public claimPayments(runId: string, limit: number) {
    // Return pending payment intents that are expired or awaiting verification
    const pending = this.paymentIntents
      .filter((i) => i.status === 'initialized' || i.status === 'processing')
      .slice(0, limit);

    return pending.map((p) => ({
      job_id: p.id,
      claim_token: `pay-clm-${Date.now()}-${p.id}`,
      reference: p.reference,
      expected_amount_minor: p.amountMinor,
      currency: 'NGN',
      environment: 'test',
    }));
  }

  // --- Automation: SMS Delivery (WF03) ---
  public ingestTermiiWebhook(rawPayload: Record<string, unknown>, authenticated: boolean) {
    const providerMessageId = (rawPayload.message_id || rawPayload.id || `msg-${Date.now()}`) as string;
    const rawStatus = String(rawPayload.status || '');
    const mappedStatus = mapTermiiProviderStatus(rawStatus);

    const event: SMSDeliveryInboxEvent = {
      id: `inbox-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      provider: 'termii',
      channel: 'sms',
      providerMessageId,
      status: mappedStatus,
      occurredAt: new Date().toISOString(),
      sourceAuthenticated: authenticated,
      rawPayload,
    };
    this.smsDeliveryInbox.push(event);
    return event;
  }

  public claimSmsDeliveryEvents(runId: string, limit: number) {
    const now = Date.now();
    const unapplied = this.smsDeliveryInbox
      .filter((e) => e.sourceAuthenticated && !e.appliedAt && (!e.leaseExpiresAt || new Date(e.leaseExpiresAt).getTime() < now))
      .slice(0, limit);

    return unapplied.map((e) => {
      e.claimToken = `sms-clm-${Date.now()}-${e.id}`;
      e.leaseExpiresAt = new Date(now + 180 * 1000).toISOString();
      return {
        event_id: e.id,
        claim_token: e.claimToken,
        provider: e.provider,
        channel: e.channel,
        provider_message_id: e.providerMessageId,
        status: e.status,
        occurred_at: e.occurredAt,
        source_authenticated: e.sourceAuthenticated,
      };
    });
  }

  public applySmsDeliveryEvent(params: {
    event_id: string;
    claim_token: string;
    provider_message_id: string;
    status: 'sent' | 'delivered' | 'failed' | 'expired' | 'rejected' | 'unknown';
  }) {
    const inboxEvent = this.smsDeliveryInbox.find((e) => e.id === params.event_id && e.claimToken === params.claim_token);
    if (!inboxEvent) {
      return { success: false, reason: 'Inbox event or claim token invalid' };
    }

    // Match to reminder attempt or notification attempt
    const reminderAtt = this.reminderAttempts.find((a) => a.providerMessageId === params.provider_message_id);
    if (reminderAtt) {
      // Check state transition validity: never overwrite delivered
      if (canTransitionAttemptStatus(reminderAtt.status, params.status)) {
        reminderAtt.status = params.status === 'delivered' ? 'delivered' : params.status === 'sent' ? 'accepted' : 'failed';
        const job = this.reminderJobs.find((j) => j.id === reminderAtt.jobId);
        if (job) {
          if (params.status === 'delivered') job.status = 'delivered';
          else if (params.status === 'failed' && job.status !== 'delivered') job.status = 'failed';
        }
      }
    }

    const notifAtt = this.notificationAttempts.find((a) => a.providerMessageId === params.provider_message_id);
    if (notifAtt) {
      if (canTransitionAttemptStatus(notifAtt.status, params.status)) {
        notifAtt.status = params.status === 'delivered' ? 'delivered' : params.status === 'sent' ? 'accepted' : 'failed';
        const job = this.notificationJobs.find((j) => j.id === notifAtt.jobId);
        if (job) {
          if (params.status === 'delivered') job.status = 'delivered';
          else if (params.status === 'failed' && job.status !== 'delivered') job.status = 'failed';
        }
      }
    }

    inboxEvent.appliedAt = new Date().toISOString();
    return { success: true, event_id: inboxEvent.id };
  }

  // --- Automation: Recovery Sweep & Incidents (WF04) ---
  public sweepRecovery(runId: string, limit: number, maxAttempts: number = 3) {
    const now = Date.now();
    let releasedClaims = 0;
    let requeuedTransient = 0;

    // 1. Release expired unstarted claims
    for (const job of this.reminderJobs) {
      if (job.status === 'claimed' && job.leaseExpiresAt && new Date(job.leaseExpiresAt).getTime() < now) {
        // check if sending started
        const hasStarted = this.reminderAttempts.some((a) => a.jobId === job.id);
        if (!hasStarted) {
          job.status = 'pending';
          job.claimToken = undefined;
          job.leaseExpiresAt = undefined;
          releasedClaims++;
        }
      }
    }

    // 2. Requeue transient failed jobs if retryCount < maxAttempts
    for (const job of this.reminderJobs) {
      if (job.status === 'failed' && job.retryCount < maxAttempts) {
        // Re-check balance before requeuing
        const bal = this.getAuthoritativeBalance(job.pupilId, '22222222-2222-2222-2222-222222222222');
        if (bal > 0) {
          job.status = 'pending';
          job.claimToken = undefined;
          job.leaseExpiresAt = undefined;
          requeuedTransient++;
        }
      }
    }

    return {
      run_id: runId,
      released_claims: releasedClaims,
      requeued_transient: requeuedTransient,
    };
  }

  public recordIncident(params: {
    incident_key: string;
    workflow_id: string;
    workflow_name: string;
    execution_id?: string;
    failure_kind: string;
    failed_node?: string;
    record_only?: boolean;
    details?: Record<string, unknown>;
  }) {
    // Deduplication check
    const existing = this.operationalIncidents.find((i) => i.incidentKey === params.incident_key);
    if (existing) {
      return { success: true, incident_id: existing.id, deduplicated: true };
    }

    const incident: OperationalIncident = {
      id: `inc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      incidentKey: params.incident_key,
      workflowId: params.workflow_id,
      workflowName: params.workflow_name,
      executionId: params.execution_id,
      failureKind: params.failure_kind,
      failedNode: params.failed_node,
      recordOnly: params.record_only ?? false,
      details: params.details,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    this.operationalIncidents.push(incident);

    // If NOT record_only and not WF05 (prevent alert recursion), enqueue staff notification
    if (!params.record_only && params.workflow_id !== 'hoPH7KNlrdMYXszh' && params.workflow_id !== 'YWD3GloqWM7HhZpq') {
      const adminStaff = this.staffProfiles.find((s) => s.role === 'admin');
      if (adminStaff) {
        this.notificationJobs.push({
          id: `job-inc-staff-${incident.id}`,
          eventType: 'operational_alert',
          sourceEventId: incident.id,
          recipientType: 'staff',
          recipientId: adminStaff.id,
          channel: 'telegram',
          status: 'pending',
          retryCount: 0,
        });
      }
    }

    return { success: true, incident_id: incident.id, deduplicated: false };
  }

  // --- Automation: Transactional Notifications (WF05) ---
  public claimNotifications(runId: string, limit: number) {
    const now = Date.now();
    const claimed: { job_id: string; claim_token: string }[] = [];

    for (const job of this.notificationJobs) {
      if (claimed.length >= limit) break;
      const isExpired = job.leaseExpiresAt && new Date(job.leaseExpiresAt).getTime() < now;
      if (job.status === 'pending' || (job.status === 'claimed' && isExpired)) {
        const claimToken = `notif-clm-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        job.status = 'claimed';
        job.claimToken = claimToken;
        job.claimedAt = new Date().toISOString();
        job.leaseExpiresAt = new Date(now + 180 * 1000).toISOString();
        claimed.push({ job_id: job.id, claim_token: claimToken });
      }
    }
    return claimed;
  }

  public authorizeNotification(jobId: string, claimToken: string) {
    const job = this.notificationJobs.find((j) => j.id === jobId);
    if (!job || job.claimToken !== claimToken) {
      return { authorized: false, job_id: jobId, reason: 'Invalid or expired claim token' };
    }

    let recipient = '';
    let message = '';
    let consented = true;

    if (job.recipientType === 'guardian') {
      const guardian = this.guardians.find((g) => g.id === job.recipientId);
      if (!guardian) {
        job.status = 'skipped';
        return { authorized: false, job_id: jobId, reason: 'Guardian record not found' };
      }

      if (job.channel === 'sms') {
        if (!guardian.consentSms || !guardian.phoneNumber) {
          job.status = 'skipped';
          return { authorized: false, job_id: jobId, reason: 'SMS consent not granted or phone missing' };
        }
        consented = Boolean(guardian.consentSms);
        recipient = guardian.phoneNumber.replace(/[^0-9]/g, '');
      } else if (job.channel === 'telegram') {
        if (!guardian.consentTelegram || !guardian.telegramChatId) {
          job.status = 'skipped';
          return { authorized: false, job_id: jobId, reason: 'Telegram consent not granted or chat ID missing' };
        }
        consented = Boolean(guardian.consentTelegram);
        recipient = String(guardian.telegramChatId);
      }

      if (job.eventType === 'payment_receipt') {
        const receipt = this.receipts.find((r) => r.id === job.sourceEventId);
        message = `Dear ${guardian.fullName}, payment of ₦${((receipt?.amountMinor || 0) / 100).toLocaleString()} received. Receipt: ${receipt?.receiptNumber}. Thank you! View: ${config.appUrl}/student/payments`;
      } else if (job.eventType === 'results_published') {
        // Stale withdrawal guard: verify result is still in published status
        const result = this.academicResults.find((r) => r.id === job.sourceEventId);
        if (!result || result.status !== 'published') {
          job.status = 'skipped';
          return { authorized: false, job_id: jobId, reason: 'Result is not published or has been withdrawn' };
        }
        message = `Dear ${guardian.fullName}, First Term academic report cards have been published! Please view via the student portal: ${config.appUrl}/student/results`;
      }
    } else if (job.recipientType === 'staff') {
      const staff = this.staffProfiles.find((s) => s.id === job.recipientId);
      recipient = '12345678'; // Pre-configured authorized staff telegram chat ID
      message = `[EDVORA ALERT] Operational failure detected in workflow. Please inspect Admin Settings -> Incidents.`;
      consented = true;
    }

    const attemptId = `notif-att-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const attemptToken = `notif-atkn-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const attempt: NotificationAttempt = {
      id: attemptId,
      jobId: job.id,
      attemptToken,
      channel: job.channel,
      recipient,
      message,
      status: 'started',
      createdAt: new Date().toISOString(),
    };
    this.notificationAttempts.push(attempt);
    job.status = 'authorized';

    return {
      authorized: true,
      job_id: job.id,
      attempt_id: attemptId,
      attempt_token: attemptToken,
      event_type: job.eventType,
      source_event_id: job.sourceEventId,
      channel: job.channel,
      recipient,
      message,
      active: true,
      paused: false,
      consented,
      lease_expires_at: job.leaseExpiresAt,
    };
  }

  public recordNotificationOutcome(params: {
    job_id: string;
    attempt_id: string;
    attempt_token: string;
    status: 'accepted' | 'delivered' | 'failed' | 'skipped';
    provider_message_id?: string;
    error_message?: string;
  }) {
    const job = this.notificationJobs.find((j) => j.id === params.job_id);
    const attempt = this.notificationAttempts.find((a) => a.id === params.attempt_id && a.attemptToken === params.attempt_token);

    if (!job || !attempt) {
      return { success: false, reason: 'Notification job or attempt not found' };
    }

    attempt.status = params.status;
    attempt.providerMessageId = params.provider_message_id;
    attempt.errorMessage = params.error_message;

    if (params.status === 'delivered') {
      job.status = 'delivered';
    } else if (params.status === 'accepted') {
      job.status = 'sent';
    } else if (params.status === 'failed') {
      job.status = 'failed';
      job.retryCount += 1;
    }

    return { success: true, job_id: job.id, attempt_id: attempt.id, status: params.status };
  }

  // --- Academic Results Management ---
  public updateResultStatus(params: {
    resultId: string;
    status: 'draft' | 'under_review' | 'published' | 'under_correction';
    actorRole: StaffRole;
    actorId: string;
    reason?: string;
  }) {
    // Bursars CANNOT publish or modify results
    if (params.actorRole === 'bursar') {
      throw new Error('Unauthorized: Bursars are not permitted to publish or modify academic results');
    }

    // Only admin or authorized teacher can publish/withdraw
    const result = this.academicResults.find((r) => r.id === params.resultId);
    if (!result) throw new Error('Result not found');

    if (params.status === 'published') {
      if (params.actorRole !== 'admin') {
        throw new Error('Only School Administrators can publish academic report cards');
      }
      result.status = 'published';
      result.publishedAt = new Date().toISOString();
      result.publishedBy = params.actorId;

      // Enqueue results_published notification for pupil's guardian (accessible even if pupil has balance!)
      const pupil = this.pupils.find((p) => p.id === result.pupilId);
      if (pupil && pupil.guardianId) {
        this.notificationJobs.push({
          id: `job-result-pub-${Date.now()}-sms`,
          eventType: 'results_published',
          sourceEventId: result.id,
          recipientType: 'guardian',
          recipientId: pupil.guardianId,
          channel: 'sms',
          status: 'pending',
          retryCount: 0,
        });
      }
    } else if (params.status === 'under_correction') {
      result.status = 'under_correction';
      result.withdrawnAt = new Date().toISOString();
      result.withdrawalReason = params.reason || 'Under review for grade correction';
      // Cancel any pending or claimed publication notification jobs to prevent stale dispatch
      this.notificationJobs = this.notificationJobs.filter(
        (j) => !(j.sourceEventId === result.id && j.eventType === 'results_published' && (j.status === 'pending' || j.status === 'claimed'))
      );
    } else {
      result.status = params.status;
    }

    result.updatedAt = new Date().toISOString();
    return result;
  }

  // --- Fee Adjustments ---
  public adjustFee(params: {
    assignmentId: string;
    amountMinor: number;
    adjustmentType: 'waiver' | 'scholarship' | 'staff_discount' | 'sibling_discount' | 'correction';
    reason: string;
    authorizedBy: string;
  }) {
    const assignment = this.feeAssignments.find((a) => a.id === params.assignmentId);
    if (!assignment) throw new Error('Fee assignment not found');

    const adj: FeeAdjustment = {
      id: `adj-${Date.now()}`,
      feeAssignmentId: assignment.id,
      amountMinor: params.amountMinor,
      adjustmentType: params.adjustmentType,
      reason: params.reason,
      authorizedBy: params.authorizedBy,
      createdAt: new Date().toISOString(),
    };
    this.feeAdjustments.push(adj);

    // Adjust assignment total
    assignment.adjustedAmountMinor = Math.max(0, assignment.adjustedAmountMinor - params.amountMinor);

    // Add adjustment entry to ledger
    this.ledgerEntries.push({
      id: `led-adj-${Date.now()}`,
      pupilId: assignment.pupilId,
      termId: assignment.termId,
      entryType: 'adjustment',
      amountMinor: params.amountMinor,
      runningBalanceMinor: this.getAuthoritativeBalance(assignment.pupilId, assignment.termId),
      reference: `ADJ-${Date.now()}`,
      description: `Audited Adjustment: ${params.adjustmentType} - ${params.reason}`,
      createdAt: new Date().toISOString(),
    });

    return { success: true, adjustment: adj, newAdjustedTotalMinor: assignment.adjustedAmountMinor };
  }

  // --- Pupil Registration ---
  public registerPupil(params: {
    firstName: string;
    lastName: string;
    gender: 'male' | 'female';
    classId: string;
    guardianName: string;
    guardianPhone: string;
    guardianEmail?: string;
  }) {
    const classItem = this.classes.find((c) => c.id === params.classId);
    if (!classItem) throw new Error('Invalid class selected');

    // Create or reuse guardian
    let guardian = this.guardians.find((g) => g.phoneNumber === params.guardianPhone);
    if (!guardian) {
      guardian = {
        id: `g-${Date.now()}`,
        fullName: params.guardianName,
        phoneNumber: params.guardianPhone,
        email: params.guardianEmail,
        relationship: 'parent',
        consentSms: true,
        consentTelegram: false,
        isActive: true,
      };
      this.guardians.push(guardian);
    }

    const admissionNumber = `EDV/${new Date().getFullYear()}/${String(this.pupils.length + 43).padStart(4, '0')}`;
    const pupil: Pupil = {
      id: `pup-${Date.now()}`,
      admissionNumber,
      firstName: params.firstName,
      lastName: params.lastName,
      gender: params.gender,
      classId: params.classId,
      className: classItem.name,
      status: 'active',
      guardianId: guardian.id,
    };
    this.pupils.push(pupil);

    // Assign standard ₦120,000 fee plan
    this.feeAssignments.push({
      id: `fa-${Date.now()}`,
      pupilId: pupil.id,
      termId: '22222222-2222-2222-2222-222222222222',
      feePlanId: '55555555-5555-5555-5555-000000000005',
      baseAmountMinor: 12000000,
      adjustedAmountMinor: 12000000,
      isPaused: false,
    });

    return { pupil, guardian };
  }
}

// Singleton state store instance
export const store = new EdvoraStore();
