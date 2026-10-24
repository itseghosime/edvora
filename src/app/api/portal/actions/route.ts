import { NextRequest, NextResponse } from 'next/server';
import { currentActor } from '@/lib/auth/currentActor';
import { requireStaffSession } from '@/lib/auth/session';
import { getSupabaseAdmin } from '@/lib/supabase/client';

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin');
    if (origin && origin !== new URL(req.url).origin) return NextResponse.json({error:'Request origin is not allowed'}, {status:403});
    const verified=await currentActor(await requireStaffSession(req));
    if(verified.type!=='staff')return NextResponse.json({error:'Staff access required'},{status:403});
    const actor=verified;
    const body = await req.json();
    const client = getSupabaseAdmin();
    if (!client) return NextResponse.json({error:'The school database is not configured.'}, {status:503});
    const allowed = (roles: string[]) => { if (!roles.includes(actor.role)) throw Object.assign(new Error('Forbidden'), {statusCode:403}); };
    let error: {message:string} | null = null;
    if (body.action === 'toggle_reminder') {
      allowed(['admin','bursar']);
      if (typeof body.ruleId !== 'string' || typeof body.isActive !== 'boolean') return NextResponse.json({error:'Invalid reminder rule'}, {status:400});
      ({error} = await client.from('reminder_rules').update({is_active:body.isActive}).eq('id',body.ruleId));
    } else if (body.action === 'update_settings') {
      allowed(['admin']);
      const allowedStrings = ['schoolName','schoolShortName','contactAddress','contactPhone','contactEmail','bursaryEmail'];
      const allowedBooleans = ['remindersEnabled','feeWaiverAllowed'];
      if (!body.settings || typeof body.settings !== 'object' || Array.isArray(body.settings)) return NextResponse.json({error:'Invalid school settings'}, {status:400});
      const values: Record<string,string|boolean> = {};
      for (const [key,value] of Object.entries(body.settings)) {
        if (allowedStrings.includes(key) && typeof value === 'string' && value.length <= 500) values[key]=value.trim();
        else if (allowedBooleans.includes(key) && typeof value === 'boolean') values[key]=value;
        else return NextResponse.json({error:'Unsupported settings field: '+key}, {status:400});
      }
      const {data,error:readError} = await client.from('school_settings').select('value').eq('id','school').single();
      if (readError) throw readError;
      ({error} = await client.from('school_settings').update({value:{...data.value,...values},updated_at:new Date().toISOString()}).eq('id','school'));
    } else if (body.action === 'update_pupil') {
      allowed(['admin']);
      const pupil=body.pupil;
      if (!pupil || typeof pupil.id!=='string' || !['Active','Inactive'].includes(pupil.status)) return NextResponse.json({error:'Invalid pupil update'}, {status:400});
      ({error} = await client.from('pupils').update({status:pupil.status==='Active'?'active':'suspended'}).eq('id',pupil.id));
    } else {
      return NextResponse.json({error:'This action is not configured. No changes were made.'}, {status:422});
    }
    if (error) throw error;
    return NextResponse.json({success:true});
  } catch (err: unknown) {
    const error=err as Error & {statusCode?:number};
    return NextResponse.json({error:error.statusCode?error.message:'Unable to save changes.'},{status:error.statusCode??500});
  }
}
