-- Rolled back by the integration harness. No provider sends.
DO $$
DECLARE a uuid:=gen_random_uuid();b uuid:=gen_random_uuid();t uuid:=gen_random_uuid();p uuid;c uuid;term uuid;
 response jsonb;receipt_id uuid;job uuid;claim text;ref text:='ADMINPAY-'||gen_random_uuid()::text; n int;
BEGIN
 INSERT INTO staff_profiles(id,full_name,email,role) VALUES
 (a,'Payment Admin',a||'@test.invalid','admin'),(b,'Other Admin',b||'@test.invalid','admin'),(t,'Teacher',t||'@test.invalid','teacher');
 INSERT INTO staff_notification_contacts(staff_id,telegram_chat_id,consent_telegram) VALUES(a,123456789,true),(b,123456788,false),(t,123456787,true);
 response:=execute_staff_command(gen_random_uuid(),a,'create_class',jsonb_build_object('name','Pay '||substr(a::text,1,8),'stage','primary'));c:=(response->>'id')::uuid;
 response:=execute_staff_command(gen_random_uuid(),a,'configure_term',jsonb_build_object('sessionName','Pay '||substr(a::text,1,8),'name','Term','startDate','2026-09-01','endDate','2026-12-01'));term:=(response->>'id')::uuid;
 PERFORM execute_staff_command(gen_random_uuid(),a,'save_fee_plan',jsonb_build_object('classId',c,'termId',term,'name','Fees','amountMinor',10000));
 response:=execute_staff_command(gen_random_uuid(),a,'register_pupil',jsonb_build_object('firstName','Fee','lastName','Pupil','classId',c,'gender','female','dateOfBirth','2018-05-12','guardianName','Guardian','guardianPhone','+2348012345678'));p:=(response->>'id')::uuid;
 INSERT INTO payment_intents(pupil_id,term_id,reference,amount_minor,payer_email) VALUES(p,term,ref,1000,'test@example.invalid');
 IF EXISTS(SELECT 1 FROM notification_jobs WHERE recipient_id=a AND event_type='payment_receipt') THEN RAISE EXCEPTION 'TEST pending payment notified admin'; END IF;
 response:=credit_payment_intent(ref,'PS-'||ref,1000,'card');
 SELECT id INTO receipt_id FROM receipts WHERE transaction_id=(response->>'transaction_id')::uuid;
 SELECT count(*) INTO n FROM notification_jobs WHERE source_event_id=receipt_id AND recipient_type='staff' AND recipient_id=a;
 IF n<>1 THEN RAISE EXCEPTION 'TEST admin receipt not queued exactly once'; END IF;
 IF EXISTS(SELECT 1 FROM notification_jobs WHERE source_event_id=receipt_id AND recipient_id IN(b,t)) THEN RAISE EXCEPTION 'TEST unconsented or teacher recipient queued'; END IF;
 PERFORM credit_payment_intent(ref,'PS-'||ref,1000,'card');
 SELECT count(*) INTO n FROM notification_jobs WHERE source_event_id=receipt_id AND recipient_id=a;
 IF n<>1 THEN RAISE EXCEPTION 'TEST duplicate verification queued extra message'; END IF;
 SELECT id INTO job FROM notification_jobs WHERE source_event_id=receipt_id AND recipient_id=a;
 -- Claim only the test job so fixtures cannot consume other queued school work.
 claim:=gen_random_uuid()::text;
 UPDATE notification_jobs SET status='claimed',claim_token=claim,lease_expires_at=now()+interval '3 minutes' WHERE id=job;
 response:=authorize_school_send('notification',job,claim,'https://school.test');
 IF NOT (response->>'authorized')::boolean OR response->>'recipient'<>'123456789'
  OR strpos(response->>'message','Fee Pupil')=0 OR strpos(response->>'message',ref)=0
  OR strpos(response->>'message','NGN 10.00')=0 OR strpos(response->>'message','/admin/payments')=0 THEN
  RAISE EXCEPTION 'TEST invalid admin payment authorization %',response;
 END IF;
 -- A new claimed attempt must recheck contact consent.
 UPDATE notification_jobs SET status='claimed',claim_token=claim,lease_expires_at=now()+interval '3 minutes' WHERE id=job;
 UPDATE staff_notification_contacts SET consent_telegram=false WHERE staff_id=a;
 response:=authorize_school_send('notification',job,claim,'https://school.test');
 IF (response->>'authorized')::boolean THEN RAISE EXCEPTION 'TEST revoked consent ignored'; END IF;
 UPDATE staff_notification_contacts SET consent_telegram=true WHERE staff_id=a;
 UPDATE staff_profiles SET role='bursar' WHERE id=a;
 UPDATE notification_jobs SET status='claimed',claim_token=claim,lease_expires_at=now()+interval '3 minutes' WHERE id=job;
 response:=authorize_school_send('notification',job,claim,'https://school.test');
 IF (response->>'authorized')::boolean THEN RAISE EXCEPTION 'TEST demoted admin still notified'; END IF;
 UPDATE staff_profiles SET role='admin',is_active=false WHERE id=a;
 UPDATE notification_jobs SET status='claimed',claim_token=claim,lease_expires_at=now()+interval '3 minutes' WHERE id=job;
 response:=authorize_school_send('notification',job,claim,'https://school.test');
 IF (response->>'authorized')::boolean THEN RAISE EXCEPTION 'TEST inactive admin still notified'; END IF;
 UPDATE staff_profiles SET is_active=true WHERE id=a;
 UPDATE receipts SET is_void=true WHERE id=receipt_id;
 UPDATE notification_jobs SET status='claimed',claim_token=claim,lease_expires_at=now()+interval '3 minutes' WHERE id=job;
 response:=authorize_school_send('notification',job,claim,'https://school.test');
 IF (response->>'authorized')::boolean THEN RAISE EXCEPTION 'TEST void receipt sent'; END IF;
END; $$;
