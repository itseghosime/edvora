import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/supabaseRepository';
import { getSupabaseAdmin } from '@/lib/supabase/client';
import { createSessionToken, setSessionCookie, clearSessionCookie } from '@/lib/auth/session';
import { StaffRole } from '@/lib/types/backend';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, admissionNumber, dateOfBirth, email, password } = body;

    if (type === 'student') {
      // 1. Require credentials: admission number alone must NEVER authenticate
      if (!admissionNumber || !admissionNumber.trim()) {
        return NextResponse.json({ error: 'Admission number is required' }, { status: 401 });
      }
      if (!dateOfBirth || !dateOfBirth.trim()) {
        return NextResponse.json(
          { error: 'Date of birth is required to authenticate student access.' },
          { status: 401 }
        );
      }

      // 2. Query persisted record from database repository
      const cleanAdmission = admissionNumber.trim().toUpperCase();
      const pupil = await db.getPupilByAdmissionNumber(cleanAdmission);

      if (!pupil) {
        return NextResponse.json(
          { error: 'No pupil record matches this admission number. Please check your admission letter or contact the school office.' },
          { status: 401 }
        );
      }

      // 3. Check pupil account status before issuing a session
      if (pupil.status !== 'active') {
        return NextResponse.json(
          { error: `Student account is ${pupil.status || 'inactive'}. Please contact the school administration.` },
          { status: 403 }
        );
      }

      // 4. Reject student login if the persisted DOB is missing or does not match
      if (!pupil.dateOfBirth || !pupil.dateOfBirth.trim()) {
        return NextResponse.json(
          { error: 'Pupil account record has no registered date of birth. Please contact the school office.' },
          { status: 401 }
        );
      }

      if (pupil.dateOfBirth.trim() !== dateOfBirth.trim()) {
        return NextResponse.json(
          { error: 'Invalid credentials: Date of birth does not match school records for this admission number.' },
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
          className: pupil.className || '',
        },
        token,
        redirect: '/student',
      });

      setSessionCookie(response, token);
      return response;
    }

    if (type === 'staff') {
      // 1. Require credentials: email lookup alone must NEVER authenticate
      if (!email || !email.trim()) {
        return NextResponse.json({ error: 'Staff email is required' }, { status: 401 });
      }
      if (!password || !password.trim()) {
        return NextResponse.json(
          { error: 'Password is required to authenticate staff credentials.' },
          { status: 401 }
        );
      }

      const cleanEmail = email.trim().toLowerCase();

      // 2. Verify with Supabase Auth: fail closed if Supabase Auth is unavailable
      const supabase = getSupabaseAdmin();
      if (!supabase) {
        return NextResponse.json(
          { error: 'Authentication service unavailable: Supabase Auth is not configured. Staff credential verification cannot proceed.' },
          { status: 503 }
        );
      }

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (authError || !authData?.user) {
        return NextResponse.json(
          { error: `Invalid staff credentials: ${authError?.message || 'Authentication failed'}` },
          { status: 401 }
        );
      }

      // 3. Query persisted staff profile from database repository
      const staff = await db.getStaffByEmail(cleanEmail);

      if (!staff || !staff.isActive) {
        return NextResponse.json(
          { error: 'Invalid staff email or password. Please contact the administrator.' },
          { status: 401 }
        );
      }

      // 4. Derive actor role and assigned classes authoritatively from persisted database record
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

