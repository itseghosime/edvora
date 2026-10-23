import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/supabaseRepository';
import { config } from '@/lib/config';

export async function POST(req: NextRequest) {
  try {
    const rawPayload = await req.json();

    // 1. Strict Authenticity Verification:
    // Check against configured secret token in x-termii-token header, x-api-key header, or URL query parameter
    const tokenHeader = req.headers.get('x-termii-token') || req.headers.get('x-api-key');
    const url = new URL(req.url);
    const tokenQuery = url.searchParams.get('token');
    const providedToken = tokenHeader || tokenQuery;

    const expectedSecret = process.env.TERMII_WEBHOOK_SECRET || config.termii.apiKey;

    // Verify origin
    const isAuthenticated = Boolean(
      providedToken && expectedSecret && providedToken === expectedSecret
    );

    // If source is not authenticated, reject or quarantine with source_authenticated = false
    if (!isAuthenticated) {
      // If live production secret is set and token is missing/wrong, reject immediately
      if (process.env.TERMII_WEBHOOK_SECRET && !process.env.TERMII_WEBHOOK_SECRET.includes('sample')) {
        return NextResponse.json({ error: 'Unauthorized: Termii webhook authentication failed' }, { status: 401 });
      }
    }

    // Ingest event with verified authenticity flag via DatabaseRepository
    const event: any = await db.ingestTermiiWebhook(rawPayload, isAuthenticated);

    return NextResponse.json({
      received: true,
      event_id: event.id,
      status: event.status,
      source_authenticated: event.sourceAuthenticated ?? event.source_authenticated,
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
