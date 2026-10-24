DO $$
DECLARE a uuid:=gen_random_uuid();teacher uuid:=gen_random_uuid();class_value uuid;pupil_value uuid;request_value uuid:=gen_random_uuid();v integer;r jsonb;
 h1 text:='scrypt-v1$'||repeat('a',32)||'$'||repeat('1',128);h2 text:='scrypt-v1$'||repeat('b',32)||'$'||repeat('2',128);suffix text:=substr(gen_random_uuid()::text,1,8);
BEGIN
 INSERT INTO staff_profiles(id,full_name,email,role) VALUES(a,'Access Test Admin','access-admin-'||suffix||'@test.invalid','admin'),(teacher,'Access Test Teacher','access-teacher-'||suffix||'@test.invalid','teacher');
 r:=execute_staff_command(gen_random_uuid(),a,'create_class',jsonb_build_object('name','Access '||suffix,'stage','primary'));class_value:=(r->>'id')::uuid;
 r:=execute_staff_command(gen_random_uuid(),a,'register_pupil',jsonb_build_object('firstName','Access','lastName','Pupil','classId',class_value,'gender','female','dateOfBirth','2018-05-12','guardianName','Access Guardian','guardianPhone','+2348012345678','smsConsent',false));pupil_value:=(r->>'id')::uuid;
 IF check_portal_session(repeat('f',64),'student',pupil_value,0) IS NOT NULL THEN RAISE EXCEPTION 'TEST: legacy DOB session accepted';END IF;
 IF read_student_credential(r->>'admissionNumber') IS NOT NULL THEN RAISE EXCEPTION 'TEST: DOB-only pupil has a login credential';END IF;
 BEGIN
  PERFORM issue_student_access(teacher,gen_random_uuid(),pupil_value,repeat('a',64),'Guardian verified');RAISE EXCEPTION 'TEST: teacher issued reset';
 EXCEPTION WHEN insufficient_privilege THEN NULL;END;
 r:=issue_student_access(a,request_value,pupil_value,repeat('a',64),'Guardian verified');
 PERFORM issue_student_access(a,request_value,pupil_value,repeat('a',64),'Guardian verified');
 SELECT auth_version INTO v FROM pupils WHERE id=pupil_value;
 IF v<>1 OR NOT student_access_is_valid(repeat('a',64)) THEN RAISE EXCEPTION 'TEST: issue retry reset twice or proof unavailable';END IF;
 IF r ? 'token' OR r ? 'password_hash' THEN RAISE EXCEPTION 'TEST: SQL receipt exposes credential';END IF;
 PERFORM redeem_student_access(repeat('a',64),h1);
 IF student_access_is_valid(repeat('a',64)) THEN RAISE EXCEPTION 'TEST: consumed proof remains valid';END IF;
 BEGIN
  PERFORM redeem_student_access(repeat('a',64),h2);RAISE EXCEPTION 'TEST: proof was replayed';
 EXCEPTION WHEN invalid_parameter_value THEN NULL;END;
 SELECT auth_version INTO v FROM pupils WHERE id=pupil_value;
 IF check_portal_session(repeat('f',64),'student',pupil_value,2) IS NULL THEN RAISE EXCEPTION 'TEST: configured password session rejected';END IF;
 IF v<>2 OR check_portal_session(repeat('f',64),'student',pupil_value,1) IS NOT NULL THEN RAISE EXCEPTION 'TEST: password setup failed to revoke old sessions';END IF;
 SELECT read_student_credential(admission_number) INTO r FROM pupils WHERE id=pupil_value;
 IF r->>'passwordHash'<>h1 THEN RAISE EXCEPTION 'TEST: password hash not stored';END IF;
 BEGIN
  PERFORM change_student_password(pupil_value,h2,h2);RAISE EXCEPTION 'TEST: stale password changed credential';
 EXCEPTION WHEN insufficient_privilege THEN NULL;END;
 PERFORM change_student_password(pupil_value,h1,h2);
 IF check_portal_session(repeat('f',64),'student',pupil_value,2) IS NOT NULL THEN RAISE EXCEPTION 'TEST: old session survived password change';END IF;
 PERFORM issue_student_access(a,gen_random_uuid(),pupil_value,repeat('b',64),'Verified recovery request');
 SELECT read_student_credential(admission_number) INTO r FROM pupils WHERE id=pupil_value;
 IF r IS NOT NULL THEN RAISE EXCEPTION 'TEST: recovery did not lock old password';END IF;
 UPDATE student_access_tokens SET expires_at=now()-interval '1 minute' WHERE token_hash=repeat('b',64);
 IF student_access_is_valid(repeat('b',64)) THEN RAISE EXCEPTION 'TEST: expired proof accepted';END IF;
 BEGIN
  PERFORM redeem_student_access(repeat('b',64),h1);RAISE EXCEPTION 'TEST: expired proof redeemed';
 EXCEPTION WHEN invalid_parameter_value THEN NULL;END;
 PERFORM issue_student_access(a,gen_random_uuid(),pupil_value,repeat('c',64),'Replacement recovery request');
 IF (SELECT revoked_at FROM student_access_tokens WHERE token_hash=repeat('b',64)) IS NULL THEN RAISE EXCEPTION 'TEST: old recovery proof not revoked';END IF;
 PERFORM redeem_student_access(repeat('c',64),h1);
 PERFORM issue_student_access(a,gen_random_uuid(),pupil_value,repeat('d',64),'Guardian verified again');
 UPDATE pupils SET status='suspended' WHERE id=pupil_value;UPDATE pupils SET status='active' WHERE id=pupil_value;
 IF student_access_is_valid(repeat('d',64)) THEN RAISE EXCEPTION 'TEST: suspended account proof survived reactivation';END IF;
 IF has_table_privilege('anon','student_credentials','SELECT') OR has_table_privilege('authenticated','student_access_tokens','SELECT') OR has_function_privilege('authenticated','public.read_student_credential(text)','EXECUTE') THEN RAISE EXCEPTION 'TEST: credentials exposed to browser';END IF;
END;$$;
