# Public site completion

The public-site work started on `antigravity/public-site-polish` and is based on the tested integration branch, not `main`.

## Completed

- Shared desktop/mobile navigation and footer; seven public routes with unique titles, descriptions and canonical URLs.
- Public-only sitemap with the configured origin; robots excludes dashboard, API, login and account routes. Robots is not an authorization boundary.
- Shared keyboard-accessible FAQs with persistent answer targets, unique IDs and expanded state.
- Facility category filters and nursery/primary example daily schedules.
- Home, About, Admissions and Contact enquiry cards prepare an editable-source, copyable summary. They make no API request, do not save personal information, and do not claim a visit or message was received. A school inbox and verified contact channels must be configured before actual dispatch can be added.
- Fees explains assigned charges, server-verified payments and receipts, links to the Student portal, and no longer shows a fabricated pupil balance, public checkout or success receipt.
- Removed unverified telephone/email endpoints and the new invented Airport Road address. Existing illustrative school content and images remain for the class project; confirm institutional claims and replace images before operational use.

## Verification

TypeScript, existing unit tests and production build run locally. CI runs PostgreSQL integration tests and Chromium browser acceptance. Browser coverage checks all seven pages at desktop/mobile widths, anchors, mobile Escape dismissal, enquiry preparation, FAQ state, programme schedule switching, facility filtering and the fees-to-login route. CI artifacts contain screenshots. Dashboard/service mocks remain isolated from real SQL tests; this is not a claim of live payment or notification acceptance.

## Still separate

No dashboard, authentication, financial, database or n8n behavior is changed by this public-site completion. No notification is sent and no workflow is activated. Actual administrator provisioning, school setup and provider test acceptance remain separate tasks. The project is a class demonstration; missing office details must not be invented to satisfy provider registration.
