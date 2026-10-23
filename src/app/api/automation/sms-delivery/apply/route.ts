import { NextRequest, NextResponse } from 'next/server';
import { verifyAutomationRequest } from '@/lib/services/authService';
import { db } from '@/lib/db/supabaseRepository';

export async function POST(req: NextRequest) {
  const isAuth = verifyAutomationRequest(req.headers.get('authorization'));
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized: Invalid service key' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { event_id, claim_token, provider_message_id, status } = body;

    if (!event_id || !claim_token || !provider_message_id) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const result = await db.applySmsDeliveryEvent({
      event_id,
      claim_token,
      provider_message_id,
      status: status || 'unknown',
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
