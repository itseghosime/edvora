-- ==============================================================================
-- Edvora Nursery & Primary School — Seed Data
-- Aligned with Edvora_Antigravity_Handoff.md specifications:
-- 180 pupils; ₦21,600,000 charges; ₦12,600,000 paid; ₦9,000,000 balance (58.3% collection)
-- Session: 2026/2027 First Term
-- Selected Pupil: Osasere Ehigiator (Primary 3A)
-- Sibling: Tamara Ehigiator (Nursery 2A)
-- ==============================================================================

-- 1. Session and Term
INSERT INTO academic_sessions (id, name, start_date, end_date, is_current)
VALUES ('11111111-1111-1111-1111-111111111111', '2026/2027', '2026-09-08', '2027-07-20', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO academic_terms (id, session_id, name, term_code, start_date, end_date, is_current)
VALUES ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'First Term', '2026-2027-T1', '2026-09-08', '2026-12-18', true)
ON CONFLICT (session_id, name) DO NOTHING;

-- 2. Classes
INSERT INTO school_classes (id, name, stage, capacity) VALUES
('33333333-3333-3333-3333-000000000001', 'Nursery 1', 'nursery', 20),
('33333333-3333-3333-3333-000000000002', 'Nursery 2A', 'nursery', 20),
('33333333-3333-3333-3333-000000000003', 'Primary 1A', 'primary', 28),
('33333333-3333-3333-3333-000000000004', 'Primary 2A', 'primary', 28),
('33333333-3333-3333-3333-000000000005', 'Primary 3A', 'primary', 28),
('33333333-3333-3333-3333-000000000006', 'Primary 4A', 'primary', 28),
('33333333-3333-3333-3333-000000000007', 'Primary 5A', 'primary', 28)
ON CONFLICT (name) DO NOTHING;

-- 3. Staff Profiles
INSERT INTO staff_profiles (id, full_name, email, role, assigned_class_ids) VALUES
('44444444-4444-4444-4444-000000000001', 'Mrs. Folashade Adeyemi', 'admin@edvora.ng', 'admin', '{}'),
('44444444-4444-4444-4444-000000000002', 'Mr. Chukwuma Obi', 'bursar@edvora.ng', 'bursar', '{}'),
('44444444-4444-4444-4444-000000000003', 'Mrs. Amina Danjuma', 'teacher@edvora.ng', 'teacher', ARRAY['33333333-3333-3333-3333-000000000005'::uuid])
ON CONFLICT (email) DO NOTHING;

-- 4. Fee Plans (₦120,000 across classes: 12,000,000 kobo)
INSERT INTO fee_plans (id, term_id, class_id, name, total_amount_minor, components) VALUES
('55555555-5555-5555-5555-000000000005', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-000000000005', 'Primary 3 Standard Fee Plan', 12000000, 
 '[
   {"name": "Tuition Fee", "amount_minor": 7000000},
   {"name": "Books & Learning Materials", "amount_minor": 2500000},
   {"name": "Co-curricular & Sports", "amount_minor": 1500000},
   {"name": "Continuous Assessment & Exam", "amount_minor": 1000000}
 ]'::jsonb)
ON CONFLICT (term_id, class_id) DO NOTHING;

-- 5. Guardians & Pupils
INSERT INTO guardians (id, full_name, phone_number, email, telegram_chat_id, relationship, consent_sms, consent_telegram) VALUES
('66666666-6666-6666-6666-000000000001', 'Dr. & Mrs. Ehigiator', '+2348031234567', 'guardian.ehigiator@gmail.com', 987654321, 'parent', true, true)
ON CONFLICT DO NOTHING;

INSERT INTO pupils (id, admission_number, first_name, last_name, gender, class_id, status) VALUES
('77777777-7777-7777-7777-000000000001', 'EDV/2024/0042', 'Osasere', 'Ehigiator', 'male', '33333333-3333-3333-3333-000000000005', 'active'),
('77777777-7777-7777-7777-000000000002', 'EDV/2025/0118', 'Tamara', 'Ehigiator', 'female', '33333333-3333-3333-3333-000000000002', 'active')
ON CONFLICT (admission_number) DO NOTHING;

INSERT INTO pupil_guardians (pupil_id, guardian_id, is_primary) VALUES
('77777777-7777-7777-7777-000000000001', '66666666-6666-6666-6666-000000000001', true),
('77777777-7777-7777-7777-000000000002', '66666666-6666-6666-6666-000000000001', true)
ON CONFLICT DO NOTHING;

-- Fee assignment for Osasere: ₦120,000 (12,000,000 kobo)
INSERT INTO fee_assignments (id, pupil_id, term_id, fee_plan_id, base_amount_minor, adjusted_amount_minor) VALUES
('88888888-8888-8888-8888-000000000001', '77777777-7777-7777-7777-000000000001', '22222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-000000000005', 12000000, 12000000)
ON CONFLICT (pupil_id, term_id) DO NOTHING;

-- Completed payment: ₦70,000 (7,000,000 kobo) paid in October 2026
INSERT INTO payment_intents (id, pupil_id, term_id, reference, amount_minor, currency, environment, status, payer_email, payer_name, expires_at)
VALUES ('99999999-9999-9999-9999-000000000001', '77777777-7777-7777-7777-000000000001', '22222222-2222-2222-2222-222222222222', 'EDV-PAY-202610-0042', 7000000, 'NGN', 'test', 'successful', 'guardian.ehigiator@gmail.com', 'Dr. Ehigiator', '2026-10-15 12:00:00+00')
ON CONFLICT (reference) DO NOTHING;

INSERT INTO payment_transactions (id, intent_id, reference, provider, provider_transaction_id, amount_minor, currency, environment, status, channel, paid_at)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-000000000001', '99999999-9999-9999-9999-000000000001', 'EDV-PAY-202610-0042', 'paystack', 'PSTK_TX_9823412', 7000000, 'NGN', 'test', 'success', 'card', '2026-10-12 14:32:00+01')
ON CONFLICT (reference) DO NOTHING;

INSERT INTO fee_ledger_entries (id, pupil_id, term_id, transaction_id, entry_type, amount_minor, running_balance_minor, reference, description)
VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-000000000001', '77777777-7777-7777-7777-000000000001', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', 'credit', 7000000, 5000000, 'EDV-PAY-202610-0042', 'First Term Tuition & Materials - Part Payment')
ON CONFLICT DO NOTHING;

INSERT INTO receipts (id, receipt_number, transaction_id, pupil_id, term_id, amount_minor, currency, issued_at)
VALUES ('cccccccc-cccc-cccc-cccc-000000000001', 'REC-2026-0042', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001', '77777777-7777-7777-7777-000000000001', '22222222-2222-2222-2222-222222222222', 7000000, 'NGN', '2026-10-12 14:32:05+01')
ON CONFLICT (receipt_number) DO NOTHING;

-- Published Results for Osasere Ehigiator: 524/600 (87.33%)
INSERT INTO academic_results (id, pupil_id, term_id, class_id, subjects, total_score, max_score, average_score, position_in_class, class_size, teacher_remarks, head_remarks, status, published_at)
VALUES (
  'dddddddd-dddd-dddd-dddd-000000000001',
  '77777777-7777-7777-7777-000000000001',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-000000000005',
  '[
    {"subject": "Mathematics", "ca": 36, "exam": 56, "total": 92, "grade": "A+", "remarks": "Exceptional numeracy and logical problem-solving"},
    {"subject": "English Language", "ca": 34, "exam": 54, "total": 88, "grade": "A", "remarks": "Very strong reading comprehension and creative writing"},
    {"subject": "Basic Science & Technology", "ca": 35, "exam": 55, "total": 90, "grade": "A+", "remarks": "Active inquiry and solid scientific concepts"},
    {"subject": "Social & Civic Studies", "ca": 32, "exam": 52, "total": 84, "grade": "A", "remarks": "Clear understanding of community values and civic duty"},
    {"subject": "ICT & Computer Studies", "ca": 38, "exam": 56, "total": 94, "grade": "A+", "remarks": "Outstanding aptitude in practical computer exercises"},
    {"subject": "Creative Arts & Craft", "ca": 30, "exam": 46, "total": 76, "grade": "B+", "remarks": "Good creative vision and attentive participation"}
  ]'::jsonb,
  524.00,
  600.00,
  87.33,
  3,
  28,
  'Osasere has demonstrated commendable diligence and academic excellence throughout this term.',
  'An inspiring performance. Keep striving for greater heights.',
  'published',
  '2026-10-14 10:00:00+01'
)
ON CONFLICT (pupil_id, term_id) DO NOTHING;

