-- Server-only, transactional Staff commands. The database rechecks live role/class
-- assignments; browser-supplied role, totals and publication state are never trusted.
CREATE TABLE public.staff_command_receipts (
  request_id uuid PRIMARY KEY,
  staff_id uuid NOT NULL REFERENCES public.staff_profiles(id),
  command text NOT NULL,
  payload jsonb NOT NULL,
  response jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.staff_command_receipts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.staff_command_receipts FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.staff_command_receipts TO service_role;
CREATE POLICY server_command_receipts ON public.staff_command_receipts FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE FUNCTION public.execute_staff_command(p_request_id uuid, p_staff_id uuid, p_command text, p_payload jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE
  s staff_profiles%ROWTYPE;
  pupil pupils%ROWTYPE;
  report academic_results%ROWTYPE;
  assignment fee_assignments%ROWTYPE;
  plan fee_plans%ROWTYPE;
  term academic_terms%ROWTYPE;
  prior staff_command_receipts%ROWTYPE;
  response jsonb;
  entity uuid;
  guardian uuid;
  session_id_value uuid;
  subject jsonb;
  subjects_value jsonb := '[]';
  total numeric := 0;
  ca numeric;
  exam numeric;
  score numeric;
  amount bigint;
  paid bigint;
  affected integer;
  next_status text;
BEGIN
  IF p_request_id IS NULL OR p_staff_id IS NULL OR jsonb_typeof(p_payload) IS DISTINCT FROM 'object' THEN
    RAISE EXCEPTION 'Invalid command request' USING ERRCODE='22023';
  END IF;
  SELECT * INTO s FROM staff_profiles WHERE id=p_staff_id AND is_active=true FOR SHARE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Active staff account required' USING ERRCODE='42501'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(p_request_id::text,0));
  SELECT * INTO prior FROM staff_command_receipts WHERE request_id=p_request_id;
  IF FOUND THEN
    IF prior.staff_id<>p_staff_id OR prior.command<>p_command OR prior.payload<>p_payload THEN
      RAISE EXCEPTION 'Request identifier has already been used for a different change' USING ERRCODE='22023';
    END IF;
    RETURN prior.response;
  END IF;
  IF p_command IN ('save_result','set_result_status') THEN
    IF s.role NOT IN ('admin','teacher') THEN RAISE EXCEPTION 'Academic access denied' USING ERRCODE='42501'; END IF;
  ELSIF p_command IN ('save_fee_plan','assign_fees','adjust_fee','save_reminder','toggle_reminder') THEN
    IF s.role NOT IN ('admin','bursar') THEN RAISE EXCEPTION 'Financial access denied' USING ERRCODE='42501'; END IF;
  ELSE
    IF s.role<>'admin' THEN RAISE EXCEPTION 'Administrator access required' USING ERRCODE='42501'; END IF;
  END IF;

  IF p_command='create_class' THEN
    IF length(trim(coalesce(p_payload->>'name',''))) NOT BETWEEN 1 AND 32 OR p_payload->>'stage' NOT IN ('primary','nursery') THEN
      RAISE EXCEPTION 'Class name and stage are required' USING ERRCODE='22023';
    END IF;
    INSERT INTO school_classes(name,stage) VALUES(trim(p_payload->>'name'),p_payload->>'stage') RETURNING id INTO entity;
    response:=jsonb_build_object('id',entity);
  ELSIF p_command='configure_term' THEN
    -- Serialize term changes and keep exactly one current session/term.
    PERFORM pg_advisory_xact_lock(hashtextextended('edvora_current_term',0));
    IF length(trim(coalesce(p_payload->>'sessionName',''))) NOT BETWEEN 1 AND 32 OR length(trim(coalesce(p_payload->>'name',''))) NOT BETWEEN 1 AND 32
       OR (p_payload->>'startDate')::date >= (p_payload->>'endDate')::date THEN
      RAISE EXCEPTION 'Provide a session, term and valid date range' USING ERRCODE='22023';
    END IF;
    UPDATE academic_terms SET is_current=false WHERE is_current;
    UPDATE academic_sessions SET is_current=false WHERE is_current;
    INSERT INTO academic_sessions(name,start_date,end_date,is_current)
      VALUES(trim(p_payload->>'sessionName'),(p_payload->>'startDate')::date,(p_payload->>'endDate')::date,true)
      ON CONFLICT(name) DO UPDATE SET is_current=true,start_date=least(academic_sessions.start_date,excluded.start_date),end_date=greatest(academic_sessions.end_date,excluded.end_date)
      RETURNING id INTO session_id_value;
    INSERT INTO academic_terms(session_id,name,term_code,start_date,end_date,is_current)
      VALUES(session_id_value,trim(p_payload->>'name'),'T-'||substr(replace(gen_random_uuid()::text,'-',''),1,12),(p_payload->>'startDate')::date,(p_payload->>'endDate')::date,true)
      ON CONFLICT(session_id,name) DO UPDATE SET start_date=excluded.start_date,end_date=excluded.end_date,is_current=true RETURNING id INTO entity;
    response:=jsonb_build_object('id',entity);
  ELSIF p_command='save_settings' THEN
    IF EXISTS(SELECT 1 FROM jsonb_each(p_payload) e WHERE e.key NOT IN ('schoolName','schoolShortName','contactAddress','contactPhone','contactEmail','bursaryEmail') OR jsonb_typeof(e.value)<>'string' OR length(e.value#>>'{}')>500)
       OR length(trim(coalesce(p_payload->>'schoolName',''))) = 0 OR length(trim(coalesce(p_payload->>'schoolShortName',''))) = 0 THEN
      RAISE EXCEPTION 'Invalid school contact settings' USING ERRCODE='22023';
    END IF;
    UPDATE school_settings SET value=value||p_payload,updated_at=now() WHERE id='school';
    response:=jsonb_build_object('id','school');
  ELSIF p_command='toggle_reminder' THEN
    IF jsonb_typeof(p_payload->'isActive') IS DISTINCT FROM 'boolean' THEN RAISE EXCEPTION 'Invalid rule status' USING ERRCODE='22023'; END IF;
    UPDATE reminder_rules SET is_active=(p_payload->>'isActive')::boolean WHERE id=(p_payload->>'ruleId')::uuid RETURNING id INTO entity;
    IF NOT FOUND THEN RAISE EXCEPTION 'Reminder rule not found' USING ERRCODE='22023'; END IF;
    response:=jsonb_build_object('id',entity);
  ELSIF p_command='register_pupil' THEN
    IF length(trim(coalesce(p_payload->>'firstName',''))) NOT BETWEEN 1 AND 64 OR length(trim(coalesce(p_payload->>'lastName',''))) NOT BETWEEN 1 AND 64
       OR length(trim(coalesce(p_payload->>'guardianName',''))) NOT BETWEEN 1 AND 128 OR coalesce(p_payload->>'guardianPhone','') !~ '^\+[1-9][0-9]{7,14}$'
       OR p_payload->>'gender' NOT IN ('male','female') OR nullif(p_payload->>'dateOfBirth','') IS NULL
       OR (p_payload->>'dateOfBirth')::date>current_date OR (p_payload->>'dateOfBirth')::date<date '1900-01-01' THEN
      RAISE EXCEPTION 'Provide valid pupil details, date of birth and guardian contact' USING ERRCODE='22023';
    END IF;
    -- Each enrollment owns its guardian record; do not merge unrelated families by phone number.
    INSERT INTO guardians(full_name,phone_number,email,consent_sms,consent_telegram)
      VALUES(trim(p_payload->>'guardianName'),p_payload->>'guardianPhone',nullif(p_payload->>'guardianEmail',''),coalesce((p_payload->>'smsConsent')::boolean,false),false) RETURNING id INTO guardian;
    INSERT INTO pupils(admission_number,first_name,last_name,gender,date_of_birth,class_id,guardian_id)
      VALUES('EDV/'||extract(year from current_date)||'/'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,12)),trim(p_payload->>'firstName'),trim(p_payload->>'lastName'),p_payload->>'gender',(p_payload->>'dateOfBirth')::date,(p_payload->>'classId')::uuid,guardian)
      RETURNING * INTO pupil;
    INSERT INTO pupil_guardians(pupil_id,guardian_id,is_primary,can_view_results,can_pay_fees) VALUES(pupil.id,guardian,true,true,true);
    SELECT * INTO term FROM academic_terms WHERE is_current=true;
    IF FOUND THEN
      SELECT * INTO plan FROM fee_plans WHERE term_id=term.id AND class_id=pupil.class_id;
      IF FOUND THEN
        INSERT INTO fee_assignments(pupil_id,term_id,fee_plan_id,base_amount_minor,adjusted_amount_minor)
          VALUES(pupil.id,term.id,plan.id,plan.total_amount_minor,plan.total_amount_minor);
      END IF;
    END IF;
    entity:=pupil.id;
    response:=jsonb_build_object('id',entity,'admissionNumber',pupil.admission_number);
  ELSIF p_command='update_pupil_status' THEN
    IF p_payload->>'status' NOT IN ('active','suspended') THEN RAISE EXCEPTION 'Invalid account status' USING ERRCODE='22023'; END IF;
    UPDATE pupils SET status=p_payload->>'status' WHERE id=(p_payload->>'pupilId')::uuid RETURNING id INTO entity;
    IF NOT FOUND THEN RAISE EXCEPTION 'Pupil not found' USING ERRCODE='22023'; END IF;
    response:=jsonb_build_object('id',entity);
  ELSIF p_command='save_fee_plan' THEN
    amount:=(p_payload->>'amountMinor')::bigint;
    IF amount IS NULL OR amount<0 OR amount>10000000000 OR length(trim(coalesce(p_payload->>'name',''))) NOT BETWEEN 1 AND 64 THEN
      RAISE EXCEPTION 'Invalid fee plan' USING ERRCODE='22023';
    END IF;
    INSERT INTO fee_plans(term_id,class_id,name,total_amount_minor,components)
      VALUES((p_payload->>'termId')::uuid,(p_payload->>'classId')::uuid,trim(p_payload->>'name'),amount,jsonb_build_array(jsonb_build_object('name',trim(p_payload->>'name'),'amount_minor',amount)))
      ON CONFLICT(term_id,class_id) DO UPDATE SET name=excluded.name,total_amount_minor=excluded.total_amount_minor,components=excluded.components RETURNING id INTO entity;
    response:=jsonb_build_object('id',entity);
  ELSIF p_command='assign_fees' THEN
    SELECT * INTO plan FROM fee_plans WHERE id=(p_payload->>'planId')::uuid FOR SHARE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Fee plan not found' USING ERRCODE='22023'; END IF;
    INSERT INTO fee_assignments(pupil_id,term_id,fee_plan_id,base_amount_minor,adjusted_amount_minor)
      SELECT id,plan.term_id,plan.id,plan.total_amount_minor,plan.total_amount_minor FROM pupils WHERE class_id=plan.class_id AND status='active'
      ON CONFLICT(pupil_id,term_id) DO NOTHING;
    GET DIAGNOSTICS affected=ROW_COUNT;
    entity:=plan.id; response:=jsonb_build_object('id',entity,'assignedCount',affected);
  ELSIF p_command='adjust_fee' THEN
    amount:=(p_payload->>'amountMinor')::bigint;
    IF amount IS NULL OR amount<=0 OR amount>10000000000 OR p_payload->>'adjustmentType' NOT IN ('waiver','scholarship','staff_discount','sibling_discount','correction') OR length(trim(coalesce(p_payload->>'reason',''))) NOT BETWEEN 3 AND 1000 THEN
      RAISE EXCEPTION 'Provide a positive fee reduction and a reason' USING ERRCODE='22023';
    END IF;
    SELECT * INTO assignment FROM fee_assignments WHERE id=(p_payload->>'assignmentId')::uuid FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Fee assignment not found' USING ERRCODE='22023'; END IF;
    SELECT coalesce(sum(amount_minor),0) INTO paid FROM fee_ledger_entries WHERE pupil_id=assignment.pupil_id AND term_id=assignment.term_id AND entry_type='credit';
    IF assignment.adjusted_amount_minor-amount<paid THEN RAISE EXCEPTION 'Reduction exceeds the unpaid fee amount' USING ERRCODE='22023'; END IF;
    INSERT INTO fee_adjustments(fee_assignment_id,amount_minor,adjustment_type,reason,authorized_by)
      VALUES(assignment.id,amount,p_payload->>'adjustmentType',trim(p_payload->>'reason'),s.id) RETURNING id INTO entity;
    UPDATE fee_assignments SET adjusted_amount_minor=adjusted_amount_minor-amount WHERE id=assignment.id;
    response:=jsonb_build_object('id',entity,'adjustedAmountMinor',assignment.adjusted_amount_minor-amount);
  ELSIF p_command='save_result' THEN
    SELECT * INTO pupil FROM pupils WHERE id=(p_payload->>'pupilId')::uuid FOR SHARE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Pupil not found' USING ERRCODE='22023'; END IF;
    IF s.role='teacher' AND NOT (pupil.class_id=ANY(s.assigned_class_ids)) THEN RAISE EXCEPTION 'Class access denied' USING ERRCODE='42501'; END IF;
    -- Serialize new drafts too, when no report row exists yet.
    PERFORM pg_advisory_xact_lock(hashtextextended(pupil.id::text||coalesce(p_payload->>'termId',''),0));
    SELECT * INTO report FROM academic_results WHERE pupil_id=pupil.id AND term_id=(p_payload->>'termId')::uuid FOR UPDATE;
    IF FOUND AND report.status NOT IN ('draft','under_correction') THEN RAISE EXCEPTION 'Return this report for correction before editing' USING ERRCODE='22023'; END IF;
    IF jsonb_typeof(p_payload->'subjects') IS DISTINCT FROM 'array' OR jsonb_array_length(p_payload->'subjects') NOT BETWEEN 1 AND 30 THEN
      RAISE EXCEPTION 'Enter between 1 and 30 subjects' USING ERRCODE='22023';
    END IF;
    FOR subject IN SELECT value FROM jsonb_array_elements(p_payload->'subjects') LOOP
      ca:=(subject->>'ca')::numeric; exam:=(subject->>'exam')::numeric;
      IF length(trim(coalesce(subject->>'subject',''))) NOT BETWEEN 1 AND 64 OR ca IS NULL OR exam IS NULL OR ca<0 OR ca>40 OR exam<0 OR exam>60 OR ca::text='NaN' OR exam::text='NaN' THEN
        RAISE EXCEPTION 'Scores must be CA 0–40 and exam 0–60' USING ERRCODE='22023';
      END IF;
      score:=ca+exam; total:=total+score;
      subjects_value:=subjects_value||jsonb_build_array(jsonb_build_object('subject',trim(subject->>'subject'),'ca',ca,'exam',exam,'total',score,'grade',CASE WHEN score>=70 THEN 'A' WHEN score>=60 THEN 'B' WHEN score>=50 THEN 'C' WHEN score>=45 THEN 'D' WHEN score>=40 THEN 'E' ELSE 'F' END));
    END LOOP;
    IF (SELECT count(DISTINCT lower(trim(value->>'subject'))) FROM jsonb_array_elements(subjects_value))<>jsonb_array_length(subjects_value) THEN RAISE EXCEPTION 'Subject names must be unique' USING ERRCODE='22023'; END IF;
    INSERT INTO academic_results(pupil_id,term_id,class_id,subjects,total_score,max_score,average_score,class_size,teacher_remarks,head_remarks)
      VALUES(pupil.id,(p_payload->>'termId')::uuid,pupil.class_id,subjects_value,total,jsonb_array_length(subjects_value)*100,round(total/jsonb_array_length(subjects_value),2),(SELECT count(*) FROM pupils WHERE class_id=pupil.class_id AND status='active'),left(p_payload->>'teacherComment',2000),CASE WHEN s.role='admin' THEN left(p_payload->>'headComment',2000) ELSE NULL END)
      ON CONFLICT(pupil_id,term_id) DO UPDATE SET subjects=excluded.subjects,total_score=excluded.total_score,max_score=excluded.max_score,average_score=excluded.average_score,teacher_remarks=excluded.teacher_remarks,head_remarks=CASE WHEN s.role='admin' THEN excluded.head_remarks ELSE academic_results.head_remarks END,updated_at=now() RETURNING id INTO entity;
    response:=jsonb_build_object('id',entity);
  ELSIF p_command='set_result_status' THEN
    SELECT * INTO report FROM academic_results WHERE id=(p_payload->>'resultId')::uuid FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Result not found' USING ERRCODE='22023'; END IF;
    IF s.role='teacher' AND NOT (report.class_id=ANY(s.assigned_class_ids)) THEN RAISE EXCEPTION 'Class access denied' USING ERRCODE='42501'; END IF;
    next_status:=p_payload->>'status';
    IF NOT ((next_status='under_review' AND report.status IN ('draft','under_correction')) OR
            (s.role='admin' AND next_status='published' AND report.status='under_review') OR
            (s.role='admin' AND next_status='under_correction' AND report.status IN ('published','under_review') AND length(trim(coalesce(p_payload->>'reason','')))>=3)) THEN
      RAISE EXCEPTION 'This result transition is not permitted' USING ERRCODE='42501';
    END IF;
    UPDATE academic_results SET status=next_status,updated_at=now(),
      published_at=CASE WHEN next_status='published' THEN now() ELSE published_at END,
      published_by=CASE WHEN next_status='published' THEN s.id ELSE published_by END,
      withdrawn_at=CASE WHEN next_status='under_correction' THEN now() ELSE withdrawn_at END,
      withdrawal_reason=CASE WHEN next_status='under_correction' THEN p_payload->>'reason' ELSE withdrawal_reason END WHERE id=report.id;
    IF next_status='under_correction' THEN
      UPDATE notification_jobs SET status='skipped',claim_token=NULL,lease_expires_at=NULL WHERE source_event_id=report.id AND event_type='results_published' AND status IN ('pending','claimed','authorized');
    ELSIF next_status='published' THEN
      INSERT INTO notification_jobs(event_type,source_event_id,recipient_type,recipient_id,channel)
        SELECT 'results_published',report.id,'guardian',g.id,c.channel
        FROM pupil_guardians pg JOIN guardians g ON g.id=pg.guardian_id
        CROSS JOIN (VALUES ('sms'),('telegram')) c(channel)
        WHERE pg.pupil_id=report.pupil_id AND pg.can_view_results=true AND g.is_active=true
          AND ((c.channel='sms' AND g.consent_sms=true AND g.phone_number IS NOT NULL) OR (c.channel='telegram' AND g.consent_telegram=true AND g.telegram_chat_id IS NOT NULL))
        ON CONFLICT(event_type,source_event_id,recipient_id,channel) DO NOTHING;
    END IF;
    entity:=report.id; response:=jsonb_build_object('id',entity,'status',next_status);
  ELSIF p_command='save_reminder' THEN
    IF length(trim(coalesce(p_payload->>'name',''))) NOT BETWEEN 1 AND 64 OR (p_payload->>'daysBeforeEnd')::integer NOT BETWEEN 0 AND 90 OR (p_payload->>'minimumMinor')::bigint<0
       OR jsonb_typeof(p_payload->'channels') IS DISTINCT FROM 'array' OR jsonb_array_length(p_payload->'channels') NOT BETWEEN 1 AND 2
       OR EXISTS(SELECT 1 FROM jsonb_array_elements_text(p_payload->'channels') c WHERE c NOT IN ('sms','telegram')) THEN
      RAISE EXCEPTION 'Invalid reminder rule' USING ERRCODE='22023';
    END IF;
    INSERT INTO reminder_rules(name,term_id,trigger_days_before_due,channels,min_balance_minor,is_active)
      VALUES(trim(p_payload->>'name'),(p_payload->>'termId')::uuid,(p_payload->>'daysBeforeEnd')::integer,ARRAY(SELECT jsonb_array_elements_text(p_payload->'channels')),(p_payload->>'minimumMinor')::bigint,false) RETURNING id INTO entity;
    response:=jsonb_build_object('id',entity);
  ELSE RAISE EXCEPTION 'Unsupported staff command' USING ERRCODE='22023';
  END IF;
  INSERT INTO audit_logs(actor_id,actor_type,action,entity_type,entity_id,details)
    VALUES(s.id,'staff',p_command,'staff_workspace',entity,jsonb_build_object('requestId',p_request_id));
  INSERT INTO staff_command_receipts(request_id,staff_id,command,payload,response) VALUES(p_request_id,s.id,p_command,p_payload,response);
  RETURN response;
END;
$$;
REVOKE ALL ON FUNCTION public.execute_staff_command(uuid,uuid,text,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.execute_staff_command(uuid,uuid,text,jsonb) TO service_role;
