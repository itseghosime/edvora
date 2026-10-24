import { NextRequest, NextResponse } from "next/server";
import {
  hashStudentPassword,
  studentPasswordRpc,
  validateNewPassword,
} from "@/lib/auth/studentPasswords";
import { tokenHash } from "@/lib/auth/sessionStore";
import { consumeLoginBudget } from "@/lib/auth/loginBudget";
export async function POST(req: NextRequest) {
  try {
    if (
      req.headers.get("origin") &&
      req.headers.get("origin") !== new URL(req.url).origin
    )
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    const body = await req.json();
    if (
      typeof body.token !== "string" ||
      !/^[A-Za-z0-9_-]{43}$/.test(body.token)
    )
      return NextResponse.json(
        { error: "Invalid access link" },
        { status: 400 },
      );
    validateNewPassword(body.password);
    await consumeLoginBudget("student-access", body.token);
    if (
      !(await studentPasswordRpc("student_access_is_valid", {
        p_hash: tokenHash(body.token),
      }))
    )
      return NextResponse.json(
        { error: "Access link is unavailable or expired." },
        { status: 400 },
      );
    const result = await studentPasswordRpc("redeem_student_access", {
      p_hash: tokenHash(body.token),
      p_password_hash: await hashStudentPassword(body.password),
    });
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    const e = err as Error & { statusCode?: number };
    return NextResponse.json(
      { error: e.message },
      { status: e.statusCode ?? 400 },
    );
  }
}
