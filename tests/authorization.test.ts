import { describe, it, expect } from 'vitest';
import { canPublishResults, canEditScores, canManageFees, isAuthorizedChild, verifyAutomationRequest } from '../src/lib/services/authService';
import { store } from '../src/lib/db/store';
import { config } from '../src/lib/config';

describe('Authorization & Access Boundaries', () => {
  it('allows School Admin to publish results, but forbids Bursar', () => {
    expect(canPublishResults('admin')).toBe(true);
    expect(canPublishResults('bursar')).toBe(false);
    expect(canPublishResults('teacher')).toBe(false);
  });

  it('throws an error if a Bursar attempts to publish or withdraw results', () => {
    expect(() => {
      store.updateResultStatus({
        resultId: 'dddddddd-dddd-dddd-dddd-000000000001',
        status: 'published',
        actorRole: 'bursar',
        actorId: '44444444-4444-4444-4444-000000000002',
      });
    }).toThrow(/Bursars are not permitted/i);
  });

  it('enforces teacher class assignment boundaries', () => {
    const assigned = ['33333333-3333-3333-3333-000000000005']; // Primary 3A
    expect(canEditScores('teacher', '33333333-3333-3333-3333-000000000005', assigned)).toBe(true);
    expect(canEditScores('teacher', '33333333-3333-3333-3333-000000000001', assigned)).toBe(false);
    expect(canEditScores('admin', '33333333-3333-3333-3333-000000000001', [])).toBe(true);
  });

  it('allows Bursar and Admin to manage fees, but forbids Teacher', () => {
    expect(canManageFees('admin')).toBe(true);
    expect(canManageFees('bursar')).toBe(true);
    expect(canManageFees('teacher')).toBe(false);
  });

  it('validates guardian authorized child link', () => {
    const guardianId = '66666666-6666-6666-6666-000000000001'; // Dr. & Mrs. Ehigiator
    const osasereId = '77777777-7777-7777-7777-000000000001';
    const tamaraId = '77777777-7777-7777-7777-000000000002';
    const unrelatedId = '77777777-7777-7777-7777-999999999999';

    expect(isAuthorizedChild(guardianId, osasereId)).toBe(true);
    expect(isAuthorizedChild(guardianId, tamaraId)).toBe(true);
    expect(isAuthorizedChild(guardianId, unrelatedId)).toBe(false);
  });

  it('validates automation service Bearer credential', () => {
    expect(verifyAutomationRequest(`Bearer ${config.automationServiceKey}`)).toBe(true);
    expect(verifyAutomationRequest('Bearer wrong_token')).toBe(false);
    expect(verifyAutomationRequest('Basic random_credentials')).toBe(false);
    expect(verifyAutomationRequest(null)).toBe(false);
  });
});

