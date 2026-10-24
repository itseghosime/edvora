CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

ALTER FUNCTION public.get_authenticated_guardian_pupil_ids() SET SCHEMA private;
ALTER FUNCTION public.get_guardian_academic_result_pupil_ids() SET SCHEMA private;
ALTER FUNCTION public.get_guardian_financial_pupil_ids() SET SCHEMA private;
ALTER FUNCTION public.get_teacher_pupil_ids() SET SCHEMA private;
ALTER FUNCTION public.get_teacher_accessible_guardian_ids() SET SCHEMA private;

REVOKE ALL ON ALL FUNCTIONS IN SCHEMA private FROM PUBLIC, anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA private TO authenticated, service_role;

ALTER FUNCTION public.credit_payment_intent(varchar, varchar, bigint, varchar, jsonb) SET search_path = public;
ALTER FUNCTION public.claim_reminder_jobs(varchar, integer, integer) SET search_path = public;
ALTER FUNCTION public.claim_notification_jobs(varchar, integer, integer) SET search_path = public;

CREATE TABLE public.school_settings (
  id text PRIMARY KEY CHECK (id = 'school'),
  value jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(value) = 'object'),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.school_settings FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.school_settings TO service_role;
CREATE POLICY service_role_settings ON public.school_settings FOR ALL TO service_role USING (true) WITH CHECK (true);
INSERT INTO public.school_settings (id, value) VALUES ('school', '{"schoolName":"Edvora Nursery & Primary School","schoolShortName":"Edvora"}');
