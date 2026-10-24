import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { db } from "@/lib/db/supabaseRepository";
import { config } from "@/lib/config";
export async function POST(req: NextRequest) {
  try {
    const expected = config.termii.webhookSecret;
    if (!expected)
      return NextResponse.json(
        { error: "Webhook authentication is not configured" },
        { status: 503 },
      );
    const supplied =
      req.headers.get("x-termii-token") ||
      new URL(req.url).searchParams.get("token") ||
      "";
    const a = Buffer.from(supplied),
      b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b))
      return NextResponse.json(
        { error: "Webhook authentication failed" },
        { status: 401 },
      );
    const payload = await req.json();
    if (!payload || typeof payload !== "object" || Array.isArray(payload))
      return NextResponse.json(
        { error: "Invalid delivery report" },
        { status: 400 },
      );
    const event = await db.ingestTermiiWebhook(payload, true);
    return NextResponse.json({
      received: true,
      event_id: event.id,
      source_authenticated: true,
    });
  } catch (err: unknown) {
    const error = err as Error & { statusCode?: number };
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode ?? 400 },
    );
  }
}
