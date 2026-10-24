// Demo scripts are restricted to disposable local databases.
export function requireLocalDemoDatabase(value) {
  if (!value) throw new Error("Set DATABASE_URL explicitly to a disposable local Edvora database.");
  const url = new URL(value);
  if (!["postgres:", "postgresql:"].includes(url.protocol) ||
      !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) ||
      !/^\/(edvora_test|edvora_ci|edvora_demo)$/.test(url.pathname)) {
    throw new Error("Demo scripts only support local edvora_test, edvora_ci or edvora_demo databases.");
  }
  return value;
}
