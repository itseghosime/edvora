import { NextRequest, NextResponse } from 'next/server';
import { initializePayment } from '@/lib/services/paymentsService';
import { getSession } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { pupilId, termId, amountMinor, payerEmail, payerName } = body;

    if (!pupilId || !amountMinor || !payerEmail) {
      return NextResponse.json({ error: 'Missing required payment initialization parameters' }, { status: 400 });
    }

    // Authorization: if student session, they can only initialize payment for their own pupil record
    if (session.type === 'student' && session.pupilId !== pupilId) {
      return NextResponse.json(
        { error: 'Forbidden: You cannot initiate payment for another pupil' },
        { status: 403 }
      );
    }

    const initResult = await initializePayment({
      pupilId,
      termId: termId || '22222222-2222-2222-2222-222222222222',
      amountMinor: Number(amountMinor),
      payerEmail,
      payerName: payerName || (session.type === 'student' ? session.name : undefined),
    });

    return NextResponse.json(initResult);
  } catch (err: any) {
    const status = err.statusCode || 400;
    return NextResponse.json({ error: err.message }, { status });
  }
}
