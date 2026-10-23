import { NextRequest, NextResponse } from 'next/server';
import { initializePayment } from '@/lib/services/paymentsService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pupilId, termId, amountMinor, payerEmail, payerName } = body;

    if (!pupilId || !amountMinor || !payerEmail) {
      return NextResponse.json({ error: 'Missing required payment initialization parameters' }, { status: 400 });
    }

    const initResult = await initializePayment({
      pupilId,
      termId: termId || '22222222-2222-2222-2222-222222222222',
      amountMinor: Number(amountMinor),
      payerEmail,
      payerName,
    });

    return NextResponse.json(initResult);
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}

