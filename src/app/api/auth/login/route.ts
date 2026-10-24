import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/supabaseRepository";
import { getSupabaseAdmin } from "@/lib/supabase/client";
import {
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  revokeRequestSession,
} from "@/lib/auth/session";
import { consumeLoginBudget } from "@/lib/auth/loginBudget";
import {
  readStudentCredential,
  verifyStudentPassword,
} from "@/lib/auth/studentPasswords";
import { StaffRole } from "@/lib/types/backend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, admissionNumber, email, password } = body;

    if (type === "student") {
      if (
        typeof admissionNumber !== "string" ||
        !admissionNumber.trim() ||
        typeof password !== "string" ||
        !password
      ) {
        return NextResponse.json(
          { error: "Admission number and password are required." },
          { status: 401 },
        );
      }
      const cleanAdmission = admissionNumber.trim().toUpperCase();
      await consumeLoginBudget(type, cleanAdmission);
      const credential = await readStudentCredential(cleanAdmission);
      const valid = await verifyStudentPassword(
        password,
        credential?.passwordHash ?? null,
      );
      if (!valid || !credential)
        return NextResponse.json(
          {
            error:
              "Invalid admission number or password. Use a school-issued setup link if your account is new.",
          },
          { status: 401 },
        );
      const token = createSessionToken({
        type: "student",
        authVersion: credential.authVersion,
        userId: credential.pupilId,
        pupilId: credential.pupilId,
        admissionNumber: credential.admissionNumber,
        name: credential.name,
        className: credential.className,
        guardianId: credential.guardianId,
      });
      const response = NextResponse.json({
        success: true,
        user: {
          role: "student",
          pupilId: credential.pupilId,
          name: credential.name,
          admissionNumber: credential.admissionNumber,
          className: credential.className,
        },
        redirect: "/student",
      });
      setSessionCookie(response, token);
      return response;
    }

    if (type === "staff") {
      // 1. Require credentials: email lookup alone must NEVER authenticate
      if (!email || !email.trim()) {
        return NextResponse.json(
          { error: "Staff email is required" },
          { status: 401 },
        );
      }
      if (!password || !password.trim()) {
        return NextResponse.json(
          { error: "Password is required to authenticate staff credentials." },
          { status: 401 },
        );
      }

      const cleanEmail = email.trim().toLowerCase();

      // 2. Verify with Supabase Auth: fail closed if Supabase Auth is unavailable
      const supabase = getSupabaseAdmin();
      if (!supabase) {
        return NextResponse.json(
          {
            error:
              "Authentication service unavailable: Supabase Auth is not configured. Staff credential verification cannot proceed.",
          },
          { status: 503 },
        );
      }

      await consumeLoginBudget(type, cleanEmail);
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (authError || !authData?.user) {
        return NextResponse.json(
          {
            error: `Invalid staff credentials: ${authError?.message || "Authentication failed"}`,
          },
          { status: 401 },
        );
      }

      // 3. Query persisted staff profile from database repository
      const staff = await db.getStaffByEmail(cleanEmail);

      if (
        !staff ||
        !staff.isActive ||
        !staff.userId ||
        staff.userId !== authData.user.id
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid staff email or password. Please contact the administrator.",
          },
          { status: 401 },
        );
      }

      // 4. Derive actor role and assigned classes authoritatively from persisted database record
      const token = createSessionToken({
        type: "staff",
        authVersion: staff.authVersion ?? 0,
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
        redirect: "/admin",
      });

      setSessionCookie(response, token);
      return response;
    }

    return NextResponse.json(
      { error: "Invalid login type specified" },
      { status: 400 },
    );
  } catch (err: unknown) {
    const error = err as Error & { statusCode?: number; retryAfter?: number };
    return NextResponse.json(
      { error: error.message },
      {
        status: error.statusCode ?? 400,
        headers: error.retryAfter
          ? { "Retry-After": String(error.retryAfter) }
          : undefined,
      },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await revokeRequestSession(req);
  } catch (err: unknown) {
    const error = err as Error & { statusCode?: number };
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode ?? 503 },
    );
  }
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });
  clearSessionCookie(response);
  return response;
}
