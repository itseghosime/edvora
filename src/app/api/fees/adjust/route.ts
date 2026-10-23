import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/supabaseRepository';
import { requireStaffSession } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    // 1. Derive authorized staff strictly from verified session (only admin or bursar)
    const staffSession = await requireStaffSession(req, ['admin', 'bursar']);

    const body = await req.json();
    const { assignmentId, amountMinor, adjustmentType, reason } = body;

    if (!assignmentId || amountMinor === undefined || !adjustmentType || !reason) {
      return NextResponse.json({ error: 'Missing required fee adjustment parameters' }, { status: 400 });
    }

    const result = await db.adjustFee({
      assignmentId,
      amountMinor: Number(amountMinor),
      adjustmentType,
      reason,
      authorizedBy: staffSession.staffId,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    const status = err.statusCode || 400;
    return NextResponse.json({ error: err.message }, { status });
  }
}
