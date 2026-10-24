import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
type Node = {
  name: string;
  type: string;
  retryOnFail?: boolean;
  parameters: Record<string, unknown>;
};
const read = (id: string) =>
  JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "workflows/n8n", id + ".json"),
      "utf8",
    ),
  ) as { active: boolean; nodes: Node[] };
describe("Inactive n8n contract snapshots", () => {
  it("keeps every Edvora workflow inactive", () => {
    for (const id of ["WF01", "WF02", "WF03", "WF04", "WF05"])
      expect(read(id).active).toBe(false);
  });
  for (const id of ["WF01", "WF05"]) {
    it(`${id} preserves ownership and only retries definitive rate limits`, () => {
      const nodes = read(id).nodes;
      const sends = nodes.filter((n) => n.name.startsWith("Send "));
      expect(sends.length).toBe(2);
      for (const n of sends) expect(n.retryOnFail).toBe(false);
      const claim = nodes.find((n) => n.name.startsWith("Claim "))!;
      expect(String(claim.parameters.jsonBody)).toContain("limit:10");
      const save = nodes.find((n) => n.name === "Save Channel Outcome")!;
      for (const field of [
        "claim_token",
        "attempt_id",
        "attempt_token",
        "retryable",
      ])
        expect(save.parameters.jsonBody).toContain(field);
      const code = String(
        nodes.find((n) => n.name === "Record SMS Outcome")!.parameters.jsCode,
      );
      const job = { job_id: "owned-job", claim_token: "owned-claim" };
      const execute = (response: unknown) =>
        new Function("$", "$input", code)(() => ({ item: { json: job } }), {
          first: () => ({ json: response }),
        })[0].json;
      expect(
        execute({ statusCode: 200, body: { message_id: "provider-id" } }),
      ).toMatchObject({ ...job, status: "accepted", retryable: false });
      expect(execute({ statusCode: 429, body: {} })).toMatchObject({
        status: "failed",
        retryable: true,
      });
      expect(execute({ statusCode: 401, body: {} })).toMatchObject({
        status: "rejected",
        retryable: false,
      });
      for (const response of [
        { error: "timeout" },
        { statusCode: 500, body: {} },
        { statusCode: 200, body: {} },
      ])
        expect(execute(response)).toMatchObject({
          status: "unknown",
          retryable: false,
        });
    });
  }
});
