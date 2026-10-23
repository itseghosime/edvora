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
    const runId = body.run_id || `run-${Date.now()}`;
    const limit = Number(body.limit) || 50;

    const jobs = await db.claimReminderJobs(runId, limit);
    return NextResponse.json({ jobs });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
