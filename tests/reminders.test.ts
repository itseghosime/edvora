import { describe, it, expect } from 'vitest';
import { store } from '../src/lib/db/store';

describe('Reminders & Notifications (WF01, WF03, WF05)', () => {
  it('claims reminder jobs atomically with lease expiration', () => {
    const claims = store.claimReminderJobs('run-test-01', 10);
    expect(claims.length).toBeGreaterThan(0);
    expect(claims[0].claim_token).toBeDefined();

    // Claiming again immediately returns empty if all are claimed
    const claims2 = store.claimReminderJobs('run-test-02', 10);
    expect(claims2.length).toBe(0);
  });

  it('stops fee reminders when account balance reaches zero', () => {
    // Add a paid pupil with 0 balance
    const zeroPupilId = 'zero-pupil-001';
    const guardianId = '66666666-6666-6666-6666-000000000001';

    store.pupils.push({
      id: zeroPupilId,
      admissionNumber: 'EDV/2024/9999',
      firstName: 'Paid',
      lastName: 'Pupil',
      gender: 'female',
      classId: '33333333-3333-3333-3333-000000000005',
      status: 'active',
      guardianId,
    });

    store.feeAssignments.push({
      id: 'fa-zero-001',
      pupilId: zeroPupilId,
      termId: '22222222-2222-2222-2222-222222222222',
      feePlanId: '55555555-5555-5555-5555-000000000005',
      baseAmountMinor: 12000000,
      adjustedAmountMinor: 12000000,
      isPaused: false,
    });

    // Credit full amount
    store.ledgerEntries.push({
      id: 'led-zero-credit',
      pupilId: zeroPupilId,
      termId: '22222222-2222-2222-2222-222222222222',
      entryType: 'credit',
      amountMinor: 12000000,
      runningBalanceMinor: 0,
      reference: 'EDV-ZERO-001',
      description: 'Full payment',
      createdAt: new Date().toISOString(),
    });

    expect(store.getAuthoritativeBalance(zeroPupilId, '22222222-2222-2222-2222-222222222222')).toBe(0);

    // Create a reminder job for this zero balance pupil
    const job = {
      id: 'job-zero-rem',
      ruleId: 'rrrrrrrr-rrrr-rrrr-rrrr-000000000001',
      pupilId: zeroPupilId,
      guardianId,
      channel: 'sms' as const,
      balanceAtCreationMinor: 12000000,
      status: 'pending' as const,
      retryCount: 0,
    };
    store.reminderJobs.push(job);

    const claim = store.claimReminderJobs('run-zero', 10);
    const zeroClaim = claim.find((c) => c.job_id === 'job-zero-rem');
    expect(zeroClaim).toBeDefined();

    // Authorization must deny because balance is 0
    const auth = store.authorizeReminderJob('job-zero-rem', zeroClaim!.claim_token, 'exec-1');
    expect(auth.authorized).toBe(false);
    expect(auth.reason).toContain('Zero balance');
  });

  it('keeps published academic results accessible regardless of outstanding balance', () => {
    // Osasere has an outstanding balance of ₦30,000
    const bal = store.getAuthoritativeBalance('77777777-7777-7777-7777-000000000001', '22222222-2222-2222-2222-222222222222');
    expect(bal).toBeGreaterThan(0);

    const result = store.academicResults.find((r) => r.pupilId === '77777777-7777-7777-7777-000000000001');
    expect(result).toBeDefined();
    expect(result?.status).toBe('published');
    expect(result?.totalScore).toBe(524);
  });
});

describe('Recovery & Incidents (WF04)', () => {
  it('deduplicates incidents and prevents alert recursion for WF05 failures', () => {
    const key = 'INC-PAYSTACK-TIMEOUT-101';

    // Record incident for a normal workflow (WF01)
    const inc1 = store.recordIncident({
      incident_key: key,
      workflow_id: 'bt5x3HH74jRv5Ewt',
      workflow_name: 'WF01 Fee Reminders',
      failure_kind: 'ProviderTimeout',
    });
    expect(inc1.success).toBe(true);
    expect(inc1.deduplicated).toBe(false);

    // Duplicate call with same key
    const inc2 = store.recordIncident({
      incident_key: key,
      workflow_id: 'bt5x3HH74jRv5Ewt',
      workflow_name: 'WF01 Fee Reminders',
      failure_kind: 'ProviderTimeout',
    });
    expect(inc2.deduplicated).toBe(true);

    // Incident for WF05 should be record_only / not create alert recursion
    const wf05Inc = store.recordIncident({
      incident_key: 'INC-WF05-FAIL-999',
      workflow_id: 'YWD3GloqWM7HhZpq',
      workflow_name: 'WF05 Notifications',
      failure_kind: 'TelegramBlocked',
      record_only: true,
    });
    expect(wf05Inc.success).toBe(true);

    // Check that no operational alert job was recursively queued for WF05
    const recursiveAlert = store.notificationJobs.find(
      (j) => j.sourceEventId === wf05Inc.incident_id && j.eventType === 'operational_alert'
    );
    expect(recursiveAlert).toBeUndefined();
  });
});

