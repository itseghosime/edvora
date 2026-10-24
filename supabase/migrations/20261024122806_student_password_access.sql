CREATE UNIQUE INDEX pupil_admission_casefold_unique ON public.pupils(upper(admission_number));
-- Passwords and one-time access proofs are server-only. DOB is a school record,
-- never an authentication secret. Existing accounts need administrator setup.
CREATE TABLE public.student_credentials (
 pupil_id uuid PRIMARY KEY REFERENCES public.pupils(id) ON DELETE CASCADE,
 password_hash text NOT NULL CHECK(password_hash ~ '^scrypt-v1\$[0-9a-f]{32}\$[0-9a-f]{128}$'),
 is_locked boolean NOT NULL DEFAULT false,updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.student_access_tokens (
 token_hash text PRIMARY KEY CHECK(token_hash ~ '^[0-9a-f]{64}$'),
 pupil_id uuid NOT NULL REFERENCES public.pupils(id) ON DELETE CASCADE,
 issued_by uuid NOT NULL REFERENCES public.staff_profiles(id),
 auth_version integer NOT NULL,expires_at timestamptz NOT NULL,
 consumed_at timestamptz,revoked_at timestamptz,created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX student_access_pupil ON public.student_access_tokens(pupil_id);
ALTER TABLE public.student_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_access_tokens ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.student_credentials,public.student_access_tokens FROM PUBLIC,anon,authenticated;
GRANT ALL ON public.student_credentials,public.student_access_tokens TO service_role;
CREATE POLICY server_student_credentials ON public.student_credentials FOR ALL TO service_role USING(true) WITH CHECK(true);
CREATE POLICY server_student_access ON public.student_access_tokens FOR ALL TO service_role USING(true) WITH CHECK(true);

CREATE FUNCTION public.issue_student_access(p_staff uuid,p_request uuid,p_pupil uuid,p_hash text,p_reason text) RETURNS jsonb
LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$
DECLARE p pupils%ROWTYPE;prior staff_command_receipts%ROWTYPE;payload jsonb;response jsonb;
BEGIN
 IF p_request IS NULL OR p_hash !~ '^[0-9a-f]{64}$' OR length(trim(coalesce(p_reason,''))) NOT BETWEEN 3 AND 500 THEN RAISE EXCEPTION 'Invalid account setup request' USING ERRCODE='22023'; END IF;
 PERFORM 1 FROM staff_profiles WHERE id=p_staff AND is_active AND role='admin' FOR SHARE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Active administrator required' USING ERRCODE='42501'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(p_request::text,0));
 payload:=jsonb_build_object('pupilId',p_pupil,'tokenHash',p_hash,'reason',p_reason);
 SELECT * INTO prior FROM staff_command_receipts WHERE request_id=p_request;
 IF FOUND THEN
  IF prior.staff_id<>p_staff OR prior.command<>'issue_student_access' OR prior.payload<>payload THEN RAISE EXCEPTION 'Request already used for a different change' USING ERRCODE='22023'; END IF;
  RETURN prior.response;
 END IF;
 SELECT * INTO p FROM pupils WHERE id=p_pupil AND status='active' FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'An active pupil account is required' USING ERRCODE='22023'; END IF;
 UPDATE student_access_tokens SET revoked_at=now() WHERE pupil_id=p.id AND consumed_at IS NULL AND revoked_at IS NULL;
 UPDATE student_credentials SET is_locked=true,updated_at=now() WHERE pupil_id=p.id;
 UPDATE pupils SET auth_version=auth_version+1 WHERE id=p.id RETURNING auth_version INTO p.auth_version;
 INSERT INTO student_access_tokens(token_hash,pupil_id,issued_by,auth_version,expires_at) VALUES(p_hash,p.id,p_staff,p.auth_version,now()+interval '30 minutes');
 response:=jsonb_build_object('admissionNumber',p.admission_number,'expiresAt',now()+interval '30 minutes');
 INSERT INTO staff_command_receipts(request_id,staff_id,command,payload,response) VALUES(p_request,p_staff,'issue_student_access',payload,response);
 INSERT INTO audit_logs(actor_id,actor_type,action,entity_type,entity_id,details) VALUES(p_staff,'staff','issue_student_access','pupil',p.id,jsonb_build_object('requestId',p_request,'reason',p_reason));
 RETURN response;
END; $$;

CREATE FUNCTION public.student_access_is_valid(p_hash text) RETURNS boolean LANGUAGE sql SECURITY INVOKER SET search_path=public AS $$
 SELECT EXISTS(SELECT 1 FROM student_access_tokens t JOIN pupils p ON p.id=t.pupil_id WHERE t.token_hash=p_hash AND t.revoked_at IS NULL AND t.consumed_at IS NULL AND t.expires_at>now() AND t.auth_version=p.auth_version AND p.status='active');
$$;

CREATE FUNCTION public.redeem_student_access(p_hash text,p_password_hash text) RETURNS jsonb
LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$
DECLARE pupil_id_value uuid;p pupils%ROWTYPE;t student_access_tokens%ROWTYPE;
BEGIN
 IF p_password_hash !~ '^scrypt-v1\$[0-9a-f]{32}\$[0-9a-f]{128}$' OR p_password_hash IS NULL THEN RAISE EXCEPTION 'Invalid password encoding' USING ERRCODE='22023'; END IF;
 SELECT pupil_id INTO pupil_id_value FROM student_access_tokens WHERE token_hash=p_hash;
 IF pupil_id_value IS NULL THEN RAISE EXCEPTION 'Access link is unavailable or expired' USING ERRCODE='22023'; END IF;
 -- Consistent lock order with issuance/password changes: pupil, then credentials/proofs.
 SELECT * INTO p FROM pupils WHERE id=pupil_id_value FOR UPDATE;
 SELECT * INTO t FROM student_access_tokens WHERE token_hash=p_hash FOR UPDATE;
 IF p.status<>'active' OR t.revoked_at IS NOT NULL OR t.consumed_at IS NOT NULL OR t.expires_at<=now() OR t.auth_version<>p.auth_version THEN RAISE EXCEPTION 'Access link is unavailable or expired' USING ERRCODE='22023'; END IF;
 INSERT INTO student_credentials(pupil_id,password_hash,is_locked) VALUES(p.id,p_password_hash,false)
 ON CONFLICT(pupil_id) DO UPDATE SET password_hash=excluded.password_hash,is_locked=false,updated_at=now();
 UPDATE student_access_tokens SET consumed_at=now() WHERE token_hash=p_hash;
 UPDATE pupils SET auth_version=auth_version+1 WHERE id=p.id;
 INSERT INTO audit_logs(actor_id,actor_type,action,entity_type,entity_id) VALUES(p.id,'student','set_student_password','pupil',p.id);
 RETURN jsonb_build_object('success',true,'admissionNumber',p.admission_number);
END; $$;

CREATE FUNCTION public.read_student_credential(p_admission text) RETURNS jsonb
LANGUAGE sql SECURITY INVOKER SET search_path=public AS $$
 SELECT jsonb_build_object('pupilId',p.id,'admissionNumber',p.admission_number,'passwordHash',c.password_hash,'authVersion',p.auth_version,'name',p.first_name||' '||p.last_name,'className',sc.name,'guardianId',p.guardian_id)
 FROM pupils p JOIN student_credentials c ON c.pupil_id=p.id JOIN school_classes sc ON sc.id=p.class_id
 WHERE upper(p.admission_number)=upper(trim(p_admission)) AND p.status='active' AND NOT c.is_locked;
$$;
CREATE FUNCTION public.change_student_password(p_pupil uuid,p_old_hash text,p_new_hash text) RETURNS jsonb
LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$
BEGIN
 IF p_new_hash IS NULL OR p_new_hash !~ '^scrypt-v1\$[0-9a-f]{32}\$[0-9a-f]{128}$' THEN RAISE EXCEPTION 'Invalid password encoding' USING ERRCODE='22023'; END IF;
 PERFORM 1 FROM pupils WHERE id=p_pupil AND status='active' FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Account is unavailable' USING ERRCODE='42501'; END IF;
 UPDATE student_credentials SET password_hash=p_new_hash,updated_at=now() WHERE pupil_id=p_pupil AND password_hash=p_old_hash AND NOT is_locked;
 IF NOT FOUND THEN RAISE EXCEPTION 'Account credentials changed; sign in again' USING ERRCODE='42501'; END IF;
 UPDATE pupils SET auth_version=auth_version+1 WHERE id=p_pupil;
 UPDATE student_access_tokens SET revoked_at=now() WHERE pupil_id=p_pupil AND consumed_at IS NULL AND revoked_at IS NULL;
 INSERT INTO audit_logs(actor_id,actor_type,action,entity_type,entity_id) VALUES(p_pupil,'student','change_student_password','pupil',p_pupil);
 RETURN jsonb_build_object('success',true);
END; $$;
DO $$ DECLARE f regprocedure;BEGIN
 FOR f IN SELECT oid::regprocedure FROM pg_proc WHERE pronamespace='public'::regnamespace AND proname IN ('issue_student_access','redeem_student_access','read_student_credential','change_student_password','student_access_is_valid') LOOP
  EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC,anon,authenticated',f);
  EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role',f);
 END LOOP;
END; $$;
