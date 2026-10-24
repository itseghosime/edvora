import { describe, it, expect } from "vitest";
import { requireLocalDemoDatabase } from "../scripts/demo-database.mjs";

describe("demo database isolation", () => {
  it("requires an explicit disposable local target", () => {
    for (const value of [undefined, "", "postgres://u:p@db.example.com/edvora_test",
      "postgres://u:p@localhost/edvora_test?host=remote.example", "postgres://u:p@localhost/production", "https://localhost/edvora_test"]) {
      expect(() => requireLocalDemoDatabase(value)).toThrow();
    }
  });
  it("accepts supported loopback test targets", () => {
    for (const value of ["postgres://postgres@localhost:5433/edvora_test",
      "postgresql://postgres@127.0.0.1/edvora_ci", "postgres://postgres@[::1]/edvora_demo"]) {
      expect(requireLocalDemoDatabase(value)).toBe(value);
    }
  });
});
