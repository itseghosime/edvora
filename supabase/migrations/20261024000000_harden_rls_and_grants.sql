-- ==============================================================================
-- Migration: 20261024000000_harden_rls_and_grants.sql
-- Hardens PostgreSQL access control and Row-Level Security (RLS) across all tables:
-- 1. Revokes blanket CRUD privileges previously granted to anon and authenticated.
-- 2. Grants strictly the minimum explicitly required privileges.
-- 3. Enables RLS on ALL public tables (including financial, automation, and operational logs).
-- 4. Establishes granular tenant/role isolation policies for authenticated users.
-- 5. Restricts financial writes, receipts, adjustments, staff management, and
--    automation queues to server-only (service_role).
-- ==============================================================================

-- 1. Revoke blanket privileges from anon and authenticated
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL ROUTINES IN SCHEMA public FROM anon, authenticated;

-- 2. Grant minimum required usage
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Minimum SELECT grants for public reference data
GRANT SELECT ON academic_sessions TO anon, authenticated;
GRANT SELECT ON academic_terms TO anon, authenticated;
GRANT SELECT ON school_classes TO anon, authenticated;
GRANT SELECT ON fee_plans TO anon, authenticated;

-- Minimum SELECT grants for authenticated users (protected by RLS policies)
GRANT SELECT ON staff_profiles TO authenticated;
GRANT SELECT ON guardians TO authenticated;
GRANT SELECT ON pupils TO authenticated;
GRANT SELECT ON pupil_guardians TO authenticated;
GRANT SELECT ON fee_assignments TO authenticated;
GRANT SELECT ON fee_adjustments TO authenticated;
GRANT SELECT ON fee_ledger_entries TO authenticated;
GRANT SELECT ON receipts TO authenticated;
GRANT SELECT ON payment_intents TO authenticated;
GRANT SELECT ON payment_transactions TO authenticated;
GRANT SELECT ON academic_results TO authenticated;

-- 3. Enable RLS on ALL public tables
ALTER TABLE academic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE pupils ENABLE ROW LEVEL SECURITY;
ALTER TABLE pupil_guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_delivery_inbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE operational_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 4. Service Role Bypass Policies (Full access to all tables for backend server)
DROP POLICY IF EXISTS service_role_all_sessions ON academic_sessions;
CREATE POLICY service_role_all_sessions ON academic_sessions FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_terms ON academic_terms;
CREATE POLICY service_role_all_terms ON academic_terms FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_classes ON school_classes;
CREATE POLICY service_role_all_classes ON school_classes FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_fee_plans ON fee_plans;
CREATE POLICY service_role_all_fee_plans ON fee_plans FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_staff ON staff_profiles;
CREATE POLICY service_role_all_staff ON staff_profiles FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_pupils ON pupils;
CREATE POLICY service_role_all_pupils ON pupils FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_guardians ON guardians;
CREATE POLICY service_role_all_guardians ON guardians FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_pupil_guardians ON pupil_guardians;
CREATE POLICY service_role_all_pupil_guardians ON pupil_guardians FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_fees ON fee_assignments;
CREATE POLICY service_role_all_fees ON fee_assignments FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_adjustments ON fee_adjustments;
CREATE POLICY service_role_all_adjustments ON fee_adjustments FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_intents ON payment_intents;
CREATE POLICY service_role_all_intents ON payment_intents FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_transactions ON payment_transactions;
CREATE POLICY service_role_all_transactions ON payment_transactions FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_ledger ON fee_ledger_entries;
CREATE POLICY service_role_all_ledger ON fee_ledger_entries FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_receipts ON receipts;
CREATE POLICY service_role_all_receipts ON receipts FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_results ON academic_results;
CREATE POLICY service_role_all_results ON academic_results FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_reminder_rules ON reminder_rules;
CREATE POLICY service_role_all_reminder_rules ON reminder_rules FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_reminder_jobs ON reminder_jobs;
CREATE POLICY service_role_all_reminder_jobs ON reminder_jobs FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_reminder_attempts ON reminder_attempts;
CREATE POLICY service_role_all_reminder_attempts ON reminder_attempts FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_sms_inbox ON sms_delivery_inbox;
CREATE POLICY service_role_all_sms_inbox ON sms_delivery_inbox FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_notif_jobs ON notification_jobs;
CREATE POLICY service_role_all_notif_jobs ON notification_jobs FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_notif_attempts ON notification_attempts;
CREATE POLICY service_role_all_notif_attempts ON notification_attempts FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_incidents ON operational_incidents;
CREATE POLICY service_role_all_incidents ON operational_incidents FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS service_role_all_audit ON audit_logs;
CREATE POLICY service_role_all_audit ON audit_logs FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 5. Public reference data read policies (anon & authenticated)
DROP POLICY IF EXISTS public_read_sessions ON academic_sessions;
CREATE POLICY public_read_sessions ON academic_sessions FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS public_read_terms ON academic_terms;
CREATE POLICY public_read_terms ON academic_terms FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS public_read_classes ON school_classes;
CREATE POLICY public_read_classes ON school_classes FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS public_read_fee_plans ON fee_plans;
CREATE POLICY public_read_fee_plans ON fee_plans FOR SELECT TO anon, authenticated USING (true);

-- 6. Staff profiles: Read-only for authenticated users; No client writes
DROP POLICY IF EXISTS authenticated_staff_view ON staff_profiles;
CREATE POLICY authenticated_staff_view ON staff_profiles FOR SELECT TO authenticated USING (true);

-- 7. Guardians: strictly isolated to own guardian record or active staff
DROP POLICY IF EXISTS authenticated_guardians_view ON guardians;
CREATE POLICY authenticated_guardians_view ON guardians FOR SELECT TO authenticated
USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM staff_profiles sp WHERE sp.user_id = auth.uid() AND sp.is_active = true)
);

-- 8. Pupils & Pupil-Guardians: strictly isolated to linked guardian or active staff
DROP POLICY IF EXISTS authenticated_pupils_view ON pupils;
CREATE POLICY authenticated_pupils_view ON pupils FOR SELECT TO authenticated
USING (
  guardian_id IN (SELECT id FROM guardians WHERE user_id = auth.uid())
  OR id IN (SELECT pg.pupil_id FROM pupil_guardians pg JOIN guardians g ON g.id = pg.guardian_id WHERE g.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM staff_profiles sp WHERE sp.user_id = auth.uid() AND sp.is_active = true)
);

DROP POLICY IF EXISTS authenticated_pupil_guardians_view ON pupil_guardians;
CREATE POLICY authenticated_pupil_guardians_view ON pupil_guardians FOR SELECT TO authenticated
USING (
  guardian_id IN (SELECT id FROM guardians WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM staff_profiles sp WHERE sp.user_id = auth.uid() AND sp.is_active = true)
);

-- 9. Payment Intents: accessible ONLY to linked guardian or active staff; writes are server-only
DROP POLICY IF EXISTS authenticated_intents_view ON payment_intents;
CREATE POLICY authenticated_intents_view ON payment_intents FOR SELECT TO authenticated
USING (
  pupil_id IN (
    SELECT p.id FROM pupils p WHERE p.guardian_id IN (SELECT id FROM guardians WHERE user_id = auth.uid())
    UNION
    SELECT pg.pupil_id FROM pupil_guardians pg JOIN guardians g ON g.id = pg.guardian_id WHERE g.user_id = auth.uid()
  )
  OR EXISTS (SELECT 1 FROM staff_profiles sp WHERE sp.user_id = auth.uid() AND sp.is_active = true)
);

-- 10. Payment Transactions: accessible ONLY to linked guardian or active staff; writes are server-only
DROP POLICY IF EXISTS authenticated_transactions_view ON payment_transactions;
CREATE POLICY authenticated_transactions_view ON payment_transactions FOR SELECT TO authenticated
USING (
  intent_id IN (
    SELECT pi.id FROM payment_intents pi WHERE pi.pupil_id IN (
      SELECT p.id FROM pupils p WHERE p.guardian_id IN (SELECT id FROM guardians WHERE user_id = auth.uid())
      UNION
      SELECT pg.pupil_id FROM pupil_guardians pg JOIN guardians g ON g.id = pg.guardian_id WHERE g.user_id = auth.uid()
    )
  )
  OR EXISTS (SELECT 1 FROM staff_profiles sp WHERE sp.user_id = auth.uid() AND sp.is_active = true)
);

-- 11. Fee Assignments: accessible to linked guardian or bursar/admin staff
DROP POLICY IF EXISTS authenticated_fees_view ON fee_assignments;
CREATE POLICY authenticated_fees_view ON fee_assignments FOR SELECT TO authenticated
USING (
  pupil_id IN (
    SELECT p.id FROM pupils p WHERE p.guardian_id IN (SELECT id FROM guardians WHERE user_id = auth.uid())
    UNION
    SELECT pg.pupil_id FROM pupil_guardians pg JOIN guardians g ON g.id = pg.guardian_id WHERE g.user_id = auth.uid()
  )
  OR EXISTS (SELECT 1 FROM staff_profiles sp WHERE sp.user_id = auth.uid() AND sp.is_active = true AND sp.role IN ('admin', 'bursar'))
);

-- 12. Fee Adjustments: accessible to linked guardian or bursar/admin staff; writes are server-only
DROP POLICY IF EXISTS authenticated_adjustments_view ON fee_adjustments;
CREATE POLICY authenticated_adjustments_view ON fee_adjustments FOR SELECT TO authenticated
USING (
  fee_assignment_id IN (
    SELECT fa.id FROM fee_assignments fa WHERE fa.pupil_id IN (
      SELECT p.id FROM pupils p WHERE p.guardian_id IN (SELECT id FROM guardians WHERE user_id = auth.uid())
      UNION
      SELECT pg.pupil_id FROM pupil_guardians pg JOIN guardians g ON g.id = pg.guardian_id WHERE g.user_id = auth.uid()
    )
  )
  OR EXISTS (SELECT 1 FROM staff_profiles sp WHERE sp.user_id = auth.uid() AND sp.is_active = true AND sp.role IN ('admin', 'bursar'))
);

-- 13. Fee Ledger Entries: accessible to linked guardian or bursar/admin staff; writes are strictly server-only
DROP POLICY IF EXISTS authenticated_ledger_view ON fee_ledger_entries;
CREATE POLICY authenticated_ledger_view ON fee_ledger_entries FOR SELECT TO authenticated
USING (
  pupil_id IN (
    SELECT p.id FROM pupils p WHERE p.guardian_id IN (SELECT id FROM guardians WHERE user_id = auth.uid())
    UNION
    SELECT pg.pupil_id FROM pupil_guardians pg JOIN guardians g ON g.id = pg.guardian_id WHERE g.user_id = auth.uid()
  )
  OR EXISTS (SELECT 1 FROM staff_profiles sp WHERE sp.user_id = auth.uid() AND sp.is_active = true AND sp.role IN ('admin', 'bursar'))
);

-- 14. Receipts: accessible to linked guardian or bursar/admin staff; writes are strictly server-only
DROP POLICY IF EXISTS authenticated_receipts_view ON receipts;
CREATE POLICY authenticated_receipts_view ON receipts FOR SELECT TO authenticated
USING (
  pupil_id IN (
    SELECT p.id FROM pupils p WHERE p.guardian_id IN (SELECT id FROM guardians WHERE user_id = auth.uid())
    UNION
    SELECT pg.pupil_id FROM pupil_guardians pg JOIN guardians g ON g.id = pg.guardian_id WHERE g.user_id = auth.uid()
  )
  OR EXISTS (SELECT 1 FROM staff_profiles sp WHERE sp.user_id = auth.uid() AND sp.is_active = true AND sp.role IN ('admin', 'bursar'))
);

-- 15. Academic Results: accessible if published to linked guardian, or to staff
DROP POLICY IF EXISTS authenticated_results_view ON academic_results;
CREATE POLICY authenticated_results_view ON academic_results FOR SELECT TO authenticated
USING (
  (
    status = 'published'
    AND pupil_id IN (
      SELECT p.id FROM pupils p WHERE p.guardian_id IN (SELECT id FROM guardians WHERE user_id = auth.uid())
      UNION
      SELECT pg.pupil_id FROM pupil_guardians pg JOIN guardians g ON g.id = pg.guardian_id WHERE g.user_id = auth.uid()
    )
  )
  OR EXISTS (SELECT 1 FROM staff_profiles sp WHERE sp.user_id = auth.uid() AND sp.is_active = true)
);

-- NOTE: Internal queues and operational logs (reminder_rules, reminder_jobs,
-- reminder_attempts, sms_delivery_inbox, notification_jobs, notification_attempts,
-- operational_incidents, audit_logs) have RLS enabled with service_role policies only.
-- No grants and no policies exist for anon or ordinary authenticated users.
