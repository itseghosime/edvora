-- Admin payment receipts travel through the existing WF05 payment_receipt lane.
-- Queue in the same transaction as a new verified receipt, never on a browser callback.
CREATE FUNCTION private.queue_admin_payment_receipt() RETURNS trigger
LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $$
BEGIN
 IF NOT NEW.is_void AND EXISTS (
  SELECT 1 FROM public.payment_transactions t
  JOIN public.fee_ledger_entries l ON l.transaction_id=t.id AND l.entry_type='credit'
  WHERE t.id=NEW.transaction_id AND t.status='success'
   AND t.amount_minor=NEW.amount_minor AND t.currency=NEW.currency
   AND l.pupil_id=NEW.pupil_id AND l.term_id=NEW.term_id AND l.amount_minor=NEW.amount_minor
 ) THEN
  INSERT INTO public.notification_jobs(event_type,source_event_id,recipient_type,recipient_id,channel,status)
   SELECT 'payment_receipt',NEW.id,'staff',s.id,'telegram','pending'
   FROM public.staff_profiles s JOIN public.staff_notification_contacts c ON c.staff_id=s.id
   WHERE s.is_active AND s.role='admin' AND c.consent_telegram
    AND c.telegram_chat_id::text ~ '^[1-9][0-9]{0,15}$'
   ON CONFLICT(event_type,source_event_id,recipient_id,channel) DO NOTHING;
 END IF;
 RETURN NEW;
END; $$;
REVOKE ALL ON FUNCTION private.queue_admin_payment_receipt() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION private.queue_admin_payment_receipt() TO service_role;
CREATE TRIGGER queue_admin_payment_receipt AFTER INSERT ON public.receipts
 FOR EACH ROW EXECUTE FUNCTION private.queue_admin_payment_receipt();

-- Recheck active role, current consent, verified source and non-void receipt at send time.
DO $migration$
DECLARE definition text; marker text := 'ELSIF j.recipient_type=''staff'' AND j.event_type=''operational_alert'' THEN';
BEGIN
 SELECT pg_get_functiondef(oid) INTO definition FROM pg_proc
 WHERE pronamespace='public'::regnamespace AND proname='authorize_school_send';
 IF strpos(definition,marker)=0 OR definition IS NULL THEN RAISE EXCEPTION 'Notification authorization extension point missing'; END IF;
 definition:=replace(definition,marker,$case$
 ELSIF j.recipient_type='staff' AND j.event_type='payment_receipt' THEN
   SELECT c.* INTO contact FROM staff_notification_contacts c JOIN staff_profiles s ON s.id=c.staff_id
    WHERE c.staff_id=j.recipient_id AND s.is_active AND s.role='admin';
   IF contact.staff_id IS NULL OR j.channel<>'telegram' THEN reason:='No authorized administrator payment contact'; END IF;
   SELECT 'Edvora: '||upper(t.environment)||' school fee payment confirmed.'||chr(10)||
    'Pupil: '||p2.first_name||' '||p2.last_name||' ('||p2.admission_number||')'||chr(10)||
    'Amount: NGN '||to_char(r2.amount_minor/100.0,'FM999999990.00')||chr(10)||
    'Paid: '||to_char(t.paid_at AT TIME ZONE 'Africa/Lagos','DD Mon YYYY HH24:MI')||' WAT'||chr(10)||
    'Receipt: '||r2.receipt_number||chr(10)||'Reference: '||t.reference||chr(10)||p_origin||'/admin/payments'
    INTO message
    FROM receipts r2 JOIN payment_transactions t ON t.id=r2.transaction_id JOIN pupils p2 ON p2.id=r2.pupil_id
    WHERE r2.id=j.source_event_id AND NOT r2.is_void AND t.status='success' AND t.amount_minor=r2.amount_minor
     AND t.currency=r2.currency AND t.paid_at IS NOT NULL
     AND EXISTS(SELECT 1 FROM fee_ledger_entries l WHERE l.transaction_id=t.id AND l.entry_type='credit'
      AND l.pupil_id=r2.pupil_id AND l.term_id=r2.term_id AND l.amount_minor=r2.amount_minor);
   IF message IS NULL THEN reason:='Payment receipt is unavailable, void or unverified'; END IF;
 ELSIF j.recipient_type='staff' AND j.event_type='operational_alert' THEN
 $case$);
 EXECUTE definition;
END; $migration$;
NOTIFY pgrst,'reload schema';
