import { afterEach, describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { createSessionToken, getSession } from "../src/lib/auth/session";
import { tokenHash } from "../src/lib/auth/sessionStore";
import { parseSchoolOutcome } from "../src/lib/services/automationContract";
import { mapTermiiProviderStatus } from "../src/lib/services/smsStatus";
import {
  DELETE as logout,
  POST as login,
} from "../src/app/api/auth/login/route";
import { db } from "../src/lib/db/supabaseRepository";
import { store } from "../src/lib/db/store";
import * as clients from "../src/lib/supabase/client";
const actor = {
  type: "staff" as const,
  userId: "44444444-4444-4444-4444-000000000001",
  staffId: "44444444-4444-4444-4444-000000000001",
  role: "admin" as const,
  email: "admin@test.invalid",
  name: "Test",
  assignedClassIds: [],
};
afterEach(() => vi.restoreAllMocks());
describe("Revocable sessions and provider ownership", () => {
  it("uses the current persisted role instead of the signed role", async () => {
    const token = createSessionToken(actor);
    const rpc = vi.fn().mockResolvedValue({
      data: {
        role: "teacher",
        assignedClassIds: ["class-b"],
        name: "Teacher",
      },
      error: null,
    });
    vi.spyOn(clients, "getSupabaseAdmin").mockReturnValue({ rpc } as any);
    const session = await getSession(
      new NextRequest("http://localhost", {
        headers: { authorization: `Bearer ${token}` },
      }),
    );
    expect(session).toMatchObject({
      type: "staff",
      role: "teacher",
      assignedClassIds: ["class-b"],
    });
    expect(rpc.mock.calls[0][1].p_hash).toBe(tokenHash(token));
  });
  it("denies revoked/deactivated sessions and fails closed on lookup errors", async () => {
    const token = createSessionToken(actor);
    const rpc = vi
      .fn()
      .mockResolvedValueOnce({ data: null, error: null })
      .mockResolvedValueOnce({ data: null, error: { message: "offline" } });
    vi.spyOn(clients, "getSupabaseAdmin").mockReturnValue({ rpc } as any);
    const req = new NextRequest("http://localhost", {
      headers: { authorization: `Bearer ${token}` },
    });
    expect(await getSession(req)).toBeNull();
    await expect(getSession(req)).rejects.toMatchObject({ statusCode: 503 });
  });
  it("revokes only the token hash before clearing the logout cookie", async () => {
    const token = createSessionToken(actor);
    const upsert = vi.fn().mockResolvedValue({ error: null });
    vi.spyOn(clients, "getSupabaseAdmin").mockReturnValue({
      from: () => ({ upsert }),
    } as any);
    const response = await logout(
      new NextRequest("http://localhost/api/auth/login", {
        method: "DELETE",
        headers: { cookie: `edvora_session=${token}` },
      }),
    );
    expect(response.status).toBe(200);
    expect(upsert.mock.calls[0][0]).toMatchObject({
      token_hash: tokenHash(token),
    });
    expect(JSON.stringify(upsert.mock.calls)).not.toContain(token);
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
  });
  it("does not claim logout succeeded when revocation persistence fails", async () => {
    const token = createSessionToken(actor);
    vi.spyOn(clients, "getSupabaseAdmin").mockReturnValue({
      from: () => ({ upsert: async () => ({ error: { message: "offline" } }) }),
    } as any);
    const response = await logout(
      new NextRequest("http://localhost/api/auth/login", {
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` },
      }),
    );
    expect(response.status).toBe(503);
    expect(response.headers.get("set-cookie")).toBeNull();
  });
  it("requires the verified Auth user to match the persisted staff profile", async () => {
    vi.spyOn(clients, "getSupabaseAdmin").mockReturnValue({
      rpc: vi.fn().mockResolvedValue({ data: { allowed: true }, error: null }),
      auth: {
        signInWithPassword: async () => ({
          data: { user: { id: "other-auth-user" } },
          error: null,
        }),
      },
    } as any);
    vi.spyOn(db, "getStaffByEmail").mockResolvedValue({
      ...store.staffProfiles[0],
      userId: "authorized-auth-user",
    });
    const response = await login(
      new NextRequest("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          type: "staff",
          email: "admin@test.invalid",
          password: "valid-password",
        }),
      }),
    );
    expect(response.status).toBe(401);
  });
  it("accepts a denied-send acknowledgement without an invented attempt", () => {
    expect(
      parseSchoolOutcome({
        job_id: "job",
        claim_token: "claim",
        status: "skipped",
        attempt_id: null,
        attempt_token: null,
      }),
    ).toMatchObject({ attempt_id: null, status: "skipped" });
  });
  it("accepts channel outcomes and preserves review/retry metadata", () => {
    for (const status of ["sent", "accepted", "unknown", "rejected", "failed"])
      expect(
        parseSchoolOutcome({
          job_id: "job",
          claim_token: "claim",
          attempt_id: "attempt",
          attempt_token: "attempt-token",
          status,
          reason: "timeout",
          retryable: true,
        }),
      ).toMatchObject({ status, error_message: "timeout", retryable: true });
    expect(() =>
      parseSchoolOutcome({
        job_id: "job",
        attempt_id: "attempt",
        attempt_token: "token",
        status: "accepted",
      }),
    ).toThrow("ownership");
    expect(() =>
      parseSchoolOutcome({
        job_id: "job",
        claim_token: "claim",
        attempt_id: "attempt",
        attempt_token: "token",
        status: "delivered",
      }),
    ).toThrow("status");
  });
  it("does not interpret a generic success response as confirmed SMS delivery", () => {
    expect(mapTermiiProviderStatus("success")).toBe("unknown");
    expect(mapTermiiProviderStatus("delivered")).toBe("delivered");
  });
  it("returns Retry-After before checking credentials when the account budget is exhausted", async () => {
    const signInWithPassword = vi.fn();
    const rpc = vi
      .fn()
      .mockResolvedValue({
        data: { allowed: false, retry_after: 900 },
        error: null,
      });
    vi.spyOn(clients, "getSupabaseAdmin").mockReturnValue({
      rpc,
      auth: { signInWithPassword },
    } as any);
    const response = await login(
      new NextRequest("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          type: "staff",
          email: "private@test.invalid",
          password: "not-checked",
        }),
      }),
    );
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("900");
    expect(signInWithPassword).not.toHaveBeenCalled();
    expect(rpc.mock.calls[0][1].p_key).toMatch(/^[a-f0-9]{64}$/);
    expect(JSON.stringify(rpc.mock.calls)).not.toContain(
      "private@test.invalid",
    );
  });
  it("does not authorize new logins when the budget store is unavailable", async () => {
    const rpc = vi
      .fn()
      .mockResolvedValue({ data: null, error: { message: "offline" } });
    vi.spyOn(clients, "getSupabaseAdmin").mockReturnValue({
      rpc,
      auth: { signInWithPassword: vi.fn() },
    } as any);
    const response = await login(
      new NextRequest("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          type: "staff",
          email: "private@test.invalid",
          password: "not-checked",
        }),
      }),
    );
    expect(response.status).toBe(503);
  });
});
