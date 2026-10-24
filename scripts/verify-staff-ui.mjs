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
      body.p_subject ===
        (actor.type === "student" ? actor.pupilId : actor.staffId) &&
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
    if (url.pathname === "/api/auth/student-access") {
      const body = route.request().postDataJSON();
      requests.push({ accessIssue: body });
      return route.fulfill({
        json: {
          admissionNumber: "EDV/UI/001",
          expiresAt: new Date(Date.now() + 30 * 60000).toISOString(),
          activationUrl: base + "/account/access#" + "a".repeat(43),
        },
      });
    }
    if (url.pathname === "/api/auth/student-access/redeem") {
      requests.push({ accessRedeem: route.request().postDataJSON() });
      return route.fulfill({
        json: { success: true, admissionNumber: "EDV/UI/001" },
      });
    }
    if (url.pathname === "/api/auth/student-password") {
      requests.push({ passwordChange: route.request().postDataJSON() });
      return route.fulfill({ json: { success: true, redirect: "/login" } });
    }
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
  await page
    .getByRole("button", { name: "Set up / reset access", exact: true })
    .click();
  await page
    .getByLabel("Reason for setup or recovery", { exact: true })
    .fill("Verified guardian recovery request");
  await page.getByLabel(/I have verified this pupil/).check();
  await page
    .getByRole("button", { name: "Issue setup / recovery link", exact: true })
    .click();
  const privateLink = await page
    .getByLabel("Private setup link", { exact: true })
    .inputValue();
  assert.equal(new URL(privateLink).hash, "#" + "a".repeat(43));
  assert.equal(
    requests.find((r) => r.accessIssue).accessIssue.verifiedGuardian,
    true,
  );
  await page
    .getByRole("button", { name: "Close access panel", exact: true })
    .click();
  await page.goto(base + "/admin/results");
  await page
    .getByLabel("Start or edit a report", { exact: true })
    .selectOption(uid(20));
  await page.getByRole("button", { name: "Open editor", exact: true }).click();
  await page.getByRole("region", { name: "Report editor", exact: true }).waitFor();
  const editorPosition = await page.evaluate(() => {
    const editor = document.querySelector('section[aria-label="Report editor"]');
    const table = document.querySelector('main table');
    const bounds = editor.getBoundingClientRect();
    return { focused: document.activeElement === editor, visible: bounds.top >= 0 && bounds.top < innerHeight, beforeTable: Boolean(editor.compareDocumentPosition(table) & Node.DOCUMENT_POSITION_FOLLOWING) };
  });
  assert.deepEqual(editorPosition, { focused: true, visible: true, beforeTable: true });

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
  await page.goto(base + "/account/access#" + "a".repeat(43));
  await page
    .getByLabel("New password", { exact: true })
    .fill("My private school password");
  await page
    .getByLabel("Confirm password", { exact: true })
    .fill("My private school password");
  assert.equal(new URL(page.url()).hash, "");
  await page.getByRole("button", { name: "Set password", exact: true }).click();
  await page
    .getByRole("status")
    .filter({ hasText: "Password saved for EDV/UI/001" })
    .waitFor();
  assert.equal(
    requests.find((r) => r.accessRedeem).accessRedeem.token,
    "a".repeat(43),
  );
  await page.screenshot({
    path: "test-results/staff-ui/student-access-mobile.png",
    fullPage: true,
  });
  await page.goto(base + "/account/access");
  await page
    .getByRole("link", { name: "Contact the school office", exact: true })
    .waitFor();
  await page.goto(base + "/login");
  await page.getByLabel("Pupil Admission Number", { exact: true }).waitFor();
  await page.getByLabel("Password", { exact: true }).waitFor();
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
  Object.assign(actor, {
    type: "student",
    pupilId: uid(20),
    userId: uid(20),
    admissionNumber: "EDV/UI/001",
    className: "Primary 1A",
    jti: randomUUID(),
  });
  const studentPayload = Buffer.from(JSON.stringify(actor)).toString(
    "base64url",
  );
  const studentToken =
    studentPayload +
    "." +
    createHmac("sha256", secret).update(studentPayload).digest("base64url");
  signedHash = createHash("sha256").update(studentToken).digest("hex");
  await context.addCookies([
    {
      name: "edvora_session",
      value: studentToken,
      url: base,
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
  await page.goto(base + "/student/account");
  await page
    .getByRole("heading", { name: "Account security", exact: true })
    .waitFor();
  await page
    .getByLabel("Current password", { exact: true })
    .fill("My old school password");
  await page
    .getByLabel("New password", { exact: true })
    .fill("My changed school password");
  await page
    .getByLabel("Confirm password", { exact: true })
    .fill("My changed school password");
  await page
    .getByRole("button", { name: "Change password and sign out", exact: true })
    .click();
  await page.waitForURL("**/login");
  assert.equal(
    requests.find((r) => r.passwordChange).passwordChange.currentPassword,
    "My old school password",
  );
  // Public routes use real components; no enquiry is dispatched.
  await context.clearCookies();
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/about", "/academics", "/admissions", "/fees", "/school-life", "/contact"]) {
      await page.goto(base + path, { waitUntil: "domcontentloaded" });
      assert.equal(await page.locator("main h1").count(), 1, path + " heading");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      assert.equal(overflow, false, `${path} overflows at ${width}`);
      const missingAnchors = await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')).filter(h=>h.length>1 && !document.getElementById(h.slice(1))));
      assert.deepEqual(missingAnchors, [], `${path} broken anchors`);
    }
  }
  await page.getByRole("button", { name: "Open navigation menu", exact: true }).click();
  assert.equal(await page.getByRole("navigation", { name: "Mobile navigation", exact: true }).isVisible(), true);
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("navigation", { name: "Mobile navigation", exact: true }).count(), 0);
  await page.getByRole("button", { name: "Where can parents pay fees?", exact: true }).click();
  assert.equal(await page.getByRole("button", { name: "Where can parents pay fees?", exact: true }).getAttribute("aria-expanded"), "true");
  await page.getByLabel("Parent / guardian name", {exact:true}).fill("Enquiry Example");
  await page.getByLabel("Contact phone or email", {exact:true}).fill("parent@example.invalid");
  await page.getByRole("button", { name: "Prepare enquiry", exact:true }).click();
  await page.getByText("Your enquiry is ready to copy. It has not been sent.", {exact:true}).waitFor();
  assert.match(await page.getByLabel("Enquiry summary", {exact:true}).inputValue(), /Enquiry Example/);
  await page.screenshot({ path: "test-results/staff-ui/public-contact-mobile.png", fullPage:true });
  await page.goto(base+"/academics");
  await page.getByRole("button", { name:"Primary School",exact:true }).click();
  assert.equal(await page.getByRole("list", {name:"Primary School daily rhythm"}).isVisible(),true);
  await page.goto(base+"/school-life");
  await page.getByRole("button", { name:"Library & Literacy",exact:true }).click();
  assert.equal(await page.getByRole("heading",{name:"Reading Sanctuary & Pods",exact:true}).count(),1);
  assert.equal(await page.getByRole("heading",{name:"Naturally Ventilated Learning Studios",exact:true}).count(),0);
  await page.screenshot({ path: "test-results/staff-ui/public-facilities-mobile.png", fullPage:true });
  await page.goto(base+"/fees");
  await page.getByRole("link",{name:"Open Student portal",exact:true}).click();
  await page.waitForURL("**/login");
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
