// ==============================================================================
// Edvora School Management — Payment Domain Service (Paystack Test Mode)
// Strictly enforces integer minor kobo units, server-side provider verification,
// intent invariant matching, and single-credit idempotent transactions.
// NEVER assumes success or falls back to crediting money offline.
// ==============================================================================

import crypto from 'crypto';
import { config } from '../config';
import { db } from '../db/supabaseRepository';
import { store } from '../db/store';

export async function initializePayment(params: {
  pupilId: string;
  termId: string;
  amountMinor: number;
  payerEmail: string;
  payerName?: string;
  callbackUrl?: string;
}) {
  // 1. Authoritative server-side balance check & intent creation via DatabaseRepository
  const intent = await db.createPaymentIntent({
    pupilId: params.pupilId,
    termId: params.termId,
    amountMinor: params.amountMinor,
    payerEmail: params.payerEmail,
    payerName: params.payerName,
  });

  // 2. Prepare Paystack payload (amount in minor units / kobo)
  const paystackPayload = {
    email: params.payerEmail,
    amount: intent.amountMinor,
    reference: intent.reference,
    currency: 'NGN',
    callback_url: params.callbackUrl || `${config.appUrl}/student/payments?verify=${intent.reference}`,
    metadata: {
      pupil_id: intent.pupilId,
      term_id: intent.termId,
      school: 'Edvora Nursery & Primary School',
    },
  };

  let authorizationUrl = `${config.appUrl}/student/payments?verify=${intent.reference}`;
  let accessCode = `acc_${intent.reference}`;

  if (config.paystack.secretKey && !config.paystack.secretKey.includes('sample')) {
    try {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.paystack.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paystackPayload),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status && data.data?.authorization_url) {
          authorizationUrl = data.data.authorization_url;
          accessCode = data.data.access_code;
        }
      }
    } catch {
      // If network unreachable during initialization, retain intent reference
    }
  }

  return {
    reference: intent.reference,
    authorization_url: authorizationUrl,
    access_code: accessCode,
    amount_minor: intent.amountMinor,
    currency: intent.currency,
    expires_at: intent.expiresAt,
  };
}

export async function verifyPayment(reference: string) {
  // 1. Locate the authoritative original payment intent
  const intent = store.paymentIntents.find((i) => i.reference === reference);
  if (!intent) {
    return {
      success: false,
      status: 'failed',
      message: `Original payment intent not found for reference: ${reference}`,
    };
  }

  // 2. If intent is already credited and successful, return idempotent receipt record
  if (intent.status === 'successful') {
    const existingTx = store.paymentTransactions.find((tx) => tx.reference === reference);
    const existingReceipt = store.receipts.find((r) => r.transactionId === existingTx?.id);
    const currentBalance = store.getAuthoritativeBalance(intent.pupilId, intent.termId);

    return {
      success: true,
      status: 'success',
      reference,
      amount_minor: intent.amountMinor,
      receipt_number: existingReceipt?.receiptNumber || `REC-${reference}`,
      new_balance_minor: currentBalance,
      duplicate: true,
    };
  }

  // 3. Strict requirement: PAYSTACK_SECRET_KEY must be configured
  if (!config.paystack.secretKey) {
    return {
      success: false,
      status: 'failed',
      message: 'Payment verification failed: PAYSTACK_SECRET_KEY is unconfigured',
    };
  }

  // 4. Query Paystack Transaction Verify API
  let paystackData: any = null;
  try {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${config.paystack.secretKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return {
        success: false,
        status: 'failed',
        message: `Provider verification HTTP error: status ${res.status}`,
      };
    }

    const json = await res.json();
    if (!json.status || !json.data) {
      return {
        success: false,
        status: 'failed',
        message: json.message || 'Provider returned unsuccessful verification payload',
      };
    }

    paystackData = json.data;
  } catch (err: any) {
    // Under no circumstances do we assume success on network/provider failure!
    return {
      success: false,
      status: 'failed',
      message: `Failed to contact payment provider: ${err.message}`,
    };
  }

  // 5. Strict verification of provider response invariants against original intent:
  // a) Status must be 'success'
  if (paystackData.status !== 'success') {
    return {
      success: false,
      status: 'failed',
      message: `Transaction is not successful (provider status: ${paystackData.status})`,
    };
  }

  // b) Reference must match exactly
  if (paystackData.reference !== intent.reference) {
    return {
      success: false,
      status: 'failed',
      message: `Reference mismatch: expected ${intent.reference}, got ${paystackData.reference}`,
    };
  }

  // c) Amount must match exactly (prevent partial credit tampering)
  if (Number(paystackData.amount) !== Number(intent.amountMinor)) {
    return {
      success: false,
      status: 'failed',
      message: `Amount mismatch: expected ${intent.amountMinor} kobo, got ${paystackData.amount} kobo`,
    };
  }

  // d) Currency must match
  if ((paystackData.currency || '').toUpperCase() !== intent.currency.toUpperCase()) {
    return {
      success: false,
      status: 'failed',
      message: `Currency mismatch: expected ${intent.currency}, got ${paystackData.currency}`,
    };
  }

  // e) Environment domain check: must match configured test environment
  if (config.paystack.environment === 'test' && paystackData.domain !== 'test') {
    return {
      success: false,
      status: 'failed',
      message: 'Environment mismatch: expected test domain transaction',
    };
  }

  // 6. All invariants verified: Credit atomically in authoritative DatabaseRepository
  const providerTxId = String(paystackData.id || `PSTK_${reference}`);
  const channel = (paystackData.channel as 'card' | 'bank_transfer' | 'ussd') || 'card';

  const creditResult: any = await db.creditPayment({
    reference,
    providerTransactionId: providerTxId,
    amountMinor: Number(paystackData.amount),
    channel,
  });

  return {
    success: true,
    status: 'success',
    reference,
    amount_minor: creditResult.transaction?.amountMinor || creditResult.amount_minor || intent.amountMinor,
    receipt_number: creditResult.receipt?.receiptNumber || creditResult.receipt_number,
    new_balance_minor: creditResult.newBalanceMinor ?? creditResult.new_balance_minor,
  };
}

export function verifyPaystackWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  if (!signatureHeader || !config.paystack.secretKey) return false;
  const hash = crypto
    .createHmac('sha512', config.paystack.secretKey)
    .update(rawBody)
    .digest('hex');
  return hash === signatureHeader;
}

export async function processPaystackWebhookEvent(event: {
  event: string;
  data: {
    reference: string;
    amount: number;
    status: string;
    currency?: string;
    domain?: string;
    channel?: string;
    id?: number;
  };
}) {
  if (event.event !== 'charge.success' || event.data.status !== 'success') {
    return { processed: false, reason: 'Event is not a successful charge' };
  }

  const { reference, amount, currency, domain, channel, id } = event.data;

  // Verify against original intent before crediting
  const intent = store.paymentIntents.find((i) => i.reference === reference);
  if (!intent) {
    return { processed: false, reason: `Original payment intent not found for reference: ${reference}` };
  }

  if (Number(amount) !== Number(intent.amountMinor)) {
    return { processed: false, reason: `Amount mismatch: expected ${intent.amountMinor}, got ${amount}` };
  }

  if (currency && currency.toUpperCase() !== intent.currency.toUpperCase()) {
    return { processed: false, reason: `Currency mismatch: expected ${intent.currency}, got ${currency}` };
  }

  if (config.paystack.environment === 'test' && domain && domain !== 'test') {
    return { processed: false, reason: `Domain mismatch: expected test domain, got ${domain}` };
  }

  return db.creditPayment({
    reference,
    providerTransactionId: String(id || `PSTK_${reference}`),
    amountMinor: amount,
    channel: (channel as 'card' | 'bank_transfer' | 'ussd') || 'card',
  });
}
