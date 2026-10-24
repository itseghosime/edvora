// UI smoke only: responses are mocked; real transactions are verified separately in PostgreSQL.
import { chromium } from "playwright";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { createHmac, createHash, randomBytes, randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
const secret = randomBytes(48).toString("hex");
const port = 3217;
const base = `http://127.0.0.1:${port}`;
const uid = (n) => `${String(n).padStart(8, "0")}-1111-4111-8111-111111111111`;
const actor = {
  authVersion: 0,
  jti: randomUUID(),
  type: "staff",
  userId: uid(10),
  staffId: uid(10),
  role: "admin",
  name: "UI Test Administrator",
  email: "ui@test.invalid",
  assignedClassIds: [],
  exp: Math.floor(Date.now() / 1000) + 600,
};
const pupil = {
  id: uid(20),
  fullName: "UI Test Pupil",
  admissionNo: "EDV/UI/001",
  classId: uid(1),
  classGrade: "Primary 1A",
  gender: "Female",
  dateOfBirth: "2018-05-12",
  guardianName: "UI Test Guardian",
  guardianPhone: "+2348012345678",
  guardianEmail: "",
  guardianRelationship: "Guardian",
  charges: 100000,
  paid: 20000,
  balance: 80000,
  status: "Active",
  remindersEnabled: false,
  assignmentId: uid(30),
};
const snapshot = {
  staffRole: "admin",
  currentTerm: {
    id: uid(2),
    name: "First Term",
    sessionName: "2026/2027",
    startDate: "2026-09-01",
    endDate: "2026-12-20",
  },
  termId: uid(2),
  classes: [{ id: uid(1), name: "Primary 1A" }],
  pupils: [pupil],
  payments: [],
  results: [],
  rules: [],
  logs: [],
  feeItems: [],
  feePlans: [
    {
      id: uid(40),
      classId: uid(1),
      name: "Term tuition",
      amountMinor: 10000000,
    },
  ],
  assignments: [
    {
      id: uid(30),
      pupilId: uid(20),
      amountMinor: 10000000,
      baseAmountMinor: 10000000,
    },
  ],
  summary: {
    session: "2026/2027",
    term: "First Term",
    totalPupils: 1,
    totalCharges: 100000,
    verifiedPaid: 20000,
    totalBalance: 80000,
    collectionRate: 20,
  },
  classStats: [
    {
      className: "Primary 1A",
      pupils: 1,
      charges: 100000,
      paid: 20000,
      balance: 80000,
      rate: 20,
    },
  ],
  settings: {
    schoolName: "Edvora UI Test School",
    schoolShortName: "Edvora",
    academicSession: "2026/2027",
    currentTerm: "First Term",
    termStartDate: "2026-09-01",
    termEndDate: "2026-12-20",
    contactAddress: "",
    contactPhone: "",
    contactEmail: "",
    bursaryEmail: "",
    remindersEnabled: false,
    smsProvider: "Termii",
    telegramProvider: "Telegram",
    paymentGateway: "Paystack",
    feeWaiverAllowed: false,
  },
};
// Local PostgREST stub for the server-side session boundary; never a production bypass.
const revoked = new Set();
let signedHash = "";
const authDatabase = createServer(async (req, res) => {
  let text = "";
  for await (const chunk of req) text += chunk;
  res.setHeader("content-type", "application/json");
  if (
    req.url === "/rest/v1/rpc/check_portal_session" &&
    req.method === "POST"
  ) {
    const body = JSON.parse(text);
    const valid =
      body.p_hash === signedHash &&
      body.p_subject === actor.staffId &&
      body.p_version === 0 &&
      !revoked.has(body.p_hash);
    res.end(
      JSON.stringify(
        valid
          ? { role: actor.role, assignedClassIds: [], name: actor.name }
          : null,
      ),
    );
  } else if (
    req.url?.startsWith("/rest/v1/revoked_portal_tokens") &&
    req.method === "POST"
  ) {
    const body = JSON.parse(text);
    revoked.add(body.token_hash);
    res.statusCode = 201;
    res.end("");
  } else {
    res.statusCode = 500;
    res.end(JSON.stringify({ message: "Unexpected auth DB request" }));
  }
});
await new Promise((r) => authDatabase.listen(port + 1, "127.0.0.1", r));
const server = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    String(port),
  ],
  {
    env: {
      ...process.env,
      SESSION_SECRET: secret,
      NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${port + 1}`,
      SUPABASE_SERVICE_ROLE_KEY: "ci-only-mock-key",
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
let serverLog = "";
server.stdout.on("data", (d) => (serverLog += d));
server.stderr.on("data", (d) => (serverLog += d));
let browser;
let page;
const errors = [];
const requests = [];
let enrollAttempts = 0;
try {
  for (let i = 0; i < 40; i++) {
    try {
      if ((await fetch(base + "/login")).ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
    if (i === 39) throw Error("Server did not start: " + serverLog);
  }
  const unauth = await fetch(base + "/api/staff/commands", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  assert.equal(unauth.status, 401);
  browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  const payload = Buffer.from(JSON.stringify(actor)).toString("base64url");
  const token =
    payload +
    "." +
    createHmac("sha256", secret).update(payload).digest("base64url");
  signedHash = createHash("sha256").update(token).digest("hex");
  await context.addCookies([
    {
      name: "edvora_session",
      value: token,
      url: base,
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
  await page.route("**/api/**", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname === "/api/auth/session")
      return route.fulfill({ json: { actor } });
    if (url.pathname === "/api/portal")
      return route.fulfill({ json: snapshot });
    if (url.pathname === "/api/staff/commands") {
      const body = route.request().postDataJSON();
      requests.push(body);
      if (body.command === "register_pupil" && ++enrollAttempts === 1)
        return route.fulfill({
          status: 400,
          json: { error: "Selected class unavailable. Please retry." },
        });
      return route.fulfill({
        json: { success: true, id: uid(50), admissionNumber: "EDV/UI/002" },
      });
    }
    return route.fulfill({
      status: 501,
      json: { error: "Unexpected UI test request" },
    });
  });
  await mkdir("test-results/staff-ui", { recursive: true });
  const routes = [
    ["", "School overview"],
    ["pupils", "Pupils & guardians"],
    ["fees", "Fees & billing"],
    ["payments", "Payment ledger"],
    ["results", "Results & grading"],
    ["reminders", "Reminders & notices"],
    ["settings", "School settings"],
  ];
  for (const [path, title] of routes) {
    await page.goto(base + "/admin" + (path ? "/" + path : ""));
    await page.getByRole("heading", { name: title, exact: true }).waitFor();
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      `Desktop overflow: ${path}`,
    );
  }
  await page.goto(base + "/admin/pupils");
  await page.getByRole("button", { name: "Enroll pupil", exact: true }).click();
  for (const [label, value] of [
    ["First name", "UI"],
    ["Last name", "Enrollment"],
    ["Date of birth", "2018-05-12"],
    ["Guardian name", "UI Guardian"],
    ["Guardian phone (international format)", "+2348012345678"],
  ])
    await page.getByLabel(label, { exact: true }).fill(value);
  await page.getByLabel("Class", { exact: true }).selectOption(uid(1));
  await page
    .getByRole("button", { name: "Save enrollment", exact: true })
    .click();
  await page
    .getByRole("alert")
    .filter({ hasText: "Selected class unavailable" })
    .waitFor();
  assert.equal(
    await page.getByLabel("First name", { exact: true }).inputValue(),
    "UI",
  );
  await page
    .getByRole("button", { name: "Save enrollment", exact: true })
    .click();
  await page.getByText("EDV/UI/002", { exact: false }).waitFor();
  const enroll = requests.filter((r) => r.command === "register_pupil");
  assert.equal(enroll.length, 2);
  assert.equal(
    enroll[0].requestId,
    enroll[1].requestId,
    "Failed saves must preserve the retry key",
  );
  assert.equal(enroll[0].payload.dateOfBirth, "2018-05-12");
  await page.screenshot({
    path: "test-results/staff-ui/pupils-desktop.png",
    fullPage: true,
  });
  await page.goto(base + "/admin/results");
  await page
    .getByLabel("Start or edit a report", { exact: true })
    .selectOption(uid(20));
  await page.getByRole("button", { name: "Open editor", exact: true }).click();
  await page.getByLabel("Subject 1", { exact: true }).fill("Mathematics");
  await page.getByLabel("CA /40", { exact: true }).fill("36");
  await page.getByLabel("Exam /60", { exact: true }).fill("54");
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await page.getByRole("status").filter({ hasText: "Draft saved" }).waitFor();
  const saved = requests.find((r) => r.command === "save_result");
  assert.deepEqual(saved.payload.subjects, [
    { subject: "Mathematics", ca: 36, exam: 54 },
  ]);
  await page.screenshot({
    path: "test-results/staff-ui/results-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  for (const [path, title] of routes) {
    await page.goto(base + "/admin" + (path ? "/" + path : ""));
    await page.getByRole("heading", { name: title, exact: true }).waitFor();
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      `Mobile overflow: ${path}`,
    );
  }
  await page
    .getByRole("button", { name: "Toggle navigation", exact: true })
    .click();
  await page
    .getByRole("link", { name: "Pupils & Guardians", exact: true })
    .filter({ visible: true })
    .waitFor();
  await page.screenshot({
    path: "test-results/staff-ui/navigation-mobile.png",
    fullPage: true,
  });
  actor.role = "teacher";
  snapshot.staffRole = "teacher";
  snapshot.feePlans = [];
  snapshot.assignments = [];
  snapshot.payments = [];
  snapshot.summary.verifiedPaid = 0;
  snapshot.summary.totalBalance = 0;
  await page.goto(base + "/admin/results");
  await page
    .getByRole("heading", { name: "Results & grading", exact: true })
    .waitFor();
  assert.equal(
    await page.getByRole("button", { name: "Publish", exact: true }).count(),
    0,
  );
  await page.goto(base + "/admin/fees");
  await page
    .getByText("Your staff role does not have access to this section.")
    .waitFor();
  const logout = await context.request.delete(base + "/api/auth/login");
  assert.equal(logout.status(), 200);
  const replay = await context.request.get(base + "/api/pupils", {
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(replay.status(), 401, "Replaying a logged-out token must fail");
  assert.deepEqual(errors, []);
  console.log(
    "Staff UI smoke passed: seven routes on desktop/mobile, enrollment errors/retry key, result payload, role guard; API responses mocked.",
  );
} catch (error) {
  if (page) {
    await page
      .screenshot({ path: "test-results/staff-ui/failure.png", fullPage: true })
      .catch(() => {});
    await writeFile(
      "test-results/staff-ui/failure.html",
      await page.content(),
    ).catch(() => {});
  }
  throw error;
} finally {
  await browser?.close();
  server.kill("SIGTERM");
  await new Promise((r) => authDatabase.close(r));
}
