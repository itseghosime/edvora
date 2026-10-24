import { createHash } from "crypto";
import { getSupabaseAdmin } from "../supabase/client";
export async function consumeLoginBudget(type: string, identifier: string) {
  const client = getSupabaseAdmin();
  if (!client && process.env.NODE_ENV === "test") return;
  if (!client)
    throw Object.assign(new Error("Authentication service is unavailable."), {
      statusCode: 503,
    });
  const key = createHash("sha256")
    .update(type + "|" + identifier.trim().toLowerCase())
    .digest("hex");
  const { data, error } = await client.rpc("consume_login_budget", {
    p_key: key,
  });
  if (error || !data)
    throw Object.assign(new Error("Unable to check login availability."), {
      statusCode: 503,
    });
  if (data.allowed !== true)
    throw Object.assign(
      new Error("Too many login attempts. Please wait before trying again."),
      { statusCode: 429, retryAfter: Number(data.retry_after) || 900 },
    );
}
