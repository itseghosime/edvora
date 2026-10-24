// ==============================================================================
// Edvora Demonstration Seeder
// Seeds exactly 50 synthetic pupils, 8 nursery/primary classes, fee plans,
// demonstration session/term, and provisions admin@edvora.com.
// Safe to rerun (idempotent); synthetic data clearly marked for later cleanup.
// ==============================================================================

import { Client } from "pg";
import { createClient } from "@supabase/supabase-js";
import { DEMO_SESSION, DEMO_TERM, DEMO_CLASSES, DEMO_FEE_PLANS, DEMO_PUPILS } from "./demo-data.mjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hphytqeqhjwvuqkxvvmh.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const databaseUrl = process.env.DATABASE_URL || "postgres://postgres@localhost:5433/edvora_test";
const adminPassword = process.env.ADMIN_PASSWORD || "";

async function seed() {
  console.log("=== Edvora Demonstration Preparation ===");
  console.log(`Target Session: ${DEMO_SESSION.name}`);
  console.log(`Target Term: ${DEMO_TERM.name} (${DEMO_TERM.termCode})`);
  console.log(`Target Classes: ${DEMO_CLASSES.length}`);
  console.log(`Target Synthetic Pupils: ${DEMO_PUPILS.length}`);

  let adminAuthUserId = null;

  // 1. Supabase Auth Provisioning (if SUPABASE_SERVICE_ROLE_KEY is present)
  if (supabaseServiceKey) {
    console.log("\n[1/3] Supabase Auth: Checking admin@edvora.com via Admin API...");
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    try {
      // List existing users to find admin@edvora.com
      const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) throw listError;

      const existingUser = listData.users.find(
        (u) => u.email?.toLowerCase() === "admin@edvora.com"
      );

      if (existingUser) {
        adminAuthUserId = existingUser.id;
        console.log(`Found existing Supabase Auth user admin@edvora.com (UUID: ${adminAuthUserId})`);

        if (adminPassword) {
          const { error: updateErr } = await supabase.auth.admin.updateUserById(existingUser.id, {
            password: adminPassword,
            email_confirm: true,
          });
          if (updateErr) throw updateErr;
          console.log("Updated admin@edvora.com password privately in Supabase Auth.");
        }
      } else {
        if (!adminPassword) {
          console.warn("NOTE: ADMIN_PASSWORD is not set. admin@edvora.com user cannot be created in Supabase Auth without ADMIN_PASSWORD.");
        } else {
          const { data: createData, error: createError } = await supabase.auth.admin.createUser({
            email: "admin@edvora.com",
            password: adminPassword,
            email_confirm: true,
            user_metadata: { role: "admin", full_name: "Edvora Administrator" },
          });
          if (createError) throw createError;
          adminAuthUserId = createData.user.id;
          console.log(`Created Supabase Auth user admin@edvora.com (UUID: ${adminAuthUserId}) without sending invite email.`);
        }
      }
    } catch (err) {
      console.error("Supabase Auth Admin API error:", err.message);
    }
  } else {
    console.log("\n[1/3] SUPABASE_SERVICE_ROLE_KEY is not configured in local environment.");
    console.log("      Skipping Supabase Auth provisioning. Existing staff_profiles.user_id will be preserved without fabricated fallbacks.");
  }

  // 2. Persisted PostgreSQL Seed
  console.log("\n[2/3] Connecting to persisted PostgreSQL database...");
  const pgClient = new Client({ connectionString: databaseUrl });
  try {
    await pgClient.connect();
    console.log("Connected to PostgreSQL successfully.");

    await pgClient.query("BEGIN;");

    // A. Academic Session & Term
    console.log("Seeding demonstration session and term...");
    await pgClient.query(
      `
      INSERT INTO academic_sessions (id, name, start_date, end_date, is_current)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (name) DO UPDATE SET
        start_date = EXCLUDED.start_date,
        end_date = EXCLUDED.end_date,
        is_current = EXCLUDED.is_current
      RETURNING id;
      `,
      [DEMO_SESSION.id, DEMO_SESSION.name, DEMO_SESSION.startDate, DEMO_SESSION.endDate, DEMO_SESSION.isCurrent]
    );

    // Make sure other sessions aren't marked current if this one is current
    await pgClient.query(
      `UPDATE academic_sessions SET is_current = false WHERE id <> $1 AND is_current = true;`,
      [DEMO_SESSION.id]
    );

    await pgClient.query(
      `
      INSERT INTO academic_terms (id, session_id, name, term_code, start_date, end_date, is_current)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (session_id, name) DO UPDATE SET
        term_code = EXCLUDED.term_code,
        start_date = EXCLUDED.start_date,
        end_date = EXCLUDED.end_date,
        is_current = EXCLUDED.is_current
      RETURNING id;
      `,
      [DEMO_TERM.id, DEMO_TERM.sessionId, DEMO_TERM.name, DEMO_TERM.termCode, DEMO_TERM.startDate, DEMO_TERM.endDate, DEMO_TERM.isCurrent]
    );

    await pgClient.query(
      `UPDATE academic_terms SET is_current = false WHERE id <> $1 AND is_current = true;`,
      [DEMO_TERM.id]
    );

    // B. Classes
    console.log("Seeding 8 nursery and primary classes...");
    for (const c of DEMO_CLASSES) {
      await pgClient.query(
        `
        INSERT INTO school_classes (id, name, stage, capacity)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (name) DO UPDATE SET
          stage = EXCLUDED.stage,
          capacity = EXCLUDED.capacity;
        `,
        [c.id, c.name, c.stage, c.capacity]
      );
    }

    // Retrieve actual class IDs by name in case existing classes had different UUIDs
    const classRows = await pgClient.query("SELECT id, name FROM school_classes WHERE name = ANY($1)", [
      DEMO_CLASSES.map((c) => c.name),
    ]);
    const classIdMap = new Map(classRows.rows.map((r) => [r.name, r.id]));

    // C. Fee Plans
    console.log("Seeding fee plans for each class in current term...");
    const feePlanIdMap = new Map();
    for (const plan of DEMO_FEE_PLANS) {
      const cls = DEMO_CLASSES.find((c) => c.id === plan.classId);
      const actualClassId = classIdMap.get(cls.name) || plan.classId;
      const res = await pgClient.query(
        `
        INSERT INTO fee_plans (id, term_id, class_id, name, total_amount_minor, components)
        VALUES ($1, $2, $3, $4, $5, $6::jsonb)
        ON CONFLICT (term_id, class_id) DO UPDATE SET
          name = EXCLUDED.name,
          total_amount_minor = EXCLUDED.total_amount_minor,
          components = EXCLUDED.components
        RETURNING id;
        `,
        [plan.id, DEMO_TERM.id, actualClassId, plan.name, plan.totalAmountMinor, JSON.stringify(plan.components)]
      );
      feePlanIdMap.set(actualClassId, res.rows[0].id);
    }

    // D. Staff Profiles: admin@edvora.com
    console.log("Seeding active admin staff profile for admin@edvora.com...");
    await pgClient.query(
      `
      INSERT INTO staff_profiles (id, user_id, full_name, email, role, assigned_class_ids, is_active, auth_version)
      VALUES (gen_random_uuid(), $1, 'Edvora Administrator', 'admin@edvora.com', 'admin', '{}', true, 0)
      ON CONFLICT (email) DO UPDATE SET
        user_id = COALESCE($1, staff_profiles.user_id),
        full_name = EXCLUDED.full_name,
        role = 'admin',
        is_active = true,
        assigned_class_ids = '{}';
      `,
      [adminAuthUserId]
    );

    // E. 50 Synthetic Pupils & Fictional Guardians
    console.log("Seeding 50 synthetic pupils and fictional guardians (SMS/Telegram consent disabled)...");
    let pupilCount = 0;
    for (const pupil of DEMO_PUPILS) {
      const actualClassId = classIdMap.get(pupil.className) || pupil.classId;
      const actualFeePlanId = feePlanIdMap.get(actualClassId) || pupil.feePlanId;

      // 1. Guardian
      await pgClient.query(
        `
        INSERT INTO guardians (id, full_name, phone_number, email, telegram_chat_id, relationship, consent_sms, consent_telegram)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET
          full_name = EXCLUDED.full_name,
          phone_number = EXCLUDED.phone_number,
          email = EXCLUDED.email,
          consent_sms = false,
          consent_telegram = false,
          telegram_chat_id = NULL;
        `,
        [
          pupil.guardian.id,
          pupil.guardian.fullName,
          pupil.guardian.phoneNumber,
          pupil.guardian.email,
          null,
          pupil.guardian.relationship,
          false,
          false,
        ]
      );

      // 2. Pupil
      const pupilRes = await pgClient.query(
        `
        INSERT INTO pupils (id, admission_number, first_name, last_name, gender, date_of_birth, class_id, guardian_id, status, auth_version)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 0)
        ON CONFLICT (admission_number) DO UPDATE SET
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          gender = EXCLUDED.gender,
          date_of_birth = EXCLUDED.date_of_birth,
          class_id = EXCLUDED.class_id,
          guardian_id = EXCLUDED.guardian_id,
          status = 'active'
        RETURNING id;
        `,
        [
          pupil.id,
          pupil.admissionNumber,
          pupil.firstName,
          pupil.lastName,
          pupil.gender,
          pupil.dateOfBirth,
          actualClassId,
          pupil.guardian.id,
          "active",
        ]
      );
      const actualPupilId = pupilRes.rows[0].id;

      // 3. Pupil Guardian Link
      await pgClient.query(
        `
        INSERT INTO pupil_guardians (pupil_id, guardian_id, is_primary, can_view_results, can_pay_fees)
        VALUES ($1, $2, true, true, true)
        ON CONFLICT (pupil_id, guardian_id) DO UPDATE SET
          is_primary = true,
          can_view_results = true,
          can_pay_fees = true;
        `,
        [actualPupilId, pupil.guardian.id]
      );

      // 4. Fee Assignment for current term
      await pgClient.query(
        `
        INSERT INTO fee_assignments (id, pupil_id, term_id, fee_plan_id, base_amount_minor, adjusted_amount_minor)
        VALUES ($1, $2, $3, $4, $5, $5)
        ON CONFLICT (pupil_id, term_id) DO UPDATE SET
          fee_plan_id = EXCLUDED.fee_plan_id,
          base_amount_minor = EXCLUDED.base_amount_minor,
          adjusted_amount_minor = CASE
            WHEN EXISTS (
              SELECT 1 FROM fee_adjustments fa WHERE fa.fee_assignment_id = fee_assignments.id
            ) OR fee_assignments.adjusted_amount_minor <> fee_assignments.base_amount_minor
            THEN fee_assignments.adjusted_amount_minor
            ELSE EXCLUDED.adjusted_amount_minor
          END;
        `,
        [
          `88888888-0000-4000-a000-000000000${String(pupil.admissionNumber.slice(-3))}`,
          actualPupilId,
          DEMO_TERM.id,
          actualFeePlanId,
          pupil.feeAmountMinor,
        ]
      );

      pupilCount++;
    }

    // F. Seed demonstration published result for Osasere Ehigiator (EDV/DEMO/025)
    // and draft result for Kelechi Nwosu (EDV/DEMO/026) for demonstration of results UI
    const osasereClassId = classIdMap.get("Primary 3");
    const osaserePupil = DEMO_PUPILS.find((p) => p.admissionNumber === "EDV/DEMO/025");
    if (osaserePupil && osasereClassId) {
      console.log("Seeding demonstration results for Primary 3 pupils...");
      const demoSubjects = [
        { subject: "Mathematics", ca: 36, exam: 56, total: 92, grade: "A+" },
        { subject: "English Language", ca: 34, exam: 54, total: 88, grade: "A" },
        { subject: "Basic Science & Technology", ca: 35, exam: 55, total: 90, grade: "A+" },
        { subject: "Social & Civic Studies", ca: 32, exam: 52, total: 84, grade: "A" },
        { subject: "ICT & Computer Studies", ca: 38, exam: 56, total: 94, grade: "A+" },
        { subject: "Creative Arts & Craft", ca: 30, exam: 46, total: 76, grade: "B+" },
      ];
      await pgClient.query(
        `
        INSERT INTO academic_results (id, pupil_id, term_id, class_id, subjects, total_score, max_score, average_score, class_size, teacher_remarks, head_remarks, status, published_at)
        VALUES ($1, $2, $3, $4, $5::jsonb, 524, 600, 87.33, 7, 'Exceptional performance and attentive class participation.', 'Well done, keep up the excellent standard.', 'published', now())
        ON CONFLICT (pupil_id, term_id) DO UPDATE SET
          subjects = EXCLUDED.subjects,
          total_score = EXCLUDED.total_score,
          average_score = EXCLUDED.average_score,
          status = 'published',
          published_at = now();
        `,
        [
          "dddddddd-0000-4000-a000-000000000025",
          osaserePupil.id,
          DEMO_TERM.id,
          osasereClassId,
          JSON.stringify(demoSubjects),
        ]
      );
    }

    await pgClient.query("COMMIT;");
    console.log(`\nSuccessfully seeded ${pupilCount} demonstration pupils across 8 classes!`);
  } catch (err) {
    await pgClient.query("ROLLBACK;");
    console.error("PostgreSQL seed transaction failed:", err);
    throw err;
  } finally {
    await pgClient.end();
  }

  console.log("\n[3/3] Seed process completed successfully.");
}

seed().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});

