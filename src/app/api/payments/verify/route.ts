import { NextRequest, NextResponse } from 'next/server';
import { verifyPayment } from '@/lib/services/paymentsService';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/supabaseRepository';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if(session.type==='staff' && !['admin','bursar'].includes(session.role)) return NextResponse.json({error:'Financial access denied'},{status:403});

    const body = await req.json();
    const { reference } = body;

    if (!reference) {
      return NextResponse.json({ error: 'Missing payment reference' }, { status: 400 });
    }

    // Security check: if student session, verify the reference belongs to this pupil
    if (session.type === 'student') {
      const intent = await db.getPaymentIntentByReference(reference);
      if (intent && intent.pupilId !== session.pupilId) {
        return NextResponse.json(
          { error: 'Forbidden: You cannot verify payment for another pupil' },
          { status: 403 }
        );
      }
    }

    const verification = await verifyPayment(reference);
    return NextResponse.json(verification);
  } catch (err: any) {
    const status = err.statusCode || 400;
    return NextResponse.json({ error: err.message }, { status });
  }
}


