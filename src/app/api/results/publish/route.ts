import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/supabaseRepository';
import { requireStaffSession } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    // 1. Derive actor strictly from verified server session
    const staffSession = await requireStaffSession(req);
    const { role: verifiedRole, staffId: verifiedStaffId } = staffSession;

    const body = await req.json();
    const { resultId, status, reason } = body;

    if (!resultId || !status) {
      return NextResponse.json({ error: 'Missing required parameters (resultId, status)' }, { status: 400 });
    }

    // 2. Enforce strict role authorization:
    // Only Admin can publish or withdraw results; Bursar is strictly forbidden; Teacher cannot publish
    if (verifiedRole === 'bursar' || (status === 'published' && verifiedRole !== 'admin')) {
      return NextResponse.json(
        { error: 'Forbidden: Bursars and non-admin staff are not permitted to publish or withdraw academic results' },
        { status: 403 }
      );
    }

    const updated = await db.updateResultStatus({
      resultId,
      status: status as 'draft' | 'under_review' | 'published' | 'under_correction',
      actorRole: verifiedRole,
      actorId: verifiedStaffId,
      reason,
    });

    return NextResponse.json({
      success: true,
      result: updated,
    });
  } catch (err: any) {
    const status = err.statusCode || 400;
    return NextResponse.json({ error: err.message }, { status });
  }
}
