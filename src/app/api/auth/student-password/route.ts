import { NextRequest, NextResponse } from "next/server";
import { getSession, clearSessionCookie } from "@/lib/auth/session";
import {
  readStudentCredential,
  verifyStudentPassword,
  hashStudentPassword,
  validateNewPassword,
  studentPasswordRpc,
} from "@/lib/auth/studentPasswords";
import { consumeLoginBudget } from "@/lib/auth/loginBudget";
export async function POST(req: NextRequest) {
  try {
    if (
      req.headers.get("origin") &&
      req.headers.get("origin") !== new URL(req.url).origin
    )
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    const actor = await getSession(req);
    if (!actor || actor.type !== "student")
      return NextResponse.json(
        { error: "Student authentication required" },
        { status: 401 },
      );
    const body = await req.json();
    validateNewPassword(body.password);
    await consumeLoginBudget("student-password", actor.pupilId);
    const credential = await readStudentCredential(actor.admissionNumber);
    if (
      !credential ||
      credential.pupilId !== actor.pupilId ||
      !(await verifyStudentPassword(
        body.currentPassword,
        credential.passwordHash,
      ))
    )
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 },
      );
    await studentPasswordRpc("change_student_password", {
      p_pupil: actor.pupilId,
      p_old_hash: credential.passwordHash,
      p_new_hash: await hashStudentPassword(body.password),
    });
    const response = NextResponse.json({ success: true, redirect: "/login" });
    clearSessionCookie(response);
    return response;
  } catch (err) {
    const e = err as Error & { statusCode?: number };
    return NextResponse.json(
      { error: e.message },
      { status: e.statusCode ?? 400 },
    );
  }
}
