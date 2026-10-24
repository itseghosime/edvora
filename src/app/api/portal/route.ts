import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { readPortal } from '@/lib/services/portalService';

export async function GET(req: NextRequest) {
  try {
    const actor = await getSession(req);
    if (!actor) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    return NextResponse.json(await readPortal(actor), { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (err: unknown) {
    const error = err as Error & { statusCode?: number };
    return NextResponse.json({ error: error.statusCode === 503 ? error.message : 'Unable to load school records. Please try again.' }, { status: error.statusCode ?? 500 });
  }
}
