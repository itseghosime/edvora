-- ==============================================================================
-- Migration: 20261024000001_staff_role_class_boundaries.sql
-- Enforces precise role and class boundaries for staff and guardian read access:
-- 1. Admin: school-wide access across all entities.
-- 2. Bursar: school-wide pupil, guardian, and financial records; no grading.
-- 3. Teacher: academic and pupil records restricted strictly to assigned classes;
--    zero access to payment intents, payment transactions, and ledger entries.
-- 4. Guardian: access strictly restricted to authorized linked children.
-- 5. Inactive staff: blocked completely from accessing records (0 rows).
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- Helper Security-Definer Functions (Prevents RLS Mutual Recursion)
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION get_authenticated_guardian_pupil_ids()
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id FROM pupils p 
  WHERE p.guardian_id IN (SELECT id FROM guardians WHERE user_id = auth.uid())
  UNION
  SELECT pg.pupil_id FROM pupil_guardians pg 
  JOIN guardians g ON g.id = pg.guardian_id 
  WHERE g.user_id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION get_authenticated_guardian_pupil_ids() TO authenticated;

CREATE OR REPLACE FUNCTION get_teacher_pupil_ids()
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id FROM pupils p
  JOIN staff_profiles sp ON sp.user_id = auth.uid() AND sp.is_active = true AND sp.role = 'teacher'
  WHERE p.class_id = ANY(sp.assigned_class_ids);
$$;

GRANT EXECUTE ON FUNCTION get_teacher_pupil_ids() TO authenticated;

CREATE OR REPLACE FUNCTION get_teacher_accessible_guardian_ids()
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.guardian_id FROM pupils p 
  JOIN staff_profiles sp ON sp.user_id = auth.uid() AND sp.is_active = true AND sp.role = 'teacher'
  WHERE p.class_id = ANY(sp.assigned_class_ids) AND p.guardian_id IS NOT NULL
  UNION
  SELECT pg.guardian_id FROM pupil_guardians pg 
  JOIN pupils p ON p.id = pg.pupil_id 
  JOIN staff_profiles sp ON sp.user_id = auth.uid() AND sp.is_active = true AND sp.role = 'teacher'
  WHERE p.class_id = ANY(sp.assigned_class_ids);
$$;

GRANT EXECUTE ON FUNCTION get_teacher_accessible_guardian_ids() TO authenticated;

-- ------------------------------------------------------------------------------
-- 1. Pupils Policy: Role & Class Boundaries
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS authenticated_pupils_view ON pupils;
CREATE POLICY authenticated_pupils_view ON pupils FOR SELECT TO authenticated
USING (
  -- Guardian: authorized linked children only
  id IN (SELECT get_authenticated_guardian_pupil_ids())
  -- Admin & Bursar: school-wide pupil access
  OR EXISTS (
    SELECT 1 FROM staff_profiles sp 
    WHERE sp.user_id = auth.uid() 
      AND sp.is_active = true 
      AND sp.role IN ('admin', 'bursar')
  )
  -- Teacher: pupils in assigned classes only
  OR EXISTS (
    SELECT 1 FROM staff_profiles sp 
    WHERE sp.user_id = auth.uid() 
      AND sp.is_active = true 
      AND sp.role = 'teacher' 
      AND pupils.class_id = ANY(sp.assigned_class_ids)
  )
);

-- ------------------------------------------------------------------------------
-- 2. Pupil Guardians Policy: Role & Class Boundaries
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS authenticated_pupil_guardians_view ON pupil_guardians;
CREATE POLICY authenticated_pupil_guardians_view ON pupil_guardians FOR SELECT TO authenticated
USING (
  -- Guardian: own link
  guardian_id IN (SELECT id FROM guardians WHERE user_id = auth.uid())
  -- Admin & Bursar: school-wide
  OR EXISTS (
    SELECT 1 FROM staff_profiles sp 
    WHERE sp.user_id = auth.uid() 
      AND sp.is_active = true 
      AND sp.role IN ('admin', 'bursar')
  )
  -- Teacher: guardians of pupils in assigned classes only
  OR pupil_id IN (SELECT get_teacher_pupil_ids())
);

-- ------------------------------------------------------------------------------
-- 3. Guardians Policy: Role & Class Boundaries
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS authenticated_guardians_view ON guardians;
CREATE POLICY authenticated_guardians_view ON guardians FOR SELECT TO authenticated
USING (
  -- Guardian: own profile
  user_id = auth.uid()
  -- Admin & Bursar: school-wide guardian directory
  OR EXISTS (
    SELECT 1 FROM staff_profiles sp 
    WHERE sp.user_id = auth.uid() 
      AND sp.is_active = true 
      AND sp.role IN ('admin', 'bursar')
  )
  -- Teacher: guardians of pupils in assigned classes only
  OR id IN (SELECT get_teacher_accessible_guardian_ids())
);

-- ------------------------------------------------------------------------------
-- 4. Payment Intents: Admin & Bursar or linked guardian only (No teacher access)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS authenticated_intents_view ON payment_intents;
CREATE POLICY authenticated_intents_view ON payment_intents FOR SELECT TO authenticated
USING (
  -- Guardian: linked pupil payments only
  pupil_id IN (SELECT get_authenticated_guardian_pupil_ids())
  -- Admin & Bursar: authorized financial records only
  OR EXISTS (
    SELECT 1 FROM staff_profiles sp 
    WHERE sp.user_id = auth.uid() 
      AND sp.is_active = true 
      AND sp.role IN ('admin', 'bursar')
  )
);

-- ------------------------------------------------------------------------------
-- 5. Payment Transactions: Admin & Bursar or linked guardian only (No teacher access)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS authenticated_transactions_view ON payment_transactions;
CREATE POLICY authenticated_transactions_view ON payment_transactions FOR SELECT TO authenticated
USING (
  -- Guardian: linked pupil transactions only
  intent_id IN (
    SELECT pi.id FROM payment_intents pi 
    WHERE pi.pupil_id IN (SELECT get_authenticated_guardian_pupil_ids())
  )
  -- Admin & Bursar: authorized financial records only
  OR EXISTS (
    SELECT 1 FROM staff_profiles sp 
    WHERE sp.user_id = auth.uid() 
      AND sp.is_active = true 
      AND sp.role IN ('admin', 'bursar')
  )
);

-- ------------------------------------------------------------------------------
-- 6. Academic Results: Admin, Teacher (assigned classes only), or Guardian (published child results only)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS authenticated_results_view ON academic_results;
CREATE POLICY authenticated_results_view ON academic_results FOR SELECT TO authenticated
USING (
  -- Guardian: published results of authorized child only
  (
    status = 'published'
    AND pupil_id IN (SELECT get_authenticated_guardian_pupil_ids())
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
