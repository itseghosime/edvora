import { NextRequest, NextResponse } from "next/server";
import { requireStaffSession } from "@/lib/auth/session";
import { executeStaffCommand } from "@/lib/services/staffCommands";
export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin");
    if (origin && origin !== new URL(req.url).origin)
      return NextResponse.json(
        { error: "Request origin is not allowed" },
        { status: 403 },
      );
    const actor = await requireStaffSession(req);
    const text = await req.text();
    if (text.length > 100000)
      return NextResponse.json(
        { error: "Request is too large" },
        { status: 413 },
      );
    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: true, ...(await executeStaffCommand(actor, body)) },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (err: unknown) {
    const error = err as Error & { statusCode?: number };
    return NextResponse.json(
      { error: error.statusCode ? error.message : "Unable to save changes." },
      { status: error.statusCode ?? 500 },
    );
  }
}
