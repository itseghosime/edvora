import { NextRequest, NextResponse } from 'next/server';
import { currentActor } from '@/lib/auth/currentActor';
import { getSession } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  let actor=null;
  try { actor=session?await currentActor(session):null; } catch { /* No stale role is returned when account checks fail. */ }
  return NextResponse.json(actor ? { actor } : { error: 'Authentication required' }, {
    status: actor ? 200 : 401,
    headers: { 'Cache-Control': 'private, no-store' },
  });
}
