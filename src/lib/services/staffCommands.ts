import { getSupabaseAdmin } from "../supabase/client";
import type { StaffSessionActor } from "../auth/session";

const commands = new Set([
  "create_class",
  "configure_term",
  "register_pupil",
  "update_pupil_status",
  "save_fee_plan",
  "assign_fees",
  "adjust_fee",
  "save_result",
  "set_result_status",
  "set_result_fee_override",
  "save_reminder",
  "save_settings",
  "toggle_reminder",
]);
export function validateStaffCommand(body: unknown) {
  const fail = (message: string): never => {
    throw Object.assign(new Error(message), { statusCode: 400 });
  };
  if (!body || typeof body !== "object" || Array.isArray(body))
    return fail("Invalid request");
  const value = body as Record<string, unknown>;
  if (
    typeof value.requestId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      value.requestId,
    )
  )
    return fail("A valid request identifier is required");
  if (typeof value.command !== "string" || !commands.has(value.command))
    return fail("Unsupported staff command");
  if (
    !value.payload ||
    typeof value.payload !== "object" ||
    Array.isArray(value.payload)
  )
    return fail("Invalid command details");
  const payload = value.payload as Record<string, unknown>;
  for (const [key, item] of Object.entries(payload)) {
    if (
      key.endsWith("Id") &&
      (typeof item !== "string" || !/^[0-9a-f-]{36}$/i.test(item))
    )
      return fail("Select a valid " + key.replace("Id", ""));
    if (typeof item === "string" && item.length > 2000)
      return fail("A text field is too long");
  }
  for (const key of ["amountMinor", "minimumMinor", "daysBeforeEnd"]) {
    if (
      key in payload &&
      (typeof payload[key] !== "number" ||
        !Number.isSafeInteger(payload[key]) ||
        Number(payload[key]) < 0 ||
        Number(payload[key]) > 10000000000)
    )
      return fail("Enter a valid whole minor-unit amount or day count");
  }
  if (value.command === "set_result_fee_override" && (
    typeof payload.allowAccess !== "boolean" || typeof payload.reason !== "string" ||
    payload.reason.trim().length < 3 || payload.reason.trim().length > 1000 || typeof payload.resultId !== "string"
  )) return fail("Select a report, choose access and provide a reason (3–1000 characters)");
  if (value.command === "save_result") {
    if (
      !Array.isArray(payload.subjects) ||
      payload.subjects.length < 1 ||
      payload.subjects.length > 30
    )
      return fail("Enter between 1 and 30 subjects");
    const names = new Set<string>();
    for (const subject of payload.subjects) {
      if (
        !subject ||
        typeof subject !== "object" ||
        typeof subject.subject !== "string" ||
        !subject.subject.trim() ||
        subject.subject.length > 64 ||
        typeof subject.ca !== "number" ||
        !Number.isFinite(subject.ca) ||
        subject.ca < 0 ||
        subject.ca > 40 ||
        typeof subject.exam !== "number" ||
        !Number.isFinite(subject.exam) ||
        subject.exam < 0 ||
        subject.exam > 60
      )
        return fail("Every subject needs a name, CA 0–40 and exam 0–60");
      const name = subject.subject.trim().toLowerCase();
      if (names.has(name)) return fail("Subject names must be unique");
      names.add(name);
    }
  }
  return { requestId: value.requestId, command: value.command, payload };
}
export async function executeStaffCommand(
  actor: StaffSessionActor,
  body: unknown,
) {
  const input = validateStaffCommand(body);
  const client = getSupabaseAdmin();
  if (!client)
    throw Object.assign(new Error("The school database is not configured."), {
      statusCode: 503,
    });
  const { data, error } = await client.rpc("execute_staff_command", {
    p_staff_id: actor.staffId,
    p_request_id: input.requestId,
    p_command: input.command,
    p_payload: input.payload,
  });
  if (error) {
    const status =
      error.code === "42501"
        ? 403
        : error.code === "23505"
          ? 409
          : [
                "22023",
                "23503",
                "23502",
                "23514",
                "22P02",
                "22007",
                "22008",
                "22003",
              ].includes(error.code)
            ? 400
            : 500;
    const message =
      status === 500
        ? "Unable to save this change."
        : status === 409
          ? "This record already exists."
          : error.code === "23503"
            ? "A selected school record is no longer available."
            : error.code === "42501"
              ? error.message
              : error.code === "22023"
                ? error.message
                : "Check the required fields and values.";
    throw Object.assign(new Error(message), { statusCode: status });
  }
  return data as {
    id: string;
    admissionNumber?: string;
    assignedCount?: number;
    status?: string;
  };
}
