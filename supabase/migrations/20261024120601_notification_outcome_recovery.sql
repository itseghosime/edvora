CREATE FUNCTION public.record_school_outcome(p_kind text,p_job uuid,p_claim text,p_attempt uuid,p_attempt_token text,p_status text,p_provider_id text DEFAULT NULL,p_reason text DEFAULT NULL,p_retryable boolean DEFAULT false) RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$
DECLARE j record;a record;tbl text;ats text;status_value text;job_status text;
BEGIN
 IF p_kind NOT IN ('reminder','notification') OR p_status NOT IN ('sent','accepted','failed','rejected','unknown','skipped') THEN RAISE EXCEPTION 'Invalid outcome' USING ERRCODE='22023'; END IF;
 tbl:=p_kind||'_jobs';ats:=p_kind||'_attempts';
 EXECUTE format('SELECT * FROM %I WHERE id=$1 FOR UPDATE',tbl) INTO j USING p_job;
 IF j.id IS NULL OR j.claim_token IS DISTINCT FROM p_claim THEN RAISE EXCEPTION 'Claim not owned' USING ERRCODE='42501'; END IF;
 IF p_attempt IS NULL AND p_status='skipped' THEN RETURN jsonb_build_object('success',true,'job_id',p_job,'ignored',true); END IF;
 EXECUTE format('SELECT * FROM %I WHERE id=$1 AND job_id=$2 AND attempt_token=$3 AND owner_claim_token=$4 FOR UPDATE',ats) INTO a USING p_attempt,p_job,p_attempt_token,p_claim;
 IF a.id IS NULL THEN RAISE EXCEPTION 'Attempt not owned by this job and claim' USING ERRCODE='42501'; END IF;
 IF a.status IN ('sent','accepted','delivered','rejected','failed','skipped') THEN RETURN jsonb_build_object('success',true,'job_id',p_job,'duplicate',true); END IF;
 IF p_status IN ('sent','accepted') AND (coalesce(p_provider_id,'')='' OR (a.channel='sms' AND p_status<>'accepted') OR (a.channel='telegram' AND p_status<>'sent')) THEN RAISE EXCEPTION 'Invalid provider outcome for channel' USING ERRCODE='22023'; END IF;
 status_value:=CASE WHEN p_status='unknown' THEN 'review_required' ELSE p_status END;
 job_status:=CASE WHEN p_status IN ('sent','accepted') THEN 'sent' WHEN p_status='unknown' THEN 'review_required' WHEN p_status='rejected' THEN 'failed' ELSE p_status END;
 -- A worker-side validation failure after authorization is uncertain; it must not release the job for resend.
 IF p_status='skipped' THEN status_value:='review_required';job_status:='review_required'; END IF;
 EXECUTE format('UPDATE %I SET status=$1,provider_message_id=$2,error_message=$3,retryable=$4 WHERE id=$5',ats) USING status_value,p_provider_id,left(p_reason,1000),p_retryable AND p_status='failed',a.id;
 EXECUTE format('UPDATE %I SET status=$1 WHERE id=$2',tbl) USING job_status,p_job;
 RETURN jsonb_build_object('success',true,'job_id',p_job,'attempt_id',a.id,'status',status_value);
END; $$;

CREATE FUNCTION public.ingest_school_sms(p_payload jsonb,p_authenticated boolean) RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$
DECLARE id_value uuid;provider_id text:=coalesce(p_payload->>'message_id',p_payload->>'id');raw_status text:=lower(coalesce(p_payload->>'status',''));status_value text;
BEGIN
 IF coalesce(provider_id,'')='' OR length(provider_id)>64 THEN RAISE EXCEPTION 'Provider message ID required' USING ERRCODE='22023'; END IF;
 status_value:=CASE WHEN raw_status IN ('delivered','dlr:delivered','delivery_success') THEN 'delivered' WHEN raw_status IN ('sent','submitted','queued','accepted','pending') THEN 'sent' WHEN raw_status IN ('failed','dlr:failed','undelivered','dlr:undelivered','unreachable') THEN 'failed' WHEN raw_status IN ('expired','dlr:expired') THEN 'expired' WHEN raw_status IN ('rejected','dlr:rejected','dnd_rejected') THEN 'rejected' ELSE 'unknown' END;
 PERFORM pg_advisory_xact_lock(hashtextextended(provider_id||p_payload::text||p_authenticated::text,0));
 SELECT id INTO id_value FROM sms_delivery_inbox WHERE provider_message_id=provider_id AND raw_payload=p_payload AND source_authenticated=p_authenticated LIMIT 1;
 IF id_value IS NULL THEN INSERT INTO sms_delivery_inbox(provider,provider_message_id,status,source_authenticated,raw_payload) VALUES('termii',provider_id,status_value,p_authenticated,p_payload) RETURNING id INTO id_value; END IF;
 RETURN jsonb_build_object('id',id_value);
END; $$;

CREATE FUNCTION public.apply_school_sms(p_event uuid,p_claim text,p_provider_id text,p_status text,p_decision text DEFAULT 'apply') RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$
DECLARE e sms_delivery_inbox%ROWTYPE;candidate record;ats text;tbl text;matches integer:=0;new_status text;
BEGIN
 SELECT * INTO e FROM sms_delivery_inbox WHERE id=p_event FOR UPDATE;
 IF e.id IS NULL OR NOT e.source_authenticated OR e.claim_token IS DISTINCT FROM p_claim THEN RAISE EXCEPTION 'Event not owned or authenticated' USING ERRCODE='42501'; END IF;
 IF e.applied_at IS NOT NULL OR e.quarantined_at IS NOT NULL THEN RETURN jsonb_build_object('success',true,'event_id',p_event,'duplicate',true); END IF;
 IF e.lease_expires_at IS NULL OR e.lease_expires_at<=now() OR e.provider_message_id IS DISTINCT FROM p_provider_id OR e.status IS DISTINCT FROM p_status THEN RAISE EXCEPTION 'Expired claim or event data mismatch' USING ERRCODE='42501'; END IF;
 IF p_decision='quarantine' OR e.status='unknown' THEN
  UPDATE sms_delivery_inbox SET quarantined_at=now(),quarantine_reason='Unknown or rejected delivery event' WHERE id=p_event;
  RETURN jsonb_build_object('success',true,'event_id',p_event,'quarantined',true);
 END IF;
 SELECT count(*) INTO matches FROM (SELECT id FROM reminder_attempts WHERE channel='sms' AND provider_message_id=e.provider_message_id UNION ALL SELECT id FROM notification_attempts WHERE channel='sms' AND provider_message_id=e.provider_message_id) q;
 IF matches<>1 THEN
  UPDATE sms_delivery_inbox SET unmatched_count=unmatched_count+1,lease_expires_at=NULL,next_attempt_at=now()+interval '5 minutes',quarantined_at=CASE WHEN unmatched_count>=4 OR matches>1 THEN now() END,quarantine_reason=CASE WHEN unmatched_count>=4 OR matches>1 THEN 'Unmatched or ambiguous provider message' END WHERE id=p_event;
  RETURN jsonb_build_object('success',true,'event_id',p_event,'unmatched',true);
 END IF;
 FOREACH ats IN ARRAY ARRAY['reminder_attempts','notification_attempts'] LOOP
  tbl:=replace(ats,'_attempts','_jobs');
  -- Match outcome lock order: job first, attempt second, to avoid callback/worker deadlocks.
  EXECUTE format('SELECT job_id FROM %I WHERE channel=''sms'' AND provider_message_id=$1',ats) INTO candidate USING e.provider_message_id;
  IF candidate.job_id IS NULL THEN CONTINUE; END IF;
  EXECUTE format('SELECT id FROM %I WHERE id=$1 FOR UPDATE',tbl) USING candidate.job_id;
  EXECUTE format('SELECT * FROM %I WHERE channel=''sms'' AND provider_message_id=$1 FOR UPDATE',ats) INTO candidate USING e.provider_message_id;
  new_status:=CASE WHEN e.status='sent' THEN 'accepted' ELSE e.status END;
  IF candidate.status<>'delivered' AND (e.status='delivered' OR candidate.status IN ('started','review_required','accepted','sent') OR candidate.status=new_status) THEN
   EXECUTE format('UPDATE %I SET status=$1 WHERE id=$2',ats) USING new_status,candidate.id;
   EXECUTE format('UPDATE %I SET status=$1 WHERE id=$2',tbl) USING CASE WHEN e.status='sent' THEN 'sent' WHEN e.status IN ('expired','rejected') THEN 'failed' ELSE e.status END,candidate.job_id;
  END IF;
 END LOOP;
 UPDATE sms_delivery_inbox SET applied_at=now() WHERE id=p_event;
 RETURN jsonb_build_object('success',true,'event_id',p_event);
END; $$;

CREATE FUNCTION public.recover_school_jobs(p_run text,p_limit integer DEFAULT 100,p_max_attempts integer DEFAULT 3) RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$
DECLARE tbl text;ats text;j record;attempt record;changed integer;released integer:=0;reviewed integer:=0;retried integer:=0;
BEGIN
 IF p_limit NOT BETWEEN 1 AND 1000 OR p_max_attempts NOT BETWEEN 0 AND 3 THEN RAISE EXCEPTION 'Invalid recovery limits' USING ERRCODE='22023'; END IF;
 FOREACH tbl IN ARRAY ARRAY['reminder_jobs','notification_jobs'] LOOP
  ats:=replace(tbl,'_jobs','_attempts');
  FOR j IN EXECUTE format('SELECT * FROM %I WHERE (status IN (''claimed'',''authorized'') AND lease_expires_at<now()) OR status=''failed'' ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT $1',tbl) USING p_limit LOOP
   IF j.status='claimed' THEN
    EXECUTE format('UPDATE %I SET status=''pending'',claim_token=NULL,lease_expires_at=NULL WHERE id=$1',tbl) USING j.id;released:=released+1;
   ELSIF j.status='authorized' THEN
    EXECUTE format('UPDATE %I SET status=''review_required'' WHERE id=$1',tbl) USING j.id;
    EXECUTE format('UPDATE %I SET status=''review_required'' WHERE job_id=$1 AND status=''started''',ats) USING j.id;reviewed:=reviewed+1;
   ELSE
    -- A retry requires an explicit, definitive retryable failure on the latest attempt.
    EXECUTE format('SELECT * FROM %I WHERE job_id=$1 AND owner_claim_token=$2 LIMIT 1',ats) INTO attempt USING j.id,j.claim_token;
    IF attempt.id IS NOT NULL AND attempt.status='failed' AND attempt.retryable THEN
     EXECUTE format('UPDATE %I SET status=''pending'',retry_count=retry_count+1,claim_token=NULL,lease_expires_at=NULL,next_attempt_at=now()+interval ''5 minutes''*power(2,retry_count) WHERE id=$1 AND retry_count<$2',tbl) USING j.id,p_max_attempts;
     GET DIAGNOSTICS changed=ROW_COUNT;retried:=retried+changed;
    END IF;
   END IF;
  END LOOP;
 END LOOP;
 DELETE FROM revoked_portal_tokens WHERE expires_at<now();
 RETURN jsonb_build_object('run_id',p_run,'released_claims',released,'requeued_transient',retried,'review_required',reviewed);
END; $$;

CREATE FUNCTION public.record_school_incident(p_payload jsonb) RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$
DECLARE existing uuid;id_value uuid;record_only_value boolean:=coalesce((p_payload->>'record_only')::boolean,false) OR p_payload->>'workflow_id'='YWD3GloqWM7HhZpq' OR coalesce(p_payload->>'workflow_name','') ~* 'WF05';
BEGIN
 INSERT INTO operational_incidents(incident_key,workflow_id,workflow_name,execution_id,failure_kind,failed_node,record_only,details)
 VALUES(p_payload->>'incident_key',p_payload->>'workflow_id',p_payload->>'workflow_name',p_payload->>'execution_id',p_payload->>'failure_kind',p_payload->>'failed_node',record_only_value,p_payload->'details') ON CONFLICT(incident_key) DO NOTHING RETURNING id INTO id_value;
 IF id_value IS NULL THEN SELECT id INTO id_value FROM operational_incidents WHERE incident_key=p_payload->>'incident_key';RETURN jsonb_build_object('success',true,'incident_id',id_value,'deduplicated',true); END IF;
 IF NOT record_only_value THEN
  INSERT INTO notification_jobs(event_type,source_event_id,recipient_type,recipient_id,channel)
  SELECT 'operational_alert',id_value,'staff',s.id,c.channel FROM staff_profiles s JOIN staff_notification_contacts n ON n.staff_id=s.id CROSS JOIN (VALUES('sms'),('telegram')) c(channel)
  WHERE s.is_active AND s.role='admin' AND ((c.channel='sms' AND n.consent_sms AND n.phone_number IS NOT NULL) OR (c.channel='telegram' AND n.consent_telegram AND n.telegram_chat_id>0)) ON CONFLICT DO NOTHING;
 END IF;
 RETURN jsonb_build_object('success',true,'incident_id',id_value,'deduplicated',false);
END; $$;

-- No browser role can call these server entry points.
DO $$ DECLARE f regprocedure; BEGIN
 FOR f IN SELECT oid::regprocedure FROM pg_proc WHERE pronamespace='public'::regnamespace AND proname IN ('check_portal_session','claim_school_jobs','authorize_school_send','record_school_outcome','ingest_school_sms','apply_school_sms','recover_school_jobs','record_school_incident') LOOP
  EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC,anon,authenticated',f);
  EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role',f);
 END LOOP;
END; $$;
