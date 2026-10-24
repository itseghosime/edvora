DO $$
DECLARE
 admin_id uuid:=gen_random_uuid();class_id_value uuid;term_id_value uuid;pupil_id_value uuid;rule_id_value uuid;
 job_id_value uuid;claim text;attempt_id_value uuid;attempt_token_value text;receipt_id uuid;notification_id uuid;
 sms_event uuid;sms_claim text;result jsonb;claims jsonb;payload jsonb;suffix text:=substr(gen_random_uuid()::text,1,8);ver integer;incident uuid;
BEGIN
 FOR ver IN 1..10 LOOP
  result:=consume_login_budget(repeat('d',64));IF NOT (result->>'allowed')::boolean THEN RAISE EXCEPTION 'TEST: login budget exhausted early';END IF;
 END LOOP;
 result:=consume_login_budget(repeat('d',64));IF (result->>'allowed')::boolean OR (result->>'retry_after')::integer<1 THEN RAISE EXCEPTION 'TEST: login attempt limit missing';END IF;
 INSERT INTO staff_profiles(id,user_id,full_name,email,role) VALUES(admin_id,gen_random_uuid(),'Automation Test Admin','automation-'||suffix||'@test.invalid','admin');
 IF check_portal_session(repeat('a',64),'staff',admin_id,0) IS NULL THEN RAISE EXCEPTION 'TEST: active session rejected'; END IF;
 INSERT INTO revoked_portal_tokens VALUES(repeat('a',64),now()+interval '1 day');
 IF check_portal_session(repeat('a',64),'staff',admin_id,0) IS NOT NULL THEN RAISE EXCEPTION 'TEST: revoked token accepted'; END IF;
 UPDATE staff_profiles SET is_active=false WHERE id=admin_id;UPDATE staff_profiles SET is_active=true WHERE id=admin_id;
 IF check_portal_session(repeat('b',64),'staff',admin_id,0) IS NOT NULL OR check_portal_session(repeat('b',64),'staff',admin_id,2) IS NULL THEN RAISE EXCEPTION 'TEST: reactivation restored stale session'; END IF;
 result:=execute_staff_command(gen_random_uuid(),admin_id,'create_class',jsonb_build_object('name','Automation '||suffix,'stage','primary'));class_id_value:=(result->>'id')::uuid;
 result:=execute_staff_command(gen_random_uuid(),admin_id,'configure_term',jsonb_build_object('sessionName','Automation '||suffix,'name','Current term','startDate',(current_date-30)::text,'endDate',(current_date+7)::text));term_id_value:=(result->>'id')::uuid;
 PERFORM execute_staff_command(gen_random_uuid(),admin_id,'save_fee_plan',jsonb_build_object('classId',class_id_value,'termId',term_id_value,'name','Automation tuition','amountMinor',1000000));
 result:=execute_staff_command(gen_random_uuid(),admin_id,'register_pupil',jsonb_build_object('firstName','Automation','lastName','Pupil','classId',class_id_value,'gender','female','dateOfBirth','2018-05-12','guardianName','Automation Guardian','guardianPhone','+2348012345678','smsConsent',true));pupil_id_value:=(result->>'id')::uuid;
 UPDATE pupils SET status='suspended' WHERE id=pupil_id_value;UPDATE pupils SET status='active' WHERE id=pupil_id_value;
 IF check_portal_session(repeat('c',64),'student',pupil_id_value,0) IS NOT NULL THEN RAISE EXCEPTION 'TEST: suspended pupil token survived reactivation'; END IF;
 result:=execute_staff_command(gen_random_uuid(),admin_id,'save_reminder',jsonb_build_object('termId',term_id_value,'name','Due now','daysBeforeEnd',7,'minimumMinor',100,'channels',jsonb_build_array('sms')));rule_id_value:=(result->>'id')::uuid;
 PERFORM execute_staff_command(gen_random_uuid(),admin_id,'toggle_reminder',jsonb_build_object('ruleId',rule_id_value,'isActive',true));
 claims:=claim_school_jobs('reminder','test-run-'||suffix,10);
 SELECT id INTO job_id_value FROM reminder_jobs WHERE pupil_id=pupil_id_value AND rule_id=rule_id_value;
 SELECT value->>'claim_token' INTO claim FROM jsonb_array_elements(claims) WHERE value->>'job_id'=job_id_value::text;
 IF claim IS NULL THEN RAISE EXCEPTION 'TEST: due reminder was not queued and claimed'; END IF;
 IF (authorize_school_send('reminder',job_id_value,'wrong','https://school.test')->>'authorized')::boolean THEN RAISE EXCEPTION 'TEST: forged claim authorized'; END IF;
 result:=authorize_school_send('reminder',job_id_value,claim,'https://school.test');
 IF NOT (result->>'authorized')::boolean THEN RAISE EXCEPTION 'TEST: valid send rejected %',result; END IF;
 attempt_id_value:=(result->>'attempt_id')::uuid;attempt_token_value:=result->>'attempt_token';
 IF (authorize_school_send('reminder',job_id_value,claim,'https://school.test')->>'authorized')::boolean THEN RAISE EXCEPTION 'TEST: claim authorized twice'; END IF;
 BEGIN
  PERFORM record_school_outcome('reminder',job_id_value,'wrong',attempt_id_value,attempt_token_value,'accepted','forged');
  RAISE EXCEPTION 'TEST: forged outcome accepted';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 PERFORM record_school_outcome('reminder',job_id_value,claim,attempt_id_value,attempt_token_value,'unknown',NULL,'timeout');
 UPDATE reminder_jobs SET lease_expires_at=now()-interval '1 minute' WHERE id=job_id_value;
 PERFORM recover_school_jobs('test-recovery',100,3);
 IF (SELECT status FROM reminder_jobs WHERE id=job_id_value)<>'review_required' THEN RAISE EXCEPTION 'TEST: uncertain send was retried'; END IF;
 -- A second, definitively rejected send may use bounded backoff; unknown sends cannot.
 INSERT INTO notification_jobs(event_type,source_event_id,recipient_type,recipient_id,channel,status,claim_token,lease_expires_at)
 VALUES('operational_alert',gen_random_uuid(),'staff',admin_id,'sms','authorized',gen_random_uuid()::text,now()+interval '1 minute') RETURNING id,claim_token INTO notification_id,claim;
 INSERT INTO notification_attempts(job_id,attempt_token,owner_claim_token,channel,recipient,message,status) VALUES(notification_id,gen_random_uuid()::text,claim,'sms','2348012345678','Test','started') RETURNING id,attempt_token INTO attempt_id_value,attempt_token_value;
 PERFORM record_school_outcome('notification',notification_id,claim,attempt_id_value,attempt_token_value,'failed',NULL,'rate_limit',true);
 PERFORM recover_school_jobs('test-recovery',100,0);
 IF (SELECT status FROM notification_jobs WHERE id=notification_id)<>'failed' THEN RAISE EXCEPTION 'TEST: retry cap ignored'; END IF;
 PERFORM recover_school_jobs('test-recovery',100,3);
 IF NOT EXISTS(SELECT 1 FROM notification_jobs WHERE id=notification_id AND status='pending' AND retry_count=1 AND next_attempt_at>now()) THEN RAISE EXCEPTION 'TEST: bounded retry/backoff not persisted'; END IF;
 -- Pay fully: the receipt is still eligible, but future fee reminders are not.
 INSERT INTO payment_intents(pupil_id,term_id,reference,amount_minor,payer_email) VALUES(pupil_id_value,term_id_value,'AUTO-'||suffix,1000000,'automation@test.invalid');
 result:=credit_payment_intent('AUTO-'||suffix,'AUTO-TX-'||suffix,1000000,'card');
 SELECT id INTO receipt_id FROM receipts WHERE pupil_id=pupil_id_value;
 claims:=claim_school_jobs('notification','notification-run-'||suffix,10);
 SELECT id INTO notification_id FROM notification_jobs WHERE source_event_id=receipt_id AND channel='sms';
 SELECT value->>'claim_token' INTO claim FROM jsonb_array_elements(claims) WHERE value->>'job_id'=notification_id::text;
 result:=authorize_school_send('notification',notification_id,claim,'https://school.test');
 IF NOT (result->>'authorized')::boolean THEN RAISE EXCEPTION 'TEST: zero balance blocked receipt %',result; END IF;
 attempt_id_value:=(result->>'attempt_id')::uuid;attempt_token_value:=result->>'attempt_token';
 result:=ingest_school_sms(jsonb_build_object('message_id','SMS-'||suffix,'status','delivered'),true);sms_event:=(result->>'id')::uuid;
 claims:=claim_school_jobs('sms','sms-run-'||suffix,100);SELECT value->>'claim_token' INTO sms_claim FROM jsonb_array_elements(claims) WHERE value->>'event_id'=sms_event::text;
 result:=apply_school_sms(sms_event,sms_claim,'SMS-'||suffix,'delivered');
 IF NOT (result->>'unmatched')::boolean OR (SELECT applied_at FROM sms_delivery_inbox WHERE id=sms_event) IS NOT NULL THEN RAISE EXCEPTION 'TEST: early callback was lost'; END IF;
 PERFORM record_school_outcome('notification',notification_id,claim,attempt_id_value,attempt_token_value,'accepted','SMS-'||suffix);
 UPDATE sms_delivery_inbox SET next_attempt_at=now() WHERE id=sms_event;
 claims:=claim_school_jobs('sms','sms-retry-'||suffix,100);SELECT value->>'claim_token' INTO sms_claim FROM jsonb_array_elements(claims) WHERE value->>'event_id'=sms_event::text;
 BEGIN
  PERFORM apply_school_sms(sms_event,sms_claim,'SMS-'||suffix,'failed');RAISE EXCEPTION 'TEST: caller altered persisted event status';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 PERFORM apply_school_sms(sms_event,sms_claim,'SMS-'||suffix,'delivered');
 IF (SELECT status FROM notification_jobs WHERE id=notification_id)<>'delivered' THEN RAISE EXCEPTION 'TEST: authenticated callback not applied'; END IF;
 PERFORM record_school_outcome('notification',notification_id,claim,attempt_id_value,attempt_token_value,'unknown');
 IF (SELECT status FROM notification_jobs WHERE id=notification_id)<>'delivered' THEN RAISE EXCEPTION 'TEST: late unknown downgraded delivered'; END IF;
 result:=ingest_school_sms(jsonb_build_object('message_id','SMS-'||suffix,'status','failed'),true);sms_event:=(result->>'id')::uuid;
 claims:=claim_school_jobs('sms','sms-late-'||suffix,100);SELECT value->>'claim_token' INTO sms_claim FROM jsonb_array_elements(claims) WHERE value->>'event_id'=sms_event::text;
 PERFORM apply_school_sms(sms_event,sms_claim,'SMS-'||suffix,'failed');
 IF (SELECT status FROM notification_jobs WHERE id=notification_id)<>'delivered' THEN RAISE EXCEPTION 'TEST: late failed callback downgraded delivered'; END IF;
 result:=ingest_school_sms(jsonb_build_object('message_id','UNSIGNED-'||suffix,'status','delivered'),false);sms_event:=(result->>'id')::uuid;
 IF EXISTS(SELECT 1 FROM jsonb_array_elements(claim_school_jobs('sms','unsigned-test',100)) v WHERE v->>'event_id'=sms_event::text) THEN RAISE EXCEPTION 'TEST: unsigned event claimed'; END IF;
 INSERT INTO staff_notification_contacts(staff_id,telegram_chat_id,consent_telegram) VALUES(admin_id,123456789,true);
 result:=record_school_incident(jsonb_build_object('incident_key','WF05-'||suffix,'workflow_id','YWD3GloqWM7HhZpq','workflow_name','WF05 Notifications','failure_kind','timeout','record_only',false));incident:=(result->>'incident_id')::uuid;
 IF EXISTS(SELECT 1 FROM notification_jobs WHERE source_event_id=incident) THEN RAISE EXCEPTION 'TEST: incident recursion guard failed'; END IF;
 result:=record_school_incident(jsonb_build_object('incident_key','WF01-'||suffix,'workflow_id','WF01','workflow_name','Fee reminders','failure_kind','timeout'));incident:=(result->>'incident_id')::uuid;
 claims:=claim_school_jobs('notification','staff-alert-'||suffix,10);
 SELECT id INTO notification_id FROM notification_jobs WHERE source_event_id=incident;
 SELECT value->>'claim_token' INTO claim FROM jsonb_array_elements(claims) WHERE value->>'job_id'=notification_id::text;
 result:=authorize_school_send('notification',notification_id,claim,'https://school.test');
 IF result->>'recipient'<>'123456789' OR NOT (result->>'authorized')::boolean THEN RAISE EXCEPTION 'TEST: alert did not use authorized stored staff destination %',result; END IF;
 IF has_function_privilege('anon','public.authorize_school_send(text,uuid,text,text)','EXECUTE') OR has_table_privilege('authenticated','staff_notification_contacts','SELECT') THEN RAISE EXCEPTION 'TEST: private automation exposed'; END IF;
END; $$;
