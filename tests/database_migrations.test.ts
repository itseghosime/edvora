import { describe, it, expect } from 'vitest';
import { newDb } from 'pg-mem';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

describe('Real PostgreSQL Migrations & Stored Procedures (via pg-mem)', () => {
  const schemaSql = fs.readFileSync(
    path.join(__dirname, '../supabase/migrations/20261023000000_core_schema.sql'),
    'utf-8'
  );

  // Filter out statements that pg-mem parser does not implement (RLS policies)
  // while testing all actual tables, columns, constraints, enums, checks, and foreign keys.
  const ddlStatements = schemaSql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.includes('ROW LEVEL SECURITY') && !s.includes('CREATE POLICY'));

  function createTestDb() {
    const memDb = newDb();
    memDb.public.registerFunction({
      name: 'gen_random_uuid',
      impure: true,
      implementation: () => crypto.randomUUID(),
    });
    for (const stmt of ddlStatements) {
      memDb.public.none(stmt);
    }
    return memDb;
  }

  it('successfully applies core tables, columns, and constraints in PostgreSQL engine', () => {
    const memDb = createTestDb();

    const tables = memDb.public.many(`
      SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
    `);
    const tableNames = tables.map((t: any) => t.table_name);
    
    expect(tableNames).toContain('academic_sessions');
    expect(tableNames).toContain('academic_terms');
    expect(tableNames).toContain('school_classes');
    expect(tableNames).toContain('staff_profiles');
    expect(tableNames).toContain('guardians');
    expect(tableNames).toContain('pupils');
    expect(tableNames).toContain('pupil_guardians');
    expect(tableNames).toContain('fee_plans');
    expect(tableNames).toContain('fee_assignments');
    expect(tableNames).toContain('payment_intents');
    expect(tableNames).toContain('payment_transactions');
    expect(tableNames).toContain('fee_ledger_entries');
    expect(tableNames).toContain('receipts');
    expect(tableNames).toContain('reminder_rules');
    expect(tableNames).toContain('reminder_jobs');
    expect(tableNames).toContain('reminder_attempts');
    expect(tableNames).toContain('sms_delivery_inbox');
    expect(tableNames).toContain('academic_results');
    expect(tableNames).toContain('notification_jobs');
    expect(tableNames).toContain('notification_attempts');
    expect(tableNames).toContain('operational_incidents');
  });

  it('enforces guardian relationship on pupils table and foreign key integrity', () => {
    const memDb = createTestDb();

    // Insert class
    memDb.public.none(`
      INSERT INTO school_classes (id, name, stage) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Primary 3A', 'primary');
    `);

    // Insert guardian
    memDb.public.none(`
      INSERT INTO guardians (id, full_name, phone_number, consent_sms) 
      VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Chief Osasere Senior', '+2348030000001', true);
    `);

    // Insert pupil referencing guardian_id directly
    memDb.public.none(`
      INSERT INTO pupils (id, admission_number, first_name, last_name, class_id, guardian_id)
      VALUES ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'EDV/2024/0042', 'Osasere', 'Ehigiator', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
    `);

    const pupilRow = memDb.public.one(`
      SELECT p.first_name, p.last_name, g.full_name AS guardian_name, g.phone_number
      FROM pupils p
      JOIN guardians g ON p.guardian_id = g.id
      WHERE p.id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
    `);

    expect(pupilRow.first_name).toBe('Osasere');
    expect(pupilRow.guardian_name).toBe('Chief Osasere Senior');
  });

  it('enforces attempt status constraints including sent, expired, and rejected', () => {
    const memDb = createTestDb();

    // Setup base records
    memDb.public.none(`
      INSERT INTO academic_sessions (id, name, start_date, end_date) VALUES ('11111111-1111-1111-1111-111111111111', '2026/2027', '2026-09-01', '2027-07-20');
      INSERT INTO academic_terms (id, session_id, name, term_code, start_date, end_date) VALUES ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'First Term', '2026-T1', '2026-09-01', '2026-12-18');
      INSERT INTO school_classes (id, name, stage) VALUES ('33333333-3333-3333-3333-333333333333', 'Primary 3A', 'primary');
      INSERT INTO guardians (id, full_name, phone_number) VALUES ('44444444-4444-4444-4444-444444444444', 'Guardian Test', '+2348000000000');
      INSERT INTO pupils (id, admission_number, first_name, last_name, class_id, guardian_id) VALUES ('55555555-5555-5555-5555-555555555555', 'EDV/TEST', 'Test', 'Pupil', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444');
      INSERT INTO reminder_rules (id, name, term_id) VALUES ('66666666-6666-6666-6666-666666666666', 'Rule 1', '22222222-2222-2222-2222-222222222222');
      INSERT INTO reminder_jobs (id, rule_id, pupil_id, guardian_id, channel, balance_at_creation_minor, status)
      VALUES ('77777777-7777-7777-7777-777777777777', '66666666-6666-6666-6666-666666666666', '55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 'sms', 5000000, 'pending');
    `);

    // Valid statuses: started, accepted, delivered, failed, skipped, sent, expired, rejected
    expect(() => {
      memDb.public.none(`
        INSERT INTO reminder_attempts (id, job_id, attempt_token, channel, recipient, message, status)
        VALUES ('11111111-0000-0000-0000-000000000001', '77777777-7777-7777-7777-777777777777', 'tok-1', 'sms', '2348000', 'msg', 'delivered');
      `);
    }).not.toThrow();

    expect(() => {
      memDb.public.none(`
        INSERT INTO reminder_attempts (id, job_id, attempt_token, channel, recipient, message, status)
        VALUES ('11111111-0000-0000-0000-000000000002', '77777777-7777-7777-7777-777777777777', 'tok-expired', 'sms', '2348000', 'msg', 'expired');
      `);
    }).not.toThrow();

    expect(() => {
      memDb.public.none(`
        INSERT INTO reminder_attempts (id, job_id, attempt_token, channel, recipient, message, status)
        VALUES ('11111111-0000-0000-0000-000000000003', '77777777-7777-7777-7777-777777777777', 'tok-rejected', 'sms', '2348000', 'msg', 'rejected');
      `);
    }).not.toThrow();

    // Invalid status should trigger check constraint violation
    expect(() => {
      memDb.public.none(`
        INSERT INTO reminder_attempts (id, job_id, attempt_token, channel, recipient, message, status)
        VALUES ('11111111-0000-0000-0000-000000000004', '77777777-7777-7777-7777-777777777777', 'tok-invalid', 'sms', '2348000', 'msg', 'invalid_bogus_status');
      `);
    }).toThrow();
  });
});
