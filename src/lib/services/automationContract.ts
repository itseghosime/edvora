export const OUTCOME_STATUSES = [
  "accepted",
  "sent",
  "failed",
  "rejected",
  "unknown",
  "skipped",
] as const;
export type OutcomeStatus = (typeof OUTCOME_STATUSES)[number];
export type SchoolOutcome = {
  job_id: string;
  claim_token: string;
  attempt_id: string | null;
  attempt_token: string | null;
  status: OutcomeStatus;
  provider_message_id?: string | null;
  error_message?: string | null;
  retryable?: boolean;
};
export function parseSchoolOutcome(
  body: Record<string, unknown>,
): SchoolOutcome {
  const fail = (message: string): never => {
    throw Object.assign(new Error(message), { statusCode: 400 });
  };
  if (
    typeof body.job_id !== "string" ||
    !body.job_id ||
    typeof body.claim_token !== "string" ||
    !body.claim_token ||
    !OUTCOME_STATUSES.includes(body.status as OutcomeStatus)
  )
    return fail("Valid job ownership and outcome status are required");
  if (
    body.status !== "skipped" &&
    (typeof body.attempt_id !== "string" ||
      !body.attempt_id ||
      typeof body.attempt_token !== "string" ||
      !body.attempt_token)
  )
    return fail("Attempt ownership is required");
  if (
    body.provider_message_id != null &&
    (typeof body.provider_message_id !== "string" ||
      body.provider_message_id.length > 64)
  )
    return fail("Invalid provider message identifier");
  return {
    job_id: body.job_id,
    claim_token: body.claim_token,
    attempt_id: typeof body.attempt_id === "string" ? body.attempt_id : null,
    attempt_token:
      typeof body.attempt_token === "string" ? body.attempt_token : null,
    status: body.status as OutcomeStatus,
    provider_message_id: body.provider_message_id as string | null | undefined,
    error_message:
      typeof body.reason === "string"
        ? body.reason
        : typeof body.error_message === "string"
          ? body.error_message
          : null,
    retryable: body.retryable === true,
  };
}
