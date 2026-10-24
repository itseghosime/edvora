# Edvora deployment setup

The application code is on `codex/integration-foundation` in PR #1. No production deployment or n8n activation has been performed. Connected Vercel discovery returned no accessible Edvora project or teams; resolve that account/project access before configuring deployment.

## 1. Hosting and server credentials

Connect the private `itseghosime/edvora` repository to the intended Vercel account. Prepare a Preview from the integration branch first. Set these keys through Vercel’s environment settings, never in chat or source control:

| Variable | Configuration |
| --- | --- |
| NEXT_PUBLIC_APP_URL | The stable HTTPS application origin used in links |
| NEXT_PUBLIC_SUPABASE_URL | `https://hphytqeqhjwvuqkxvvmh.supabase.co` |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Edvora’s public API key from Supabase |
| SUPABASE_SERVICE_ROLE_KEY | Edvora server-only key; never a NEXT_PUBLIC variable |
| SESSION_SECRET | Independently generated high-entropy signing secret |
| AUTOMATION_SERVICE_KEY | Separate high-entropy secret shared only with the Edvora n8n backend credential |
| PAYSTACK_ENVIRONMENT | `test` |
| PAYSTACK_PUBLIC_KEY / PAYSTACK_SECRET_KEY | Matching Paystack test credentials |
| TERMII_API_KEY / TERMII_SENDER_ID | Dedicated account key and approved sender |
| TERMII_BASE_URL | Account-supported API origin |
| TERMII_WEBHOOK_SECRET | Separate high-entropy callback secret; do not reuse the SMS API key |
| TELEGRAM_BOT_TOKEN | Dedicated Edvora bot credential |

Keep Preview/provider testing isolated from production school records. Do not reuse Nestly credentials or destinations. Verify the selected Supabase project before applying configuration; the connected Edvora project already has the committed migrations.

## 2. First staff administrator

Create the intended staff user in Supabase Auth using the school’s real email and a private password. Confirm the account through the school-approved process. Create its `staff_profiles` row with the exact Auth user UUID in `user_id`, matching email, real full name, role `admin`, active status, and an empty assigned-class array. An unlinked Auth user cannot sign into the Staff portal.

Use that administrator to create the real academic session/current term and classes, then fee plans and pupil enrollments. Add teacher/bursar Auth users and matching profiles; teachers need explicitly assigned class UUIDs. Do not use test fixture identities as real accounts.

## 3. Student access

Enrollment records DOB for school administration, but DOB cannot authenticate. For each active pupil, the administrator verifies the guardian’s identity, opens **Pupils → Set up / reset access**, records the reason and issues a private 30-minute, single-use link. Share it privately through the school’s approved process. No automatic messages are sent by the setup control.

The guardian/student chooses a password, then signs in using admission number + password. Parents use the same Student account for payments. Forgotten passwords follow the verified administrator recovery process. Issuing recovery locks the old password; password setup/change signs out older sessions.

## 4. Payment/provider acceptance

Run Paystack test checkout success, cancellation, verification retry, duplicate callback and failed-provider cases. Confirm one ledger credit and receipt per successful transaction, and no balance change on unsuccessful verification.

Configure Termii’s callback to `/api/webhooks/termii?token=<dedicated-secret>` or use the supported proxy/header route with `x-termii-token`. Test actual callback fields, authenticity, duplicates, delayed outcomes and unknown statuses. Never put the real callback secret in documentation or tickets.

Add consented guardian destinations. Telegram requires a pre-authorized positive private chat ID and consent; no linking workflow is provided. For operational alerts, populate the server-only `staff_notification_contacts` table for the intended active administrator. Do not invent a chat ID or use a public handle as a private ID.

## 5. n8n and launch

Configure the backend HTTPS origin and dedicated Edvora credentials in each native workflow. Use the committed `workflows/n8n` snapshots as the reviewed contract reference. Test against isolated accounts before publishing. Outcome retries are idempotent; provider send retries stay disabled, and uncertain sends require review.

Only after provider acceptance: authorize publication, bind WF04 as the error workflow, then activate the required schedules. Verify timezone, delivery records and recovery. Merge/deploy the accepted code, verify the domain, database backup policy, error monitoring and recovery ownership. Automated UI mocks and separate SQL checks do not replace deployed end-to-end acceptance.
