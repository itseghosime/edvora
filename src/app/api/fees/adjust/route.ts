import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/supabaseRepository';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { assignmentId, amountMinor, adjustmentType, reason, authorizedBy } = body;

    if (!assignmentId || !amountMinor || !adjustmentType || !reason) {
      return NextResponse.json({ error: 'Missing required fee adjustment parameters' }, { status: 400 });
    }

    const result = await db.adjustFee({
      assignmentId,
      amountMinor: Number(amountMinor),
      adjustmentType,
      reason,
      authorizedBy: authorizedBy || '44444444-4444-4444-4444-000000000002', // Default bursar
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
