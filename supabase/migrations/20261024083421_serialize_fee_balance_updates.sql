-- Serialize payment credits against fee reductions and other credits for the same pupil/term.
CREATE OR REPLACE FUNCTION credit_payment_intent(
    p_reference VARCHAR(64),
    p_provider_tx_id VARCHAR(64),
    p_amount_minor BIGINT,
    p_channel VARCHAR(32),
    p_raw_payload JSONB DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
    v_intent RECORD;
    v_existing_tx RECORD;
    v_tx_id UUID;
    v_receipt_number VARCHAR(32);
    v_receipt_id UUID;
    v_previous_balance BIGINT;
    v_new_balance BIGINT;
    v_guardian_id UUID;
BEGIN
    -- 1. Check for duplicate transaction or reference (Idempotent replay)
    SELECT * INTO v_existing_tx FROM payment_transactions 
    WHERE reference = p_reference OR provider_transaction_id = p_provider_tx_id;
    
    IF FOUND THEN
        SELECT id, receipt_number INTO v_receipt_id, v_receipt_number FROM receipts WHERE transaction_id = v_existing_tx.id;
        RETURN jsonb_build_object(
            'success', true,
            'duplicate', true,
            'transaction_id', v_existing_tx.id,
            'receipt_number', v_receipt_number,
            'message', 'Transaction already credited'
        );
    END IF;

    -- 2. Lock payment intent row FOR UPDATE
    SELECT * INTO v_intent FROM payment_intents 
    WHERE reference = p_reference 
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Payment intent not found for reference %', p_reference;
    END IF;

    -- 3. If intent has already been credited (e.g. concurrent execution), return idempotent response
    IF v_intent.status = 'successful' THEN
        SELECT * INTO v_existing_tx FROM payment_transactions WHERE reference = p_reference LIMIT 1;
        SELECT id, receipt_number INTO v_receipt_id, v_receipt_number FROM receipts WHERE transaction_id = v_existing_tx.id LIMIT 1;
        RETURN jsonb_build_object(
            'success', true,
            'duplicate', true,
            'transaction_id', v_existing_tx.id,
            'receipt_number', v_receipt_number,
            'message', 'Transaction already credited'
        );
    END IF;

    -- 4. Verify amount in minor units
    IF v_intent.amount_minor <> p_amount_minor THEN
        UPDATE payment_intents SET status = 'failed' WHERE id = v_intent.id;
        RAISE EXCEPTION 'Amount mismatch: expected % minor units, got %', v_intent.amount_minor, p_amount_minor;
    END IF;

    -- 4. Calculate authoritative balance
    SELECT COALESCE(adjusted_amount_minor, 0) INTO v_previous_balance 
    FROM fee_assignments 
    WHERE pupil_id = v_intent.pupil_id AND term_id = v_intent.term_id
    FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Fee assignment not found for this payment'; END IF;

    -- Subtract previous credits
    SELECT v_previous_balance - COALESCE(SUM(amount_minor), 0) INTO v_previous_balance
    FROM fee_ledger_entries
    WHERE pupil_id = v_intent.pupil_id AND term_id = v_intent.term_id AND entry_type = 'credit';

    v_new_balance := GREATEST(0, v_previous_balance - p_amount_minor);

    -- 5. Insert payment transaction
    INSERT INTO payment_transactions (
        intent_id, reference, provider, provider_transaction_id, amount_minor, currency, environment, status, channel, paid_at, raw_payload
    ) VALUES (
        v_intent.id, p_reference, 'paystack', p_provider_tx_id, p_amount_minor, 'NGN', 'test', 'success', p_channel, now(), p_raw_payload
    ) RETURNING id INTO v_tx_id;

    -- 6. Update intent status
    UPDATE payment_intents SET status = 'successful' WHERE id = v_intent.id;

    -- 7. Append immutable ledger entry
    INSERT INTO fee_ledger_entries (
        pupil_id, term_id, transaction_id, entry_type, amount_minor, running_balance_minor, reference, description
    ) VALUES (
        v_intent.pupil_id, v_intent.term_id, v_tx_id, 'credit', p_amount_minor, v_new_balance, p_reference, 'Installment fee payment via Paystack'
    );

    -- 8. Generate and insert receipt
    v_receipt_number := 'REC-' || to_char(clock_timestamp(), 'YYYYMMDD') || '-' || lpad(cast(floor(random() * 90000000 + 10000000) as text), 8, '0');
    INSERT INTO receipts (
        receipt_number, transaction_id, pupil_id, term_id, amount_minor, currency, issued_at
    ) VALUES (
        v_receipt_number, v_tx_id, v_intent.pupil_id, v_intent.term_id, p_amount_minor, 'NGN', now()
    ) RETURNING id INTO v_receipt_id;

    -- 9. Enqueue transactional notification for guardian in same transaction
    SELECT COALESCE(p.guardian_id, pg.guardian_id) INTO v_guardian_id
    FROM pupils p
    LEFT JOIN pupil_guardians pg ON pg.pupil_id = p.id AND pg.is_primary = true
    WHERE p.id = v_intent.pupil_id
    LIMIT 1;

    IF v_guardian_id IS NOT NULL THEN
        INSERT INTO notification_jobs (
            event_type, source_event_id, recipient_type, recipient_id, channel, status
        ) VALUES 
        ('payment_receipt', v_receipt_id, 'guardian', v_guardian_id, 'sms', 'pending')
        ON CONFLICT (event_type, source_event_id, recipient_id, channel) DO NOTHING;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'duplicate', false,
        'transaction_id', v_tx_id,
        'receipt_number', v_receipt_number,
        'new_balance_minor', v_new_balance
    );
END;
$$;


REVOKE ALL ON FUNCTION public.credit_payment_intent(varchar,varchar,bigint,varchar,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.credit_payment_intent(varchar,varchar,bigint,varchar,jsonb) TO service_role;
