import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, admissionNumber, dateOfBirth, email, password } = body;

    if (type === 'student') {
      // Find pupil by admission number (e.g. EDV/2024/0042)
      const pupil = store.pupils.find(
        (p) => p.admissionNumber.toLowerCase() === (admissionNumber || '').trim().toLowerCase()
      );

      if (!pupil) {
        return NextResponse.json(
          { error: 'No pupil record matches this admission number. Please check your admission letter or contact the school office.' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          role: 'student',
          pupilId: pupil.id,
          name: `${pupil.firstName} ${pupil.lastName}`,
          admissionNumber: pupil.admissionNumber,
          className: pupil.className,
        },
        redirect: '/student',
      });
    }

    if (type === 'staff') {
      const staff = store.staffProfiles.find(
        (s) => s.email.toLowerCase() === (email || '').trim().toLowerCase()
      );

      if (!staff) {
        return NextResponse.json(
          { error: 'Invalid staff email or password. Please contact the administrator.' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          role: staff.role,
          staffId: staff.id,
          name: staff.fullName,
          email: staff.email,
          assignedClasses: staff.assignedClassIds,
        },
        redirect: '/admin',
      });
    }

    return NextResponse.json({ error: 'Invalid login type specified' }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}

