// ==============================================================================
// Edvora School Management — Core Backend & Domain Types
// Minor currency units: Integer kobo (1 NGN = 100 kobo)
// ==============================================================================

export type StaffRole = 'admin' | 'bursar' | 'teacher';

export interface StaffProfile {
  id: string;
  userId?: string;
  fullName: string;
  email: string;
  role: StaffRole;
  assignedClassIds: string[];
  isActive: boolean;
}

export interface Pupil {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
  classId: string;
  className?: string;
  status: 'active' | 'graduated' | 'withdrawn' | 'suspended';
  guardianId: string;
}

export interface Guardian {
  id: string;
  userId?: string;
  fullName: string;
  phoneNumber: string; // E.164 formatted for Termii SMS
  email?: string;
  telegramChatId?: number; // Pre-authorized Telegram Chat ID
  relationship: string;
  consentSms: boolean;
  consentTelegram: boolean;
  isActive: boolean;
}

export interface SchoolClass {
  id: string;
  name: string;
  stage: 'nursery' | 'primary';
  capacity: number;
}

export interface AcademicTerm {
  id: string;
  sessionId: string;
  name: string;
  termCode: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface FeePlan {
  id: string;
  termId: string;
  classId: string;
  name: string;
  totalAmountMinor: number; // in kobo
  components: {
    name: string;
    amountMinor: number;
  }[];
}

export interface FeeAssignment {
  id: string;
  pupilId: string;
  termId: string;
  feePlanId: string;
  baseAmountMinor: number;
  adjustedAmountMinor: number;
  isPaused: boolean;
  pauseReason?: string;
}

export interface FeeAdjustment {
  id: string;
  feeAssignmentId: string;
  amountMinor: number; // positive = discount/waiver, negative = addition
  adjustmentType: 'waiver' | 'scholarship' | 'staff_discount' | 'sibling_discount' | 'correction';
  reason: string;
  authorizedBy: string;
  createdAt: string;
}

export interface PaymentIntent {
  id: string;
  pupilId: string;
  termId: string;
  reference: string;
  amountMinor: number;
  currency: 'NGN';
  environment: 'test' | 'live';
  status: 'initialized' | 'processing' | 'successful' | 'failed' | 'abandoned';
  payerEmail: string;
  payerName?: string;
  expiresAt: string;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  intentId: string;
  reference: string;
  provider: 'paystack';
  providerTransactionId: string;
  amountMinor: number;
  currency: 'NGN';
  environment: 'test';
  status: 'success' | 'failed' | 'pending';
  channel: 'card' | 'bank_transfer' | 'ussd';
  paidAt: string;
  rawPayload?: Record<string, unknown>;
  createdAt: string;
}

export interface LedgerEntry {
  id: string;
  pupilId: string;
  termId: string;
  transactionId?: string;
  entryType: 'credit' | 'debit' | 'adjustment';
  amountMinor: number;
  runningBalanceMinor: number;
  reference: string;
  description: string;
  createdAt: string;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  transactionId: string;
  pupilId: string;
  termId: string;
  amountMinor: number;
  currency: 'NGN';
  issuedAt: string;
  isVoid: boolean;
}

export interface SubjectScore {
  subject: string;
  ca: number;
  exam: number;
  total: number;
  grade: string;
  remarks?: string;
}

export interface AcademicResult {
  id: string;
  pupilId: string;
  termId: string;
  classId: string;
  subjects: SubjectScore[];
  totalScore: number;
  maxScore: number;
  averageScore: number;
  positionInClass?: number;
  classSize: number;
  teacherRemarks?: string;
  headRemarks?: string;
  status: 'draft' | 'under_review' | 'published' | 'under_correction';
  publishedAt?: string;
  publishedBy?: string;
  withdrawnAt?: string;
  withdrawalReason?: string;
  updatedAt: string;
}

export interface ReminderRule {
  id: string;
  name: string;
  termId: string;
  triggerDaysBeforeDue: number;
  channels: ('sms' | 'telegram')[];
  minBalanceMinor: number;
  isActive: boolean;
}

export interface ReminderJob {
  id: string;
  ruleId: string;
  pupilId: string;
  guardianId: string;
  channel: 'sms' | 'telegram';
  balanceAtCreationMinor: number;
  status: 'pending' | 'claimed' | 'authorized' | 'sent' | 'delivered' | 'failed' | 'skipped';
  claimToken?: string;
  claimedAt?: string;
  leaseExpiresAt?: string;
  retryCount: number;
}

export interface ReminderAttempt {
  id: string;
  jobId: string;
  attemptToken: string;
  channel: 'sms' | 'telegram';
  recipient: string;
  message: string;
  providerMessageId?: string;
  status: 'started' | 'accepted' | 'delivered' | 'failed' | 'skipped' | 'review_required';
  errorMessage?: string;
  createdAt: string;
}

export interface SMSDeliveryInboxEvent {
  id: string;
  provider: 'termii';
  channel: 'sms';
  providerMessageId: string;
  status: 'sent' | 'delivered' | 'failed' | 'expired' | 'rejected' | 'unknown';
  occurredAt: string;
  sourceAuthenticated: boolean;
  rawPayload: Record<string, unknown>;
  claimToken?: string;
  leaseExpiresAt?: string;
  appliedAt?: string;
}

export interface NotificationJob {
  id: string;
  eventType: 'payment_receipt' | 'results_published' | 'account_invitation' | 'operational_alert';
  sourceEventId: string;
  recipientType: 'guardian' | 'staff';
  recipientId: string;
  channel: 'sms' | 'telegram';
  status: 'pending' | 'claimed' | 'authorized' | 'sent' | 'delivered' | 'failed' | 'skipped';
  claimToken?: string;
  claimedAt?: string;
  leaseExpiresAt?: string;
  retryCount: number;
}

export interface NotificationAttempt {
  id: string;
  jobId: string;
  attemptToken: string;
  channel: 'sms' | 'telegram';
  recipient: string;
  message: string;
  providerMessageId?: string;
  status: 'started' | 'accepted' | 'delivered' | 'failed' | 'skipped' | 'review_required';
  errorMessage?: string;
  createdAt: string;
}

export interface OperationalIncident {
  id: string;
  incidentKey: string;
  workflowId: string;
  workflowName: string;
  executionId?: string;
  failureKind: string;
  failedNode?: string;
  recordOnly: boolean;
  details?: Record<string, unknown>;
  status: 'open' | 'investigating' | 'resolved';
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
}

