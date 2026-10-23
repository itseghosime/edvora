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
    const { job_id, claim_token } = body;

    if (!job_id || !claim_token) {
      return NextResponse.json({ error: 'Missing job_id or claim_token' }, { status: 400 });
    }

    const authResult = await db.authorizeNotification(job_id, claim_token);
    return NextResponse.json(authResult);
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
