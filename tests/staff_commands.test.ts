import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { validateStaffCommand } from "../src/lib/services/staffCommands";
import { POST } from "../src/app/api/staff/commands/route";
const requestId = "a1111111-1111-4111-8111-111111111111";
describe("Staff command API boundary", () => {
  it("requires authentication before parsing or saving a command", async () => {
    const response = await POST(
      new NextRequest("http://localhost/api/staff/commands", {
        method: "POST",
        body: "{}",
      }),
    );
    expect(response.status).toBe(401);
  });
  it("rejects cross-origin cookie requests before database access", async () => {
    const response = await POST(
      new NextRequest("http://localhost/api/staff/commands", {
        method: "POST",
        headers: { origin: "https://other.example" },
        body: "{}",
      }),
    );
    expect(response.status).toBe(403);
  });
  it("requires a reusable request identifier for all writes", () => {
    expect(() =>
      validateStaffCommand({ command: "adjust_fee", payload: {} }),
    ).toThrow("request identifier");
  });
  it("rejects unsupported commands and fractional financial minor units", () => {
    expect(() =>
      validateStaffCommand({
        requestId,
        command: "credit_balance",
        payload: {},
      }),
    ).toThrow("Unsupported");
    expect(() =>
      validateStaffCommand({
        requestId,
        command: "adjust_fee",
        payload: { amountMinor: 0.25 },
      }),
    ).toThrow("whole minor-unit");
  });
  it("rejects invalid and duplicate subject scores", () => {
    const command = (subjects: unknown[]) => ({
      requestId,
      command: "save_result",
      payload: { subjects },
    });
    expect(() =>
      validateStaffCommand(command([{ subject: "Maths", ca: 41, exam: 10 }])),
    ).toThrow("CA 0");
    expect(() =>
      validateStaffCommand(
        command([
          { subject: "Maths", ca: 30, exam: 60 },
          { subject: " maths ", ca: 20, exam: 50 },
        ]),
      ),
    ).toThrow("unique");
  });
});
