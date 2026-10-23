# Edvora — implementation handoff

Stitch project: https://stitch.withgoogle.com/projects/3027576161540888686
Project: Edvora — Public Website · Staff · Student

Status: All 18 canonical main screens exist. Direct edits applied the Student sidebar, canonical names, copy corrections and sample-data reconciliation. Older concepts are marked Archive and moved aside. Public frames were aligned; Staff and Student rows are separated and ordered, with final alignment optional. No further main-page generation is needed. Hidden dialogs, full navigation, mobile layouts and form/error states remain unverified and must be checked during implementation. This is a design handoff, not a built application.

## Final user decisions

- A complete public school website explains Edvora to parents and pupils before dashboard access.
- Exactly TWO dashboard experiences: Staff and Student. Parents use the child's Student dashboard to pay fees, view receipts and see published results. No separate Parent dashboard.
- Staff administrator, bursar and teacher are permission variants within one Staff shell.
- Every desktop Student page shares one persistent left sidebar: Overview, Fees & Payments, Results, school support and sign out. Selected child/class, session/term and account controls share the same top header. Mobile uses an accessible navigation drawer.
- Remove all visible Test Mode, Demo, Sandbox, fictional/prototype/simulation banners, badges and notices. Use ordinary payment wording. Backend Paystack configuration remains TEST MODE; never enable live keys or real collection as part of UI work. Test configuration belongs in developer documentation only.
- Preserve current visual foundation and layouts. Make targeted corrections. Do not generate replacement concepts or duplicate dashboards.
- Notification channels are SMS and Telegram. This supersedes any WhatsApp labels in the existing Stitch screens; update those labels and controls during implementation. WhatsApp is removed from the integration scope.
- Keep the canvas visibly organised into Public Website, Access, Staff Dashboard, Student Dashboard, Supporting States and Archive.

## Canonical screen inventory

| Group | Frame | Route | Purpose |
| --- | --- | --- | --- |
| Public | PUB-01 Home | / | School introduction, programmes, learning/care, school life, admissions path and portal access |
| Public | PUB-02 About | /about | School story, mission, vision, values and family partnership |
| Public | PUB-03 Academics | /academics | Nursery/primary learning, assessment and reporting |
| Public | PUB-04 Admissions | /admissions | Enquiry, visit, documents, school review and enrolment guidance |
| Public | PUB-05 Fees & Parent Guide | /fees | Fee breakdown, flexible instalments and Student portal guide for parents |
| Public | PUB-06 School Life & Facilities | /school-life | School activities, learning spaces and gallery |
| Public | PUB-07 Contact & FAQs | /contact | Configurable school contact, visit enquiry and FAQs |
| Access | AUTH-01 Shared Login | /login | Staff/Student choice; parent access explained within Student choice |
| Staff | STF-01 Overview | /admin | Term totals and issues requiring staff action |
| Staff | STF-02 Pupils & Guardians | /admin/pupils | Pupil records and authorised guardian links |
| Staff | STF-03 Fees | /admin/fees | Fee plans, assignments, due dates and audited adjustments |
| Staff | STF-04 Payments | /admin/payments | Payment references, states and reconciliation |
| Staff | STF-05 Reminders | /admin/reminders | SMS/Telegram rules, run history and delivery outcomes |
| Staff | STF-06 Results | /admin/results | Draft, review, publish and withdraw results |
| Staff | STF-07 Settings | /admin/settings | School/contact, terms/classes, staff roles, integrations and audit tabs |
| Student | STU-01 Overview | /student | Selected child's balance, recent payment activity and result availability |
| Student | STU-02 Fees & Payments | /student/payments | Parent payment through child's account, instalments and receipts |
| Student | STU-03 Results | /student/results | Published subject report by pupil and term |

Keep the old software-marketing landing and superseded Parent-labelled versions in Archive. There should be one canonical frame per main page. Forms/dialogs and mobile variants are supporting states, not extra dashboard products. Canonical frame names were applied manually. Use the PUB, AUTH, STF and STU prefixes to identify the current screens; ignore ARCHIVE frames. The groups are separate canvas areas, not verified native board objects.

Public header: Home, About, Academics, Admissions, School Life, Contact, Student Portal and secondary Staff Login. Fees is reachable from Admissions/footer. Shared footer includes school contact and privacy/accessibility information.

## Visual implementation

Next.js App Router, TypeScript and Tailwind. Plus Jakarta Sans headings; Inter body. Forest #14695D, ivory #FBFAF5, ink #1C3438, mint #DDEDE5 and marigold #E5AA58. Rounded surfaces and generous spacing, clear readable tables, restrained photographic editorial public pages. Use GSAP for modest transitions and honour prefers-reduced-motion. Preserve approved layout hierarchy; do not introduce another style direction.

Shared components: StaffShell, StudentShell, BrandMark, TermSwitcher, ChildSwitcher, PageHeader, StatCard, DataTable, FilterBar, StatusBadge, EmptyState, ErrorState, ConfirmDialog, FormDrawer, MoneyDisplay, PaymentTimeline, DeliveryTimeline and ResultReport. Use semantic design tokens and distinct typed payment/delivery states.

## Consistent content and figures

School identity: Edvora Nursery & Primary School; wordmark edvora. Session 2026/2027, First Term. Use October 2026 for sample completed transactions rather than future-dated settlement.

School summary: 180 pupils; ₦21,600,000 charges; ₦12,600,000 verified payments; ₦9,000,000 outstanding.

Selected pupil: Osasere Ehigiator, Primary 3A. Charges ₦120,000; verified paid ₦70,000; balance ₦50,000. Fee breakdown: Tuition ₦70,000 + Books & Learning Materials ₦25,000 + Co-curricular ₦15,000 + Assessment ₦10,000. After a verified ₦20,000 instalment, balance becomes ₦30,000. Pending/failed payments leave balance unchanged.

Use ₦ consistently. Do not promise fixed 60/40 percentages or contradictory tranche structures; instalments are configured by the school. For the current sample dataset, all class plans are ₦120,000. Nursery 1 and Nursery 2 each have 20 pupils: charges ₦2,400,000, paid ₦1,400,000, balance ₦1,000,000. Primary 1–5 each have 28 pupils: charges ₦3,360,000, paid ₦1,960,000, balance ₦1,400,000. Collection is 58.3% throughout. Real school plans remain configurable; do not treat these sample prices as confirmed business policy.

Remove unsupported generated claims: 100% success rates, 1:12 ratios, accreditation, specialist therapy/medical services, background-check/security guarantees, fabricated staff credentials or school aliases. Use modest school copy and school-supplied factual details. Contact details are configurable; do not invent phone/address/email or live bank accounts. No newsletters, classroom-development feeds, attendance tracking, payroll, chat inbox or admission decision engine.

## Required flows

1. Staff login → pupil registration → guardian link → fee assignment → account review → reminders enabled.
2. Reminder rules → eligible recipient preview → content/channel check → send → accepted/pending/delivered/failed log → safe retry or pause.
3. Student login (parent assisting) → linked child → fees → valid instalment → hosted checkout → verifying → verified receipt, pending or failure.
4. Teacher score entry → draft → review → publish → authorised Student account displays result. Withdrawal shows under-correction status.
5. Parent contacts school about discrepancy → staff checks account → pauses reminders → reconciles or appends authorised adjustment → audit → appropriate resumption.

## Data and integration boundaries

Planned stack: Supabase Auth/Postgres/RLS, controlled server actions, n8n schedules, Termii SMS, Telegram Bot API and Paystack Test Mode. Provider secrets remain server-side. Preserve guardian-authorised child links and sibling switching. No publicly guessable pupil records. UI permissions alone are insufficient.

Credit payments only after server verification of reference, amount, currency and success; unique references credit once. Browser redirect is not proof of payment. Corrections append history. Track SMS and Telegram independently. An API-accepted Telegram message is sent, not proof that the parent read it; display delivery/read status only when the provider actually supplies that evidence. Suppress reminders for zero balance or inactive/disputed/wrong-contact accounts and recheck balance before sending. Communication is one-way; school office handles discrepancies. No chatbot.

Published results remain accessible despite outstanding fees; fee withholding is not enabled. Teacher cannot edit fees; bursar cannot publish results; Student accounts cannot access staff tools or unrelated pupils.

Frontend fixtures must be replaceable by typed server adapters. Do not fabricate successful real delivery or verified payment events for an unconnected provider. Use truthful pending/error states without exposing implementation jargon to pupils/parents.

## SMS and Telegram reminder workflow

1. Staff record the authorised guardian phone number for SMS. Telegram is optional and uses an existing, authorised private chat ID supplied by the backend.
2. A separate Telegram linking workflow is excluded by the user. Do not build a Telegram linking screen or n8n linking workflow as part of this scope. Do not accept an arbitrary username as proof of ownership; the backend must establish recipient authorisation before supplying a chat ID. Without an authorised chat ID, send SMS only when enabled.
3. Staff configure SMS, Telegram or both for each reminder rule and preview eligible recipients. A guardian without a linked Telegram chat cannot receive Telegram reminders; show that eligibility clearly and use SMS when enabled by the rule.
4. n8n loads due accounts, rechecks the current balance and pause/consent settings, and sends through the enabled channels. Deduplicate each scheduled reminder per guardian, account, rule and channel. Retry only the failed channel; respect retry limits and do not silently duplicate successful sends.
5. Staff see per-channel outcomes: queued, sent/accepted, failed or skipped, plus provider-supported SMS delivery status. Telegram blocked/disconnected failures prompt reconnection or SMS when enabled. Zero balance stops future fee reminders.

Update channel selectors, reminder previews, templates, delivery logs, settings, public guidance and Student help text from WhatsApp to Telegram. Keep reminders one-way, with a link to the Student dashboard and school-office contact guidance; no conversational bot or group sharing of pupil information. Provider credentials remain server-side. Connecting these providers and sending live notifications are implementation tasks, not completed actions in this handoff.

## Remaining implementation work

Build responsive variants and supporting states from the existing visual system. Conserve design allowance: do not regenerate the main screens. Reuse any existing state designs before adding missing ones:

- Login recovery, invitation, invalid credentials and expired session.
- Pupil/guardian form, duplicate and invalid contact, save failure and confirmation.
- Fee assignment and adjustment with reason and confirmation.
- Reminder rule, recipient preview, pause/resume, delivery detail, provider failure/retry.
- Score grid validation, draft save, review/return, publish/withdraw confirmation.
- Payment amount, verifying, pending, failure, success and receipt.
- Results unpublished, under correction and access denied.
- Shared skeleton, empty, no search results, offline/retry and unsaved changes.
- Mobile public Home, Login, Staff Overview and all three Student pages. Verify responsive patterns at approximately 390px, 768px and 1440px. No hover-only actions or page-wide horizontal overflow. Accessible forms/dialogs, visible focus and readable tables required.

## Specific checks for Antigravity

- Search all rendered and hidden UI for remaining Test/Demo/Sandbox wording, old Cedar school aliases, fake contact details, technical hashes and test reference labels. Direct edits covered visible pages; hidden dialogs were not exhaustively checked.
- On Student Payments, keep the selected full-balance option, custom amount field and remaining-balance preview synchronized. A verified ₦50,000 full payment leaves ₦0; pending or failed checkout leaves ₦50,000.
- Student Results sample scores total 524 across six subjects; average is 87.3%. Published results stay accessible regardless of fee balance.
- The Overview classroom feed cards were repurposed as account guidance; remove leftover observation dates/chips if present.
- Check Fees adjustment/waiver examples against accounting totals before using them as fixtures. Avoid subtracting a historical example twice.
- Replace placeholder contact information with school-provided values before publication.
- Confirm direct edits persisted and shared sidebars render consistently; final visual and interaction verification remains necessary.
- Backend integrations, real authentication, actual payment verification and real message delivery have not been implemented by the Stitch designs.

## Completion gate

Verify the actual canonical frames, not only Stitch's written summaries. Confirm two dashboard shells, shared Student sidebar on all three pages, correct names, clean copy, consistent data, grouped boards and archived older versions. Then check every primary CTA, cross-page flow, form and mobile state. Export selected canonical screens and assets only. Do not code from superseded frames or claim the design is complete while these checks are unresolved.


## n8n automation suite — created 22 October 2026

All five workflows are saved in the personal n8n project and inactive. They are draft automation implementations with explicit backend contracts, not working provider integrations. No Edvora credentials exist yet and no live messages or payments were sent.

| Workflow | n8n link | Default schedule (Africa/Lagos) |
| --- | --- | --- |
| WF01 — SMS & Telegram Fee Reminders | https://itseghosime.app.n8n.cloud/workflow/bt5x3HH74jRv5Ewt | Daily 09:00 |
| WF02 — Payment Verification & Receipts | https://itseghosime.app.n8n.cloud/workflow/d2nMNvcDwMMXgijY | Every 5 minutes |
| WF03 — SMS Delivery Tracking | https://itseghosime.app.n8n.cloud/workflow/TGHcEQyTlco1v2WB | Every minute |
| WF04 — Failure Recovery & Staff Alerts | https://itseghosime.app.n8n.cloud/workflow/hoPH7KNlrdMYXszh | Every 15 minutes + workflow failure trigger |
| WF05 — Receipts Results & School Notifications | https://itseghosime.app.n8n.cloud/workflow/YWD3GloqWM7HhZpq | Every 2 minutes |

All workflows also have a manual review trigger. Execution timeout: 180 seconds. Parent payloads are not retained in successful/failed execution storage. Batch sizes and polling cadence are defaults to tune after measuring backend load and school volume. Default claim limits must be enforced server-side. Shared error-handler wiring is pending because n8n requires WF04 to be published first.

### Backend boundary and activation order

- Build the Edvora backend, authenticate automation endpoints with a scoped service credential, and implement durable job claims, per-channel idempotency, eligibility checks and audit history. None of these endpoints exist merely because a workflow node references them.
- Backend owns checkout initialization and prompt verification, pupil/guardian authorisation, fees, immutable payment ledger, receipts, result publication and provider webhook authenticity checks. n8n supplies asynchronous verification/reconciliation, notification dispatch, delivery-event application and recovery scheduling.
- Provider webhooks enter backend ingress first; persist authenticated normalized events before acknowledging, then expose them through the job endpoints. Do not point raw provider callbacks at unauthenticated workflow paths.
- Backend emits one notification job per authorised recipient/event/channel. Fee reminders are separate from transactional notifications. Do not stop receipts or results notices at zero debt.
- Configure Edvora Backend Service, Edvora Paystack Test Secret, Edvora Termii SMS and a dedicated Edvora Telegram Bot. Use no Nestly credentials. Configure the Termii account-specific send endpoint and approved sender ID in WF01 and WF05.
- After real backend/provider tests pass, publish WF04, assign its workflow ID hoPH7KNlrdMYXszh as errorWorkflow for WF01 bt5x3HH74jRv5Ewt, WF02 d2nMNvcDwMMXgijY, WF03 TGHcEQyTlco1v2WB and WF05 YWD3GloqWM7HhZpq, then publish those workflows. Do not assign WF04 to itself. No errorWorkflow assignments are currently active.
- Complete end-to-end tests against real backend data before production scheduling: duplicate reference/event, replay, stale balance, paid/disputed account, wrong guardian, unpublished result, blocked bot, invalid number, provider timeout and backend outage. Retain uncertain sends for review rather than automatically resending.

### Validation completed

Existing WF01 had four simulated tests. New WF02–WF05 had six successful simulated executions, covering all main paths, both WF04 triggers and both WF05 channels. All external HTTP/provider responses were pinned; live integrations were not exercised. Eighteen additional logic assertions passed: successful and mismatched payment details, pending/timeout deferral, trusted/untrusted/unknown SMS events, zero-balance receipts, paused notifications, event-type separation, private Telegram recipients, expired authorisation and non-recursive sanitised incidents. Backend race conditions, financial atomicity and real provider delivery remain untested until backend implementation.

### Exact workflow contracts

## Edvora — setup before activation
SMS + Telegram only. This workflow is a draft; backend endpoints and Edvora credentials are NOT connected.
Schedule: daily 09:00 Africa/Lagos. Each run claims at most 50 jobs; increase schedule frequency after checking volume and staff rules.
Configuration: backend HTTPS origin, Termii account-specific send URL, approved sender ID.
Credentials: Edvora Backend Service template {"headers":{"Authorization":"Bearer {{api_key}}"}}
Edvora Termii SMS template {"body":{"api_key":"{{api_key}}"}}
Use a dedicated Edvora Telegram bot; do not reuse Nestly credentials.

Backend contract (Antigravity must implement):
POST /api/automation/reminders/claim {run_id,limit} -> {jobs:[{job_id,claim_token}]}. Atomic claim; unique guardian/account/rule/occurrence/channel; idempotent run_id; respect school timezone, due rules, pauses, consent, inactive accounts and linked private chats. Empty jobs is normal.
POST /api/automation/reminders/authorize {job_id,claim_token,execution_id} -> {authorized,job_id,attempt_id,attempt_token,channel,recipient,message,balance_minor,currency:"NGN",active,paused,consented,lease_expires_at}. Recheck authoritative balance immediately, lock one attempt and return server-rendered current message. Recipient: SMS country-code digits; Telegram positive private chat ID. Denial may return {authorized:false,job_id}. Only authorize if the claim is still owned and not consumed.
POST /api/automation/reminders/outcome -> persist idempotently using job_id/attempt_id plus ownership tokens; never let skipped overwrite a successful send.
Do NOT automatically recycle uncertain/started attempts after a crash or timeout: provider may already have accepted the message. Reconcile unknown outcomes before retry; no automatic provider retries here. Retry only definitive failures with capped backoff; successful channels never resend. Stop future reminders at zero balance.
Telegram sent != read. SMS accepted != delivered. Provider delivery callbacks belong to backend ingress. No Telegram linking workflow is included; the backend supplies already-authorised private chat IDs.
Before enabling: connect credentials and backend, test mixed accounts, paid/paused/unlinked accounts, duplicate claims, send timeout, blocked bot, provider rejection and failed outcome persistence. Live messages have not been sent.

## Edvora payment verification — backend contract
Draft; Edvora backend and Paystack TEST credential are missing. No live keys or collections.
Every 5 minutes + manual. This is asynchronous reconciliation; the backend must also verify interactive checkout promptly.
POST /api/automation/payments/claim {run_id,limit:20} -> {jobs:[{job_id,claim_token,reference,expected_amount_minor,currency:"NGN",environment:"test"}]}.
Claim atomically from server-created payment intents; never use a browser-supplied amount or pupil ID. Empty queue -> no work. Respect retry_after; capped retries for pending/API failures; mismatch -> staff review.
GET Paystack transaction verify is read-only. Test domain, reference, integer kobo, currency, success and paid_at are checked before a credit request.
POST /api/automation/payments/reconcile accepts normalized output plus execution_id. Backend MUST independently verify Paystack, compare its original intent and recheck ownership before financial mutation. Atomic unique provider reference + provider transaction ID prevents duplicate credit; persist immutable ledger entry, derive balance, create one receipt and enqueue receipt notification for WF05 in the SAME transaction. Duplicates return existing result. Never overwrite success with later pending/failure or reverse money automatically. Reversed/refund disputes require staff reconciliation.
For defer: preserve balance, schedule bounded verification retry. For review/non_success: preserve existing ledger and create actionable status.
Paystack webhook ingestion/signature verification belongs in backend; callback redirects do not prove payment.
Credential: Edvora Paystack Test Secret (Templated Custom Auth), {"headers":{"Authorization":"Bearer {{api_key}}"}} using sk_test key only.
Backend credential: Edvora Backend Service, same header template. Disable redirects on service requests. Before activation verify replay, mismatch, pending, failure, out-of-order events and receipt uniqueness.

## Edvora SMS delivery tracking
Draft; no backend or credentials connected. Poll every minute + manual.
Provider callbacks MUST first enter the backend's /api/webhooks/termii ingress. Implement provider-supported authenticity verification using current Termii account documentation; do not accept client assertions. Persist normalized, authenticated events in a durable inbox before acknowledging the provider.
POST /api/automation/sms-delivery/claim {run_id,limit:100} -> {events:[{event_id,claim_token,provider:"termii",channel:"sms",provider_message_id,status,occurred_at,source_authenticated:true}]}.
Backend maps actual provider fields/statuses to sent/delivered/failed/expired/rejected/unknown. Unknown mappings require review; never treat an unrecognized status as delivered.
POST /api/automation/sms-delivery/apply receives this workflow's normalized output. Validate claim ownership and match provider_message_id to the school's recorded SMS attempt. Update per-channel status and acknowledge inbox event atomically/idempotently. Missing attempt -> retain unmatched for bounded reconciliation; invalid/untrusted -> quarantine. Do not create a new outgoing message here.
Out-of-order or duplicate reports must not downgrade delivered or overwrite newer authoritative status. Record contradictory terminal reports for staff review. No payment or result mutations.
Telegram sent is not read; this workflow never invents Telegram delivery/read receipts.
Edvora Backend Service credential uses {"headers":{"Authorization":"Bearer {{api_key}}"}}. No public n8n webhook is exposed; backend owns provider authentication and durable receipt.

## Edvora failure recovery and staff alerts
Draft; backend missing. After backend setup, publish WF04 first, then assign its ID as errorWorkflow on WF01, WF02, WF03 and WF05. These assignments are NOT active yet: n8n rejects unpublished error-workflow targets. The recovery workflow must NOT use itself as an error workflow.
Every 15 minutes: POST /api/automation/recovery/sweep {run_id,limit:100,max_attempts:3}. Must be idempotent per run_id. Release expired claims only if sending never began. Requeue definitively rejected transient failures only after backoff, while retries<3, consent/rule/due-date still valid, and no successful attempt exists for that channel/occurrence. Enqueue back to the ORIGINAL reminders or notifications queue; each worker reauthorizes.
Never automatically resend started, timed-out, unknown or possibly accepted attempts. Move them to review/reconciliation. Permanent failures, blocked bot, wrong number, exhausted retries and provider configuration errors require staff action.
Safe idempotent payment verification and inbox application can resume after expired claims; financial credit remains reference-unique.
Unknown statuses and mismatch incidents are deduplicated; open incidents persist until staff resolves them.
Failure branch: POST /api/automation/incidents {incident_key,workflow_id,workflow_name,execution_id,failure_kind,failed_node,record_only}. Deduplicate incident_key, apply alert cooldown and queue an operational_alert for authorized STAFF in WF05. Do not expose guardian messages, pupil data, tokens or raw stack traces. Workflow WF05 failures are record_only to prevent alert recursion. Recovery sweep must also avoid generating alerts about WF05 failure delivery recursively; surface these in staff dashboard.
Staff Telegram recipients must already be authorized private chat IDs supplied by backend. SMS may be enabled by school policy. This is not Telegram linking.
If reporting endpoint itself fails, n8n execution error remains visible; inspect n8n and backend monitoring. No claim of independent monitoring when backend is down.
Credential Edvora Backend Service uses {"headers":{"Authorization":"Bearer {{api_key}}"}}.

## Edvora transactional notifications — no Telegram linking
Draft; backend and provider credentials missing. Every 2 minutes + manual. SMS and Telegram only.
This queue serves payment_receipt, results_published, account_invitation and operational_alert. It must never send fee reminders (WF01 owns reminders). A fully paid account MUST still receive receipts and published-result notifications.
POST /api/automation/notifications/claim {run_id,limit:50} -> {jobs:[{job_id,claim_token}]}. Atomic per-channel jobs, unique guardian-or-staff/event/channel key. Empty jobs -> no work.
POST /api/automation/notifications/authorize {job_id,claim_token,execution_id} -> {authorized,job_id,attempt_id,attempt_token,event_type,source_event_id,channel,recipient,message,active,paused,consented,lease_expires_at}.
Backend verifies committed source event still exists and recipient is authorized: payment receipt belongs to guardian's child; result is still published and accessible despite fee balance; invitation is server-created and unexpired; operational_alert targets school STAFF only. Use authorized stored private Telegram chat IDs or SMS country-code digits; no linking workflow. If Telegram chat is missing, do not create a Telegram job; SMS only when enabled/consented.
Use short-lived account invitation links, no plaintext passwords. Published result notification links to authenticated Student dashboard, not public report PDFs. Templates and current contact details come from backend; no AI-generated financial statements.
POST /api/automation/notifications/outcome records normalized channel status, claim/attempt tokens and execution ID idempotently. Telegram sent is not read; SMS accepted is not delivered. Delivery events feed WF03.
Provider timeouts/unknown outcomes -> review; never blindly resend. Known retryable failures -> WF04 bounded policy. Suppress successful channel duplicates; callback replay does not enqueue a second receipt.
Configure approved Termii sender, account-specific /api/sms/send URL, body api_key via Edvora Termii SMS templated credential, dedicated Edvora Telegram Bot.
Edvora Backend Service credential template {"headers":{"Authorization":"Bearer {{api_key}}"}}. Termii credential template {"body":{"api_key":"{{api_key}}"}}.
No live messages have been sent. Backend implementation and real-provider integration tests remain required.

Provider references used for node configuration: [Paystack transaction verification](https://paystack.com/docs/api/transaction/), [Termii developer documentation](https://developers.termii.com/). Review current provider account configuration when implementing ingress verification and credentials.

