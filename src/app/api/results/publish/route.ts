import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/supabaseRepository';
import { StaffRole } from '@/lib/types/backend';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resultId, status, actorRole, actorId, reason } = body;

    if (!resultId || !status || !actorRole) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Explicit 403 Forbidden check for unauthorized roles
    if (actorRole === 'bursar' || (status === 'published' && actorRole !== 'admin')) {
      return NextResponse.json(
        { error: 'Forbidden: Bursars and unauthorized staff are not permitted to publish or withdraw academic results' },
        { status: 403 }
      );
    }

    const updated = await db.updateResultStatus({
      resultId,
      status: status as 'draft' | 'under_review' | 'published' | 'under_correction',
      actorRole: actorRole as StaffRole,
      actorId: actorId || '44444444-4444-4444-4444-000000000001',
      reason,
    });

    return NextResponse.json({
      success: true,
      result: updated,
    });
  } catch (err: unknown) {
    const message = (err as Error).message;
    if (message.includes('Unauthorized') || message.includes('Forbidden') || message.includes('Bursars are not permitted')) {
      return NextResponse.json({ error: message }, { status: 403 });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
