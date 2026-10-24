-- Retire legacy DOB sessions: Student sessions require an unlocked password account.
CREATE OR REPLACE FUNCTION public.check_portal_session(p_hash text,p_type text,p_subject uuid,p_version integer) RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$
DECLARE v jsonb;
BEGIN
 IF EXISTS(SELECT 1 FROM revoked_portal_tokens WHERE token_hash=p_hash) THEN RETURN NULL; END IF;
 IF p_type='staff' THEN
  SELECT jsonb_build_object('role',role,'assignedClassIds',assigned_class_ids,'name',full_name) INTO v FROM staff_profiles WHERE id=p_subject AND is_active AND auth_version=p_version;
 ELSIF p_type='student' THEN
  SELECT jsonb_build_object('name',first_name||' '||last_name,'admissionNumber',admission_number,'className',(SELECT name FROM school_classes WHERE id=p.class_id)) INTO v FROM pupils p JOIN student_credentials c ON c.pupil_id=p.id WHERE p.id=p_subject AND p.status='active' AND p.auth_version=p_version AND NOT c.is_locked;
 END IF;
 RETURN v;
END; $$;


REVOKE ALL ON FUNCTION public.check_portal_session(text,text,uuid,integer) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.check_portal_session(text,text,uuid,integer) TO service_role;
