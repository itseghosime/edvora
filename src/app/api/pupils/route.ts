import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/supabaseRepository';
import { store } from '@/lib/db/store';
import { getSession, requireStaffSession } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (session.type === 'student') {
      // Student session can only access their own record
      const pupil = store.pupils.find((p) => p.id === session.pupilId);
      if (!pupil) {
        return NextResponse.json({ error: 'Pupil record not found' }, { status: 404 });
      }
      const balanceMinor = store.getAuthoritativeBalance(pupil.id, '22222222-2222-2222-2222-222222222222');
      const guardian = store.guardians.find((g) => g.id === pupil.guardianId);
      return NextResponse.json({
        pupils: [
          {
            ...pupil,
            guardianName: guardian?.fullName || 'Not linked',
            guardianPhone: guardian?.phoneNumber || '',
            telegramLinked: Boolean(guardian?.telegramChatId),
            balanceMinor,
            balanceFormatted: `₦${(balanceMinor / 100).toLocaleString()}`,
          },
        ],
      });
    }

    // Staff session
    let pupils = store.pupils;
    if (session.role === 'teacher') {
      // Teachers can only view pupils in their assigned classes
      pupils = pupils.filter((p) => session.assignedClassIds.includes(p.classId));
    }

    const pupilsWithBalances = pupils.map((p) => {
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
  } catch (err: any) {
    const status = err.statusCode || 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Only Admin staff can register new pupils
    await requireStaffSession(req, ['admin']);

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
  } catch (err: any) {
    const status = err.statusCode || 400;
    return NextResponse.json({ error: err.message }, { status });
  }
}
