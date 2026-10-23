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
    const { job_id, attempt_id, attempt_token, status, provider_message_id, error_message } = body;

    if (!job_id || !attempt_id || !attempt_token || !status) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const result = await db.recordNotificationOutcome({
      job_id,
      attempt_id,
      attempt_token,
      status,
      provider_message_id,
      error_message,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
