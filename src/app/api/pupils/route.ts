import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { executeStaffCommand } from '@/lib/services/staffCommands';
import { db } from '@/lib/db/supabaseRepository';
import { getSession, requireStaffSession } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (session.type === 'student') {
      // Student session can only access their own record
      const pupils = await db.listPupils({ pupilId: session.pupilId });
      if (pupils.length === 0) {
        return NextResponse.json({ error: 'Pupil record not found' }, { status: 404 });
      }
      return NextResponse.json({ pupils });
    }

    // Staff session
    const filter = session.role === 'teacher' ? { classIds: session.assignedClassIds } : undefined;
    const pupils = await db.listPupils(filter);
    return NextResponse.json({ pupils });
  } catch (err: any) {
    const status = err.statusCode || 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Only Admin staff can register new pupils
    const actor=await requireStaffSession(req, ['admin']);

    const body = await req.json();
    const { firstName, lastName, gender, classId, guardianName, guardianPhone, guardianEmail, dateOfBirth } = body;

    if (!firstName || !lastName || !classId || !guardianName || !guardianPhone) {
      return NextResponse.json({ error: 'Please provide all required pupil and guardian details' }, { status: 400 });
    }

    if (typeof dateOfBirth !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth) || !Number.isFinite(Date.parse(dateOfBirth)) || new Date(dateOfBirth).toISOString().slice(0,10) !== dateOfBirth || Date.parse(dateOfBirth) > Date.now()) {
      return NextResponse.json({error:'Provide a valid date of birth'}, {status:400});
    }
    const result=await executeStaffCommand(actor,{requestId:body.requestId??randomUUID(),command:'register_pupil',payload:{firstName,lastName,gender:gender??'male',classId,guardianName,guardianPhone,guardianEmail:guardianEmail??'',dateOfBirth,smsConsent:body.smsConsent===true}});
    return NextResponse.json({success:true,pupil:{id:result.id,admissionNumber:result.admissionNumber,admission_number:result.admissionNumber}});

  } catch (err: any) {
    const status = err.statusCode || 400;
    return NextResponse.json({ error: err.message }, { status });
  }
}

