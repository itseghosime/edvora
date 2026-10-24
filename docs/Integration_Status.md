# Edvora integration status — 24 October 2026

This branch implements the Staff and Student workspaces. It has not been deployed or verified with live provider accounts.

## Staff workspace

All seven Staff routes read the server portal snapshot. Static example pupils, receipts, balances, target collections and grading tables were removed. The existing warm school palette, shared shell, rounded cards and separate Staff/Student navigation remain.

- Overview: current term, scoped pupils, collections by class and role-specific workspace links.
- Pupils: search, class filters, CSV export, atomic enrollment with DOB, guardian/consent and current fee assignment; suspend/reactivate accounts.
- Fees: class plans, idempotent assignment to unbilled pupils, authorized reductions that update charges and preserve an adjustment audit record.
- Payments: scoped current-term transaction ledger, CSV export and server verification by reference. No manual browser crediting.
- Results: subject entry (CA /40, exam /60), server-derived totals/grades, draft → review → administrator publication. Teachers are restricted to assigned classes. Published reports must be withdrawn for correction before edits; queued publication notices are canceled on withdrawal. Debt does not block publication.
- Settings: school details, classes, academic session/current term.
- Reminders: paused rule creation, enable/pause controls and recorded delivery outcomes. No browser sending or fabricated delivery counts. n8n activation remains separate.

Every new Staff command rechecks the active persisted role and class assignments. A request key makes failed-response retries safe; an audit record and response are committed atomically with the change. The SQL RPC and response receipts are server-only. Fee reductions and payment credits lock the same assignment row to serialize balance changes.

## Student workspace

Authenticated overview, fees and published results use scoped database reads. Shared desktop sidebar and mobile drawer remain. Paystack initialization returns a provider URL; returns are verified before refreshing balances. No localStorage ledger, fixture fallback, browser-generated receipts or payment success simulation.

## Cloud state

Project `hphytqeqhjwvuqkxvvmh` (eu-west-2). Fifteen migrations were applied, including Staff transactions and fee balance serialization. All 30 public tables have RLS. New transactions were verified using a rolled-back cloud fixture: role/class denials, atomic failed enrollment rollback, duplicate requests, fee reductions, server-derived scores, publication and withdrawal. No test pupils, terms or fees were left in the cloud.

## Verification

```
npm ci
npm test
npm run typecheck
npm run build
DATABASE_URL=postgresql://... npm run test:integration
npx playwright install --with-deps chromium --only-shell
npm run test:ui
```

Use a disposable PostgreSQL database for integration tests: they create roles, schema and test records. GitHub Actions provisions PostgreSQL 17. The real database suite tests RLS, duplicate/concurrent crediting, different-reference balance serialization and Staff transactions. The browser smoke suite deliberately mocks API responses and checks seven routes at desktop/mobile widths, enrollment error/retry behavior, result request payloads and the teacher role guard. It does not prove a live account can use the deployed database. CI stores its screenshots as an artifact. Chromium download was unavailable locally, so browser acceptance runs in CI.

The existing `lint` script runs TypeScript checking, not ESLint. See PR checks for the latest executed results.

## Remaining before operational use

1. Secure deployment configuration: independent high-entropy SESSION_SECRET, server-only Supabase service key, Paystack test credentials, Termii and Telegram credentials. Do not send or commit secrets. No production deployment was performed.
2. Create actual staff Auth accounts and profiles, assign teacher classes, then enter real school contact details, classes/current term, fee plans and pupils. Setup forms are implemented; real data has not been invented.
3. Verify actual Auth/profile linking and login/logout with deployed credentials. Every protected session now checks the database for token revocation, account status/version and current role/classes. Logout persists a token hash revocation; suspension/reactivation invalidates old tokens. Staff login requires the verified Supabase Auth user to match the profile user_id. Login JSON no longer exposes the bearer token. Login attempts are limited per normalized, hashed account identifier (10 attempts per 15 minutes), with a Retry-After response; test the school’s recovery process before launch. Student sign-in now requires admission number + password. DOB-only login and legacy sessions without a configured password are denied. Administrators verify guardian identity and issue private, single-use 30-minute setup/recovery links; families choose their passwords. Passwords use salted scrypt hashes in server-only tables. Recovery locks the old password immediately, and redemption/password changes invalidate old sessions. Validate the school’s guardian identity-check process before launch.
4. Configure and verify provider delivery against the implemented notification contracts. Claims and attempts now have persisted ownership and leases; early/unmatched callbacks retry before quarantine, and delivered states cannot regress. Uncertain sends go to review; only explicit rate-limit failures may use capped backoff. Staff alerts use a server-only consented contact table; no placeholder recipient. WF05 failures cannot enqueue recursive alerts. Native WF01/WF05 parameters and all five workflow notes were aligned, and sanitized inactive snapshots are in workflows/n8n. Bind WF04 as the error workflow only after publication is authorized. All five remain inactive.
5. Run deployed browser → API → Supabase acceptance with real scoped accounts and Paystack test scenarios: success, failure, cancellation, retries, receipts, denied cross-pupil reads, published/unpublished results and mobile navigation. CI UI mocks do not replace this check.
6. Confirm school grading policy (current implementation is CA 40 + exam 60), historical-term reporting, fee breakdown requirements and guardian account management. Current Staff billing/results workspace operates on the selected current term; historical records are preserved.
7. Verify hosting/domain, backups, monitoring and recovery. No live payments or notifications have been sent.

## Notification and session verification scope

The new cloud SQL fixture is rolled back and tests current account/session versions, revoked hashes, guardian permission, due reminder creation, exclusive send authorization, forged ownership, unknown send review, retry limits, paid-account receipts, early/late SMS callbacks and stored staff alert destinations. It sends no messages. The browser smoke uses a local PostgREST stub for server session checks and verifies that replaying a logged-out token is rejected; provider and database behavior remain separate integration checks.

Before messaging, set `NEXT_PUBLIC_APP_URL` to the actual public HTTPS origin, configure dedicated `TERMII_WEBHOOK_SECRET` and provider credentials, and populate authorized guardian/staff destinations with consent. Generic provider `success` is no longer treated as proof of delivery. Unsupported invitation source events are denied rather than fabricated.

## Student password setup and recovery

Existing pupils have no default password. In Staff → Pupils, an active administrator selects **Set up / reset access**, records the reason and confirms guardian identity verification. Issuance locks any previous password, revokes older setup links, invalidates sessions and returns one private link for manual sharing. Only the hash is stored; the URL carries its proof in a fragment, not a query string. The client removes the fragment after reading it. No SMS or email is automatically sent.

The family opens `/account/access`, chooses a 12–128 character password, then signs in with the pupil’s admission number. Expired, revoked, consumed or stale-account-version proofs cannot be used. Failed issuance responses can be retried with the same request identifier without resetting the account twice. Student → Account supports changing a password after verifying the current password; it signs out all sessions. Forgotten passwords use the same administrator-verified recovery process.

The cloud fixture verifies expiry, replay, teacher denial, reset locking, session invalidation, stale-password races, private-table grants and legacy-session denial. Browser coverage uses mocked services for the setup link, password form and account page. A real-account acceptance run is still required.

Deployment discovery: the connected Vercel tools returned no accessible Edvora project or teams. No Vercel resources or deployment secrets were created. Supabase migrations are separate from deployment configuration; no provider credentials were available to this workspace.
