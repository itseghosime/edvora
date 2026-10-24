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

Project `hphytqeqhjwvuqkxvvmh` (eu-west-2). Nine migrations were applied, including Staff transactions and fee balance serialization. All 25 public tables have RLS. New transactions were verified using a rolled-back cloud fixture: role/class denials, atomic failed enrollment rollback, duplicate requests, fee reductions, server-derived scores, publication and withdrawal. No test pupils, terms or fees were left in the cloud.

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
3. Verify actual logins and complete account lifecycle/session revocation. Portal snapshots and Staff commands recheck active accounts; legacy payment/session routes need a complete account-revocation review. Admission number + DOB remains the current Student login model and needs a deliberate hardening decision before public launch.
4. Finish n8n notification claim/lease/outcome/recovery contracts, consent/destination checks and provider callbacks. Remove placeholder operational-alert recipients before connecting credentials. No WhatsApp and no Telegram linking flow. Keep all five n8n schedules inactive until integration tests pass.
5. Run deployed browser → API → Supabase acceptance with real scoped accounts and Paystack test scenarios: success, failure, cancellation, retries, receipts, denied cross-pupil reads, published/unpublished results and mobile navigation. CI UI mocks do not replace this check.
6. Confirm school grading policy (current implementation is CA 40 + exam 60), historical-term reporting, fee breakdown requirements and guardian account management. Current Staff billing/results workspace operates on the selected current term; historical records are preserved.
7. Verify hosting/domain, backups, monitoring and recovery. No live payments or notifications have been sent.
