# Result fee access

Published reports are locked to students and guardians while that report term has an unpaid fee assignment. Verified ledger credits reduce the balance; pending or failed payments do not. No fee assignment, a zero fee assignment, or a verified fully paid balance permits access. Historical terms are evaluated independently. Publication is still required.

Administrators use Staff → Results & grading → Allow result access. A reason is mandatory. The override is stored on that pupil/term report and can be removed using Remove access override. It never changes fees, payments or publication state. Teachers, bursars and inactive staff cannot approve exceptions. Changes use the existing idempotent command boundary and record an audit entry.

The portal API excludes locked report payloads, including grades and comments, and returns only lock metadata. A restrictive RLS policy adds fee clearance to existing guardian-child/result permissions. Admin and assigned-class teacher review remains available. Existing downloaded or printed copies cannot be recalled.

Migration: 20261025074740_fee_result_access.sql. Notification wording announces publication without promising access. Browser and PostgreSQL tests cover override/revoke, denied roles, child/term isolation, pending/partial/full payments, unpublished results, print controls and server payload exclusion.
