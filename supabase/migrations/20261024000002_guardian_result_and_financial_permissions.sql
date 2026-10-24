-- ==============================================================================
-- Migration: 20261024000002_guardian_result_and_financial_permissions.sql
-- Enforces separate academic and financial permissions for guardians:
-- 1. Academic Results: Access must respect pupil_guardians.can_view_results.
--    A secondary guardian with can_view_results = false must NOT qualify
--    through the general guardian-pupil lookup.
-- 2. Financial Records: Payment intents and transactions must respect
--    pupil_guardians.can_pay_fees.
-- 3. Both remain strictly isolated to the authorized child.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Helper Security-Definer Function: Academic Result Access for Guardians
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_guardian_academic_result_pupil_ids()
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Primary guardian from pupils table, provided there is no explicit pupil_guardians record with can_view_results = false
  SELECT p.id FROM pupils p 
  JOIN guardians g ON g.id = p.guardian_id
  WHERE g.user_id = auth.uid()
    AND NOT EXISTS (
      SELECT 1 FROM pupil_guardians pg 
      WHERE pg.pupil_id = p.id AND pg.guardian_id = g.id AND pg.can_view_results = false
    )
  UNION
  -- Linked guardians in pupil_guardians where can_view_results is explicitly true
  SELECT pg.pupil_id FROM pupil_guardians pg 
  JOIN guardians g ON g.id = pg.guardian_id 
  WHERE g.user_id = auth.uid() AND pg.can_view_results = true;
$$;

GRANT EXECUTE ON FUNCTION get_guardian_academic_result_pupil_ids() TO authenticated;

-- ------------------------------------------------------------------------------
-- 2. Helper Security-Definer Function: Financial Record Access for Guardians
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_guardian_financial_pupil_ids()
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Primary guardian from pupils table, provided there is no explicit pupil_guardians record with can_pay_fees = false
  SELECT p.id FROM pupils p 
  JOIN guardians g ON g.id = p.guardian_id
  WHERE g.user_id = auth.uid()
    AND NOT EXISTS (
      SELECT 1 FROM pupil_guardians pg 
      WHERE pg.pupil_id = p.id AND pg.guardian_id = g.id AND pg.can_pay_fees = false
    )
  UNION
  -- Linked guardians in pupil_guardians where can_pay_fees is explicitly true
  SELECT pg.pupil_id FROM pupil_guardians pg 
  JOIN guardians g ON g.id = pg.guardian_id 
  WHERE g.user_id = auth.uid() AND pg.can_pay_fees = true;
$$;

GRANT EXECUTE ON FUNCTION get_guardian_financial_pupil_ids() TO authenticated;

-- ------------------------------------------------------------------------------
-- 3. Academic Results Policy: Separated & Bound to can_view_results
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS authenticated_results_view ON academic_results;
CREATE POLICY authenticated_results_view ON academic_results FOR SELECT TO authenticated
USING (
  -- Guardian: published results of authorized child where can_view_results is true
  (
    status = 'published'
    AND pupil_id IN (SELECT get_guardian_academic_result_pupil_ids())
  )
  -- Admin: school-wide results
  OR EXISTS (
    SELECT 1 FROM staff_profiles sp 
    WHERE sp.user_id = auth.uid() 
      AND sp.is_active = true 
      AND sp.role = 'admin'
  )
  -- Teacher: academic results for assigned classes only
  OR EXISTS (
    SELECT 1 FROM staff_profiles sp 
    WHERE sp.user_id = auth.uid() 
      AND sp.is_active = true 
      AND sp.role = 'teacher' 
      AND academic_results.class_id = ANY(sp.assigned_class_ids)
  )
);

-- ------------------------------------------------------------------------------
-- 4. Payment Intents Policy: Separated & Bound to can_pay_fees
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS authenticated_intents_view ON payment_intents;
CREATE POLICY authenticated_intents_view ON payment_intents FOR SELECT TO authenticated
USING (
  -- Guardian: linked pupil payments only where can_pay_fees is permitted
  pupil_id IN (SELECT get_guardian_financial_pupil_ids())
  -- Admin & Bursar: authorized financial records only
  OR EXISTS (
    SELECT 1 FROM staff_profiles sp 
    WHERE sp.user_id = auth.uid() 
      AND sp.is_active = true 
      AND sp.role IN ('admin', 'bursar')
  )
);

-- ------------------------------------------------------------------------------
-- 5. Payment Transactions Policy: Separated & Bound to can_pay_fees
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS authenticated_transactions_view ON payment_transactions;
CREATE POLICY authenticated_transactions_view ON payment_transactions FOR SELECT TO authenticated
USING (
  -- Guardian: linked pupil transactions only where can_pay_fees is permitted
  intent_id IN (
    SELECT pi.id FROM payment_intents pi 
    WHERE pi.pupil_id IN (SELECT get_guardian_financial_pupil_ids())
  )
  -- Admin & Bursar: authorized financial records only
  OR EXISTS (
    SELECT 1 FROM staff_profiles sp 
    WHERE sp.user_id = auth.uid() 
      AND sp.is_active = true 
      AND sp.role IN ('admin', 'bursar')
  )
);
