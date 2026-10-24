# Operational acceptance — 24 October 2026

Live application: https://edvora-sage.vercel.app
Application commit: 3935c8f2a43e1f9ada70d03a425b7c9d801002c6

## Active automation
- WF01: Telegram fee reminder scan at 09:00 Africa/Lagos; current rule eligible 11–18 December, minimum NGN 1,000.
- WF02: pending test-payment reconciliation every five minutes. n8n sends claimed job ID, claim token and reference to the backend. The backend verifies directly with Paystack using its server-only key and applies atomic credits. n8n no longer needs a duplicate Paystack credential.
- WF04: safe recovery every fifteen minutes and bound error handling for WF01, WF02 and WF05. WF05 failures remain record-only to prevent alert loops.
- WF05: receipts, results and admin Telegram alerts every two minutes.
- WF03 remains inactive; SMS send nodes are disabled. Snapshot files export inactive for safe imports; this does not describe the live publication state.

## Acceptance evidence
- Demo pupil EDV/DEMO/025: successful NGN 1,000 test payment, exactly one ledger credit and one receipt; outstanding NGN 119,000.
- Telegram receipt message 3, result message 4 and reminder message 5 recorded sent.
- Administrator alert message 6 recorded sent; synthetic acceptance incident resolved afterward. Admin Telegram contact configured with consent; SMS consent disabled.
- Recovery negative test: nonexistent test reference claimed in execution 211; no transaction/credit created. Temporary intent deleted. Execution payload retention remains disabled, so a saved provider response is not available. A fresh positive recovery of a genuinely paid pending intent was not performed.
- Seven live Staff routes and seven public routes opened successfully in the authenticated browser; Staff routes showed no record-loading errors or horizontal overflow.

## Outstanding walkthrough findings
- Public pages report minified React hydration error 418 in the user's Chrome. Same application revision passed CI browser checks; cause is not established. Do not claim a clean console.
- Fresh Student browser walkthrough was not completed in this session because only an admin session was available. Prior Student login/results/payment acceptance and CI Student payment-modal checks remain valid historical evidence.
- Public enquiries prepare copyable text only; they do not send to the school.
- SMS registration and live payments remain outside this class demonstration.

No secrets are stored in this document or workflow snapshots. Credential references contain only n8n IDs and names.
