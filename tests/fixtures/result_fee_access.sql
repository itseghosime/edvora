-- Disposable transaction only: verify financial clearance and access exceptions end to end.
DO $test$
DECLARE
 a uuid:=gen_random_uuid(); t uuid:=gen_random_uuid(); b uuid:=gen_random_uuid();
 au uuid:=gen_random_uuid(); gu uuid:=gen_random_uuid(); g uuid:=gen_random_uuid();
 c uuid:=gen_random_uuid(); p uuid:=gen_random_uuid(); other uuid:=gen_random_uuid();
 sess uuid:=gen_random_uuid(); term uuid:=gen_random_uuid(); term2 uuid:=gen_random_uuid();
 plan uuid:=gen_random_uuid(); report uuid:=gen_random_uuid(); report2 uuid:=gen_random_uuid();
 req uuid:=gen_random_uuid(); payload jsonb; response jsonb; n int; x record;
 ref text:='EDV-LOCK-'||gen_random_uuid()::text;
BEGIN
 INSERT INTO staff_profiles(id,user_id,full_name,email,role) VALUES
 (a,au,'Lock Admin',a||'@test.invalid','admin'),(t,gen_random_uuid(),'Lock Teacher',t||'@test.invalid','teacher'),(b,gen_random_uuid(),'Lock Bursar',b||'@test.invalid','bursar');
 INSERT INTO school_classes(id,name,stage) VALUES(c,'Lock '||substr(c::text,1,8),'primary');
 INSERT INTO academic_sessions(id,name,start_date,end_date) VALUES(sess,'Lock '||substr(sess::text,1,8),'2026-09-01','2027-07-01');
 INSERT INTO academic_terms(id,session_id,name,term_code,start_date,end_date) VALUES
 (term,sess,'Lock Term','L-'||substr(term::text,1,8),'2026-09-01','2026-12-01'),(term2,sess,'Other Term','L-'||substr(term2::text,1,8),'2027-01-01','2027-04-01');
 INSERT INTO guardians(id,user_id,full_name,phone_number) VALUES(g,gu,'Lock Guardian','+2348012345678');
 INSERT INTO pupils(id,admission_number,first_name,last_name,gender,class_id,guardian_id)
 VALUES(p,'LOCK-'||substr(p::text,1,12),'Fee','Pupil','female',c,g),(other,'LOCK-'||substr(other::text,1,12),'Other','Pupil','male',c,NULL);
 INSERT INTO pupil_guardians(pupil_id,guardian_id,can_view_results,can_pay_fees) VALUES(p,g,true,true);
 INSERT INTO fee_plans(id,term_id,class_id,name,total_amount_minor) VALUES(plan,term,c,'Lock fees',10000);
 INSERT INTO fee_assignments(pupil_id,term_id,fee_plan_id,base_amount_minor,adjusted_amount_minor) VALUES(p,term,plan,10000,10000);
 INSERT INTO academic_results(id,pupil_id,term_id,class_id,subjects,total_score,max_score,average_score,status)
 VALUES(report,p,term,c,'[{"subject":"Math","total":80}]',80,100,80,'published'),
 (report2,p,term2,c,'[{"subject":"Math","total":90}]',90,100,90,'published');
 SELECT * INTO x FROM get_result_access(ARRAY[p],term);
 IF NOT x.locked OR x.balance_minor<>10000 THEN RAISE EXCEPTION 'TEST unpaid report must lock'; END IF;
 PERFORM set_config('request.jwt.claim.sub',gu::text,true);
 SET LOCAL ROLE authenticated;
 SELECT count(*) INTO n FROM academic_results WHERE id=report;
 IF n<>0 THEN RAISE EXCEPTION 'TEST RLS leaked unpaid grades'; END IF;
 SELECT count(*) INTO n FROM academic_results WHERE id=report2;
 IF n<>1 THEN RAISE EXCEPTION 'TEST debt crossed term boundary'; END IF;
 IF has_function_privilege('authenticated','public.get_result_access(uuid[],uuid)','EXECUTE') OR has_function_privilege('authenticated','public.execute_staff_command(uuid,uuid,text,jsonb)','EXECUTE') THEN RAISE EXCEPTION 'TEST browser can invoke service RPC'; END IF;
 RESET ROLE;
 payload:=jsonb_build_object('resultId',report,'allowAccess',true,'reason','Approved payment arrangement');
 BEGIN PERFORM execute_staff_command(gen_random_uuid(),t,'set_result_fee_override',payload); RAISE EXCEPTION 'TEST teacher approved override'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN PERFORM execute_staff_command(gen_random_uuid(),b,'set_result_fee_override',payload); RAISE EXCEPTION 'TEST bursar approved override'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN PERFORM execute_staff_command(gen_random_uuid(),a,'set_result_fee_override',jsonb_set(payload,'{reason}','""')); RAISE EXCEPTION 'TEST missing reason accepted'; EXCEPTION WHEN invalid_parameter_value THEN NULL; END;
 response:=execute_staff_command(req,a,'set_result_fee_override',payload);
 IF execute_staff_command(req,a,'set_result_fee_override',payload)<>response THEN RAISE EXCEPTION 'TEST retry changed response'; END IF;
 IF (SELECT count(*) FROM audit_logs WHERE entity_id=report AND action='result_fee_override')<>1 THEN RAISE EXCEPTION 'TEST retry duplicated audit'; END IF;
 SELECT * INTO x FROM get_result_access(ARRAY[p],term);
 IF x.locked OR NOT x.overridden OR x.balance_minor<>10000 THEN RAISE EXCEPTION 'TEST override changed fee balance or failed'; END IF;
 SET LOCAL ROLE authenticated;
 SELECT count(*) INTO n FROM academic_results WHERE id=report;
 IF n<>1 THEN RAISE EXCEPTION 'TEST override did not release linked child'; END IF;
 PERFORM set_config('request.jwt.claim.sub',gen_random_uuid()::text,true);
 SELECT count(*) INTO n FROM academic_results WHERE id=report;
 IF n<>0 THEN RAISE EXCEPTION 'TEST override exposed unrelated child'; END IF;
 RESET ROLE;
 UPDATE academic_results SET status='draft' WHERE id=report;
 SELECT * INTO x FROM get_result_access(ARRAY[p],term);
 IF x.has_published THEN RAISE EXCEPTION 'TEST override published draft'; END IF;
 PERFORM set_config('request.jwt.claim.sub',gu::text,true);
 SET LOCAL ROLE authenticated;
 SELECT count(*) INTO n FROM academic_results WHERE id=report;
 IF n<>0 THEN RAISE EXCEPTION 'TEST override leaked draft'; END IF;
 RESET ROLE;
 UPDATE academic_results SET status='published' WHERE id=report;
 PERFORM execute_staff_command(gen_random_uuid(),a,'set_result_fee_override',jsonb_build_object('resultId',report,'allowAccess',false,'reason','Arrangement revoked'));
 SELECT * INTO x FROM get_result_access(ARRAY[p],term);
 IF NOT x.locked THEN RAISE EXCEPTION 'TEST revocation failed'; END IF;
 UPDATE staff_profiles SET is_active=false WHERE id=a;
 BEGIN PERFORM execute_staff_command(gen_random_uuid(),a,'set_result_fee_override',payload); RAISE EXCEPTION 'TEST inactive admin approved override'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 UPDATE staff_profiles SET is_active=true WHERE id=a;
 INSERT INTO payment_intents(pupil_id,term_id,reference,amount_minor,payer_email) VALUES(p,term,ref,4000,'test@example.invalid');
 SELECT * INTO x FROM get_result_access(ARRAY[p],term);
 IF x.balance_minor<>10000 OR NOT x.locked THEN RAISE EXCEPTION 'TEST pending payment released report'; END IF;
 PERFORM credit_payment_intent(ref,'PS-'||ref,4000,'card');
 SELECT * INTO x FROM get_result_access(ARRAY[p],term);
 IF NOT x.locked OR x.balance_minor<>6000 THEN RAISE EXCEPTION 'TEST partial payment released report'; END IF;
 INSERT INTO payment_intents(pupil_id,term_id,reference,amount_minor,payer_email) VALUES(p,term,ref||'-FULL',6000,'test@example.invalid');
 PERFORM credit_payment_intent(ref||'-FULL','PS-'||ref||'-FULL',6000,'card');
 SELECT * INTO x FROM get_result_access(ARRAY[p],term);
 IF x.locked OR x.overridden OR x.balance_minor<>0 THEN RAISE EXCEPTION 'TEST verified full payment did not release report'; END IF;
 SET LOCAL ROLE authenticated;
 SELECT count(*) INTO n FROM academic_results WHERE id=report;
 IF n<>1 THEN RAISE EXCEPTION 'TEST RLS did not follow payment'; END IF;
 RESET ROLE;
END; $test$;
