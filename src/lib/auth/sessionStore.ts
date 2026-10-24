import { createHash } from "crypto";
import { getSupabaseAdmin } from "../supabase/client";
import type { SessionActor } from "./session";
export const tokenHash = (token: string) =>
  createHash("sha256").update(token).digest("hex");
export async function validateStoredSession(
  actor: SessionActor,
  token: string,
): Promise<SessionActor | null> {
  const client = getSupabaseAdmin();
  // Isolated unit suites use signed fixtures without an external database.
  if (!client && process.env.NODE_ENV === "test") return actor;
  if (!client)
    throw Object.assign(new Error("Authentication service is unavailable."), {
      statusCode: 503,
    });
  const { data, error } = await client.rpc("check_portal_session", {
    p_hash: tokenHash(token),
    p_type: actor.type,
    p_subject: actor.type === "staff" ? actor.staffId : actor.pupilId,
    p_version: actor.authVersion,
  });
  if (error)
    throw Object.assign(new Error("Unable to verify current account access."), {
      statusCode: 503,
    });
  if (!data) return null;
  return { ...actor, ...data };
}
export async function revokeStoredToken(actor: SessionActor, token: string) {
  const client = getSupabaseAdmin();
  if (!client && process.env.NODE_ENV === "test") return;
  if (!client)
    throw Object.assign(new Error("Authentication service is unavailable."), {
      statusCode: 503,
    });
  const { error } = await client
    .from("revoked_portal_tokens")
    .upsert(
      {
        token_hash: tokenHash(token),
        expires_at: new Date(actor.exp * 1000).toISOString(),
      },
      { onConflict: "token_hash" },
    );
  if (error)
    throw Object.assign(
      new Error("Unable to revoke this session. Please retry sign out."),
      { statusCode: 503 },
    );
}
