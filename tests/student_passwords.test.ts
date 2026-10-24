import { afterEach, describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import {
  hashStudentPassword,
  verifyStudentPassword,
  validateNewPassword,
  deriveStudentAccessToken,
} from "../src/lib/auth/studentPasswords";
import { POST as issue } from "../src/app/api/auth/student-access/route";
import { POST as redeem } from "../src/app/api/auth/student-access/redeem/route";
import { createSessionToken } from "../src/lib/auth/session";
import * as clients from "../src/lib/supabase/client";
const uuid = "11111111-1111-4111-8111-111111111111";
afterEach(() => vi.restoreAllMocks());
describe("Student password and recovery boundary", () => {
  it("stores salted memory-hard hashes and verifies exact passwords", async () => {
    const password = "A private school password";
    const first = await hashStudentPassword(password);
    const second = await hashStudentPassword(password);
    expect(first).not.toBe(second);
    expect(first).not.toContain(password);
    expect(await verifyStudentPassword(password, first)).toBe(true);
    expect(await verifyStudentPassword(password + " ", first)).toBe(false);
    expect(await verifyStudentPassword("wrong password", first)).toBe(false);
    expect(await verifyStudentPassword(password, null)).toBe(false);
  });
  it("rejects weak or unbounded new passwords", () => {
    for (const p of ["short", " ".repeat(20), "x".repeat(129), null])
      expect(() => validateNewPassword(p)).toThrow("12–128");
  });
  it("derives retry-stable opaque access proofs scoped to the administrator and pupil", () => {
    const proof = deriveStudentAccessToken(uuid, uuid, uuid);
    expect(proof).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(deriveStudentAccessToken(uuid, uuid, uuid)).toBe(proof);
    expect(
      deriveStudentAccessToken(
        uuid,
        uuid,
        "22222222-2222-4222-8222-222222222222",
      ),
    ).not.toBe(proof);
  });
  it("requires administrator authentication before issuing a proof", async () => {
    const response = await issue(
      new NextRequest("http://localhost/api/auth/student-access", {
        method: "POST",
        body: "{}",
      }),
    );
    expect(response.status).toBe(401);
    const token = createSessionToken({
      type: "staff",
      userId: uuid,
      staffId: uuid,
      role: "teacher",
      email: "teacher@test.invalid",
      name: "Teacher",
      assignedClassIds: [],
    });
    const denied = await issue(
      new NextRequest("http://localhost/api/auth/student-access", {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
        body: "{}",
      }),
    );
    expect(denied.status).toBe(403);
  });
  it("requires guardian verification and never accepts cross-origin reset requests", async () => {
    const token = createSessionToken({
      type: "staff",
      userId: uuid,
      staffId: uuid,
      role: "admin",
      email: "admin@test.invalid",
      name: "Admin",
      assignedClassIds: [],
    });
    const response = await issue(
      new NextRequest("http://localhost/api/auth/student-access", {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
        body: JSON.stringify({
          pupilId: uuid,
          requestId: uuid,
          reason: "Recovery",
        }),
      }),
    );
    expect(response.status).toBe(400);
    const cross = await redeem(
      new NextRequest("http://localhost/api/auth/student-access/redeem", {
        method: "POST",
        headers: { origin: "https://other.invalid" },
        body: "{}",
      }),
    );
    expect(cross.status).toBe(403);
  });
  it("rejects unavailable proofs before doing password derivation or writing a credential", async () => {
    const rpc = vi
      .fn()
      .mockImplementation(async (name: string) => ({
        data: name === "consume_login_budget" ? { allowed: true } : false,
        error: null,
      }));
    vi.spyOn(clients, "getSupabaseAdmin").mockReturnValue({ rpc } as any);
    const response = await redeem(
      new NextRequest("http://localhost/api/auth/student-access/redeem", {
        method: "POST",
        body: JSON.stringify({
          token: "a".repeat(43),
          password: "A private school password",
        }),
      }),
    );
    expect(response.status).toBe(400);
    expect(rpc.mock.calls.map((c) => c[0])).toEqual([
      "consume_login_budget",
      "student_access_is_valid",
    ]);
  });
});
