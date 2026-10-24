-- Server-only session checks, notification ownership, and durable provider reconciliation.
ALTER TABLE public.staff_profiles ADD COLUMN auth_version integer NOT NULL DEFAULT 0;
ALTER TABLE public.pupils ADD COLUMN auth_version integer NOT NULL DEFAULT 0;
CREATE TABLE public.revoked_portal_tokens(token_hash text PRIMARY KEY CHECK(length(token_hash)=64),expires_at timestamptz NOT NULL);
CREATE TABLE public.staff_notification_contacts (
 staff_id uuid PRIMARY KEY REFERENCES public.staff_profiles(id) ON DELETE CASCADE,
 phone_number text,telegram_chat_id bigint,consent_sms boolean NOT NULL DEFAULT false,consent_telegram boolean NOT NULL DEFAULT false,
 CHECK(phone_number IS NULL OR phone_number ~ '^\+[1-9][0-9]{7,14}$'),CHECK(telegram_chat_id IS NULL OR telegram_chat_id>0)
);
ALTER TABLE public.revoked_portal_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_notification_contacts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.revoked_portal_tokens,public.staff_notification_contacts FROM PUBLIC,anon,authenticated;
GRANT ALL ON public.revoked_portal_tokens,public.staff_notification_contacts TO service_role;
CREATE POLICY server_tokens ON public.revoked_portal_tokens FOR ALL TO service_role USING(true) WITH CHECK(true);
CREATE POLICY server_staff_contacts ON public.staff_notification_contacts FOR ALL TO service_role USING(true) WITH CHECK(true);
CREATE FUNCTION private.invalidate_portal_sessions() RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$
BEGIN
 IF TG_TABLE_NAME='staff_profiles' THEN
  IF NEW.is_active IS DISTINCT FROM OLD.is_active OR NEW.user_id IS DISTINCT FROM OLD.user_id THEN NEW.auth_version:=OLD.auth_version+1; END IF;
 ELSE
  IF NEW.status IS DISTINCT FROM OLD.status OR NEW.date_of_birth IS DISTINCT FROM OLD.date_of_birth OR NEW.admission_number IS DISTINCT FROM OLD.admission_number THEN NEW.auth_version:=OLD.auth_version+1; END IF;
 END IF;
 RETURN NEW;
END; $$;
REVOKE ALL ON FUNCTION private.invalidate_portal_sessions() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER staff_session_version BEFORE UPDATE ON public.staff_profiles FOR EACH ROW EXECUTE FUNCTION private.invalidate_portal_sessions();
CREATE TRIGGER pupil_session_version BEFORE UPDATE ON public.pupils FOR EACH ROW EXECUTE FUNCTION private.invalidate_portal_sessions();
CREATE FUNCTION public.check_portal_session(p_hash text,p_type text,p_subject uuid,p_version integer) RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$
DECLARE v jsonb;
BEGIN
 IF EXISTS(SELECT 1 FROM revoked_portal_tokens WHERE token_hash=p_hash) THEN RETURN NULL; END IF;
 IF p_type='staff' THEN
  SELECT jsonb_build_object('role',role,'assignedClassIds',assigned_class_ids,'name',full_name) INTO v FROM staff_profiles WHERE id=p_subject AND is_active AND auth_version=p_version;
 ELSIF p_type='student' THEN
  SELECT jsonb_build_object('name',first_name||' '||last_name,'admissionNumber',admission_number,'className',(SELECT name FROM school_classes WHERE id=p.class_id)) INTO v FROM pupils p WHERE id=p_subject AND status='active' AND auth_version=p_version;
 END IF;
 RETURN v;
END; $$;

ALTER TABLE public.reminder_jobs ADD COLUMN next_attempt_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.notification_jobs ADD COLUMN next_attempt_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.reminder_attempts ADD COLUMN owner_claim_token text,ADD COLUMN retryable boolean NOT NULL DEFAULT false;
ALTER TABLE public.notification_attempts ADD COLUMN owner_claim_token text,ADD COLUMN retryable boolean NOT NULL DEFAULT false;
ALTER TABLE public.payment_intents ADD COLUMN claimed_by_run_id text,ADD COLUMN claim_token text,ADD COLUMN lease_expires_at timestamptz;
ALTER TABLE public.sms_delivery_inbox ADD COLUMN unmatched_count integer NOT NULL DEFAULT 0,ADD COLUMN next_attempt_at timestamptz NOT NULL DEFAULT now(),ADD COLUMN quarantined_at timestamptz,ADD COLUMN quarantine_reason text;
CREATE INDEX reminder_due_jobs ON public.reminder_jobs(next_attempt_at) WHERE status='pending';
CREATE INDEX notification_due_jobs ON public.notification_jobs(next_attempt_at) WHERE status='pending';
CREATE INDEX sms_unapplied_events ON public.sms_delivery_inbox(next_attempt_at) WHERE applied_at IS NULL AND quarantined_at IS NULL;
CREATE INDEX reminder_provider_message ON public.reminder_attempts(provider_message_id) WHERE channel='sms';
CREATE INDEX notification_provider_message ON public.notification_attempts(provider_message_id) WHERE channel='sms';

-- No browser role can call these server entry points.
DO $$ DECLARE f regprocedure; BEGIN
 FOR f IN SELECT oid::regprocedure FROM pg_proc WHERE pronamespace='public'::regnamespace AND proname IN ('check_portal_session','claim_school_jobs','authorize_school_send','record_school_outcome','ingest_school_sms','apply_school_sms','recover_school_jobs','record_school_incident') LOOP
  EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC,anon,authenticated',f);
  EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role',f);
 END LOOP;
END; $$;
