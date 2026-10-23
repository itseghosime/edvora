import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/supabaseRepository';
import { getSession, requireStaffSession } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (session.type === 'student') {
      // Student session can only access their own record
      const pupils = await db.listPupils({ pupilId: session.pupilId });
      if (pupils.length === 0) {
        return NextResponse.json({ error: 'Pupil record not found' }, { status: 404 });
      }
      return NextResponse.json({ pupils });
    }

    // Staff session
    const filter = session.role === 'teacher' ? { classIds: session.assignedClassIds } : undefined;
    const pupils = await db.listPupils(filter);
    return NextResponse.json({ pupils });
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
