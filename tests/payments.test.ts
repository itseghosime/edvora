import { describe, it, expect } from 'vitest';
import { store } from '../src/lib/db/store';
import { config } from '../src/lib/config';
import { initializePayment, verifyPayment, verifyPaystackWebhookSignature } from '../src/lib/services/paymentsService';

describe('Payment & Ledger Integrity', () => {
  const pupilId = '77777777-7777-7777-7777-000000000001'; // Osasere Ehigiator
  const termId = '22222222-2222-2222-2222-222222222222';

  it('correctly calculates authoritative balance from records in integer minor kobo units', () => {
    // Initial: ₦120,000 (12,000,000 kobo) charges - ₦70,000 (7,000,000 kobo) paid = ₦50,000 (5,000,000 kobo)
    const balance = store.getAuthoritativeBalance(pupilId, termId);
    expect(balance).toBe(5000000); // ₦50,000 in kobo
  });

  it('rejects payment intents exceeding outstanding balance or <= 0', () => {
    expect(() => {
      store.createPaymentIntent({
        pupilId,
        termId,
        amountMinor: 0,
        payerEmail: 'guardian@test.com',
      });
    }).toThrow(/greater than zero/i);

    expect(() => {
      store.createPaymentIntent({
        pupilId,
        termId,
        amountMinor: 6000000, // ₦60,000 > ₦50,000 balance
        payerEmail: 'guardian@test.com',
      });
    }).toThrow(/cannot exceed outstanding balance/i);
  });

  it('atomically credits a verified payment and recalculates balance', async () => {
    // Make an installment of ₦20,000 (2,000,000 kobo)
    const init = await initializePayment({
      pupilId,
      termId,
      amountMinor: 2000000,
      payerEmail: 'guardian.ehigiator@gmail.com',
    });

    expect(init.reference).toBeDefined();

    // Verify payment
    const verification = await verifyPayment(init.reference);
    expect(verification.success).toBe(true);
    expect(verification.amount_minor).toBe(2000000);
    expect(verification.new_balance_minor).toBe(3000000); // ₦30,000 remaining

    // Verify authoritative balance reflects exactly ₦30,000 (3,000,000 kobo)
    const currentBalance = store.getAuthoritativeBalance(pupilId, termId);
    expect(currentBalance).toBe(3000000);
  });

  it('prevents duplicate credits for the same reference (idempotent)', async () => {
    const existingRef = 'EDV-PAY-202610-0042';
    const beforeBal = store.getAuthoritativeBalance(pupilId, termId);

    // Call verify again with already credited reference
    const res = await verifyPayment(existingRef);
    expect(res.success).toBe(true);

    // Balance must not change (no double credit)
    const afterBal = store.getAuthoritativeBalance(pupilId, termId);
    expect(afterBal).toBe(beforeBal);
  });

  it('verifies Paystack webhook signature verification using PAYSTACK_SECRET_KEY', async () => {
    const rawBody = JSON.stringify({ event: 'charge.success', data: { reference: 'REF123' } });
    // Without valid signature header, verification fails
    expect(verifyPaystackWebhookSignature(rawBody, null)).toBe(false);
    expect(verifyPaystackWebhookSignature(rawBody, 'invalid_signature_hash')).toBe(false);

    // With true HMAC-SHA512 signature computed with secret key, verification succeeds
    const crypto = await import('crypto');
    const validSignature = crypto.createHmac('sha512', config.paystack.secretKey).update(rawBody).digest('hex');
    expect(verifyPaystackWebhookSignature(rawBody, validSignature)).toBe(true);
  });
});

