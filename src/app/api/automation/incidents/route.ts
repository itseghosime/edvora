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
    const {
      incident_key,
      workflow_id,
      workflow_name,
      execution_id,
      failure_kind,
      failed_node,
      record_only,
      details,
    } = body;

    if (!incident_key || !workflow_id || !failure_kind) {
      return NextResponse.json({ error: 'Missing required incident fields' }, { status: 400 });
    }

    const result = await db.recordIncident({
      incident_key,
      workflow_id,
      workflow_name: workflow_name || 'Workflow Execution',
      execution_id,
      failure_kind,
      failed_node,
      record_only: Boolean(record_only),
      details,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
