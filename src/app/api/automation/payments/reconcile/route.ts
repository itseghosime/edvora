import { NextRequest, NextResponse } from 'next/server';
import { verifyAutomationRequest } from '@/lib/services/authService';
import { db } from '@/lib/db/supabaseRepository';

export async function POST(req: NextRequest) {
  const isAuth = verifyAutomationRequest(req.headers.get('authorization'));
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized: Invalid service key' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { reference, provider_transaction_id, amount_minor, channel, status } = body;

    if (!reference) {
      return NextResponse.json({ error: 'Missing reference' }, { status: 400 });
    }

    if (status !== 'success') {
      return NextResponse.json({
        success: false,
        status: status || 'pending',
        action: 'preserved_balance',
      });
    }

    const result = await db.creditPayment({
      reference,
      providerTransactionId: provider_transaction_id || `PSTK_${reference}`,
      amountMinor: Number(amount_minor),
      channel: channel || 'card',
    });

    return NextResponse.json({
      success: true,
      transaction_id: (result as any).transaction?.id || (result as any).transaction_id,
      receipt_number: (result as any).receipt?.receiptNumber || (result as any).receipt_number,
      new_balance_minor: (result as any).newBalanceMinor || (result as any).new_balance_minor,
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
