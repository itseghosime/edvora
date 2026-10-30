# Administrator payment notifications

New verified receipts enqueue one Telegram payment_receipt job per active administrator with a stored private destination and explicit Telegram consent. The queue insert is transactional with receipt creation. Duplicate payment verification creates no new receipt or extra admin job. Failed and pending payments do not notify.

WF05 already supports payment_receipt and needs no workflow graph change. Backend send authorization independently rechecks active admin role, current consent, verified transaction, matching ledger credit and non-void receipt. Text contains the payment environment, pupil/admission number, amount, paid date/time in WAT, receipt, reference and Staff payment ledger link. Guardian receipt and operational alert handling remain intact. SMS remains disabled.

No historical bulk notifications are enqueued by the migration. A one-off acceptance test may queue a missing staff receipt for an already verified test payment using the same unique event/source/recipient/channel key; it must not create another credit or receipt.
