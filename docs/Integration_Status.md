# Edvora integration status — 24 October 2026

This branch replaces browser fixtures for Student views with authenticated server reads. It is an integration foundation, not a production-ready release.

## Implemented

- Public site, Staff dashboard and Student dashboard remain the three product surfaces. Parents pay through the Student account.
- Server layouts require a signed session. The login form supplies the DOB required by the existing Student authentication contract, and does not redirect after failed login.
- Dashboard hooks read `/api/portal`; no browser localStorage ledger or fixture fallback. Teacher reads are limited to assigned classes, including an empty-class deny case.
- Student overview, fees and published results share a sidebar/mobile drawer. Unpublished results have an explicit empty state; debt does not hide published results.
- Checkout initializes on the server and redirects to Paystack. The return page verifies payment before refreshing the ledger. Browser code cannot manufacture receipts or credits.
- Staff shell uses the authenticated role rather than a role picker; settings and reminder toggles have protected persistence endpoints.
- Pupil registration sends and validates DOB, persists it with the primary guardian reference and reads configured classes.
- New forward migration moves RLS lookup helpers into a private schema, fixes function search paths and adds server-only school settings.

## Cloud state

Edvora project: `hphytqeqhjwvuqkxvvmh` (eu-west-2). The six committed migrations were applied. All 24 public tables have RLS enabled. Supabase security advisories returned no lints after the migration. An ephemeral SQL transaction verified separated guardian permissions and duplicate payment credit protection, then rolled back. This check was sequential, not a concurrency test.

## Run and verify

Copy `.env.example` to `.env.local`. Configure credentials in a secret store; do not commit or send them in chat. `SUPABASE_SERVICE_ROLE_KEY` is server-only. Set an independent high-entropy `SESSION_SECRET`. Use Paystack test credentials exclusively.

```
npm ci
npm run dev
npm test
npm run build
npm run typecheck
DATABASE_URL=postgresql://... npm run test:integration
```

`npm test` excludes the real PostgreSQL suite intentionally. That suite must run separately against a disposable database: it creates roles, schema and test records. The CI workflow provisions PostgreSQL 17. The `lint` command currently performs TypeScript checking, not ESLint.

## Remaining before operational use

1. Configure the deployment's server credential, authentication users and provider credentials through secure project settings. No server key or provider credentials were available to this workspace.
2. Create the real academic session/current term, classes, fee plans and assignments. No sample pupils or invented balances were seeded in the cloud.
3. Finish Staff page integration: several original Staff screens still contain static tables, examples or unsupported controls. Complete result entry/publication, fees/adjustments and registration refresh. Registration currently uses several repository calls rather than an atomic onboarding transaction; handle rollback/idempotency before bulk enrollment.
4. Complete staff account lifecycle/session revocation, verify all API role/class boundaries and test actual Supabase Auth logins. Student admission number + DOB remains the existing login model and needs a deliberate hardening decision before public launch.
5. Complete notification outcome/claim/lease/recovery contracts, remove placeholder staff recipients and connect actual consent/authorized destinations. `queue_reminders` deliberately returns an unsupported-action error; it does not claim delivery.
6. Run browser acceptance tests on desktop/mobile with real scoped accounts, including failed/canceled/duplicate Paystack test payments, receipt access, results publication and denied cross-pupil reads. Automated UI acceptance has not been completed.
7. Configure and test Termii callbacks and authorized Telegram destinations. No WhatsApp and no Telegram linking screen or workflow. Keep all five n8n schedules inactive until integration tests pass.
8. Verify hosting, domain, backups, monitoring and recovery before launch. No production deployment or live payment collection was performed.
