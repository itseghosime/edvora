import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Client, Pool } from 'pg';
import fs from 'fs';
import path from 'path';

describe('Real PostgreSQL 18 Integration: Migrations, RLS, Stored Functions & Concurrency', () => {
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

  beforeAll(async () => {
    // Connect to postgres server and setup test database
    pool = new Pool({ connectionString });
    const client = await pool.connect();
    try {
      // Create Supabase roles if not present
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

      // Apply migrations
      await client.query(schemaSql);
      await client.query(functionsSql);
    } finally {
      client.release();
    }
  });

  afterAll(async () => {
    await pool.end();
  });

  it('verifies that core schema tables and functions exist in PostgreSQL', async () => {
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
    const pupilId = '11111111-2222-3333-4444-555555555555';
    const termId = '66666666-7777-8888-9999-000000000000';

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
});
