-- Run only inside a disposable/rolled-back test transaction.
DO $$
DECLARE
  a uuid:=gen_random_uuid(); b uuid:=gen_random_uuid(); t uuid:=gen_random_uuid();
  class_a uuid; class_b uuid; term_id_value uuid; plan_id uuid; pupil_id_value uuid;
  assignment_id uuid; result_id_value uuid; request_key uuid:=gen_random_uuid();
  payload jsonb; result jsonb; replay jsonb; count_before integer;
  suffix text:=substr(gen_random_uuid()::text,1,8);
BEGIN
  INSERT INTO staff_profiles(id,full_name,email,role) VALUES(a,'Command Test Admin','command-admin-'||suffix||'@test.invalid','admin'),(b,'Command Test Bursar','command-bursar-'||suffix||'@test.invalid','bursar'),(t,'Command Test Teacher','command-teacher-'||suffix||'@test.invalid','teacher');
  result:=execute_staff_command(gen_random_uuid(),a,'create_class',jsonb_build_object('name','Command A '||suffix,'stage','primary')); class_a:=(result->>'id')::uuid;
  result:=execute_staff_command(gen_random_uuid(),a,'create_class',jsonb_build_object('name','Command B '||suffix,'stage','primary')); class_b:=(result->>'id')::uuid;
  UPDATE staff_profiles SET assigned_class_ids=ARRAY[class_a] WHERE id=t;
  result:=execute_staff_command(gen_random_uuid(),a,'configure_term',jsonb_build_object('sessionName','Command Session '||suffix,'name','First Term','startDate','2026-09-01','endDate','2026-12-20')); term_id_value:=(result->>'id')::uuid;
  IF (SELECT count(*) FROM academic_terms WHERE is_current)<>1 THEN RAISE EXCEPTION 'TEST: current term must be unique'; END IF;
  result:=execute_staff_command(gen_random_uuid(),b,'save_fee_plan',jsonb_build_object('termId',term_id_value,'classId',class_a,'name','Command Tuition','amountMinor',10000000)); plan_id:=(result->>'id')::uuid;
  payload:=jsonb_build_object('firstName','Integration','lastName','Pupil','classId',class_a,'gender','female','dateOfBirth','2018-05-12','guardianName','Command Guardian','guardianPhone','+2348012345678','guardianEmail','','smsConsent',true);
  result:=execute_staff_command(request_key,a,'register_pupil',payload); pupil_id_value:=(result->>'id')::uuid;
  replay:=execute_staff_command(request_key,a,'register_pupil',payload);
  IF replay<>result OR (SELECT count(*) FROM pupils WHERE id=pupil_id_value)<>1 THEN RAISE EXCEPTION 'TEST: enrollment replay duplicated data'; END IF;
  IF NOT EXISTS(SELECT 1 FROM pupils p JOIN pupil_guardians pg ON pg.pupil_id=p.id WHERE p.id=pupil_id_value AND p.guardian_id=pg.guardian_id AND p.date_of_birth=date '2018-05-12') THEN RAISE EXCEPTION 'TEST: guardian or DOB not persisted'; END IF;
  SELECT id INTO assignment_id FROM fee_assignments WHERE pupil_id=pupil_id_value AND term_id=term_id_value;
  IF assignment_id IS NULL THEN RAISE EXCEPTION 'TEST: enrollment did not assign fee plan'; END IF;
  BEGIN
    PERFORM execute_staff_command(request_key,a,'register_pupil',payload||'{"firstName":"Changed"}');
    RAISE EXCEPTION 'TEST: idempotency key accepted changed payload';
  EXCEPTION WHEN invalid_parameter_value THEN NULL; END;
  SELECT count(*) INTO count_before FROM guardians;
  BEGIN
    PERFORM execute_staff_command(gen_random_uuid(),a,'register_pupil',payload||jsonb_build_object('classId',gen_random_uuid()));
    RAISE EXCEPTION 'TEST: invalid class enrollment was accepted';
  EXCEPTION WHEN foreign_key_violation THEN NULL; END;
  IF (SELECT count(*) FROM guardians)<>count_before THEN RAISE EXCEPTION 'TEST: failed enrollment left an orphan guardian'; END IF;
  BEGIN
    PERFORM execute_staff_command(gen_random_uuid(),t,'save_fee_plan',jsonb_build_object('termId',term_id_value,'classId',class_a,'name','Denied','amountMinor',1));
    RAISE EXCEPTION 'TEST: teacher altered financial records';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  request_key:=gen_random_uuid();payload:=jsonb_build_object('assignmentId',assignment_id,'amountMinor',1000000,'adjustmentType','scholarship','reason','Test scholarship');
  PERFORM execute_staff_command(request_key,b,'adjust_fee',payload);PERFORM execute_staff_command(request_key,b,'adjust_fee',payload);
  IF (SELECT adjusted_amount_minor FROM fee_assignments WHERE id=assignment_id)<>9000000 OR (SELECT count(*) FROM fee_adjustments WHERE fee_assignment_id=assignment_id)<>1 THEN RAISE EXCEPTION 'TEST: adjustment did not update charges exactly once'; END IF;
  BEGIN
    PERFORM execute_staff_command(gen_random_uuid(),b,'adjust_fee',payload||'{"amountMinor":10000000}');
    RAISE EXCEPTION 'TEST: excessive reduction was accepted';
  EXCEPTION WHEN invalid_parameter_value THEN NULL; END;
  payload:=jsonb_build_object('pupilId',pupil_id_value,'termId',term_id_value,'subjects',jsonb_build_array(jsonb_build_object('subject','Mathematics','ca',36,'exam',54)),'total_score',99999);
  BEGIN
    PERFORM execute_staff_command(gen_random_uuid(),b,'save_result',payload);
    RAISE EXCEPTION 'TEST: bursar accessed academic grading';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  BEGIN
    UPDATE staff_profiles SET assigned_class_ids=NULL WHERE id=t;
    RAISE EXCEPTION 'TEST: null class assignments were accepted';
  EXCEPTION WHEN not_null_violation THEN NULL; END;
  BEGIN
    UPDATE staff_profiles SET assigned_class_ids=ARRAY[NULL::uuid] WHERE id=t;
    RAISE EXCEPTION 'TEST: null class element was accepted';
  EXCEPTION WHEN check_violation THEN NULL; END;
  UPDATE staff_profiles SET assigned_class_ids='{}' WHERE id=t;
  BEGIN
    PERFORM execute_staff_command(gen_random_uuid(),t,'save_result',payload);
    RAISE EXCEPTION 'TEST: unassigned teacher edited a report';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  UPDATE staff_profiles SET assigned_class_ids=ARRAY[class_b] WHERE id=t;
  BEGIN
    PERFORM execute_staff_command(gen_random_uuid(),t,'save_result',payload);
    RAISE EXCEPTION 'TEST: teacher edited another class';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  UPDATE staff_profiles SET assigned_class_ids=ARRAY[class_a] WHERE id=t;
  result:=execute_staff_command(gen_random_uuid(),t,'save_result',payload);result_id_value:=(result->>'id')::uuid;
  IF (SELECT total_score FROM academic_results WHERE id=result_id_value)<>90 THEN RAISE EXCEPTION 'TEST: server did not derive scores'; END IF;
  BEGIN
    PERFORM execute_staff_command(gen_random_uuid(),t,'set_result_status',jsonb_build_object('resultId',result_id_value,'status','published'));
    RAISE EXCEPTION 'TEST: teacher published a report';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  PERFORM execute_staff_command(gen_random_uuid(),t,'set_result_status',jsonb_build_object('resultId',result_id_value,'status','under_review'));
  PERFORM execute_staff_command(gen_random_uuid(),a,'set_result_status',jsonb_build_object('resultId',result_id_value,'status','published'));
  IF (SELECT count(*) FROM notification_jobs WHERE source_event_id=result_id_value)<>1 THEN RAISE EXCEPTION 'TEST: consented publication notice was not queued'; END IF;
  IF (SELECT status FROM academic_results WHERE id=result_id_value)<>'published' THEN RAISE EXCEPTION 'TEST: unpaid fees blocked results'; END IF;
  BEGIN
    PERFORM execute_staff_command(gen_random_uuid(),t,'save_result',payload);
    RAISE EXCEPTION 'TEST: published report edited without withdrawal';
  EXCEPTION WHEN invalid_parameter_value THEN NULL; END;
  PERFORM execute_staff_command(gen_random_uuid(),a,'set_result_status',jsonb_build_object('resultId',result_id_value,'status','under_correction','reason','Correct an exam score'));
  IF EXISTS(SELECT 1 FROM notification_jobs WHERE source_event_id=result_id_value AND status<>'skipped') THEN RAISE EXCEPTION 'TEST: withdrawal left a queued publication notice'; END IF;
  PERFORM execute_staff_command(gen_random_uuid(),a,'save_settings',jsonb_build_object('schoolName','Command Test School','schoolShortName','Command Test'));
  PERFORM execute_staff_command(gen_random_uuid(),b,'save_reminder',jsonb_build_object('termId',term_id_value,'name','Command reminder','daysBeforeEnd',7,'minimumMinor',100000,'channels',jsonb_build_array('sms')));
  IF EXISTS(SELECT 1 FROM reminder_rules WHERE name='Command reminder' AND is_active) THEN RAISE EXCEPTION 'TEST: new reminder was not paused'; END IF;
  UPDATE staff_profiles SET is_active=false WHERE id=a;
  BEGIN
    PERFORM execute_staff_command(gen_random_uuid(),a,'create_class','{"name":"Denied class","stage":"primary"}');
    RAISE EXCEPTION 'TEST: inactive administrator retained access';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  IF has_function_privilege('anon','public.execute_staff_command(uuid,uuid,text,jsonb)','EXECUTE') OR has_function_privilege('authenticated','public.execute_staff_command(uuid,uuid,text,jsonb)','EXECUTE') THEN RAISE EXCEPTION 'TEST: browser role can execute staff commands'; END IF;
END;
$$;
