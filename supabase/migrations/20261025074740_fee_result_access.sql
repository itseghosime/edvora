-- Fee clearance is term-specific. Publication and fee clearance are independent.
ALTER TABLE public.academic_results
 ADD COLUMN fee_access_override boolean NOT NULL DEFAULT false,
 ADD COLUMN fee_override_reason text,
 ADD COLUMN fee_override_by uuid REFERENCES public.staff_profiles(id),
 ADD COLUMN fee_override_at timestamptz;

-- Private lookup used only after existing guardian/teacher authorization policies.
CREATE FUNCTION private.result_fees_cleared(p_pupil uuid,p_term uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT auth.uid() IS NOT NULL AND NOT EXISTS(
  SELECT 1 FROM public.fee_assignments a WHERE a.pupil_id=p_pupil AND a.term_id=p_term
   AND a.adjusted_amount_minor > coalesce((SELECT sum(l.amount_minor) FROM public.fee_ledger_entries l
    WHERE l.pupil_id=a.pupil_id AND l.term_id=a.term_id AND l.entry_type='credit'),0)
 );
$$;
REVOKE ALL ON FUNCTION private.result_fees_cleared(uuid,uuid) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION private.result_fees_cleared(uuid,uuid) TO authenticated;

-- Restrictive AND policy preserves all existing child, permission and class boundaries.
CREATE POLICY result_fee_clearance ON public.academic_results AS RESTRICTIVE FOR SELECT TO authenticated
USING (
 fee_access_override OR private.result_fees_cleared(pupil_id,term_id)
 OR EXISTS(SELECT 1 FROM public.staff_profiles s WHERE s.user_id=auth.uid() AND s.is_active AND
  (s.role='admin' OR (s.role='teacher' AND academic_results.class_id=ANY(s.assigned_class_ids))))
);

-- Server DTO exposes only lock metadata, never grades, to locked Student sessions.
CREATE FUNCTION public.get_result_access(p_pupil_ids uuid[],p_term_id uuid)
RETURNS TABLE(pupil_id uuid,balance_minor bigint,locked boolean,overridden boolean,has_published boolean)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path=public AS $$
 WITH balances AS (
 SELECT p.id AS pupil_id,
  greatest(0,coalesce(a.adjusted_amount_minor,0)-coalesce(
   (SELECT sum(l.amount_minor) FROM fee_ledger_entries l WHERE l.pupil_id=p.id AND l.term_id=p_term_id AND l.entry_type='credit'),0))::bigint AS balance_minor,
  coalesce(r.fee_access_override,false) AS overridden,
  coalesce(r.status='published',false) AS has_published
 FROM pupils p
 LEFT JOIN fee_assignments a ON a.pupil_id=p.id AND a.term_id=p_term_id
 LEFT JOIN academic_results r ON r.pupil_id=p.id AND r.term_id=p_term_id
 WHERE p.id=ANY(p_pupil_ids)
 ) SELECT pupil_id,balance_minor,has_published AND balance_minor>0 AND NOT overridden,overridden,has_published FROM balances;
$$;
REVOKE ALL ON FUNCTION public.get_result_access(uuid[],uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.get_result_access(uuid[],uuid) TO service_role;

-- Extend the existing transactional command boundary, keeping live-role checks,
-- request receipts, replay protection and the original role/class safeguards.
DO $migration$
DECLARE definition text; marker text := 'ELSIF p_command=''save_reminder'' THEN';
BEGIN
 SELECT pg_get_functiondef('public.execute_staff_command(uuid,uuid,text,jsonb)'::regprocedure) INTO definition;
 IF strpos(definition,marker)=0 THEN RAISE EXCEPTION 'Staff command extension point missing'; END IF;
 definition:=replace(definition,marker,$case$
 ELSIF p_command='set_result_fee_override' THEN
   IF s.role<>'admin' THEN RAISE EXCEPTION 'Administrator access required' USING ERRCODE='42501'; END IF;
   IF jsonb_typeof(p_payload->'allowAccess') IS DISTINCT FROM 'boolean'
    OR length(trim(coalesce(p_payload->>'reason',''))) NOT BETWEEN 3 AND 1000 THEN
    RAISE EXCEPTION 'Choose an access setting and provide a reason (3–1000 characters)' USING ERRCODE='22023';
   END IF;
   SELECT * INTO report FROM academic_results WHERE id=(p_payload->>'resultId')::uuid FOR UPDATE;
   IF NOT FOUND THEN RAISE EXCEPTION 'Result not found' USING ERRCODE='22023'; END IF;
   UPDATE academic_results SET fee_access_override=(p_payload->>'allowAccess')::boolean,
    fee_override_reason=trim(p_payload->>'reason'),fee_override_by=s.id,fee_override_at=now(),updated_at=now() WHERE id=report.id;
   INSERT INTO audit_logs(actor_id,actor_type,action,entity_type,entity_id,details)
    VALUES(s.id,'staff','result_fee_override','academic_result',report.id,
     jsonb_build_object('pupilId',report.pupil_id,'termId',report.term_id,'previous',report.fee_access_override,
      'allowAccess',(p_payload->>'allowAccess')::boolean,'reason',trim(p_payload->>'reason'),'requestId',p_request_id));
   entity:=report.id; response:=jsonb_build_object('id',entity,'allowAccess',(p_payload->>'allowAccess')::boolean);
 ELSIF p_command='save_reminder' THEN
 $case$);
 EXECUTE definition;
END; $migration$;

-- Publication notices contain no marks and do not promise access to locked results.
DO $migration$
DECLARE definition text;
BEGIN
 SELECT pg_get_functiondef(oid) INTO definition FROM pg_proc
 WHERE pronamespace='public'::regnamespace AND proname='authorize_school_send';
 IF definition IS NOT NULL THEN
  definition:=replace(definition,'Edvora: a school report is available in the Student portal. ',
   'Edvora: a school report has been published. Access requires fee clearance or administrator approval. ');
  EXECUTE definition;
 END IF;
END; $migration$;
NOTIFY pgrst,'reload schema';
