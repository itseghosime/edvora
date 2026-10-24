import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  const actor = await getSession(req);
  return NextResponse.json(actor ? { actor } : { error: 'Authentication required' }, {
    status: actor ? 200 : 401,
    headers: { 'Cache-Control': 'private, no-store' },
  });
}
