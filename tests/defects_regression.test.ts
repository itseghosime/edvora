import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { NextRequest } from 'next/server';
import { createSessionToken } from '../src/lib/auth/session';
import { POST as loginRoute } from '../src/app/api/auth/login/route';
import { POST as publishRoute } from '../src/app/api/results/publish/route';
import { POST as adjustFeeRoute } from '../src/app/api/fees/adjust/route';
import { GET as pupilsGetRoute, POST as pupilsPostRoute } from '../src/app/api/pupils/route';
import { POST as paymentsInitRoute } from '../src/app/api/payments/initialize/route';
import { POST as paymentsVerifyRoute } from '../src/app/api/payments/verify/route';
import { initializePayment, verifyPayment, processPaystackWebhookEvent } from '../src/lib/services/paymentsService';
import { mapTermiiProviderStatus, canTransitionAttemptStatus } from '../src/lib/services/smsStatus';
import { store } from '../src/lib/db/store';
import { db } from '../src/lib/db/supabaseRepository';
import { config } from '../src/lib/config';
import * as supabaseClientModule from '../src/lib/supabase/client';

describe('Codex Defect Regressions', () => {
  beforeAll(() => {
    config.paystack.secretKey = 'sk_test_mock_paystack_secret_2026';
    config.automationServiceKey = 'test_automation_service_key_2026';
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });
  const pupilId = '77777777-7777-7777-7777-000000000001'; // Osasere Ehigiator
  const termId = '22222222-2222-2222-2222-222222222222';
  const adminStaffId = '44444444-4444-4444-4444-000000000001';
  const bursarStaffId = '44444444-4444-4444-4444-000000000002';
  const teacherStaffId = '44444444-4444-4444-4444-000000000003';

  // Tokens
  const adminToken = createSessionToken({
    type: 'staff',
    userId: adminStaffId,
    staffId: adminStaffId,
    role: 'admin',
    email: 'admin@edvora.edu.ng',
    name: 'Dr. Stella Efe',
    assignedClassIds: [],
  });

  const bursarToken = createSessionToken({
    type: 'staff',
    userId: bursarStaffId,
    staffId: bursarStaffId,
    role: 'bursar',
    email: 'bursar@edvora.edu.ng',
    name: 'Mr. Jude Okafor',
    assignedClassIds: [],
  });

  const teacherToken = createSessionToken({
    type: 'staff',
    userId: teacherStaffId,
    staffId: teacherStaffId,
    role: 'teacher',
    email: 'teacher.p3@edvora.edu.ng',
    name: 'Mrs. Linda Johnson',
    assignedClassIds: ['33333333-3333-3333-3333-000000000003'], // Primary 3A
  });

  const studentToken = createSessionToken({
    type: 'student',
    userId: pupilId,
    pupilId,
    admissionNumber: 'EDV/2024/0042',
    name: 'Osasere Ehigiator',
    className: 'Primary 3A',
    guardianId: 'g-001',
  });

  // ============================================================================
  // Defect 1: Verified Sessions & Client Spoofing Prevention
  // ============================================================================
  describe('1. Server-Side Verified Sessions & Client Spoofing Prevention', () => {
    it('rejects staff login with correct email but missing password with HTTP 401', async () => {
      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'staff',
          email: 'admin@edvora.ng',
        }),
      });

      const res = await loginRoute(req);
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toMatch(/Password is required/i);
    });

    it('fails closed with HTTP 503 if Supabase Auth is unavailable when verifying staff credentials', async () => {
      // Ensure Supabase admin client is unavailable
      vi.spyOn(supabaseClientModule, 'getSupabaseAdmin').mockReturnValue(null);

      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'staff',
          email: 'admin@edvora.ng',
          password: 'some_password',
        }),
      });

      const res = await loginRoute(req);
      expect(res.status).toBe(503);
      const json = await res.json();
      expect(json.error).toMatch(/Authentication service unavailable/i);
    });

    it('rejects staff login when Supabase Auth reports invalid credentials with HTTP 401', async () => {
      // Mock Supabase Auth returning invalid credentials error
      vi.spyOn(supabaseClientModule, 'getSupabaseAdmin').mockReturnValue({
        auth: {
          signInWithPassword: vi.fn().mockResolvedValue({
            error: { message: 'Invalid login credentials' },
            data: { user: null },
          }),
        },
      } as any);

      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'staff',
          email: 'admin@edvora.ng',
          password: 'arbitrary_incorrect_password',
        }),
      });

      const res = await loginRoute(req);
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toMatch(/Invalid staff credentials/i);
    });

    it('authenticates staff login when Supabase Auth verifies credentials and issues signed session cookie', async () => {
      // Mock Supabase Auth returning successful user authentication
      vi.spyOn(supabaseClientModule, 'getSupabaseAdmin').mockReturnValue({
        auth: {
          signInWithPassword: vi.fn().mockResolvedValue({
            error: null,
            data: { user: { id: adminStaffId, email: 'admin@edvora.ng' } },
          }),
        },
      } as any);

      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'staff',
          email: 'admin@edvora.ng',
          password: 'valid_secure_password',
        }),
      });

      const res = await loginRoute(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.user.role).toBe('admin');
      expect(json.token).toBeDefined();

      const cookieHeader = res.headers.get('set-cookie');
      expect(cookieHeader).toMatch(/edvora_session=/);
    });

    it('rejects student login with admission number alone when credentials (DOB) are missing with HTTP 401', async () => {
      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'student',
          admissionNumber: 'EDV/2024/0042',
        }),
      });

      const res = await loginRoute(req);
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toMatch(/Date of birth is required/i);
    });

    it('rejects student login if the persisted DOB is missing in school records with HTTP 401', async () => {
      // EDV/2025/0118 (Tamara Ehigiator) has no persisted dateOfBirth in records
      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'student',
          admissionNumber: 'EDV/2025/0118',
          dateOfBirth: '2019-06-20',
        }),
      });

      const res = await loginRoute(req);
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toMatch(/no registered date of birth/i);
    });

    it('rejects student login with arbitrary supplied date of birth not matching records with HTTP 401', async () => {
      // EDV/2024/0042 (Osasere) has DOB 2018-05-14; supplying arbitrary DOB must fail
      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'student',
          admissionNumber: 'EDV/2024/0042',
          dateOfBirth: '2021-12-31', // Arbitrary non-matching DOB
        }),
      });

      const res = await loginRoute(req);
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toMatch(/Date of birth does not match/i);
    });

    it('rejects student login for inactive or withdrawn pupils with HTTP 403', async () => {
      // EDV/2023/0099 (Chinedu Okeke) has status: 'withdrawn'
      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'student',
          admissionNumber: 'EDV/2023/0099',
          dateOfBirth: '2017-03-21',
        }),
      });

      const res = await loginRoute(req);
      expect(res.status).toBe(403);
      const json = await res.json();
      expect(json.error).toMatch(/withdrawn|inactive/i);
    });

    it('authenticates student login with valid admission number and matching date of birth', async () => {
      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'student',
          admissionNumber: 'EDV/2024/0042',
          dateOfBirth: '2018-05-14', // Valid matching DOB
        }),
      });

      const res = await loginRoute(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.user.role).toBe('student');
      expect(json.token).toBeDefined();
    });

    it('rejects unauthenticated result publishing with HTTP 401 even if body contains actorRole: admin', async () => {
      const req = new NextRequest('http://localhost:3000/api/results/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resultId: 'dddddddd-dddd-dddd-dddd-000000000001',
          status: 'published',
          actorRole: 'admin', // Untrusted spoof attempt
          actorId: adminStaffId,
        }),
      });

      const res = await publishRoute(req);
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toMatch(/Authentication required/i);
    });

    it('rejects authenticated Bursar from publishing results with HTTP 403 even if client sends actorRole: admin', async () => {
      const req = new NextRequest('http://localhost:3000/api/results/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bursarToken}`,
        },
        body: JSON.stringify({
          resultId: 'dddddddd-dddd-dddd-dddd-000000000001',
          status: 'published',
          actorRole: 'admin', // Spoofed client param
        }),
      });

      const res = await publishRoute(req);
      expect(res.status).toBe(403);
      const json = await res.json();
      expect(json.error).toMatch(/Forbidden|not permitted/i);
    });

    it('allows verified Admin session to publish results', async () => {
      const req = new NextRequest('http://localhost:3000/api/results/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          resultId: 'dddddddd-dddd-dddd-dddd-000000000001',
          status: 'published',
          reason: 'Term results finalized and approved by Principal',
        }),
      });

      const res = await publishRoute(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.result.status).toBe('published');
    });

    it('rejects unauthenticated fee adjustments with HTTP 401', async () => {
      const req = new NextRequest('http://localhost:3000/api/fees/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: '55555555-5555-5555-5555-000000000001',
          amountMinor: 500000,
          adjustmentType: 'scholarship_discount',
          reason: 'Staff discount',
        }),
      });

      const res = await adjustFeeRoute(req);
      expect(res.status).toBe(401);
    });

    it('rejects teachers from adjusting fees with HTTP 403', async () => {
      const req = new NextRequest('http://localhost:3000/api/fees/adjust', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${teacherToken}`,
        },
        body: JSON.stringify({
          assignmentId: '55555555-5555-5555-5555-000000000001',
          amountMinor: 500000,
          adjustmentType: 'scholarship_discount',
          reason: 'Staff discount',
        }),
      });

      const res = await adjustFeeRoute(req);
      expect(res.status).toBe(403);
    });

    it('allows verified Bursar to adjust fees and derives authorizedBy strictly from server session', async () => {
      const req = new NextRequest('http://localhost:3000/api/fees/adjust', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bursarToken}`,
        },
        body: JSON.stringify({
          assignmentId: '88888888-8888-8888-8888-000000000001',
          amountMinor: 500000,
          adjustmentType: 'scholarship',
          reason: 'Academic scholarship approved',
          authorizedBy: 'spoofed_staff_id', // Must be ignored
        }),
      });

      const res = await adjustFeeRoute(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.adjustment.authorizedBy).toBe(bursarStaffId);
    });

    it('restricts student session from accessing other pupils in GET /api/pupils', async () => {
      const req = new NextRequest('http://localhost:3000/api/pupils', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${studentToken}`,
        },
      });

      const res = await pupilsGetRoute(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.pupils).toHaveLength(1);
      expect(json.pupils[0].id).toBe(pupilId);
      expect(json.pupils[0].admissionNumber).toBe('EDV/2024/0042');
    });

    it('prevents student session from initiating payments for other pupil IDs', async () => {
      const otherPupilId = '77777777-7777-7777-7777-000000000002';
      const req = new NextRequest('http://localhost:3000/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({
          pupilId: otherPupilId,
          termId,
          amountMinor: 1000000,
          payerEmail: 'other@test.com',
        }),
      });

      const res = await paymentsInitRoute(req);
      expect(res.status).toBe(403);
      const json = await res.json();
      expect(json.error).toMatch(/cannot initiate payment for another pupil/i);
    });
  });

  // ============================================================================
  // Defect 2: Removal of Assumed-Success & Offline Payment Fallbacks
  // ============================================================================
  describe('2. Removal of Assumed-Success & Offline Payment Fallbacks', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
      config.paystack.secretKey = 'sk_test_mock_paystack_secret_2026';
    });

    function mockPaystackVerify(verifyResponse: any) {
      vi.spyOn(global, 'fetch').mockImplementation(async (url: any) => {
        const urlStr = String(url);
        if (urlStr.includes('/initialize')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              status: true,
              data: {
                authorization_url: 'https://checkout.paystack.com/auth-mock-test',
                access_code: 'acc_mock_code_test',
              },
            }),
          } as any;
        }
        return typeof verifyResponse === 'function' ? verifyResponse(urlStr) : verifyResponse;
      });
    }

    it('fails checkout initialization explicitly when PAYSTACK_SECRET_KEY is unconfigured without returning local URL', async () => {
      config.paystack.secretKey = '';

      let initError: any;
      try {
        await initializePayment({
          pupilId,
          termId,
          amountMinor: 500000,
          payerEmail: 'test@edvora.edu.ng',
        });
      } catch (err: any) {
        initError = err;
      }

      expect(initError).toBeDefined();
      expect(initError.message).toMatch(/PAYSTACK_SECRET_KEY is required/i);
    });

    it('fails checkout initialization explicitly on provider HTTP errors without returning local URL', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ message: 'Paystack downstream unavailable' }),
      } as any);

      let initError: any;
      try {
        await initializePayment({
          pupilId,
          termId,
          amountMinor: 500000,
          payerEmail: 'test@edvora.edu.ng',
        });
      } catch (err: any) {
        initError = err;
      }

      expect(initError).toBeDefined();
      expect(initError.message).toMatch(/HTTP status 500/i);
    });

    it('fails checkout initialization explicitly on malformed provider response payloads', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ status: true, data: {} }), // Missing authorization_url & access_code
      } as any);

      let malformedError: any;
      try {
        await initializePayment({
          pupilId,
          termId,
          amountMinor: 500000,
          payerEmail: 'test@edvora.edu.ng',
        });
      } catch (err: any) {
        malformedError = err;
      }

      expect(malformedError).toBeDefined();
      expect(malformedError.message).toMatch(/missing authorization_url or access_code/i);
    });

    it('fails checkout initialization explicitly on timeout without returning fabricated access code', async () => {
      const timeoutErr = new Error('The operation was aborted due to timeout');
      timeoutErr.name = 'TimeoutError';
      vi.spyOn(global, 'fetch').mockRejectedValueOnce(timeoutErr);

      let timeoutFailure: any;
      try {
        await initializePayment({
          pupilId,
          termId,
          amountMinor: 500000,
          payerEmail: 'test@edvora.edu.ng',
        });
      } catch (err: any) {
        timeoutFailure = err;
      }

      expect(timeoutFailure).toBeDefined();
      expect(timeoutFailure.message).toMatch(/timed out/i);
    });

    it('never credits money if payment provider returns HTTP error during verification', async () => {
      mockPaystackVerify({
        ok: false,
        status: 500,
        json: async () => ({ status: false, message: 'Provider internal error' }),
      });

      const init = await initializePayment({
        pupilId,
        termId,
        amountMinor: 500000,
        payerEmail: 'test@edvora.edu.ng',
      });

      const beforeBalance = store.getAuthoritativeBalance(pupilId, termId);
      const verifyResult = await verifyPayment(init.reference);

      expect(verifyResult.success).toBe(false);
      expect(verifyResult.status).toBe('failed');
      expect(verifyResult.message).toMatch(/HTTP error: status 500/i);

      // Balance must NOT decrease
      const afterBalance = store.getAuthoritativeBalance(pupilId, termId);
      expect(afterBalance).toBe(beforeBalance);
    });

    it('never credits money if provider returns status other than success (e.g. abandoned, failed)', async () => {
      let currentRef = '';
      mockPaystackVerify(() => ({
        ok: true,
        status: 200,
        json: async () => ({
          status: true,
          data: {
            status: 'abandoned',
            reference: currentRef,
            amount: 500000,
            currency: 'NGN',
            domain: 'test',
          },
        }),
      }));

      const init = await initializePayment({
        pupilId,
        termId,
        amountMinor: 500000,
        payerEmail: 'test@edvora.edu.ng',
      });
      currentRef = init.reference;

      const beforeBalance = store.getAuthoritativeBalance(pupilId, termId);
      const verifyResult = await verifyPayment(init.reference);

      expect(verifyResult.success).toBe(false);
      expect(verifyResult.status).toBe('failed');
      expect(verifyResult.message).toMatch(/Transaction is not successful/i);

      expect(store.getAuthoritativeBalance(pupilId, termId)).toBe(beforeBalance);
    });

    it('rejects and refuses credit if paid amount does not match original intent (partial tampering)', async () => {
      let currentRef = '';
      mockPaystackVerify(() => ({
        ok: true,
        status: 200,
        json: async () => ({
          status: true,
          data: {
            status: 'success',
            reference: currentRef,
            amount: 100000, // Amount mismatch!
            currency: 'NGN',
            domain: 'test',
          },
        }),
      }));

      const init = await initializePayment({
        pupilId,
        termId,
        amountMinor: 2000000, // ₦20,000
        payerEmail: 'test@edvora.edu.ng',
      });
      currentRef = init.reference;

      const beforeBalance = store.getAuthoritativeBalance(pupilId, termId);
      const verifyResult = await verifyPayment(init.reference);

      expect(verifyResult.success).toBe(false);
      expect(verifyResult.status).toBe('failed');
      expect(verifyResult.message).toMatch(/Amount mismatch/i);

      expect(store.getAuthoritativeBalance(pupilId, termId)).toBe(beforeBalance);
    });

    it('rejects and refuses credit if provider domain is not test in test environment', async () => {
      let currentRef = '';
      mockPaystackVerify(() => ({
        ok: true,
        status: 200,
        json: async () => ({
          status: true,
          data: {
            status: 'success',
            reference: currentRef,
            amount: 500000,
            currency: 'NGN',
            domain: 'live', // Domain mismatch!
          },
        }),
      }));

      const init = await initializePayment({
        pupilId,
        termId,
        amountMinor: 500000,
        payerEmail: 'test@edvora.edu.ng',
      });
      currentRef = init.reference;

      const verifyResult = await verifyPayment(init.reference);
      expect(verifyResult.success).toBe(false);
      expect(verifyResult.message).toMatch(/Environment mismatch/i);
    });

    it('credits atomically and issues immutable receipt only when all invariants match', async () => {
      let currentRef = '';
      mockPaystackVerify(() => ({
        ok: true,
        status: 200,
        json: async () => ({
          status: true,
          data: {
            status: 'success',
            reference: currentRef,
            amount: 1000000,
            currency: 'NGN',
            domain: 'test',
            channel: 'card',
            id: 998877,
          },
        }),
      }));

      const init = await initializePayment({
        pupilId,
        termId,
        amountMinor: 1000000, // ₦10,000
        payerEmail: 'guardian.ehigiator@gmail.com',
      });
      currentRef = init.reference;

      const beforeBalance = store.getAuthoritativeBalance(pupilId, termId);

      const verifyResult = await verifyPayment(init.reference);
      expect(verifyResult.success).toBe(true);
      expect(verifyResult.amount_minor).toBe(1000000);
      expect(verifyResult.receipt_number).toBeDefined();

      const afterBalance = store.getAuthoritativeBalance(pupilId, termId);
      expect(afterBalance).toBe(beforeBalance - 1000000);
    });

    it('creates payment intent in database repository and verifies it through the real payments service without memory-store fallback', async () => {
      // 1. Create intent directly in persisted database repository
      const intent = await db.createPaymentIntent({
        pupilId,
        termId,
        amountMinor: 1500000, // ₦15,000
        payerEmail: 'guardian.ehigiator@gmail.com',
      });

      expect(intent.reference).toBeDefined();

      // Verify intent exists in database repository
      const dbIntent = await db.getPaymentIntentByReference(intent.reference);
      expect(dbIntent).not.toBeNull();
      expect(dbIntent?.amountMinor).toBe(1500000);

      const beforeBalance = await db.getAuthoritativeBalance(pupilId, termId);

      // Mock Paystack verification API
      vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          status: true,
          data: {
            status: 'success',
            reference: intent.reference,
            amount: 1500000,
            currency: 'NGN',
            domain: 'test',
            channel: 'bank_transfer',
            id: 889900,
          },
        }),
      } as any);

      // Verify payment through real service
      const verifyResult = await verifyPayment(intent.reference);
      expect(verifyResult.success).toBe(true);
      expect(verifyResult.amount_minor).toBe(1500000);
      expect(verifyResult.receipt_number).toBeDefined();

      // Verify that database repository reflects the credit
      const updatedIntent = await db.getPaymentIntentByReference(intent.reference);
      expect(updatedIntent?.status).toBe('successful');

      const afterBalance = await db.getAuthoritativeBalance(pupilId, termId);
      expect(afterBalance).toBe(beforeBalance - 1500000);
    });
  });

  // ============================================================================
  // Defect 3: Dynamic Notification Recipients & Consent Resolution
  // ============================================================================
  describe('3. Dynamic Notification Recipients & Consent Flags', () => {
    it('resolves actual guardian recipient and message without hardcoding 2348031234567', () => {
      // Create notification job for Osasere's guardian
      const job = {
        id: 'notif-job-test-01',
        eventType: 'payment_receipt' as const,
        sourceEventId: 'cccccccc-cccc-cccc-cccc-000000000001',
        recipientType: 'guardian' as const,
        recipientId: '66666666-6666-6666-6666-000000000001', // Dr. & Mrs. Ehigiator (+2348031234567)
        channel: 'sms' as const,
        status: 'claimed' as const,
        claimToken: 'tok-notif-01',
        claimedAt: new Date().toISOString(),
        leaseExpiresAt: new Date(Date.now() + 180000).toISOString(),
        retryCount: 0,
        createdAt: new Date().toISOString(),
      };
      store.notificationJobs.push(job);

      const authResult = store.authorizeNotification('notif-job-test-01', 'tok-notif-01');
      expect(authResult.authorized).toBe(true);
      expect(authResult.recipient).toBe('2348031234567');
      expect(authResult.message).toMatch(/Dr\. & Mrs\. Ehigiator/i);
      expect(authResult.message).toMatch(/REC-2026-0042/i);
      expect(authResult.consented).toBe(true);
    });

    it('skips notification job if guardian has revoked SMS consent', () => {
      const guardianWithoutConsent = {
        id: 'g-no-consent',
        fullName: 'Mr. Unconsented Guardian',
        phoneNumber: '+2348099999999',
        relationship: 'father',
        consentSms: false, // Revoked!
        consentTelegram: false,
        isActive: true,
      };
      store.guardians.push(guardianWithoutConsent as any);

      const job = {
        id: 'notif-job-no-consent',
        eventType: 'payment_receipt' as const,
        sourceEventId: 'cccccccc-cccc-cccc-cccc-000000000001',
        recipientType: 'guardian' as const,
        recipientId: 'g-no-consent',
        channel: 'sms' as const,
        status: 'claimed' as const,
        claimToken: 'tok-notif-02',
        claimedAt: new Date().toISOString(),
        leaseExpiresAt: new Date(Date.now() + 180000).toISOString(),
        retryCount: 0,
        createdAt: new Date().toISOString(),
      };
      store.notificationJobs.push(job);

      const authResult = store.authorizeNotification('notif-job-no-consent', 'tok-notif-02');
      expect(authResult.authorized).toBe(false);
      expect(authResult.reason).toMatch(/SMS consent not granted/i);
    });

    it('skips results_published notification if academic result has been withdrawn', () => {
      // Mark result as under_correction
      const result = store.academicResults[0];
      result.status = 'under_correction';

      const job = {
        id: 'notif-job-withdrawn-result',
        eventType: 'results_published' as const,
        sourceEventId: result.id,
        recipientType: 'guardian' as const,
        recipientId: '66666666-6666-6666-6666-000000000001',
        channel: 'sms' as const,
        status: 'claimed' as const,
        claimToken: 'tok-notif-03',
        claimedAt: new Date().toISOString(),
        leaseExpiresAt: new Date(Date.now() + 180000).toISOString(),
        retryCount: 0,
        createdAt: new Date().toISOString(),
      };
      store.notificationJobs.push(job);

      const authResult = store.authorizeNotification('notif-job-withdrawn-result', 'tok-notif-03');
      expect(authResult.authorized).toBe(false);
      expect(authResult.reason).toMatch(/Result is not published or has been withdrawn/i);

      // Restore status
      result.status = 'published';
    });
  });

  // ============================================================================
  // Defect 4: SMS Status Mapping & Terminal State Invariants
  // ============================================================================
  describe('4. SMS Explicit Status Mapping & Terminal State Machine', () => {
    it('correctly maps undelivered to failed without false match on deliver substring', () => {
      expect(mapTermiiProviderStatus('undelivered')).toBe('failed');
      expect(mapTermiiProviderStatus('DLR:undelivered')).toBe('failed');
      expect(mapTermiiProviderStatus('delivered')).toBe('delivered');
      expect(mapTermiiProviderStatus('dlr:delivered')).toBe('delivered');
      expect(mapTermiiProviderStatus('expired')).toBe('expired');
      expect(mapTermiiProviderStatus('rejected')).toBe('rejected');
    });

    it('prevents a confirmed delivered outcome from being regressed by a late or stale event', () => {
      // Cannot transition from delivered to failed, sent, expired, or unknown
      expect(canTransitionAttemptStatus('delivered', 'failed')).toBe(false);
      expect(canTransitionAttemptStatus('delivered', 'sent')).toBe(false);
      expect(canTransitionAttemptStatus('delivered', 'expired')).toBe(false);
      expect(canTransitionAttemptStatus('delivered', 'unknown')).toBe(false);

      // Transition from started to delivered is valid
      expect(canTransitionAttemptStatus('started', 'delivered')).toBe(true);

      // Transition from accepted to delivered is valid
      expect(canTransitionAttemptStatus('accepted', 'delivered')).toBe(true);

      // Cannot transition from failed back to sent
      expect(canTransitionAttemptStatus('failed', 'sent')).toBe(false);
    });

    it('applies SMS delivery report to the correct reminder attempt and job without regressing delivered status', () => {
      const attempt = {
        id: 'att-dlr-test-1',
        jobId: 'job-dlr-test-1',
        attemptToken: 'tok-dlr-1',
        channel: 'sms' as const,
        recipient: '2348030000001',
        message: 'Reminder test',
        providerMessageId: 'termii-msg-success-99',
        status: 'accepted' as const,
        createdAt: new Date().toISOString(),
      };
      store.reminderAttempts.push(attempt);

      const job = {
        id: 'job-dlr-test-1',
        ruleId: 'r-001',
        pupilId,
        guardianId: 'g-001',
        channel: 'sms' as const,
        balanceAtCreationMinor: 5000000,
        status: 'authorized' as const,
        retryCount: 0,
        createdAt: new Date().toISOString(),
      };
      store.reminderJobs.push(job as any);

      // Ingest delivered event
      const event = store.ingestTermiiWebhook({
        message_id: 'termii-msg-success-99',
        status: 'delivered',
      }, true);

      const claimed = store.claimSmsDeliveryEvents('run-1', 10);
      const claimedEvent = claimed.find((c) => c.event_id === event.id);
      expect(claimedEvent).toBeDefined();

      store.applySmsDeliveryEvent({
        event_id: event.id,
        claim_token: claimedEvent!.claim_token,
        provider_message_id: 'termii-msg-success-99',
        status: 'delivered',
      });

      expect(attempt.status).toBe('delivered');
      expect(job.status).toBe('delivered');

      // Now simulate a late, out-of-order 'failed' delivery callback for same message
      const lateEvent = store.ingestTermiiWebhook({
        message_id: 'termii-msg-success-99',
        status: 'failed',
      }, true);

      const claimedLate = store.claimSmsDeliveryEvents('run-2', 10);
      const claimedLateEvent = claimedLate.find((c) => c.event_id === lateEvent.id);

      store.applySmsDeliveryEvent({
        event_id: lateEvent.id,
        claim_token: claimedLateEvent!.claim_token,
        provider_message_id: 'termii-msg-success-99',
        status: 'failed',
      });

      // Terminal state preserved!
      expect(attempt.status).toBe('delivered');
      expect(job.status).toBe('delivered');
    });
  });
});
