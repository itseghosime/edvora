CREATE FUNCTION public.claim_school_jobs(p_kind text,p_run text,p_limit integer DEFAULT 10) RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$
DECLARE result jsonb; tbl text;
BEGIN
 IF length(coalesce(p_run,'')) NOT BETWEEN 1 AND 128 OR p_limit NOT BETWEEN 1 AND 100 THEN RAISE EXCEPTION 'Invalid claim request' USING ERRCODE='22023'; END IF;
 IF p_kind='reminder' THEN
  INSERT INTO reminder_jobs(rule_id,pupil_id,guardian_id,channel,balance_at_creation_minor)
  SELECT r.id,p.id,g.id,c.channel,a.adjusted_amount_minor-coalesce((SELECT sum(l.amount_minor) FROM fee_ledger_entries l WHERE l.pupil_id=p.id AND l.term_id=r.term_id AND l.entry_type='credit'),0)
  FROM reminder_rules r JOIN academic_terms t ON t.id=r.term_id JOIN fee_assignments a ON a.term_id=r.term_id
  JOIN pupils p ON p.id=a.pupil_id JOIN guardians g ON (g.id=p.guardian_id OR EXISTS(SELECT 1 FROM pupil_guardians pg WHERE pg.pupil_id=p.id AND pg.guardian_id=g.id AND pg.can_pay_fees)) CROSS JOIN LATERAL unnest(r.channels) c(channel)
  WHERE r.is_active AND t.is_current AND (now() AT TIME ZONE 'Africa/Lagos')::date BETWEEN t.end_date-r.trigger_days_before_due AND t.end_date
   AND p.status='active' AND g.is_active AND NOT a.is_paused
   AND NOT EXISTS(SELECT 1 FROM pupil_guardians pg WHERE pg.pupil_id=p.id AND pg.guardian_id=g.id AND NOT pg.can_pay_fees)
   AND ((c.channel='sms' AND g.consent_sms AND g.phone_number ~ '^\+[1-9][0-9]{7,14}$') OR (c.channel='telegram' AND g.consent_telegram AND g.telegram_chat_id>0))
   AND a.adjusted_amount_minor-coalesce((SELECT sum(l.amount_minor) FROM fee_ledger_entries l WHERE l.pupil_id=p.id AND l.term_id=r.term_id AND l.entry_type='credit'),0)>0
   AND a.adjusted_amount_minor-coalesce((SELECT sum(l.amount_minor) FROM fee_ledger_entries l WHERE l.pupil_id=p.id AND l.term_id=r.term_id AND l.entry_type='credit'),0)>=r.min_balance_minor
  ON CONFLICT(rule_id,pupil_id,guardian_id,channel) DO NOTHING;
 END IF;
 IF p_kind IN ('reminder','notification') THEN
  tbl:=p_kind||'_jobs';
  EXECUTE format('WITH q AS (SELECT id FROM %I WHERE status=''pending'' AND next_attempt_at<=now() ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT $1), u AS (UPDATE %I j SET status=''claimed'',claimed_by_run_id=$2,claim_token=gen_random_uuid()::text,claimed_at=now(),lease_expires_at=now()+interval ''15 minutes'' FROM q WHERE j.id=q.id RETURNING j.id,j.claim_token) SELECT coalesce(jsonb_agg(jsonb_build_object(''job_id'',id,''claim_token'',claim_token)),''[]''::jsonb) FROM u',tbl,tbl) INTO result USING least(p_limit,10),p_run;
 ELSIF p_kind='sms' THEN
  WITH q AS (SELECT id FROM sms_delivery_inbox WHERE source_authenticated AND applied_at IS NULL AND quarantined_at IS NULL AND next_attempt_at<=now() AND (lease_expires_at IS NULL OR lease_expires_at<now()) ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT p_limit),u AS (UPDATE sms_delivery_inbox e SET claimed_by_run_id=p_run,claim_token=gen_random_uuid()::text,lease_expires_at=now()+interval '15 minutes' FROM q WHERE e.id=q.id RETURNING e.*)
  SELECT coalesce(jsonb_agg(jsonb_build_object('event_id',id,'claim_token',claim_token,'provider',provider,'channel','sms','provider_message_id',provider_message_id,'status',status,'occurred_at',created_at,'source_authenticated',source_authenticated)),'[]') INTO result FROM u;
 ELSIF p_kind='payment' THEN
  WITH q AS (SELECT id FROM payment_intents WHERE status IN ('initialized','processing') AND (lease_expires_at IS NULL OR lease_expires_at<now()) ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT p_limit),u AS (UPDATE payment_intents p SET claimed_by_run_id=p_run,claim_token=gen_random_uuid()::text,lease_expires_at=now()+interval '15 minutes' FROM q WHERE p.id=q.id RETURNING p.*)
  SELECT coalesce(jsonb_agg(jsonb_build_object('job_id',id,'claim_token',claim_token,'reference',reference,'expected_amount_minor',amount_minor,'currency',currency,'environment',environment)),'[]') INTO result FROM u;
 ELSE RAISE EXCEPTION 'Invalid queue' USING ERRCODE='22023'; END IF;
 RETURN result;
END; $$;

CREATE FUNCTION public.authorize_school_send(p_kind text,p_job uuid,p_claim text,p_origin text) RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$
DECLARE j record;g guardians%ROWTYPE;p pupils%ROWTYPE;r reminder_rules%ROWTYPE;a fee_assignments%ROWTYPE; contact staff_notification_contacts%ROWTYPE;
 tbl text;attempt_tbl text;balance bigint;recipient text;message text;reason text;attempt_id uuid;attempt_token text:=gen_random_uuid()::text;source_pupil uuid;can_access boolean;
BEGIN
 IF p_kind NOT IN ('reminder','notification') OR p_origin !~ '^https://[^/]+$' THEN RAISE EXCEPTION 'Configured HTTPS school origin required' USING ERRCODE='22023'; END IF;
 tbl:=p_kind||'_jobs';attempt_tbl:=p_kind||'_attempts';
 EXECUTE format('SELECT * FROM %I WHERE id=$1 FOR UPDATE',tbl) INTO j USING p_job;
 IF j.id IS NULL THEN RETURN jsonb_build_object('authorized',false,'job_id',p_job,'reason','Job not found'); END IF;
 IF j.status<>'claimed' OR j.claim_token IS DISTINCT FROM p_claim OR (j.lease_expires_at IS NULL OR j.lease_expires_at<=now()) THEN RETURN jsonb_build_object('authorized',false,'job_id',p_job,'reason','Claim expired, consumed or not owned'); END IF;
 IF p_kind='reminder' THEN
  SELECT * INTO p FROM pupils WHERE id=j.pupil_id;
  SELECT * INTO g FROM guardians WHERE id=j.guardian_id;
  SELECT * INTO r FROM reminder_rules WHERE id=j.rule_id;
  SELECT * INTO a FROM fee_assignments WHERE pupil_id=p.id AND term_id=r.term_id FOR SHARE;
  SELECT greatest(0,a.adjusted_amount_minor-coalesce(sum(amount_minor),0)) INTO balance FROM fee_ledger_entries WHERE pupil_id=p.id AND term_id=r.term_id AND entry_type='credit';
  IF p.id IS NULL OR g.id IS NULL OR r.id IS NULL OR a.id IS NULL OR p.status<>'active' OR NOT g.is_active OR NOT r.is_active OR NOT coalesce(j.channel=ANY(r.channels),false) OR a.is_paused THEN reason:='Account or rule inactive or paused';
  ELSIF NOT EXISTS(SELECT 1 FROM academic_terms t WHERE t.id=r.term_id AND t.is_current AND (now() AT TIME ZONE 'Africa/Lagos')::date BETWEEN t.end_date-r.trigger_days_before_due AND t.end_date) THEN reason:='Rule is outside its current-term due window';
  ELSIF balance IS NULL OR balance<=0 OR balance<r.min_balance_minor THEN reason:='Balance no longer eligible';
  ELSIF NOT ((p.guardian_id=g.id AND NOT EXISTS(SELECT 1 FROM pupil_guardians pg WHERE pg.pupil_id=p.id AND pg.guardian_id=g.id AND NOT pg.can_pay_fees)) OR EXISTS(SELECT 1 FROM pupil_guardians pg WHERE pg.pupil_id=p.id AND pg.guardian_id=g.id AND pg.can_pay_fees)) THEN reason:='Guardian is not authorized for this pupil'; END IF;
  message:='Edvora: outstanding fees for '||p.first_name||' are NGN '||to_char(balance/100.0,'FM999999990.00')||'. Pay through the Student portal: '||p_origin||'/student/payments';
 ELSE
  IF j.recipient_type='guardian' THEN
   SELECT * INTO g FROM guardians WHERE id=j.recipient_id;
   IF g.id IS NULL OR NOT g.is_active THEN reason:='Guardian is inactive'; END IF;
   IF j.event_type='payment_receipt' THEN
    SELECT pupil_id,'Edvora: payment of NGN '||to_char(amount_minor/100.0,'FM999999990.00')||' received. Receipt '||receipt_number||'. '||p_origin||'/student/payments' INTO source_pupil,message FROM receipts WHERE id=j.source_event_id AND NOT is_void;
   ELSIF j.event_type='results_published' THEN
    SELECT pupil_id,'Edvora: a school report is available in the Student portal. '||p_origin||'/student/results' INTO source_pupil,message FROM academic_results WHERE id=j.source_event_id AND status='published';
   ELSE reason:='Unsupported or unverified source event'; END IF;
   SELECT ((p2.guardian_id=g.id AND NOT EXISTS(SELECT 1 FROM pupil_guardians pg WHERE pg.pupil_id=p2.id AND pg.guardian_id=g.id AND NOT CASE WHEN j.event_type='results_published' THEN pg.can_view_results ELSE pg.can_pay_fees END)) OR EXISTS(SELECT 1 FROM pupil_guardians pg WHERE pg.pupil_id=p2.id AND pg.guardian_id=g.id AND CASE WHEN j.event_type='results_published' THEN pg.can_view_results ELSE pg.can_pay_fees END)) INTO can_access FROM pupils p2 WHERE p2.id=source_pupil;
   IF NOT coalesce(can_access,false) THEN reason:='Source event is unavailable or not authorized for this guardian'; END IF;
  ELSIF j.recipient_type='staff' AND j.event_type='operational_alert' THEN
   SELECT c.* INTO contact FROM staff_notification_contacts c JOIN staff_profiles s ON s.id=c.staff_id WHERE c.staff_id=j.recipient_id AND s.is_active AND s.role='admin';
   IF contact.staff_id IS NULL OR NOT EXISTS(SELECT 1 FROM operational_incidents WHERE id=j.source_event_id AND NOT record_only AND status<>'resolved') THEN reason:='No authorized staff contact or open incident'; END IF;
   message:='Edvora: an automation issue needs administrator review. Incident '||j.source_event_id::text||'.';
  ELSE reason:='Unsupported recipient or source event'; END IF;
 END IF;
 IF j.channel='sms' THEN
  recipient:=regexp_replace(coalesce(g.phone_number,contact.phone_number,''),'\D','','g');
  IF NOT coalesce(g.consent_sms,contact.consent_sms,false) OR recipient !~ '^[1-9][0-9]{7,14}$' THEN reason:='SMS consent or valid phone missing'; END IF;
 ELSIF j.channel='telegram' THEN
  recipient:=coalesce(g.telegram_chat_id,contact.telegram_chat_id)::text;
  IF NOT coalesce(g.consent_telegram,contact.consent_telegram,false) OR coalesce(recipient,'') !~ '^[1-9][0-9]{0,15}$' THEN reason:='Telegram consent or authorized private chat missing'; END IF;
 ELSE reason:='Unsupported channel'; END IF;
 IF message IS NULL OR length(message)>(CASE WHEN j.channel='sms' THEN 480 ELSE 4000 END) THEN reason:='Message is unavailable or too long'; END IF;
 IF reason IS NOT NULL THEN
  EXECUTE format('UPDATE %I SET status=''skipped'' WHERE id=$1',tbl) USING p_job;
  RETURN jsonb_build_object('authorized',false,'job_id',p_job,'reason',reason);
 END IF;
 EXECUTE format('INSERT INTO %I(job_id,attempt_token,owner_claim_token,channel,recipient,message) VALUES($1,$2,$3,$4,$5,$6) RETURNING id',attempt_tbl) INTO attempt_id USING p_job,attempt_token,p_claim,j.channel,recipient,message;
 EXECUTE format('UPDATE %I SET status=''authorized'',lease_expires_at=now()+interval ''3 minutes'' WHERE id=$1',tbl) USING p_job;
 RETURN jsonb_build_object('authorized',true,'job_id',p_job,'attempt_id',attempt_id,'attempt_token',attempt_token,'channel',j.channel,'recipient',recipient,'message',message,'balance_minor',balance,'currency','NGN','event_type',CASE WHEN p_kind='notification' THEN to_jsonb(j)->>'event_type' ELSE NULL END,'source_event_id',CASE WHEN p_kind='notification' THEN to_jsonb(j)->>'source_event_id' ELSE NULL END,'active',true,'paused',false,'consented',true,'lease_expires_at',now()+interval '3 minutes');
END; $$;

-- No browser role can call these server entry points.
DO $$ DECLARE f regprocedure; BEGIN
 FOR f IN SELECT oid::regprocedure FROM pg_proc WHERE pronamespace='public'::regnamespace AND proname IN ('check_portal_session','claim_school_jobs','authorize_school_send','record_school_outcome','ingest_school_sms','apply_school_sms','recover_school_jobs','record_school_incident') LOOP
  EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC,anon,authenticated',f);
  EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role',f);
 END LOOP;
END; $$;
