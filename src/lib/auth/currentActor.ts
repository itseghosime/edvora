import { getSupabaseAdmin } from "../supabase/client";
import type { SessionActor } from "./session";
/** Recheck current account status and class permissions for every portal snapshot. */
export async function currentActor(actor: SessionActor): Promise<SessionActor> {
  const client = getSupabaseAdmin();
  if (!client)
    throw Object.assign(new Error("The school database is not configured."), {
      statusCode: 503,
    });
  if (actor.type === "staff") {
    const { data, error } = await client
      .from("staff_profiles")
      .select("*")
      .eq("id", actor.staffId)
      .eq("is_active", true)
      .maybeSingle();
    if (error) throw new Error("Unable to check staff access");
    if (!data)
      throw Object.assign(
        new Error("This staff account no longer has access."),
        { statusCode: 403 },
      );
    return {
      ...actor,
      role: data.role,
      assignedClassIds: data.assigned_class_ids ?? [],
      name: data.full_name,
    };
  }
  const { data, error } = await client
    .from("pupils")
    .select("id,status")
    .eq("id", actor.pupilId)
    .maybeSingle();
  if (error) throw new Error("Unable to check pupil access");
  if (!data || data.status !== "active")
    throw Object.assign(new Error("This pupil account is not active."), {
      statusCode: 403,
    });
  return actor;
}
