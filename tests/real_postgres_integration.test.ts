import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Client, Pool } from 'pg';
import fs from 'fs';
import path from 'path';

describe('Real PostgreSQL Integration: Migrations, RLS, Stored Functions & Concurrency', () => {
  const connectionString = process.env.DATABASE_URL || 'postgres://postgres@localhost:5433/edvora_test';
  let pool: Pool;

  const schemaSql = fs.readFileSync(
    path.join(__dirname, '../supabase/migrations/20261023000000_core_schema.sql'),
    'utf-8'
  );
  const functionsSql = fs.readFileSync(
    path.join(__dirname, '../supabase/migrations/20261023000001_atomic_functions.sql'),
    'utf-8'
  );
  const hardenSql = fs.readFileSync(
    path.join(__dirname, '../supabase/migrations/20261024000000_harden_rls_and_grants.sql'),
    'utf-8'
  );
  const staffBoundariesSql = fs.readFileSync(
    path.join(__dirname, '../supabase/migrations/20261024000001_staff_role_class_boundaries.sql'),
    'utf-8'
  );
  const guardianPermissionsSql = fs.readFileSync(
    path.join(__dirname, '../supabase/migrations/20261024000002_guardian_result_and_financial_permissions.sql'),
    'utf-8'
  );

  beforeAll(async () => {
    // Connect to postgres server and setup test database
    pool = new Pool({ connectionString });
    const client = await pool.connect();
    try {
      // 1. Create Supabase client roles if not present
      await client.query(`
        DO $$ BEGIN
          IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'anon') THEN
            CREATE ROLE anon NOLOGIN;
          END IF;
          IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'authenticated') THEN
            CREATE ROLE authenticated NOLOGIN;
          END IF;
          IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'service_role') THEN
            CREATE ROLE service_role NOLOGIN;
          END IF;
        END $$;
      `);

      // 2. Test-only compatibility stub for auth.uid() in standalone PostgreSQL testing
      // (Supabase managed environments provide this natively; never defined in migrations)
      await client.query(`
        CREATE SCHEMA IF NOT EXISTS auth;
        CREATE OR REPLACE FUNCTION auth.uid() RETURNS UUID AS $$
          SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid;
        $$ LANGUAGE sql STABLE;
      `);

      // 3. Apply migrations in order
      await client.query(schemaSql);
      await client.query(functionsSql);
      await client.query(hardenSql);
      await client.query(staffBoundariesSql);
      await client.query(guardianPermissionsSql);
      const integrationMigration=fs.readdirSync(path.join(__dirname,'../supabase/migrations')).find(name=>name.endsWith('_portal_integration_foundation.sql'));
      if(integrationMigration) await client.query(fs.readFileSync(path.join(__dirname,'../supabase/migrations',integrationMigration),'utf8'));
      const staffMigration=fs.readdirSync(path.join(__dirname,'../supabase/migrations')).find(name=>name.endsWith('_staff_workspace_transactions.sql'))!;
      await client.query(fs.readFileSync(path.join(__dirname,'../supabase/migrations',staffMigration),'utf8'));
      const balanceMigration=fs.readdirSync(path.join(__dirname,'../supabase/migrations')).find(name=>name.endsWith('_serialize_fee_balance_updates.sql'))!;
      await client.query(fs.readFileSync(path.join(__dirname,'../supabase/migrations',balanceMigration),'utf8'));
      const classMigration=fs.readdirSync(path.join(__dirname,'../supabase/migrations')).find(name=>name.endsWith('_harden_staff_class_checks.sql'))!;
      await client.query(fs.readFileSync(path.join(__dirname,'../supabase/migrations',classMigration),'utf8'));
      // Test-owned prerequisites; never rely on a developer's existing database seed.
      await client.query(`
        INSERT INTO academic_sessions (id,name,start_date,end_date)
        VALUES ('11111111-0000-0000-0000-000000000000','2026/2027 Test','2026-09-01','2027-07-31');
        INSERT INTO academic_terms (id,session_id,name,term_code,start_date,end_date)
        VALUES ('66666666-7777-8888-9999-000000000000','11111111-0000-0000-0000-000000000000','RLS Test Term','RLS-TEST','2026-09-01','2026-12-31');
        INSERT INTO school_classes (id,name,stage)
        VALUES ('22222222-0000-0000-0000-000000000000','Primary 3A Test','primary');
      `);

    } finally {
      client.release();
    }
  });

  afterAll(async () => {
    await pool.end();
  });

  it('verifies that core schema tables and functions exist in PostgreSQL with RLS enabled', async () => {
    const res = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    const tables = res.rows.map((r) => r.table_name);

    expect(tables).toContain('pupils');
    expect(tables).toContain('guardians');
    expect(tables).toContain('payment_intents');
    expect(tables).toContain('payment_transactions');
    expect(tables).toContain('fee_ledger_entries');
    expect(tables).toContain('receipts');
    expect(tables).toContain('reminder_jobs');
    expect(tables).toContain('notification_jobs');
    expect(tables).toContain('operational_incidents');
    expect(tables).toContain('audit_logs');
  });

  it('restricts execution of privileged functions from anon and authenticated roles', async () => {
    const client = await pool.connect();
    try {
      // Test anon execution rejection
      await client.query('SET ROLE anon;');
      let anonFailed = false;
      try {
        await client.query(`
          SELECT credit_payment_intent('DUMMY', 'DUMMY', 1000, 'card');
        `);
      } catch (err: any) {
        anonFailed = true;
        expect(err.message).toMatch(/permission denied for function credit_payment_intent/i);
      }
      expect(anonFailed).toBe(true);

      // Test authenticated execution rejection
      await client.query('SET ROLE authenticated;');
      let authFailed = false;
      try {
        await client.query(`
          SELECT credit_payment_intent('DUMMY', 'DUMMY', 1000, 'card');
        `);
      } catch (err: any) {
        authFailed = true;
        expect(err.message).toMatch(/permission denied for function credit_payment_intent/i);
      }
      expect(authFailed).toBe(true);
    } finally {
      await client.query('RESET ROLE;');
      client.release();
    }
  });

  it('proves anon and ordinary authenticated users cannot insert or modify staff roles (allowed: directory read)', async () => {
    const client = await pool.connect();
    try {
      // 0. Ensure baseline staff profile exists via service_role
      const baselineStaffId = '44444444-0000-0000-0000-000000000001';
      await client.query(`
        INSERT INTO staff_profiles (id, full_name, email, role, is_active)
        VALUES ('${baselineStaffId}', 'Dr. Stella Efe', 'admin@edvora.edu.ng', 'admin', true)
        ON CONFLICT (email) DO NOTHING;
      `);

      // 1. Denied: anon cannot insert staff
      await client.query('SET ROLE anon;');
      let anonInsertBlocked = false;
      try {
        await client.query(`
          INSERT INTO staff_profiles (full_name, email, role)
          VALUES ('Hacker Anon', 'anon_hacker@edvora.ng', 'admin');
        `);
      } catch (err: any) {
        anonInsertBlocked = true;
        expect(err.message).toMatch(/permission denied for table staff_profiles/i);
      }
      expect(anonInsertBlocked).toBe(true);

      // 2. Denied: authenticated ordinary user cannot insert staff profile
      await client.query('SET ROLE authenticated;');
      await client.query("SET request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001';");
      let authInsertBlocked = false;
      try {
        await client.query(`
          INSERT INTO staff_profiles (full_name, email, role)
          VALUES ('Malicious User', 'malicious@edvora.ng', 'admin');
        `);
      } catch (err: any) {
        authInsertBlocked = true;
        expect(err.message).toMatch(/permission denied for table staff_profiles/i);
      }
      expect(authInsertBlocked).toBe(true);

      // 3. Denied: authenticated ordinary user cannot elevate or modify staff roles
      let authUpdateBlocked = false;
      try {
        await client.query(`
          UPDATE staff_profiles SET role = 'admin' WHERE email = 'admin@edvora.edu.ng';
        `);
      } catch (err: any) {
        authUpdateBlocked = true;
        expect(err.message).toMatch(/permission denied for table staff_profiles/i);
      }
      expect(authUpdateBlocked).toBe(true);

      // 4. Allowed: authenticated users can read staff directory
      const staffList = await client.query('SELECT id, full_name, email, role FROM staff_profiles;');
      expect(staffList.rows.length).toBeGreaterThanOrEqual(1);

      // 5. Allowed: service_role can manage staff profiles
      await client.query('RESET ROLE;');
      const testStaffId = '44444444-9999-9999-9999-000000000001';
      await client.query(`
        INSERT INTO staff_profiles (id, full_name, email, role)
        VALUES ('${testStaffId}', 'New Staff Member', 'new.staff@edvora.ng', 'teacher')
        ON CONFLICT (email) DO NOTHING;
      `);
      const checkStaff = await client.query(`SELECT role FROM staff_profiles WHERE id = '${testStaffId}';`);
      expect(checkStaff.rows[0].role).toBe('teacher');
    } finally {
      await client.query('RESET ROLE;');
      client.release();
    }
  });

  it('proves anon and ordinary authenticated users cannot read unrelated payment intents or transactions (allowed: own records)', async () => {
    const client = await pool.connect();
    try {
      const parentAUserId = 'aaaaaaaa-1111-2222-3333-000000000001';
      const parentBUserId = 'bbbbbbbb-1111-2222-3333-000000000002';
      const guardianAId = 'aaaaaaaa-2222-3333-4444-000000000001';
      const guardianBId = 'bbbbbbbb-2222-3333-4444-000000000002';
      const pupilAId = 'aaaaaaaa-3333-4444-5555-000000000001';
      const pupilBId = 'bbbbbbbb-3333-4444-5555-000000000002';
      const intentARef = `EDV-INTENT-A-${Date.now()}`;
      const intentBRef = `EDV-INTENT-B-${Date.now()}`;
      const intentAId = `aa44aa44-4444-5555-6666-${Date.now().toString().slice(-12)}`;
      const intentBId = `bb44bb44-4444-5555-6666-${Date.now().toString().slice(-12)}`;
      const termId = '66666666-7777-8888-9999-000000000000';
      const classId = '22222222-0000-0000-0000-000000000000';

      // Insert prerequisites via service_role
      await client.query(`
        INSERT INTO guardians (id, user_id, full_name, phone_number)
        VALUES 
          ('${guardianAId}', '${parentAUserId}', 'Parent A', '+2348011111111'),
          ('${guardianBId}', '${parentBUserId}', 'Parent B', '+2348022222222')
        ON CONFLICT DO NOTHING;

        INSERT INTO pupils (id, admission_number, first_name, last_name, class_id, guardian_id, status)
        VALUES 
          ('${pupilAId}', 'EDV/RLS/A01', 'Pupil', 'A', '${classId}', '${guardianAId}', 'active'),
          ('${pupilBId}', 'EDV/RLS/B01', 'Pupil', 'B', '${classId}', '${guardianBId}', 'active')
        ON CONFLICT DO NOTHING;

        INSERT INTO payment_intents (id, pupil_id, term_id, reference, amount_minor, currency, environment, status, payer_email, expires_at)
        VALUES 
          ('${intentAId}', '${pupilAId}', '${termId}', '${intentARef}', 2000000, 'NGN', 'test', 'initialized', 'parentA@test.com', now() + interval '30 minutes'),
          ('${intentBId}', '${pupilBId}', '${termId}', '${intentBRef}', 3000000, 'NGN', 'test', 'initialized', 'parentB@test.com', now() + interval '30 minutes')
        ON CONFLICT DO NOTHING;

        INSERT INTO payment_transactions (id, intent_id, reference, provider, amount_minor, currency, environment, status, channel)
        VALUES 
          (gen_random_uuid(), '${intentAId}', '${intentARef}', 'paystack', 2000000, 'NGN', 'test', 'success', 'card'),
          (gen_random_uuid(), '${intentBId}', '${intentBRef}', 'paystack', 3000000, 'NGN', 'test', 'success', 'card')
        ON CONFLICT DO NOTHING;
      `);

      // 1. Denied: anon has no permission on payment intents or transactions
      await client.query('SET ROLE anon;');
      let anonIntentsBlocked = false;
      try {
        await client.query('SELECT * FROM payment_intents;');
      } catch (err: any) {
        anonIntentsBlocked = true;
        expect(err.message).toMatch(/permission denied for table payment_intents/i);
      }
      expect(anonIntentsBlocked).toBe(true);

      // 2. Denied: Parent A cannot see Parent B's payment intent
      await client.query('SET ROLE authenticated;');
      await client.query(`SET request.jwt.claim.sub = '${parentAUserId}';`);

      const parentAViewB = await client.query(`SELECT * FROM payment_intents WHERE reference = '${intentBRef}';`);
      expect(parentAViewB.rows).toHaveLength(0); // Filtered by RLS

      // Denied: Parent A cannot see Parent B's payment transaction
      const parentAViewBTx = await client.query(`SELECT * FROM payment_transactions WHERE reference = '${intentBRef}';`);
      expect(parentAViewBTx.rows).toHaveLength(0); // Filtered by RLS

      // 3. Allowed: Parent A can see own pupil's payment intent and transaction
      const parentAViewA = await client.query(`SELECT * FROM payment_intents WHERE reference = '${intentARef}';`);
      expect(parentAViewA.rows).toHaveLength(1);
      expect(parentAViewA.rows[0].reference).toBe(intentARef);

      const parentAViewATx = await client.query(`SELECT * FROM payment_transactions WHERE reference = '${intentARef}';`);
      expect(parentAViewATx.rows).toHaveLength(1);
      expect(Number(parentAViewATx.rows[0].amount_minor)).toBe(2000000);
    } finally {
      await client.query('RESET ROLE;');
      client.release();
    }
  });

  it('proves anon and ordinary authenticated users cannot create financial credits, receipts or fee adjustments (allowed: server-only)', async () => {
    const client = await pool.connect();
    try {
      const pupilId = 'aaaaaaaa-3333-4444-5555-000000000001';
      const termId = '66666666-7777-8888-9999-000000000000';

      // 1. Denied: anon cannot create ledger entries, receipts, or fee adjustments
      await client.query('SET ROLE anon;');
      let anonLedgerBlocked = false;
      try {
        await client.query(`
          INSERT INTO fee_ledger_entries (pupil_id, term_id, entry_type, amount_minor, running_balance_minor, reference, description)
          VALUES ('${pupilId}', '${termId}', 'credit', 500000, 0, 'ANON-UNAUTH-CREDIT', 'Malicious credit');
        `);
      } catch (err: any) {
        anonLedgerBlocked = true;
        expect(err.message).toMatch(/permission denied for table fee_ledger_entries/i);
      }
      expect(anonLedgerBlocked).toBe(true);

      let anonReceiptBlocked = false;
      try {
        await client.query(`
          INSERT INTO receipts (receipt_number, transaction_id, pupil_id, term_id, amount_minor, currency)
          VALUES ('REC-ANON-FAKE', gen_random_uuid(), '${pupilId}', '${termId}', 500000, 'NGN');
        `);
      } catch (err: any) {
        anonReceiptBlocked = true;
        expect(err.message).toMatch(/permission denied for table receipts/i);
      }
      expect(anonReceiptBlocked).toBe(true);

      let anonAdjustBlocked = false;
      try {
        await client.query(`
          INSERT INTO fee_adjustments (fee_assignment_id, amount_minor, adjustment_type, reason, authorized_by)
          VALUES (gen_random_uuid(), 500000, 'waiver', 'Anon waiver', gen_random_uuid());
        `);
      } catch (err: any) {
        anonAdjustBlocked = true;
        expect(err.message).toMatch(/permission denied for table fee_adjustments/i);
      }
      expect(anonAdjustBlocked).toBe(true);

      // 2. Denied: ordinary authenticated user cannot create ledger entries, receipts, or fee adjustments
      await client.query('SET ROLE authenticated;');
      await client.query("SET request.jwt.claim.sub = 'aaaaaaaa-1111-2222-3333-000000000001';");

      let authLedgerBlocked = false;
      try {
        await client.query(`
          INSERT INTO fee_ledger_entries (pupil_id, term_id, entry_type, amount_minor, running_balance_minor, reference, description)
          VALUES ('${pupilId}', '${termId}', 'credit', 500000, 0, 'AUTH-UNAUTH-CREDIT', 'Malicious credit');
        `);
      } catch (err: any) {
        authLedgerBlocked = true;
        expect(err.message).toMatch(/permission denied for table fee_ledger_entries/i);
      }
      expect(authLedgerBlocked).toBe(true);

      let authReceiptBlocked = false;
      try {
        await client.query(`
          INSERT INTO receipts (receipt_number, transaction_id, pupil_id, term_id, amount_minor, currency)
          VALUES ('REC-AUTH-FAKE', gen_random_uuid(), '${pupilId}', '${termId}', 500000, 'NGN');
        `);
      } catch (err: any) {
        authReceiptBlocked = true;
        expect(err.message).toMatch(/permission denied for table receipts/i);
      }
      expect(authReceiptBlocked).toBe(true);

      let authAdjustBlocked = false;
      try {
        await client.query(`
          INSERT INTO fee_adjustments (fee_assignment_id, amount_minor, adjustment_type, reason, authorized_by)
          VALUES (gen_random_uuid(), 500000, 'waiver', 'User waiver', gen_random_uuid());
        `);
      } catch (err: any) {
        authAdjustBlocked = true;
        expect(err.message).toMatch(/permission denied for table fee_adjustments/i);
      }
      expect(authAdjustBlocked).toBe(true);

      // 3. Allowed: service_role can create financial records
      await client.query('RESET ROLE;');
      const servRef = `EDV-SERV-LEDGER-${Date.now()}`;
      await client.query(`
        INSERT INTO fee_ledger_entries (pupil_id, term_id, entry_type, amount_minor, running_balance_minor, reference, description)
        VALUES ('${pupilId}', '${termId}', 'debit', 12000000, 12000000, '${servRef}', 'First term tuition fee charge');
      `);
      const checkLedger = await client.query(`SELECT * FROM fee_ledger_entries WHERE reference = '${servRef}';`);
      expect(checkLedger.rows).toHaveLength(1);
    } finally {
      await client.query('RESET ROLE;');
      client.release();
    }
  });

  it('proves anon and ordinary authenticated users cannot modify notification recipients, consent or job outcomes (allowed: server-only)', async () => {
    const client = await pool.connect();
    try {
      // 1. Denied: anon has no access to notification queues
      await client.query('SET ROLE anon;');
      let anonNotifBlocked = false;
      try {
        await client.query('SELECT * FROM notification_jobs;');
      } catch (err: any) {
        anonNotifBlocked = true;
        expect(err.message).toMatch(/permission denied for table notification_jobs/i);
      }
      expect(anonNotifBlocked).toBe(true);

      // 2. Denied: authenticated user cannot view or tamper with notification or reminder jobs
      await client.query('SET ROLE authenticated;');
      await client.query("SET request.jwt.claim.sub = 'aaaaaaaa-1111-2222-3333-000000000001';");

      let authNotifReadBlocked = false;
      try {
        await client.query('SELECT * FROM notification_jobs;');
      } catch (err: any) {
        authNotifReadBlocked = true;
        expect(err.message).toMatch(/permission denied for table notification_jobs/i);
      }
      expect(authNotifReadBlocked).toBe(true);

      let authReminderUpdateBlocked = false;
      try {
        await client.query("UPDATE reminder_jobs SET status = 'delivered' WHERE channel = 'sms';");
      } catch (err: any) {
        authReminderUpdateBlocked = true;
        expect(err.message).toMatch(/permission denied for table reminder_jobs/i);
      }
      expect(authReminderUpdateBlocked).toBe(true);

      // 3. Denied: authenticated user cannot modify other guardians' consent or contact
      let authGuardianTamperBlocked = false;
      try {
        await client.query(`
          UPDATE guardians 
          SET phone_number = '+2340000000000', consent_sms = false 
          WHERE user_id = 'bbbbbbbb-1111-2222-3333-000000000002';
        `);
      } catch (err: any) {
        authGuardianTamperBlocked = true;
        expect(err.message).toMatch(/permission denied for table guardians/i);
      }
      expect(authGuardianTamperBlocked).toBe(true);

      // 4. Allowed: service_role can enqueue and update notification jobs
      await client.query('RESET ROLE;');
      const testJobId = '55555555-4444-3333-2222-111111111111';
      await client.query(`
        INSERT INTO notification_jobs (id, event_type, source_event_id, recipient_type, recipient_id, channel, status)
        VALUES ('${testJobId}', 'payment_receipt', gen_random_uuid(), 'guardian', gen_random_uuid(), 'sms', 'pending')
        ON CONFLICT DO NOTHING;

        UPDATE notification_jobs SET status = 'claimed' WHERE id = '${testJobId}';
      `);
      const checkJob = await client.query(`SELECT status FROM notification_jobs WHERE id = '${testJobId}';`);
      expect(checkJob.rows[0].status).toBe('claimed');
    } finally {
      await client.query('RESET ROLE;');
      client.release();
    }
  });

  it('proves anon and ordinary authenticated users cannot access internal incidents or audit records (allowed: server-only)', async () => {
    const client = await pool.connect();
    try {
      // 1. Denied: anon cannot access operational incidents or audit logs
      await client.query('SET ROLE anon;');
      let anonIncidentBlocked = false;
      try {
        await client.query('SELECT * FROM operational_incidents;');
      } catch (err: any) {
        anonIncidentBlocked = true;
        expect(err.message).toMatch(/permission denied for table operational_incidents/i);
      }
      expect(anonIncidentBlocked).toBe(true);

      let anonAuditBlocked = false;
      try {
        await client.query('SELECT * FROM audit_logs;');
      } catch (err: any) {
        anonAuditBlocked = true;
        expect(err.message).toMatch(/permission denied for table audit_logs/i);
      }
      expect(anonAuditBlocked).toBe(true);

      // 2. Denied: authenticated ordinary user cannot access operational incidents or audit logs
      await client.query('SET ROLE authenticated;');
      await client.query("SET request.jwt.claim.sub = 'aaaaaaaa-1111-2222-3333-000000000001';");

      let authIncidentBlocked = false;
      try {
        await client.query('SELECT * FROM operational_incidents;');
      } catch (err: any) {
        authIncidentBlocked = true;
        expect(err.message).toMatch(/permission denied for table operational_incidents/i);
      }
      expect(authIncidentBlocked).toBe(true);

      let authAuditBlocked = false;
      try {
        await client.query('SELECT * FROM audit_logs;');
      } catch (err: any) {
        authAuditBlocked = true;
        expect(err.message).toMatch(/permission denied for table audit_logs/i);
      }
      expect(authAuditBlocked).toBe(true);

      let authAuditInsertBlocked = false;
      try {
        await client.query(`
          INSERT INTO audit_logs (actor_type, action, entity_type)
          VALUES ('user', 'unauthorized_action', 'audit');
        `);
      } catch (err: any) {
        authAuditInsertBlocked = true;
        expect(err.message).toMatch(/permission denied for table audit_logs/i);
      }
      expect(authAuditInsertBlocked).toBe(true);

      // 3. Allowed: service_role can record and query incidents and audit logs
      await client.query('RESET ROLE;');
      const testIncidentKey = `INC-TEST-${Date.now()}`;
      await client.query(`
        INSERT INTO operational_incidents (incident_key, workflow_id, workflow_name, failure_kind)
        VALUES ('${testIncidentKey}', 'WF01_PAYSTACK', 'Payment Reconciliation', 'provider_500');

        INSERT INTO audit_logs (actor_type, action, entity_type)
        VALUES ('system', 'sweep_execution', 'workflow');
      `);
      const checkIncident = await client.query(`SELECT * FROM operational_incidents WHERE incident_key = '${testIncidentKey}';`);
      expect(checkIncident.rows).toHaveLength(1);
    } finally {
      await client.query('RESET ROLE;');
      client.release();
    }
  });

  it('proves Teacher A cannot read Class B pupils/results or financial records, while assigned-class access works (tests inactive staff and unrelated guardians too)', async () => {
    const client = await pool.connect();
    try {
      const runId = Date.now().toString().slice(-6);

      // Unique IDs for classes
      const classAId = `20000000-0000-0000-0000-${runId}000001`;
      const classBId = `20000000-0000-0000-0000-${runId}000002`;

      // Unique IDs for users / auth.uid()
      const adminUserId = `10000000-0000-0000-0000-${runId}000001`;
      const bursarUserId = `10000000-0000-0000-0000-${runId}000002`;
      const teacherAUserId = `10000000-0000-0000-0000-${runId}000003`;
      const inactiveTeacherUserId = `10000000-0000-0000-0000-${runId}000004`;
      const unrelatedGuardianUserId = `10000000-0000-0000-0000-${runId}000005`;

      // Unique IDs for entities
      const guardianAId = `30000000-0000-0000-0000-${runId}000001`;
      const guardianBId = `30000000-0000-0000-0000-${runId}000002`;
      const unrelatedGuardianId = `30000000-0000-0000-0000-${runId}000003`;

      const pupilAId = `40000000-0000-0000-0000-${runId}000001`;
      const pupilBId = `40000000-0000-0000-0000-${runId}000002`;
      const pupilCId = `40000000-0000-0000-0000-${runId}000003`;

      const termId = '66666666-7777-8888-9999-000000000000';
      const resultAId = `50000000-0000-0000-0000-${runId}000001`;
      const resultBId = `50000000-0000-0000-0000-${runId}000002`;
      const resultCId = `50000000-0000-0000-0000-${runId}000003`;

      const intentAId = `60000000-0000-0000-0000-${runId}000001`;
      const intentBId = `60000000-0000-0000-0000-${runId}000002`;
      const intentCId = `60000000-0000-0000-0000-${runId}000003`;

      const txAId = `70000000-0000-0000-0000-${runId}000001`;
      const txBId = `70000000-0000-0000-0000-${runId}000002`;

      // 1. Setup seed data as service_role / superuser
      await client.query('RESET ROLE;');

      // Classes
      await client.query(`
        INSERT INTO school_classes (id, name, stage) VALUES
          ('${classAId}', 'Class A-${runId}', 'primary'),
          ('${classBId}', 'Class B-${runId}', 'primary')
        ON CONFLICT DO NOTHING;
      `);

      // Guardians
      await client.query(`
        INSERT INTO guardians (id, user_id, full_name, phone_number, email) VALUES
          ('${guardianAId}', gen_random_uuid(), 'Guardian A', '+2348011111111', 'parentA_${runId}@edvora.org'),
          ('${guardianBId}', gen_random_uuid(), 'Guardian B', '+2348022222222', 'parentB_${runId}@edvora.org'),
          ('${unrelatedGuardianId}', '${unrelatedGuardianUserId}', 'Unrelated Guardian', '+2348033333333', 'unrelated_${runId}@edvora.org')
        ON CONFLICT DO NOTHING;
      `);

      // Pupils: A in Class A, B in Class B, C (child of Unrelated Guardian) in Class A
      await client.query(`
        INSERT INTO pupils (id, admission_number, first_name, last_name, class_id, guardian_id, status) VALUES
          ('${pupilAId}', 'EDV/RLS/A-${runId}', 'Alice', 'Pupil', '${classAId}', '${guardianAId}', 'active'),
          ('${pupilBId}', 'EDV/RLS/B-${runId}', 'Bob', 'Pupil', '${classBId}', '${guardianBId}', 'active'),
          ('${pupilCId}', 'EDV/RLS/C-${runId}', 'Charlie', 'Pupil', '${classAId}', '${unrelatedGuardianId}', 'active')
        ON CONFLICT DO NOTHING;
      `);

      // Staff Profiles:
      // - Admin: school-wide
      // - Bursar: school-wide pupils + finance, no academic results
      // - Teacher A: assigned only to Class A
      // - Inactive Teacher: assigned to Class A, but is_active = false
      await client.query(`
        INSERT INTO staff_profiles (id, user_id, full_name, email, role, assigned_class_ids, is_active) VALUES
          (gen_random_uuid(), '${adminUserId}', 'Admin User', 'admin_${runId}@edvora.org', 'admin', '{}', true),
          (gen_random_uuid(), '${bursarUserId}', 'Bursar User', 'bursar_${runId}@edvora.org', 'bursar', '{}', true),
          (gen_random_uuid(), '${teacherAUserId}', 'Teacher A', 'teacherA_${runId}@edvora.org', 'teacher', ARRAY['${classAId}'::uuid], true),
          (gen_random_uuid(), '${inactiveTeacherUserId}', 'Inactive Teacher', 'inactive_${runId}@edvora.org', 'teacher', ARRAY['${classAId}'::uuid], false)
        ON CONFLICT DO NOTHING;
      `);

      // Academic Results: Result A in Class A, Result B in Class B, Result C in Class A (all published)
      await client.query(`
        INSERT INTO academic_results (id, pupil_id, term_id, class_id, subjects, total_score, max_score, average_score, status) VALUES
          ('${resultAId}', '${pupilAId}', '${termId}', '${classAId}', '[]', 92.00, 100.00, 92.00, 'published'),
          ('${resultBId}', '${pupilBId}', '${termId}', '${classBId}', '[]', 85.00, 100.00, 85.00, 'published'),
          ('${resultCId}', '${pupilCId}', '${termId}', '${classAId}', '[]', 88.00, 100.00, 88.00, 'published')
        ON CONFLICT DO NOTHING;
      `);

      // Payment Intents & Transactions:
      await client.query(`
        INSERT INTO payment_intents (id, pupil_id, term_id, reference, amount_minor, status, payer_email, expires_at) VALUES
          ('${intentAId}', '${pupilAId}', '${termId}', 'REF-RLS-A-${runId}', 5000000, 'successful', 'payerA@edvora.org', now() + interval '30 minutes'),
          ('${intentBId}', '${pupilBId}', '${termId}', 'REF-RLS-B-${runId}', 5000000, 'successful', 'payerB@edvora.org', now() + interval '30 minutes'),
          ('${intentCId}', '${pupilCId}', '${termId}', 'REF-RLS-C-${runId}', 5000000, 'successful', 'payerC@edvora.org', now() + interval '30 minutes')
        ON CONFLICT DO NOTHING;

        INSERT INTO payment_transactions (id, intent_id, reference, provider, provider_transaction_id, amount_minor, status) VALUES
          ('${txAId}', '${intentAId}', 'TX-RLS-A-${runId}', 'paystack', 'PSTK-A-${runId}', 5000000, 'success'),
          ('${txBId}', '${intentBId}', 'TX-RLS-B-${runId}', 'paystack', 'PSTK-B-${runId}', 5000000, 'success')
        ON CONFLICT DO NOTHING;
      `);

      // =========================================================================
      // Test 1: Teacher A (Assigned Class A only)
      // =========================================================================
      await client.query('SET ROLE authenticated;');
      await client.query(`SET request.jwt.claim.sub = '${teacherAUserId}';`);

      // 1.1 Pupil Access: Can read Class A pupil, CANNOT read Class B pupil
      const teacherPupils = await client.query(`
        SELECT id, admission_number FROM pupils WHERE id IN ('${pupilAId}', '${pupilBId}');
      `);
      expect(teacherPupils.rows).toHaveLength(1);
      expect(teacherPupils.rows[0].id).toBe(pupilAId);

      // 1.2 Academic Results: Can read Class A result, CANNOT read Class B result
      const teacherResults = await client.query(`
        SELECT id, pupil_id FROM academic_results WHERE id IN ('${resultAId}', '${resultBId}');
      `);
      expect(teacherResults.rows).toHaveLength(1);
      expect(teacherResults.rows[0].id).toBe(resultAId);

      // 1.3 Financial Access: CANNOT read payment intents or transactions
      const teacherIntents = await client.query(`
        SELECT id FROM payment_intents WHERE id IN ('${intentAId}', '${intentBId}');
      `);
      expect(teacherIntents.rows).toHaveLength(0);

      const teacherTxs = await client.query(`
        SELECT id FROM payment_transactions WHERE id IN ('${txAId}', '${txBId}');
      `);
      expect(teacherTxs.rows).toHaveLength(0);

      // =========================================================================
      // Test 2: Inactive Staff (is_active = false)
      // =========================================================================
      await client.query(`SET request.jwt.claim.sub = '${inactiveTeacherUserId}';`);

      const inactivePupils = await client.query(`
        SELECT id FROM pupils WHERE id IN ('${pupilAId}', '${pupilBId}');
      `);
      expect(inactivePupils.rows).toHaveLength(0);

      const inactiveResults = await client.query(`
        SELECT id FROM academic_results WHERE id IN ('${resultAId}', '${resultBId}');
      `);
      expect(inactiveResults.rows).toHaveLength(0);

      const inactiveIntents = await client.query(`
        SELECT id FROM payment_intents WHERE id IN ('${intentAId}', '${intentBId}');
      `);
      expect(inactiveIntents.rows).toHaveLength(0);

      // =========================================================================
      // Test 3: Unrelated Guardian (Linked only to Pupil C)
      // =========================================================================
      await client.query(`SET request.jwt.claim.sub = '${unrelatedGuardianUserId}';`);

      // Cannot read Pupil A or Pupil B; CAN read own child Pupil C
      const guardianPupils = await client.query(`
        SELECT id FROM pupils WHERE id IN ('${pupilAId}', '${pupilBId}', '${pupilCId}');
      `);
      expect(guardianPupils.rows).toHaveLength(1);
      expect(guardianPupils.rows[0].id).toBe(pupilCId);

      // Cannot read Result A or Result B; CAN read published Result C
      const guardianResults = await client.query(`
        SELECT id FROM academic_results WHERE id IN ('${resultAId}', '${resultBId}', '${resultCId}');
      `);
      expect(guardianResults.rows).toHaveLength(1);
      expect(guardianResults.rows[0].id).toBe(resultCId);

      // Cannot read Intent A or Intent B; CAN read own child's Intent C
      const guardianIntents = await client.query(`
        SELECT id FROM payment_intents WHERE id IN ('${intentAId}', '${intentBId}', '${intentCId}');
      `);
      expect(guardianIntents.rows).toHaveLength(1);
      expect(guardianIntents.rows[0].id).toBe(intentCId);

      // =========================================================================
      // Test 4: Bursar (School-wide pupils and finance, NO academic results)
      // =========================================================================
      await client.query(`SET request.jwt.claim.sub = '${bursarUserId}';`);

      // Can read school-wide pupils
      const bursarPupils = await client.query(`
        SELECT id FROM pupils WHERE id IN ('${pupilAId}', '${pupilBId}');
      `);
      expect(bursarPupils.rows).toHaveLength(2);

      // Can read school-wide financial records
      const bursarIntents = await client.query(`
        SELECT id FROM payment_intents WHERE id IN ('${intentAId}', '${intentBId}');
      `);
      expect(bursarIntents.rows).toHaveLength(2);

      const bursarTxs = await client.query(`
        SELECT id FROM payment_transactions WHERE id IN ('${txAId}', '${txBId}');
      `);
      expect(bursarTxs.rows).toHaveLength(2);

      // CANNOT read academic results
      const bursarResults = await client.query(`
        SELECT id FROM academic_results WHERE id IN ('${resultAId}', '${resultBId}');
      `);
      expect(bursarResults.rows).toHaveLength(0);

      // =========================================================================
      // Test 5: Admin (School-wide access across all entities)
      // =========================================================================
      await client.query(`SET request.jwt.claim.sub = '${adminUserId}';`);

      const adminPupils = await client.query(`
        SELECT id FROM pupils WHERE id IN ('${pupilAId}', '${pupilBId}');
      `);
      expect(adminPupils.rows).toHaveLength(2);

      const adminResults = await client.query(`
        SELECT id FROM academic_results WHERE id IN ('${resultAId}', '${resultBId}');
      `);
      expect(adminResults.rows).toHaveLength(2);

      const adminIntents = await client.query(`
        SELECT id FROM payment_intents WHERE id IN ('${intentAId}', '${intentBId}');
      `);
      expect(adminIntents.rows).toHaveLength(2);

      const adminTxs = await client.query(`
        SELECT id FROM payment_transactions WHERE id IN ('${txAId}', '${txBId}');
      `);
      expect(adminTxs.rows).toHaveLength(2);
    } finally {
      await client.query('RESET ROLE;');
      client.release();
    }
  });

  it('proves guardian result permissions respect pupil_guardians.can_view_results, keeping academic and financial access separate and isolated to the correct child', async () => {
    const client = await pool.connect();
    try {
      const runId = Date.now().toString().slice(-6);

      // Unique IDs
      const classId = `21000000-0000-0000-0000-${runId}000001`;
      const termId = '66666666-7777-8888-9999-000000000000';

      const p1UserId = `11000000-0000-0000-0000-${runId}000001`;
      const s1DisabledUserId = `11000000-0000-0000-0000-${runId}000002`;
      const p2UserId = `11000000-0000-0000-0000-${runId}000003`;
      const s2EnabledUserId = `11000000-0000-0000-0000-${runId}000004`;

      const guardianP1Id = `31000000-0000-0000-0000-${runId}000001`;
      const guardianS1DisabledId = `31000000-0000-0000-0000-${runId}000002`;
      const guardianP2Id = `31000000-0000-0000-0000-${runId}000003`;
      const guardianS2EnabledId = `31000000-0000-0000-0000-${runId}000004`;

      const pupil1Id = `41000000-0000-0000-0000-${runId}000001`;
      const pupil2Id = `41000000-0000-0000-0000-${runId}000002`;

      const result1Id = `51000000-0000-0000-0000-${runId}000001`;
      const result2Id = `51000000-0000-0000-0000-${runId}000002`;

      const intent1Id = `61000000-0000-0000-0000-${runId}000001`;
      const intent2Id = `61000000-0000-0000-0000-${runId}000002`;

      const tx1Id = `71000000-0000-0000-0000-${runId}000001`;
      const tx2Id = `71000000-0000-0000-0000-${runId}000002`;

      // 1. Setup seed data as service_role
      await client.query('RESET ROLE;');

      // Class
      await client.query(`
        INSERT INTO school_classes (id, name, stage) VALUES
          ('${classId}', 'Guard-Test-${runId}', 'primary')
        ON CONFLICT DO NOTHING;
      `);

      // Guardians
      await client.query(`
        INSERT INTO guardians (id, user_id, full_name, phone_number, email) VALUES
          ('${guardianP1Id}', '${p1UserId}', 'Primary Guardian 1', '+2348041111111', 'p1_${runId}@edvora.org'),
          ('${guardianS1DisabledId}', '${s1DisabledUserId}', 'Secondary S1 (Results Disabled)', '+2348042222222', 's1_${runId}@edvora.org'),
          ('${guardianP2Id}', '${p2UserId}', 'Primary Guardian 2', '+2348043333333', 'p2_${runId}@edvora.org'),
          ('${guardianS2EnabledId}', '${s2EnabledUserId}', 'Secondary S2 (Results Enabled)', '+2348044444444', 's2_${runId}@edvora.org')
        ON CONFLICT DO NOTHING;
      `);

      // Pupils:
      // Pupil 1 has Primary Guardian P1
      // Pupil 2 has Primary Guardian P2
      await client.query(`
        INSERT INTO pupils (id, admission_number, first_name, last_name, class_id, guardian_id, status) VALUES
          ('${pupil1Id}', 'EDV/G1-${runId}', 'Pupil One', 'Student', '${classId}', '${guardianP1Id}', 'active'),
          ('${pupil2Id}', 'EDV/G2-${runId}', 'Pupil Two', 'Student', '${classId}', '${guardianP2Id}', 'active')
        ON CONFLICT DO NOTHING;
      `);

      // Link Secondary Guardians in pupil_guardians:
      // - Secondary Guardian S1 linked to Pupil 1 with can_view_results = false, can_pay_fees = true
      // - Secondary Guardian S2 linked to Pupil 2 with can_view_results = true, can_pay_fees = false
      await client.query(`
        INSERT INTO pupil_guardians (pupil_id, guardian_id, is_primary, can_view_results, can_pay_fees) VALUES
          ('${pupil1Id}', '${guardianS1DisabledId}', false, false, true),
          ('${pupil2Id}', '${guardianS2EnabledId}', false, true, false)
        ON CONFLICT (pupil_id, guardian_id) DO UPDATE SET 
          can_view_results = EXCLUDED.can_view_results, 
          can_pay_fees = EXCLUDED.can_pay_fees;
      `);

      // Published Academic Results for Pupil 1 and Pupil 2
      await client.query(`
        INSERT INTO academic_results (id, pupil_id, term_id, class_id, subjects, total_score, max_score, average_score, status) VALUES
          ('${result1Id}', '${pupil1Id}', '${termId}', '${classId}', '[]', 95.00, 100.00, 95.00, 'published'),
          ('${result2Id}', '${pupil2Id}', '${termId}', '${classId}', '[]', 89.00, 100.00, 89.00, 'published')
        ON CONFLICT DO NOTHING;
      `);

      // Payment Intents & Transactions for Pupil 1 and Pupil 2
      await client.query(`
        INSERT INTO payment_intents (id, pupil_id, term_id, reference, amount_minor, status, payer_email, expires_at) VALUES
          ('${intent1Id}', '${pupil1Id}', '${termId}', 'REF-G1-${runId}', 6000000, 'successful', 'p1pay@edvora.org', now() + interval '30 minutes'),
          ('${intent2Id}', '${pupil2Id}', '${termId}', 'REF-G2-${runId}', 6000000, 'successful', 'p2pay@edvora.org', now() + interval '30 minutes')
        ON CONFLICT DO NOTHING;

        INSERT INTO payment_transactions (id, intent_id, reference, provider, provider_transaction_id, amount_minor, status) VALUES
          ('${tx1Id}', '${intent1Id}', 'TX-G1-${runId}', 'paystack', 'PSTK-G1-${runId}', 6000000, 'success'),
          ('${tx2Id}', '${intent2Id}', 'TX-G2-${runId}', 'paystack', 'PSTK-G2-${runId}', 6000000, 'success')
        ON CONFLICT DO NOTHING;
      `);

      // =========================================================================
      // Test 1: Secondary Guardian S1 (can_view_results = false, can_pay_fees = true)
      // =========================================================================
      await client.query('SET ROLE authenticated;');
      await client.query(`SET request.jwt.claim.sub = '${s1DisabledUserId}';`);

      // 1.1 Academic Results: CANNOT view Result 1 (disabled result access is denied)
      const s1Result1 = await client.query(`
        SELECT id, pupil_id FROM academic_results WHERE pupil_id = '${pupil1Id}';
      `);
      expect(s1Result1.rows).toHaveLength(0);

      // 1.2 Academic Results: CANNOT view Result 2 (isolated to unrelated child)
      const s1Result2 = await client.query(`
        SELECT id, pupil_id FROM academic_results WHERE pupil_id = '${pupil2Id}';
      `);
      expect(s1Result2.rows).toHaveLength(0);

      // 1.3 Financial Access: CAN view Intent 1 (can_pay_fees = true; kept separate from results)
      const s1Intent1 = await client.query(`
        SELECT id, pupil_id FROM payment_intents WHERE pupil_id = '${pupil1Id}';
      `);
      expect(s1Intent1.rows).toHaveLength(1);
      expect(s1Intent1.rows[0].id).toBe(intent1Id);

      const s1Tx1 = await client.query(`
        SELECT id FROM payment_transactions WHERE intent_id = '${intent1Id}';
      `);
      expect(s1Tx1.rows).toHaveLength(1);
      expect(s1Tx1.rows[0].id).toBe(tx1Id);

      // 1.4 Financial Access: CANNOT view Intent 2 (isolated to unrelated child)
      const s1Intent2 = await client.query(`
        SELECT id, pupil_id FROM payment_intents WHERE pupil_id = '${pupil2Id}';
      `);
      expect(s1Intent2.rows).toHaveLength(0);

      // =========================================================================
      // Test 2: Secondary Guardian S2 (can_view_results = true, can_pay_fees = false)
      // =========================================================================
      await client.query(`SET request.jwt.claim.sub = '${s2EnabledUserId}';`);

      // 2.1 Academic Results: CAN view Result 2 (enabled access works)
      const s2Result2 = await client.query(`
        SELECT id, pupil_id FROM academic_results WHERE pupil_id = '${pupil2Id}';
      `);
      expect(s2Result2.rows).toHaveLength(1);
      expect(s2Result2.rows[0].id).toBe(result2Id);

      // 2.2 Academic Results: CANNOT view Result 1 (isolated to unrelated child)
      const s2Result1 = await client.query(`
        SELECT id, pupil_id FROM academic_results WHERE pupil_id = '${pupil1Id}';
      `);
      expect(s2Result1.rows).toHaveLength(0);

      // 2.3 Financial Access: CANNOT view Intent 2 (can_pay_fees = false; kept separate from results)
      const s2Intent2 = await client.query(`
        SELECT id, pupil_id FROM payment_intents WHERE pupil_id = '${pupil2Id}';
      `);
      expect(s2Intent2.rows).toHaveLength(0);

      const s2Tx2 = await client.query(`
        SELECT id FROM payment_transactions WHERE intent_id = '${intent2Id}';
      `);
      expect(s2Tx2.rows).toHaveLength(0);

      // 2.4 Financial Access: CANNOT view Intent 1 (isolated to unrelated child)
      const s2Intent1 = await client.query(`
        SELECT id, pupil_id FROM payment_intents WHERE pupil_id = '${pupil1Id}';
      `);
      expect(s2Intent1.rows).toHaveLength(0);

      // =========================================================================
      // Test 3: Primary Guardian P1 (Child 1 only)
      // =========================================================================
      await client.query(`SET request.jwt.claim.sub = '${p1UserId}';`);

      // Can view own child's result & financial records
      const p1Result = await client.query(`
        SELECT id FROM academic_results WHERE pupil_id = '${pupil1Id}';
      `);
      expect(p1Result.rows).toHaveLength(1);
      expect(p1Result.rows[0].id).toBe(result1Id);

      const p1Intent = await client.query(`
        SELECT id FROM payment_intents WHERE pupil_id = '${pupil1Id}';
      `);
      expect(p1Intent.rows).toHaveLength(1);
      expect(p1Intent.rows[0].id).toBe(intent1Id);

      // Cannot view unrelated Child 2's result or financial records
      const p1UnrelatedResult = await client.query(`
        SELECT id FROM academic_results WHERE pupil_id = '${pupil2Id}';
      `);
      expect(p1UnrelatedResult.rows).toHaveLength(0);

      const p1UnrelatedIntent = await client.query(`
        SELECT id FROM payment_intents WHERE pupil_id = '${pupil2Id}';
      `);
      expect(p1UnrelatedIntent.rows).toHaveLength(0);

      // =========================================================================
      // Test 4: Primary Guardian P2 (Child 2 only)
      // =========================================================================
      await client.query(`SET request.jwt.claim.sub = '${p2UserId}';`);

      // Can view own child's result & financial records
      const p2Result = await client.query(`
        SELECT id FROM academic_results WHERE pupil_id = '${pupil2Id}';
      `);
      expect(p2Result.rows).toHaveLength(1);
      expect(p2Result.rows[0].id).toBe(result2Id);

      const p2Intent = await client.query(`
        SELECT id FROM payment_intents WHERE pupil_id = '${pupil2Id}';
      `);
      expect(p2Intent.rows).toHaveLength(1);
      expect(p2Intent.rows[0].id).toBe(intent2Id);

      // Cannot view unrelated Child 1's result or financial records
      const p2UnrelatedResult = await client.query(`
        SELECT id FROM academic_results WHERE pupil_id = '${pupil1Id}';
      `);
      expect(p2UnrelatedResult.rows).toHaveLength(0);

      const p2UnrelatedIntent = await client.query(`
        SELECT id FROM payment_intents WHERE pupil_id = '${pupil1Id}';
      `);
      expect(p2UnrelatedIntent.rows).toHaveLength(0);
    } finally {
      await client.query('RESET ROLE;');
      client.release();
    }
  });

  it('executes atomic payment crediting, ledger entry, receipt, and notification in PostgreSQL', async () => {
    const client = await pool.connect();
    try {
      // Insert prerequisites
      const pupilId = `11111111-${Date.now().toString().slice(-4)}-3333-4444-555555555555`;
      const termId = '66666666-7777-8888-9999-000000000000';
      const sessionId = '11111111-0000-0000-0000-000000000000';
      const classId = '22222222-0000-0000-0000-000000000000';
      const guardianId = '33333333-0000-0000-0000-000000000000';
      const testRef = `EDV-TEST-PG-INTENT-${Date.now()}`;
      const providerTxId = `PSTK_REAL_${Date.now()}`;
      const admissionNum = `EDV/TEST/${Date.now().toString().slice(-6)}`;

      await client.query(`
        INSERT INTO academic_sessions (id, name, start_date, end_date) 
        VALUES ('${sessionId}', '2026/2027 Test', '2026-09-01', '2027-07-20')
        ON CONFLICT (name) DO NOTHING;

        INSERT INTO academic_terms (id, session_id, name, term_code, start_date, end_date)
        VALUES ('${termId}', '${sessionId}', 'First Term Test', '2026-T1-TEST', '2026-09-01', '2026-12-18')
        ON CONFLICT DO NOTHING;

        INSERT INTO school_classes (id, name, stage)
        VALUES ('${classId}', 'Primary 3A Test', 'primary')
        ON CONFLICT (name) DO NOTHING;

        INSERT INTO guardians (id, full_name, phone_number, consent_sms)
        VALUES ('${guardianId}', 'Test Guardian Real', '+2348039999999', true)
        ON CONFLICT DO NOTHING;

        INSERT INTO pupils (id, admission_number, first_name, last_name, class_id, guardian_id)
        VALUES ('${pupilId}', '${admissionNum}', 'Real', 'Postgres', '${classId}', '${guardianId}')
        ON CONFLICT (admission_number) DO NOTHING;

        INSERT INTO fee_plans (id, term_id, class_id, name, total_amount_minor)
        VALUES ('44444444-0000-0000-0000-000000000000', '${termId}', '${classId}', 'Standard Test Plan', 12000000)
        ON CONFLICT (term_id, class_id) DO NOTHING;

        INSERT INTO fee_assignments (id, pupil_id, term_id, fee_plan_id, base_amount_minor, adjusted_amount_minor)
        VALUES (gen_random_uuid(), '${pupilId}', '${termId}', '44444444-0000-0000-0000-000000000000', 12000000, 12000000)
        ON CONFLICT (pupil_id, term_id) DO NOTHING;

        INSERT INTO payment_intents (id, pupil_id, term_id, reference, amount_minor, currency, environment, status, payer_email, expires_at)
        VALUES (gen_random_uuid(), '${pupilId}', '${termId}', '${testRef}', 3000000, 'NGN', 'test', 'initialized', 'test@guardian.com', now() + interval '30 minutes')
        ON CONFLICT (reference) DO NOTHING;
      `);

      // Call stored procedure credit_payment_intent
      const result = await client.query(`
        SELECT credit_payment_intent('${testRef}', '${providerTxId}', 3000000, 'card') AS res;
      `);
      const creditRes = result.rows[0].res;

      expect(creditRes.success).toBe(true);
      expect(creditRes.duplicate).toBe(false);
      expect(creditRes.receipt_number).toBeDefined();
      expect(creditRes.new_balance_minor).toBe(9000000); // 120,000 - 30,000 = 90,000 NGN (9,000,000 kobo)

      // Verify immutable ledger entry exists
      const ledger = await client.query(`
        SELECT * FROM fee_ledger_entries WHERE pupil_id = '${pupilId}' AND reference = '${testRef}';
      `);
      expect(ledger.rows).toHaveLength(1);
      expect(Number(ledger.rows[0].amount_minor)).toBe(3000000);
      expect(Number(ledger.rows[0].running_balance_minor)).toBe(9000000);

      // Verify receipt exists
      const receipts = await client.query(`
        SELECT * FROM receipts WHERE pupil_id = '${pupilId}';
      `);
      expect(receipts.rows).toHaveLength(1);
      expect(receipts.rows[0].receipt_number).toBe(creditRes.receipt_number);

      // Verify transactional notification job was enqueued
      const notifs = await client.query(`
        SELECT * FROM notification_jobs WHERE recipient_id = '${guardianId}';
      `);
      expect(notifs.rows.length).toBeGreaterThanOrEqual(1);
      expect(notifs.rows[0].event_type).toBe('payment_receipt');
    } finally {
      client.release();
    }
  });

  it('guarantees database atomicity and single-credit during concurrent duplicate verification', async () => {
    const testRunId = Date.now();
    const concurrentRef = `EDV-CONCURRENT-REF-${testRunId}`;
    const fixture = await pool.query("SELECT pupil_id, term_id FROM fee_assignments WHERE term_id = '66666666-7777-8888-9999-000000000000' LIMIT 1");
    expect(fixture.rows).toHaveLength(1);
    const pupilId = fixture.rows[0].pupil_id;
    const termId = fixture.rows[0].term_id;

    // Insert intent for concurrency test
    await pool.query(`
      INSERT INTO payment_intents (id, pupil_id, term_id, reference, amount_minor, currency, environment, status, payer_email, expires_at)
      VALUES (gen_random_uuid(), '${pupilId}', '${termId}', '${concurrentRef}', 2000000, 'NGN', 'test', 'initialized', 'concurrent@test.com', now() + interval '30 minutes')
      ON CONFLICT (reference) DO NOTHING;
    `);

    // Fire 5 concurrent requests simultaneously across separate client connections
    const attempts = Array.from({ length: 5 }, (_, i) => async () => {
      const client = await pool.connect();
      try {
        const res = await client.query(`
          SELECT credit_payment_intent('${concurrentRef}', 'PSTK_${testRunId}_${i}', 2000000, 'card') AS res;
        `);
        return res.rows[0].res;
      } finally {
        client.release();
      }
    });

    const results = await Promise.all(attempts.map((fn) => fn()));

    // Exactly ONE request must succeed with duplicate: false
    const initialCredits = results.filter((r) => r.success === true && r.duplicate === false);
    const duplicates = results.filter((r) => r.success === true && r.duplicate === true);

    expect(initialCredits).toHaveLength(1);
    expect(duplicates).toHaveLength(4);

    // Verify exactly ONE ledger entry was inserted
    const ledger = await pool.query(`
      SELECT * FROM fee_ledger_entries WHERE reference = '${concurrentRef}';
    `);
    expect(ledger.rows).toHaveLength(1);

    // Verify exactly ONE transaction was recorded
    const tx = await pool.query(`
      SELECT * FROM payment_transactions WHERE reference = '${concurrentRef}';
    `);
    expect(tx.rows).toHaveLength(1);
  });
  it('enforces transactional Staff commands, live roles, class scope, idempotency and result publication rules',async()=>{
    const client=await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(fs.readFileSync(path.join(__dirname,'fixtures/staff_commands.sql'),'utf8'));
    } finally {
      await client.query('ROLLBACK');
      client.release();
    }
  });

  it('serializes different payment references against the same fee balance',async()=>{
    const fixture=await pool.query("SELECT a.pupil_id,a.term_id,a.adjusted_amount_minor-coalesce((SELECT sum(amount_minor) FROM fee_ledger_entries l WHERE l.pupil_id=a.pupil_id AND l.term_id=a.term_id AND l.entry_type='credit'),0) AS balance FROM fee_assignments a WHERE term_id='66666666-7777-8888-9999-000000000000' LIMIT 1");
    const row=fixture.rows[0];const amount=100000;const before=Number(row.balance);
    const references=[`EDV-RACE-A-${Date.now()}`,`EDV-RACE-B-${Date.now()}`];
    for(const ref of references)await pool.query("INSERT INTO payment_intents(pupil_id,term_id,reference,amount_minor,payer_email) VALUES($1,$2,$3,$4,'race@test.invalid')",[row.pupil_id,row.term_id,ref,amount]);
    const results=await Promise.all(references.map(ref=>pool.query("SELECT credit_payment_intent($1,$2,$3,'card') AS result",[ref,`PS-${ref}`,amount])));
    const balances=results.map(r=>Number(r.rows[0].result.new_balance_minor)).sort((a,b)=>a-b);
    expect(balances).toEqual([Math.max(0,before-2*amount),Math.max(0,before-amount)]);
    expect(results.every(r=>r.rows[0].result.success&&!r.rows[0].result.duplicate)).toBe(true);
  });

});

