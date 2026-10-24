import { NextRequest, NextResponse } from "next/server";
import { verifyAutomationRequest } from "@/lib/services/authService";
import { getSupabaseAdmin } from "@/lib/supabase/client";
import { verifyPayment } from "@/lib/services/paymentsService";
export async function POST(req: NextRequest) {
  if (!verifyAutomationRequest(req.headers.get("authorization")))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    if (!body.job_id || !body.claim_token || !body.reference)
      return NextResponse.json(
        { error: "Payment job, claim and reference are required" },
        { status: 400 },
      );
    const client = getSupabaseAdmin();
    if (!client)
      return NextResponse.json(
        { error: "School database is not configured" },
        { status: 503 },
      );
    const { data, error } = await client
      .from("payment_intents")
      .select("id,claim_token,lease_expires_at,status,reference")
      .eq("id", body.job_id)
      .eq("reference", body.reference)
      .maybeSingle();
    if (error) throw error;
    if (
      !data ||
      data.claim_token !== body.claim_token ||
      !data.lease_expires_at ||
      Date.parse(data.lease_expires_at) <= Date.now()
    )
      return NextResponse.json(
        { error: "Payment claim is not owned or has expired" },
        { status: 403 },
      );
    // Re-verify server-side; an automation worker cannot fabricate a provider transaction.
    return NextResponse.json(await verifyPayment(body.reference));
  } catch {
    return NextResponse.json(
      { error: "Unable to reconcile payment" },
      { status: 400 },
    );
  }
}
