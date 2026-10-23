import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/supabaseRepository';
import { store } from '@/lib/db/store';

export async function GET() {
  const pupilsWithBalances = store.pupils.map((p) => {
    const balanceMinor = store.getAuthoritativeBalance(p.id, '22222222-2222-2222-2222-222222222222');
    const guardian = store.guardians.find((g) => g.id === p.guardianId);
    return {
      ...p,
      guardianName: guardian?.fullName || 'Not linked',
      guardianPhone: guardian?.phoneNumber || '',
      telegramLinked: Boolean(guardian?.telegramChatId),
      balanceMinor,
      balanceFormatted: `₦${(balanceMinor / 100).toLocaleString()}`,
    };
  });

  return NextResponse.json({ pupils: pupilsWithBalances });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, gender, classId, guardianName, guardianPhone, guardianEmail } = body;

    if (!firstName || !lastName || !classId || !guardianName || !guardianPhone) {
      return NextResponse.json({ error: 'Please provide all required pupil and guardian details' }, { status: 400 });
    }

    const result = await db.registerPupil({
      firstName,
      lastName,
      gender: gender || 'male',
      classId,
      guardianName,
      guardianPhone,
      guardianEmail,
    });

    return NextResponse.json({
      success: true,
      pupil: result.pupil,
      guardian: result.guardian,
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
