import { describe, it, expect, beforeAll,vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as publishRoute } from '../src/app/api/results/publish/route';
import { POST as remindersClaimRoute } from '../src/app/api/automation/reminders/claim/route';
import { POST as authLoginRoute } from '../src/app/api/auth/login/route';
import { POST as termiiWebhookRoute } from '../src/app/api/webhooks/termii/route';
import { createSessionToken } from '../src/lib/auth/session';
import { db } from '../src/lib/db/supabaseRepository';
import { config } from '../src/lib/config';

describe('Route-Level Authorization & Security Boundaries', () => {
  beforeAll(() => {
    config.automationServiceKey = 'test_automation_service_key_valid_2026';
    config.termii.webhookSecret = 'test_termii_webhook_secret_2026';
  });
  const bursarToken = createSessionToken({
    type: 'staff',
    userId: '44444444-4444-4444-4444-000000000002',
    staffId: '44444444-4444-4444-4444-000000000002',
    role: 'bursar',
    email: 'bursar@edvora.edu.ng',
    name: 'Mr. Jude Okafor',
    assignedClassIds: [],
  });

  const adminToken = createSessionToken({
    type: 'staff',
    userId: '44444444-4444-4444-4444-000000000001',
    staffId: '44444444-4444-4444-4444-000000000001',
    role: 'admin',
    email: 'admin@edvora.edu.ng',
    name: 'Dr. Stella Efe',
    assignedClassIds: [],
  });

  it('blocks Bursars from publishing results at the API route level', async () => {
    const req = new NextRequest('http://localhost:3000/api/results/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bursarToken}`,
      },
      body: JSON.stringify({
        resultId: 'dddddddd-dddd-dddd-dddd-000000000001',
        status: 'published',
      }),
    });

    const res = await publishRoute(req);
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toMatch(/Forbidden|Bursars|not permitted/i);
  });

  it('allows School Administrators to publish results at the API route level', async () => {
    const req = new NextRequest('http://localhost:3000/api/results/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        resultId: 'dddddddd-dddd-dddd-dddd-000000000001',
        status: 'published',
      }),
    });

    const res = await publishRoute(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.result.status).toBe('published');
  });

  it('rejects unauthenticated automation requests missing Bearer tokens', async () => {
    const req = new NextRequest('http://localhost:3000/api/automation/reminders/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit: 10 }),
    });

    const res = await remindersClaimRoute(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toMatch(/Unauthorized/i);
  });

  it('accepts valid automation service Bearer credentials', async () => {
    vi.spyOn(db,'claimReminderJobs').mockResolvedValueOnce([]);
    const req = new NextRequest('http://localhost:3000/api/automation/reminders/claim', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.automationServiceKey}`,
      },
      body: JSON.stringify({ limit: 10 }),
    });

    const res = await remindersClaimRoute(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.jobs).toBeDefined();
  });

  it('rejects invalid student login admission numbers', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'student',
        admissionNumber: 'NON_EXISTENT_ID',
        dateOfBirth: '2020-01-01',
      }),
    });

    const res = await authLoginRoute(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toMatch(/password/i);
  });

  it('rejects unauthenticated Termii webhook delivery reports before persistence', async () => {
    const req = new NextRequest('http://localhost:3000/api/webhooks/termii', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message_id: 'forged_termii_msg_999',
        status: 'delivered',
      }),
    });

    const res = await termiiWebhookRoute(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    // Must NOT be marked authenticated
    expect(json.error).toMatch(/authentication failed/i);
  });
});


