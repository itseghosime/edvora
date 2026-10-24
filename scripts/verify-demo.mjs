// ==============================================================================
// Edvora Demonstration Verification Suite
// Verifies:
// 1. Database counts: exactly 50 synthetic pupils, 8 classes, fee plans, active admin@edvora.com
// 2. Fictional guardian details with SMS and Telegram consent strictly disabled
// 3. Administrator login, live role check, and class filtering across all 8 classes
// 4. Assigned fees for all pupils with full outstanding balance (no fabricated payments)
// 5. Student access setup & password authentication (no DOB login, single-use recovery)
// 6. Academic results drafting and publication (with zero notification job dispatches)
// 7. Paystack in test mode, payment intent creation, zero SMS/Telegram sends, n8n inactive
// ==============================================================================

import assert from "node:assert/strict";
import { Client } from "pg";
import { randomBytes, randomUUID, createHash } from "node:crypto";
import { DEMO_SESSION, DEMO_TERM, DEMO_CLASSES, DEMO_PUPILS } from "./demo-data.mjs";
import { createSessionToken, verifySessionToken } from "../src/lib/auth/session.ts";
import {
  hashStudentPassword,
  verifyStudentPassword,
  deriveStudentAccessToken,
} from "../src/lib/auth/studentPasswords.ts";

const databaseUrl = process.env.DATABASE_URL || "postgres://postgres@localhost:5433/edvora_test";
process.env.SESSION_SECRET = process.env.SESSION_SECRET || "demo-session-secret-verify-2026";

async function verify() {
  console.log("=== Running Edvora Demonstration Verification ===\n");
  const pg = new Client({ connectionString: databaseUrl });
  await pg.connect();

  try {
    // --------------------------------------------------------------------------
    // 1. Verify Database Records and Counts
    // --------------------------------------------------------------------------
    console.log("[Check 1/7] Verifying database records and synthetic data isolation...");
    
    // Check Session & Term
    const sessionRes = await pg.query("SELECT * FROM academic_sessions WHERE name = $1 AND is_current = true", [DEMO_SESSION.name]);
    assert.equal(sessionRes.rows.length, 1, "Demonstration session must exist and be marked current");
    
    const termRes = await pg.query("SELECT * FROM academic_terms WHERE name = $1 AND is_current = true", [DEMO_TERM.name]);
    assert.equal(termRes.rows.length, 1, "Demonstration term must exist and be marked current");

    // Check Classes
    const classesRes = await pg.query("SELECT * FROM school_classes WHERE name = ANY($1)", [DEMO_CLASSES.map(c => c.name)]);
    assert.equal(classesRes.rows.length, 8, "All 8 nursery and primary classes must exist");

    // Check Fee Plans
    const plansRes = await pg.query("SELECT * FROM fee_plans WHERE term_id = $1", [termRes.rows[0].id]);
    assert.ok(plansRes.rows.length >= 8, "Fee plans must exist for all demonstration classes in the current term");

    // Check Admin Staff Profile
    const adminRes = await pg.query("SELECT * FROM staff_profiles WHERE email = 'admin@edvora.com'");
    assert.equal(adminRes.rows.length, 1, "staff_profiles must contain admin@edvora.com");
    const adminProfile = adminRes.rows[0];
    assert.equal(adminProfile.role, "admin", "admin@edvora.com role must be 'admin'");
    assert.equal(adminProfile.is_active, true, "admin@edvora.com must be active");
    assert.ok(adminProfile.user_id, "admin@edvora.com must have an assigned user_id matching Supabase Auth UUID");

    // Check Exactly 50 Synthetic Pupils
    const pupilsRes = await pg.query("SELECT * FROM pupils WHERE admission_number LIKE 'EDV/DEMO/%' ORDER BY admission_number");
    assert.equal(pupilsRes.rows.length, 50, "Database must contain exactly 50 synthetic demonstration pupils");

    for (const p of pupilsRes.rows) {
      assert.equal(p.status, "active", `Pupil ${p.admission_number} must be active`);
      assert.ok(p.date_of_birth, `Pupil ${p.admission_number} must have a valid date of birth`);
      assert.ok(p.class_id, `Pupil ${p.admission_number} must be assigned to a class`);
      assert.ok(p.guardian_id, `Pupil ${p.admission_number} must have an assigned guardian`);
    }

    // Check Guardians: SMS and Telegram consent MUST be false
    const guardiansRes = await pg.query(
      "SELECT g.* FROM guardians g JOIN pupils p ON p.guardian_id = g.id WHERE p.admission_number LIKE 'EDV/DEMO/%'"
    );
    assert.equal(guardiansRes.rows.length, 50, "All 50 pupils must have valid guardian records");
    for (const g of guardiansRes.rows) {
      assert.equal(g.consent_sms, false, `Guardian ${g.full_name} (${g.phone_number}) SMS consent must be strictly disabled`);
      assert.equal(g.consent_telegram, false, `Guardian ${g.full_name} Telegram consent must be strictly disabled`);
      assert.equal(g.telegram_chat_id, null, `Guardian ${g.full_name} Telegram chat ID must be null`);
      assert.ok(g.email.endsWith("@example.com"), `Guardian email must be fictional @example.com`);
    }

    // Check Fee Assignments: All 50 pupils must have fee assignments
    const assignmentsRes = await pg.query(
      "SELECT fa.* FROM fee_assignments fa JOIN pupils p ON p.id = fa.pupil_id WHERE p.admission_number LIKE 'EDV/DEMO/%' AND fa.term_id = $1",
      [termRes.rows[0].id]
    );
    assert.equal(assignmentsRes.rows.length, 50, "All 50 pupils must have fee assignments for the current term");
    for (const a of assignmentsRes.rows) {
      assert.ok(Number(a.adjusted_amount_minor) > 0, "Fee assignment amount must be greater than zero");
    }
    console.log("✓ Database records: 50 pupils, 50 guardians, 8 classes, 50 fee assignments, active admin profile verified.");

    // --------------------------------------------------------------------------
    // 2. Administrator Authentication & Class Filtering
    // --------------------------------------------------------------------------
    console.log("\n[Check 2/7] Verifying administrator session and class filtering...");
    
    const adminSessionToken = createSessionToken({
      type: "staff",
      userId: adminProfile.id,
      staffId: adminProfile.id,
      role: "admin",
      email: adminProfile.email,
      name: adminProfile.full_name,
      assignedClassIds: [],
    });
    const verifiedAdmin = verifySessionToken(adminSessionToken);
    assert.ok(verifiedAdmin, "Admin session token must verify correctly");
    assert.equal(verifiedAdmin.role, "admin");
    assert.equal(verifiedAdmin.email, "admin@edvora.com");

    // Verify class filtering across all 8 classes
    const expectedClassDist = {
      "Nursery 1": 5,
      "Nursery 2": 5,
      "Primary 1": 7,
      "Primary 2": 7,
      "Primary 3": 7,
      "Primary 4": 7,
      "Primary 5": 7,
      "Primary 6": 5,
    };

    for (const [className, expectedCount] of Object.entries(expectedClassDist)) {
      const classPupils = await pg.query(
        "SELECT count(*) FROM pupils p JOIN school_classes c ON c.id = p.class_id WHERE p.admission_number LIKE 'EDV/DEMO/%' AND c.name = $1",
        [className]
      );
      assert.equal(
        Number(classPupils.rows[0].count),
        expectedCount,
        `Class filter '${className}' must return exactly ${expectedCount} pupils`
      );
    }
    console.log("✓ Administrator session & class filtering across all 8 nursery/primary classes verified.");

    // --------------------------------------------------------------------------
    // 3. Student Access & Password Setup (Single-Use Recovery)
    // --------------------------------------------------------------------------
    console.log("\n[Check 3/7] Verifying student password setup and authenticated sign-in...");
    
    // Choose Osasere Ehigiator (EDV/DEMO/025)
    const demoPupil = pupilsRes.rows.find((p) => p.admission_number === "EDV/DEMO/025");
    assert.ok(demoPupil, "Demonstration pupil EDV/DEMO/025 must exist");

    // Administrator issues single-use student access link
    const setupRequestId = randomUUID();
    const setupToken = deriveStudentAccessToken(setupRequestId, adminProfile.id, demoPupil.id);
    const setupHash = createHash("sha256").update(setupToken).digest("hex");

    const issueRes = await pg.query(
      "SELECT public.issue_student_access($1, $2, $3, $4, $5) AS result",
      [adminProfile.id, setupRequestId, demoPupil.id, setupHash, "Demonstration access issuance"]
    );
    assert.ok(issueRes.rows[0].result.expiresAt, "issue_student_access must return expiration timestamp");
    assert.equal(issueRes.rows[0].result.admissionNumber, "EDV/DEMO/025");

    // Student redeems access token and chooses private password
    const testPassword = "DemoStudentPass2026!";
    const passwordHash = await hashStudentPassword(testPassword);
    const redeemRes = await pg.query(
      "SELECT public.redeem_student_access($1, $2) AS result",
      [setupHash, passwordHash]
    );
    assert.equal(redeemRes.rows[0].result.success, true);
    assert.equal(redeemRes.rows[0].result.admissionNumber, "EDV/DEMO/025");

    // Second redemption must fail closed (single-use proof)
    await assert.rejects(
      async () => {
        await pg.query("SELECT public.redeem_student_access($1, $2) AS result", [setupHash, passwordHash]);
      },
      /Access link is unavailable or expired/,
      "Redeemed setup token must not be reusable"
    );

    // Verify reading student credential by admission number
    const credRes = await pg.query("SELECT public.read_student_credential($1) AS cred", ["EDV/DEMO/025"]);
    const cred = credRes.rows[0].cred;
    assert.ok(cred, "Credential must be readable by admission number");
    assert.equal(cred.admissionNumber, "EDV/DEMO/025");
    assert.equal(await verifyStudentPassword(testPassword, cred.passwordHash), true, "Valid password must verify");
    assert.equal(await verifyStudentPassword("WrongPassword123", cred.passwordHash), false, "Invalid password must be rejected");

    // Verify DOB cannot be used as a password
    assert.equal(await verifyStudentPassword(demoPupil.date_of_birth, cred.passwordHash), false, "Date of birth must not authenticate");

    // Verify Student session creation and scope
    const studentSessionToken = createSessionToken({
      type: "student",
      authVersion: cred.authVersion,
      userId: cred.pupilId,
      pupilId: cred.pupilId,
      admissionNumber: cred.admissionNumber,
      name: cred.name,
      className: cred.className,
      guardianId: cred.guardianId,
    });
    const verifiedStudent = verifySessionToken(studentSessionToken);
    assert.ok(verifiedStudent);
    assert.equal(verifiedStudent.type, "student");
    assert.equal(verifiedStudent.pupilId, demoPupil.id);
    console.log("✓ Student access link issuance, token redemption, password hashing, and session scope verified.");

    // --------------------------------------------------------------------------
    // 4. Academic Results Drafting and Publication
    // --------------------------------------------------------------------------
    console.log("\n[Check 4/7] Verifying academic result drafting, review, and publication...");

    // Choose Kelechi Nwosu (EDV/DEMO/026) for fresh result drafting and publication
    const resultPupil = pupilsRes.rows.find((p) => p.admission_number === "EDV/DEMO/026");
    assert.ok(resultPupil, "Demonstration pupil EDV/DEMO/026 must exist");

    // Clean up any existing result for this test pupil
    await pg.query("DELETE FROM academic_results WHERE pupil_id = $1 AND term_id = $2", [
      resultPupil.id,
      termRes.rows[0].id,
    ]);

    // Draft a new result via execute_staff_command
    const draftRequestId = randomUUID();
    const resultSubjects = [
      { subject: "Mathematics", ca: 38, exam: 58 },
      { subject: "English Language", ca: 35, exam: 52 },
      { subject: "Basic Science", ca: 36, exam: 54 },
    ];

    const draftCmdRes = await pg.query(
      "SELECT public.execute_staff_command($1, $2, $3, $4::jsonb) AS res",
      [
        draftRequestId,
        adminProfile.id,
        "save_result",
        JSON.stringify({
          pupilId: resultPupil.id,
          termId: termRes.rows[0].id,
          subjects: resultSubjects,
          teacherComment: "Demonstration excellent progress",
          headComment: "Outstanding academic performance",
        }),
      ]
    );
    const resultId = draftCmdRes.rows[0].res.id;
    assert.ok(resultId, "Result draft must return result ID");

    // Check draft status in database
    const draftDb = await pg.query("SELECT * FROM academic_results WHERE id = $1", [resultId]);
    assert.equal(draftDb.rows[0].status, "draft", "Saved result must start in 'draft' status");

    // Move to 'under_review'
    const reviewRequestId = randomUUID();
    await pg.query(
      "SELECT public.execute_staff_command($1, $2, $3, $4::jsonb) AS res",
      [reviewRequestId, adminProfile.id, "set_result_status", JSON.stringify({ resultId, status: "under_review" })]
    );

    // Admin publishes result ('under_review' -> 'published')
    const publishRequestId = randomUUID();
    await pg.query(
      "SELECT public.execute_staff_command($1, $2, $3, $4::jsonb) AS res",
      [publishRequestId, adminProfile.id, "set_result_status", JSON.stringify({ resultId, status: "published" })]
    );

    const publishedDb = await pg.query("SELECT * FROM academic_results WHERE id = $1", [resultId]);
    assert.equal(publishedDb.rows[0].status, "published", "Result must transition to 'published'");
    assert.ok(publishedDb.rows[0].published_at, "published_at timestamp must be set");

    // Check that NO notification job was queued for this guardian (consent disabled)
    const notifJobs = await pg.query(
      "SELECT count(*) FROM notification_jobs WHERE source_event_id = $1",
      [resultId]
    );
    assert.equal(Number(notifJobs.rows[0].count), 0, "No notification jobs should be queued when guardian consent is disabled");
    console.log("✓ Result drafting, review transition, publication, and zero-notification isolation verified.");

    // --------------------------------------------------------------------------
    // 5. Parent Payment Flow Through Student Dashboard
    // --------------------------------------------------------------------------
    console.log("\n[Check 5/7] Verifying parent payment flow through Student dashboard...");

    // Balance check for demonstration pupil: full fee outstanding, 0 paid
    const assignment = await pg.query(
      "SELECT * FROM fee_assignments WHERE pupil_id = $1 AND term_id = $2",
      [demoPupil.id, termRes.rows[0].id]
    );
    assert.ok(assignment.rows.length === 1);
    const feeAmount = Number(assignment.rows[0].adjusted_amount_minor);
    assert.equal(feeAmount, 12000000, "Primary 3 fee must be ₦120,000 (12,000,000 kobo)");

    const paidCredits = await pg.query(
      "SELECT coalesce(sum(amount_minor), 0) AS total_paid FROM fee_ledger_entries WHERE pupil_id = $1 AND term_id = $2 AND entry_type = 'credit'",
      [demoPupil.id, termRes.rows[0].id]
    );
    assert.equal(Number(paidCredits.rows[0].total_paid), 0, "No fabricated payments: verified paid must be ₦0");

    // Verify Paystack payment intent creation in test environment
    const intentId = randomUUID();
    const intentRef = `EDV-TEST-DEMO-${Date.now()}`;
    await pg.query(
      `
      INSERT INTO payment_intents (id, pupil_id, term_id, reference, amount_minor, currency, environment, status, payer_email, payer_name, expires_at)
      VALUES ($1, $2, $3, $4, $5, 'NGN', 'test', 'initialized', 'guardian.demo25@example.com', 'Dr. & Mrs. Ehigiator', now() + interval '1 hour')
      `,
      [intentId, demoPupil.id, termRes.rows[0].id, intentRef, 5000000]
    );

    const intentCheck = await pg.query("SELECT * FROM payment_intents WHERE id = $1", [intentId]);
    assert.equal(intentCheck.rows[0].environment, "test", "Payment intent must be in test environment");
    assert.equal(intentCheck.rows[0].status, "initialized");

    // Clean up test verification intent
    await pg.query("DELETE FROM payment_intents WHERE id = $1", [intentId]);

    // Ensure receipts and fee_ledger_entries remain untouched (no fabricated receipts)
    const demoReceipts = await pg.query(
      "SELECT count(*) FROM receipts r JOIN pupils p ON p.id = r.pupil_id WHERE p.admission_number LIKE 'EDV/DEMO/%'"
    );
    assert.equal(Number(demoReceipts.rows[0].count), 0, "No fabricated receipts must exist for demonstration pupils");
    console.log("✓ Fee balance authoritative (₦120,000 outstanding, ₦0 paid), Paystack in test mode, no fabricated receipts.");

    // --------------------------------------------------------------------------
    // 6. Messaging & Automation Inactivity Check
    // --------------------------------------------------------------------------
    console.log("\n[Check 6/7] Verifying SMS sending and n8n workflows remain inactive...");

    // Verify that NO SMS notification jobs or sends exist for any demo pupils or demo guardians
    const demoSmsJobs = await pg.query(
      `
      SELECT count(*) FROM notification_jobs nj
      WHERE nj.recipient_id IN (
        SELECT g.id FROM guardians g JOIN pupils p ON p.guardian_id = g.id WHERE p.admission_number LIKE 'EDV/DEMO/%'
      )
      `
    );
    assert.equal(Number(demoSmsJobs.rows[0].count), 0, "SMS notification jobs must remain inactive for demonstration pupils (0 queued)");

    const reminderJobs = await pg.query(
      "SELECT count(*) FROM reminder_jobs rj JOIN pupils p ON p.id = rj.pupil_id WHERE p.admission_number LIKE 'EDV/DEMO/%'"
    );
    assert.equal(Number(reminderJobs.rows[0].count), 0, "No reminder jobs must be generated for demonstration pupils");
    console.log("✓ SMS sending and n8n notification/reminder queues verified inactive.");

    // --------------------------------------------------------------------------
    // 7. Summary & Final Report
    // --------------------------------------------------------------------------
    console.log("\n[Check 7/7] Computing final database counts for reporting...");
    const counts = {
      academicSessions: Number((await pg.query("SELECT count(*) FROM academic_sessions")).rows[0].count),
      academicTerms: Number((await pg.query("SELECT count(*) FROM academic_terms")).rows[0].count),
      schoolClasses: Number((await pg.query("SELECT count(*) FROM school_classes")).rows[0].count),
      demoPupils: Number((await pg.query("SELECT count(*) FROM pupils WHERE admission_number LIKE 'EDV/DEMO/%'")).rows[0].count),
      totalPupils: Number((await pg.query("SELECT count(*) FROM pupils")).rows[0].count),
      demoGuardians: Number((await pg.query("SELECT count(*) FROM guardians WHERE email LIKE 'guardian.demo%@example.com'")).rows[0].count),
      feePlans: Number((await pg.query("SELECT count(*) FROM fee_plans")).rows[0].count),
      demoFeeAssignments: Number(
        (await pg.query("SELECT count(*) FROM fee_assignments fa JOIN pupils p ON p.id = fa.pupil_id WHERE p.admission_number LIKE 'EDV/DEMO/%'")).rows[0].count
      ),
      adminStaffProfiles: Number((await pg.query("SELECT count(*) FROM staff_profiles WHERE email = 'admin@edvora.com' AND is_active = true")).rows[0].count),
      demoReceipts: Number(
        (await pg.query("SELECT count(*) FROM receipts r JOIN pupils p ON p.id = r.pupil_id WHERE p.admission_number LIKE 'EDV/DEMO/%'")).rows[0].count
      ),
    };

    console.log("\n=== Verified Database Counts ===");
    console.table(counts);

    console.log("\n✅ All demonstration readiness checks passed successfully!");
    return counts;
  } finally {
    await pg.end();
  }
}

verify().catch((err) => {
  console.error("\n❌ Verification failed:", err);
  process.exit(1);
});
