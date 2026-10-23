import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/supabaseRepository';
import { store } from '@/lib/db/store';
import { createSessionToken, setSessionCookie, clearSessionCookie } from '@/lib/auth/session';
import { StaffRole } from '@/lib/types/backend';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, admissionNumber, dateOfBirth, email, password } = body;

    if (type === 'student') {
      if (!admissionNumber || !admissionNumber.trim()) {
        return NextResponse.json({ error: 'Admission number is required' }, { status: 400 });
      }

      // Look up pupil record
      const cleanAdmission = admissionNumber.trim().toUpperCase();
      const pupil = store.pupils.find(
        (p) => p.admissionNumber.toUpperCase() === cleanAdmission
      );

      if (!pupil) {
        return NextResponse.json(
          { error: 'No pupil record matches this admission number. Please check your admission letter or contact the school office.' },
          { status: 401 }
        );
      }

      // If dateOfBirth is supplied, verify it matches
      if (dateOfBirth && pupil.dateOfBirth && pupil.dateOfBirth !== dateOfBirth) {
        return NextResponse.json(
          { error: 'Date of birth does not match school records for this admission number.' },
          { status: 401 }
        );
      }

      const token = createSessionToken({
        type: 'student',
        userId: pupil.id,
        pupilId: pupil.id,
        admissionNumber: pupil.admissionNumber,
        name: `${pupil.firstName} ${pupil.lastName}`,
        className: pupil.className || '',
        guardianId: pupil.guardianId,
      });

      const response = NextResponse.json({
        success: true,
        user: {
          role: 'student',
          pupilId: pupil.id,
          name: `${pupil.firstName} ${pupil.lastName}`,
          admissionNumber: pupil.admissionNumber,
          className: pupil.className,
        },
        token,
        redirect: '/student',
      });

      setSessionCookie(response, token);
      return response;
    }

    if (type === 'staff') {
      if (!email || !email.trim()) {
        return NextResponse.json({ error: 'Staff email is required' }, { status: 400 });
      }

      // 1. Look up staff record
      const cleanEmail = email.trim().toLowerCase();
      const staff = store.staffProfiles.find(
        (s) => s.email.toLowerCase() === cleanEmail
      );

      if (!staff || !staff.isActive) {
        return NextResponse.json(
          { error: 'Invalid staff email or password. Please contact the administrator.' },
          { status: 401 }
        );
      }

      // 2. Derive actor role and assigned classes authoritatively from persisted record
      const token = createSessionToken({
        type: 'staff',
        userId: staff.id,
        staffId: staff.id,
        role: staff.role as StaffRole,
        email: staff.email,
        name: staff.fullName,
        assignedClassIds: staff.assignedClassIds || [],
      });

      const response = NextResponse.json({
        success: true,
        user: {
          role: staff.role,
          staffId: staff.id,
          name: staff.fullName,
          email: staff.email,
          assignedClasses: staff.assignedClassIds,
        },
        token,
        redirect: '/admin',
      });

      setSessionCookie(response, token);
      return response;
    }

    return NextResponse.json({ error: 'Invalid login type specified' }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  clearSessionCookie(response);
  return response;
}
