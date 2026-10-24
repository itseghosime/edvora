import { NextRequest, NextResponse } from "next/server";
import { verifyAutomationRequest } from "@/lib/services/authService";
import { db } from "@/lib/db/supabaseRepository";

export async function POST(req: NextRequest) {
  const isAuth = verifyAutomationRequest(req.headers.get("authorization"));
  if (!isAuth) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid service key" },
      { status: 401 },
    );
  }

  try {
    const body = await req.json();
    const runId = body.run_id || `run-sms-${Date.now()}`;
    const limit = Number(body.limit) || 100;

    const events = await db.claimSmsDeliveryEvents(runId, limit);
    return NextResponse.json({ events });
  } catch (err: unknown) {
    const error = err as Error & { statusCode?: number };
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode ?? 400 },
    );
  }
}
