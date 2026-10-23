import { NextRequest, NextResponse } from 'next/server';
import { verifyPaystackWebhookSignature, processPaystackWebhookEvent } from '@/lib/services/paymentsService';
import { config } from '@/lib/config';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    // Paystack signs all webhook deliveries with HMAC-SHA512 using PAYSTACK_SECRET_KEY
    const isSignatureValid = verifyPaystackWebhookSignature(rawBody, signature);

    // If in live mode or configured key is present, reject invalid signatures
    if (!isSignatureValid) {
      if (config.paystack.secretKey && !config.paystack.secretKey.includes('sample')) {
        return NextResponse.json({ error: 'Unauthorized: Invalid Paystack webhook signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const result = processPaystackWebhookEvent(payload);

    return NextResponse.json({
      received: true,
      result,
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
