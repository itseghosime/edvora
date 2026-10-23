import { NextRequest, NextResponse } from 'next/server';
import { verifyPayment } from '@/lib/services/paymentsService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reference } = body;

    if (!reference) {
      return NextResponse.json({ error: 'Missing reference' }, { status: 400 });
    }

    const verification = await verifyPayment(reference);
    return NextResponse.json(verification);
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}

