-- ==============================================================================
-- Edvora Nursery & Primary School — Core Schema & Migrations
-- Target: Supabase Postgres (with Row Level Security and Constraints)
-- Currency: NGN stored in integer minor units (kobo: 1 NGN = 100 kobo)
-- ==============================================================================

-- 1. Academic Sessions and Terms
CREATE TABLE IF NOT EXISTS academic_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(32) NOT NULL UNIQUE, -- e.g. "2026/2027"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS academic_terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES academic_sessions(id) ON DELETE CASCADE,
    name VARCHAR(32) NOT NULL, -- "First Term", "Second Term", "Third Term"
    term_code VARCHAR(16) NOT NULL, -- e.g. "2026-2027-T1"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(session_id, name)
);

-- 2. Classes (Nursery 1-2, Primary 1-5)
CREATE TABLE IF NOT EXISTS school_classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(32) NOT NULL UNIQUE, -- e.g. "Primary 3A", "Nursery 1"
    stage VARCHAR(16) NOT NULL CHECK (stage IN ('nursery', 'primary')),
    capacity INTEGER NOT NULL DEFAULT 30,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Staff Profiles & Role Assignments
CREATE TYPE staff_role AS ENUM ('admin', 'bursar', 'teacher');

CREATE TABLE IF NOT EXISTS staff_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE, -- References auth.users(id) when using Supabase Auth
    full_name VARCHAR(128) NOT NULL,
    email VARCHAR(128) NOT NULL UNIQUE,
    role staff_role NOT NULL,
    assigned_class_ids UUID[] DEFAULT '{}', -- Teachers assigned to specific classes
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Pupils & Guardians
CREATE TABLE IF NOT EXISTS pupils (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admission_number VARCHAR(32) NOT NULL UNIQUE, -- e.g. "EDV/2024/0042"
    first_name VARCHAR(64) NOT NULL,
    last_name VARCHAR(64) NOT NULL,
    gender VARCHAR(8) CHECK (gender IN ('male', 'female')),
    date_of_birth DATE,
    class_id UUID NOT NULL REFERENCES school_classes(id),
    status VARCHAR(16) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'graduated', 'withdrawn', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS guardians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE, -- Linked to auth.users if parent logs in via user account
    full_name VARCHAR(128) NOT NULL,
    phone_number VARCHAR(32) NOT NULL, -- E.164 formatted for Termii SMS
    email VARCHAR(128),
    telegram_chat_id BIGINT, -- Pre-authorized Telegram Chat ID supplied by backend
    relationship VARCHAR(32) NOT NULL DEFAULT 'parent', -- parent, mother, father, legal_guardian
    consent_sms BOOLEAN DEFAULT true,
    consent_telegram BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pupil_guardians (
    pupil_id UUID NOT NULL REFERENCES pupils(id) ON DELETE CASCADE,
    guardian_id UUID NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT true,
    can_view_results BOOLEAN DEFAULT true,
    can_pay_fees BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (pupil_id, guardian_id)
);

-- 5. Fee Plans, Assignments, and Adjustments
CREATE TABLE IF NOT EXISTS fee_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    term_id UUID NOT NULL REFERENCES academic_terms(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES school_classes(id) ON DELETE CASCADE,
    name VARCHAR(64) NOT NULL, -- e.g. "Primary 3 Standard Fee Plan"
    total_amount_minor BIGINT NOT NULL CHECK (total_amount_minor >= 0), -- e.g. 12000000 kobo (120,000 NGN)
    components JSONB NOT NULL DEFAULT '[]', -- [{name: "Tuition", amount_minor: 7000000}, ...]
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(term_id, class_id)
);

CREATE TABLE IF NOT EXISTS fee_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pupil_id UUID NOT NULL REFERENCES pupils(id) ON DELETE CASCADE,
    term_id UUID NOT NULL REFERENCES academic_terms(id) ON DELETE CASCADE,
    fee_plan_id UUID NOT NULL REFERENCES fee_plans(id),
    base_amount_minor BIGINT NOT NULL CHECK (base_amount_minor >= 0),
    adjusted_amount_minor BIGINT NOT NULL CHECK (adjusted_amount_minor >= 0),
    is_paused BOOLEAN DEFAULT false, -- fee reminders paused for this account
    pause_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(pupil_id, term_id)
);

CREATE TABLE IF NOT EXISTS fee_adjustments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fee_assignment_id UUID NOT NULL REFERENCES fee_assignments(id) ON DELETE CASCADE,
    amount_minor BIGINT NOT NULL, -- Positive reduces fee, negative increases
    adjustment_type VARCHAR(32) NOT NULL CHECK (adjustment_type IN ('waiver', 'scholarship', 'staff_discount', 'sibling_discount', 'correction')),
    reason TEXT NOT NULL,
    authorized_by UUID NOT NULL REFERENCES staff_profiles(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Payment Intents, Transactions, Immutable Ledger, and Receipts
CREATE TABLE IF NOT EXISTS payment_intents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pupil_id UUID NOT NULL REFERENCES pupils(id),
    term_id UUID NOT NULL REFERENCES academic_terms(id),
    reference VARCHAR(64) NOT NULL UNIQUE, -- Unique Paystack reference e.g. "EDV-202610-001"
    amount_minor BIGINT NOT NULL CHECK (amount_minor > 0),
    currency VARCHAR(4) NOT NULL DEFAULT 'NGN',
    environment VARCHAR(8) NOT NULL DEFAULT 'test' CHECK (environment IN ('test', 'live')),
    status VARCHAR(16) NOT NULL DEFAULT 'initialized' CHECK (status IN ('initialized', 'processing', 'successful', 'failed', 'abandoned')),
    payer_email VARCHAR(128) NOT NULL,
    payer_name VARCHAR(128),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    intent_id UUID NOT NULL REFERENCES payment_intents(id),
    reference VARCHAR(64) NOT NULL UNIQUE,
    provider VARCHAR(16) NOT NULL DEFAULT 'paystack',
    provider_transaction_id VARCHAR(64) UNIQUE,
    amount_minor BIGINT NOT NULL CHECK (amount_minor > 0),
    currency VARCHAR(4) NOT NULL DEFAULT 'NGN',
    environment VARCHAR(8) NOT NULL DEFAULT 'test',
    status VARCHAR(16) NOT NULL CHECK (status IN ('success', 'failed', 'pending')),
    channel VARCHAR(32), -- card, bank_transfer, ussd
    paid_at TIMESTAMPTZ,
    raw_payload JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Immutable Ledger: Each verified payment appends a credit entry.
-- Balance is calculated authoritatively: Total Charges - Sum(Credits) + Adjustments.
CREATE TABLE IF NOT EXISTS fee_ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pupil_id UUID NOT NULL REFERENCES pupils(id),
    term_id UUID NOT NULL REFERENCES academic_terms(id),
    transaction_id UUID REFERENCES payment_transactions(id),
    entry_type VARCHAR(16) NOT NULL CHECK (entry_type IN ('credit', 'debit', 'adjustment')),
    amount_minor BIGINT NOT NULL,
    running_balance_minor BIGINT NOT NULL,
    reference VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_number VARCHAR(32) NOT NULL UNIQUE, -- e.g. "REC-2026-0042"
    transaction_id UUID NOT NULL REFERENCES payment_transactions(id) UNIQUE,
    pupil_id UUID NOT NULL REFERENCES pupils(id),
    term_id UUID NOT NULL REFERENCES academic_terms(id),
    amount_minor BIGINT NOT NULL CHECK (amount_minor > 0),
    currency VARCHAR(4) NOT NULL DEFAULT 'NGN',
    issued_at TIMESTAMPTZ DEFAULT now(),
    is_void BOOLEAN DEFAULT false
);

-- 7. Reminder Rules, Automation Jobs, and Delivery Ingress
CREATE TABLE IF NOT EXISTS reminder_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(64) NOT NULL, -- e.g. "Term Balance 7-Day Reminder"
    term_id UUID NOT NULL REFERENCES academic_terms(id),
    trigger_days_before_due INTEGER NOT NULL DEFAULT 7,
    channels VARCHAR(16)[] NOT NULL DEFAULT '{"sms"}', -- 'sms', 'telegram'
    min_balance_minor BIGINT NOT NULL DEFAULT 100000, -- 1,000 NGN min
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reminder_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id UUID NOT NULL REFERENCES reminder_rules(id),
    pupil_id UUID NOT NULL REFERENCES pupils(id),
    guardian_id UUID NOT NULL REFERENCES guardians(id),
    channel VARCHAR(16) NOT NULL CHECK (channel IN ('sms', 'telegram')),
    balance_at_creation_minor BIGINT NOT NULL,
    status VARCHAR(16) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'claimed', 'authorized', 'sent', 'delivered', 'failed', 'skipped')),
    claim_token VARCHAR(64),
    claimed_at TIMESTAMPTZ,
    lease_expires_at TIMESTAMPTZ,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(rule_id, pupil_id, guardian_id, channel)
);

CREATE TABLE IF NOT EXISTS reminder_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES reminder_jobs(id) ON DELETE CASCADE,
    attempt_token VARCHAR(64) NOT NULL UNIQUE,
    channel VARCHAR(16) NOT NULL,
    recipient VARCHAR(64) NOT NULL, -- phone or telegram_chat_id
    message TEXT NOT NULL,
    provider_message_id VARCHAR(64),
    status VARCHAR(16) NOT NULL DEFAULT 'started' CHECK (status IN ('started', 'accepted', 'delivered', 'failed', 'skipped', 'review_required')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Ingress for Termii SMS Webhooks (durable queue before processing)
CREATE TABLE IF NOT EXISTS sms_delivery_inbox (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider VARCHAR(16) NOT NULL DEFAULT 'termii',
    provider_message_id VARCHAR(64) NOT NULL,
    status VARCHAR(16) NOT NULL CHECK (status IN ('sent', 'delivered', 'failed', 'expired', 'rejected', 'unknown')),
    source_authenticated BOOLEAN DEFAULT false,
    raw_payload JSONB NOT NULL,
    claimed_by_run_id VARCHAR(64),
    claim_token VARCHAR(64),
    lease_expires_at TIMESTAMPTZ,
    applied_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Academic Results (Teacher Draft, Review, Publication, Withdrawal)
CREATE TABLE IF NOT EXISTS academic_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pupil_id UUID NOT NULL REFERENCES pupils(id) ON DELETE CASCADE,
    term_id UUID NOT NULL REFERENCES academic_terms(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES school_classes(id),
    subjects JSONB NOT NULL DEFAULT '[]', -- [{subject: "Mathematics", ca: 36, exam: 54, total: 90, grade: "A+"}, ...]
    total_score NUMERIC(6, 2) NOT NULL, -- e.g. 524.00
    max_score NUMERIC(6, 2) NOT NULL DEFAULT 600.00,
    average_score NUMERIC(5, 2) NOT NULL, -- e.g. 87.33
    position_in_class INTEGER,
    class_size INTEGER NOT NULL DEFAULT 28,
    teacher_remarks TEXT,
    head_remarks TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'under_review', 'published', 'under_correction')),
    published_at TIMESTAMPTZ,
    published_by UUID REFERENCES staff_profiles(id),
    withdrawn_at TIMESTAMPTZ,
    withdrawal_reason TEXT,
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(pupil_id, term_id)
);

-- 9. Transactional Notifications Queue (Receipts, Results Published, Invitations, Staff Alerts)
CREATE TABLE IF NOT EXISTS notification_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(32) NOT NULL CHECK (event_type IN ('payment_receipt', 'results_published', 'account_invitation', 'operational_alert')),
    source_event_id UUID NOT NULL, -- e.g. receipt_id, result_id, incident_id
    recipient_type VARCHAR(16) NOT NULL CHECK (recipient_type IN ('guardian', 'staff')),
    recipient_id UUID NOT NULL, -- references guardians(id) or staff_profiles(id)
    channel VARCHAR(16) NOT NULL CHECK (channel IN ('sms', 'telegram')),
    status VARCHAR(16) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'claimed', 'authorized', 'sent', 'delivered', 'failed', 'skipped')),
    claim_token VARCHAR(64),
    claimed_at TIMESTAMPTZ,
    lease_expires_at TIMESTAMPTZ,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(event_type, source_event_id, recipient_id, channel)
);

CREATE TABLE IF NOT EXISTS notification_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES notification_jobs(id) ON DELETE CASCADE,
    attempt_token VARCHAR(64) NOT NULL UNIQUE,
    channel VARCHAR(16) NOT NULL,
    recipient VARCHAR(64) NOT NULL,
    message TEXT NOT NULL,
    provider_message_id VARCHAR(64),
    status VARCHAR(16) NOT NULL DEFAULT 'started' CHECK (status IN ('started', 'accepted', 'delivered', 'failed', 'skipped', 'review_required')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Operational Incidents & Audit Log
CREATE TABLE IF NOT EXISTS operational_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_key VARCHAR(128) NOT NULL UNIQUE,
    workflow_id VARCHAR(64) NOT NULL,
    workflow_name VARCHAR(128) NOT NULL,
    execution_id VARCHAR(64),
    failure_kind VARCHAR(64) NOT NULL,
    failed_node VARCHAR(64),
    record_only BOOLEAN DEFAULT false,
    details JSONB,
    status VARCHAR(16) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved')),
    resolved_by UUID REFERENCES staff_profiles(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID,
    actor_type VARCHAR(16) NOT NULL, -- staff, system, parent
    action VARCHAR(64) NOT NULL,
    entity_type VARCHAR(32) NOT NULL,
    entity_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- Row-Level Security (RLS) Setup
-- ==============================================================================
ALTER TABLE pupils ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE pupil_guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_results ENABLE ROW LEVEL SECURITY;

-- Service Role Policy (Automation service key bypasses all RLS)
CREATE POLICY service_role_all ON pupils FOR ALL TO service_role USING (true);
CREATE POLICY service_role_all_guardians ON guardians FOR ALL TO service_role USING (true);
CREATE POLICY service_role_all_fees ON fee_assignments FOR ALL TO service_role USING (true);
CREATE POLICY service_role_all_ledger ON fee_ledger_entries FOR ALL TO service_role USING (true);
CREATE POLICY service_role_all_receipts ON receipts FOR ALL TO service_role USING (true);
CREATE POLICY service_role_all_results ON academic_results FOR ALL TO service_role USING (true);

-- Indexes for performance and high-concurrency lookups
CREATE INDEX IF NOT EXISTS idx_pupils_class ON pupils(class_id);
CREATE INDEX IF NOT EXISTS idx_fee_ledger_pupil ON fee_ledger_entries(pupil_id, term_id);
CREATE INDEX IF NOT EXISTS idx_payment_intents_ref ON payment_intents(reference);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_ref ON payment_transactions(reference);
CREATE INDEX IF NOT EXISTS idx_reminder_jobs_status ON reminder_jobs(status, lease_expires_at);
CREATE INDEX IF NOT EXISTS idx_notification_jobs_status ON notification_jobs(status, lease_expires_at);
CREATE INDEX IF NOT EXISTS idx_sms_inbox_status ON sms_delivery_inbox(status, lease_expires_at);

