import { NextRequest, NextResponse } from "next/server";
import { requireStaffSession } from "@/lib/auth/session";
import {
  deriveStudentAccessToken,
  studentPasswordRpc,
} from "@/lib/auth/studentPasswords";
import { tokenHash } from "@/lib/auth/sessionStore";
import { config } from "@/lib/config";
export async function POST(req: NextRequest) {
  try {
    if (
      req.headers.get("origin") &&
      req.headers.get("origin") !== new URL(req.url).origin
    )
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    const actor = await requireStaffSession(req, ["admin"]);
    const body = await req.json();
    const uuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (
      !uuid.test(body.pupilId ?? "") ||
      !uuid.test(body.requestId ?? "") ||
      body.verifiedGuardian !== true ||
      typeof body.reason !== "string" ||
      body.reason.trim().length < 3
    )
      return NextResponse.json(
        {
          error:
            "Verify the guardian and provide a pupil, request identifier and reason.",
        },
        { status: 400 },
      );
    const url = new URL("/account/access", config.appUrl);
    if (process.env.NODE_ENV === "production" && url.protocol !== "https:")
      throw Object.assign(new Error("Configure the public HTTPS school URL."), {
        statusCode: 503,
      });
    const token = deriveStudentAccessToken(
      body.requestId,
      actor.staffId,
      body.pupilId,
    );
    const result = await studentPasswordRpc("issue_student_access", {
      p_staff: actor.staffId,
      p_request: body.requestId,
      p_pupil: body.pupilId,
      p_hash: tokenHash(token),
      p_reason: body.reason.trim(),
    });
    url.hash = token;
    return NextResponse.json(
      { ...result, activationUrl: url.href },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (err) {
    const e = err as Error & { statusCode?: number };
    return NextResponse.json(
      { error: e.message },
      { status: e.statusCode ?? 400 },
    );
  }
}
