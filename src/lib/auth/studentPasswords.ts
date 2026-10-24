import { createHmac, randomBytes, scrypt, timingSafeEqual } from "crypto";

import { getSupabaseAdmin } from "../supabase/client";
import { getSessionSecret } from "./session";

const pattern = /^scrypt-v1\$([0-9a-f]{32})\$([0-9a-f]{128})$/;
export function validateNewPassword(value: unknown): asserts value is string {
  if (
    typeof value !== "string" ||
    value.trim().length < 12 ||
    value.length > 128
  )
    throw Object.assign(new Error("Use a password of 12–128 characters."), {
      statusCode: 400,
    });
}
async function derive(password: string, salt: string) {
  return await new Promise<Buffer>((resolve, reject) =>
    scrypt(
      password,
      salt,
      64,
      { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 },
      (error, key) => (error ? reject(error) : resolve(key)),
    ),
  );
}
export async function hashStudentPassword(password: string) {
  validateNewPassword(password);
  const salt = randomBytes(16).toString("hex");
  return `scrypt-v1$${salt}$${(await derive(password, salt)).toString("hex")}`;
}
export async function verifyStudentPassword(
  password: unknown,
  encoded: string | null,
) {
  if (typeof password !== "string" || password.length > 128) return false;
  const match = encoded?.match(pattern);
  const salt = match?.[1] ?? "0".repeat(32);
  const expected = Buffer.from(match?.[2] ?? "0".repeat(128), "hex");
  const actual = await derive(password, salt);
  return timingSafeEqual(actual, expected) && Boolean(match);
}
export function deriveStudentAccessToken(
  requestId: string,
  staffId: string,
  pupilId: string,
) {
  return createHmac("sha256", getSessionSecret())
    .update(`edvora-student-access-v1\n${requestId}\n${staffId}\n${pupilId}`)
    .digest("base64url");
}
export type StudentCredential = {
  pupilId: string;
  admissionNumber: string;
  passwordHash: string;
  authVersion: number;
  name: string;
  className: string;
  guardianId?: string;
};
export async function studentPasswordRpc(
  name: string,
  params: Record<string, unknown>,
) {
  const client = getSupabaseAdmin();
  if (!client)
    throw Object.assign(new Error("Account service is unavailable."), {
      statusCode: 503,
    });
  const { data, error } = await client.rpc(name, params);
  if (error)
    throw Object.assign(
      new Error(
        error.code === "42501"
          ? "Account access is not permitted."
          : error.code === "22023"
            ? error.message
            : "Unable to update account access.",
      ),
      {
        statusCode:
          error.code === "42501" ? 403 : error.code === "22023" ? 400 : 503,
      },
    );
  return data;
}
export async function readStudentCredential(
  admission: string,
): Promise<StudentCredential | null> {
  return studentPasswordRpc("read_student_credential", {
    p_admission: admission,
  });
}
