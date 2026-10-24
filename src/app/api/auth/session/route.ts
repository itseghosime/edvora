import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
export async function GET(req: NextRequest) {
  try {
    const actor = await getSession(req);
    return NextResponse.json(
      actor ? { actor } : { error: "Authentication required" },
      {
        status: actor ? 200 : 401,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to verify current account access." },
      { status: 503 },
    );
  }
}
