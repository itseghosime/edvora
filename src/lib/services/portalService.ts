import { getSupabaseAdmin } from '../supabase/client';
import { db } from '../db/supabaseRepository';
import type { SessionActor } from '../auth/session';
import type { PortalSnapshot, SchoolSettings } from '../types/portal';
import type { TermResultRecord, PaymentTransaction } from '../mockData';

export function pupilScope(actor: SessionActor) {
  return actor.type === 'student' ? { pupilId: actor.pupilId } : actor.role === 'teacher' ? { classIds: actor.assignedClassIds } : undefined;
}

export async function readPortal(actor: SessionActor): Promise<PortalSnapshot> {
  const client = getSupabaseAdmin();
  if (!client) throw Object.assign(new Error('The school database is not configured.'), { statusCode: 503 });
  const checked = async <T>(query: PromiseLike<{ data: T | null; error: { message: string } | null }>): Promise<T> => {
    const { data, error } = await query;
    if (error) throw new Error('Unable to load school records: ' + error.message);
    return data as T;
  };
  const terms = await checked(client.from('academic_terms').select('*, academic_sessions(name)').eq('is_current', true).limit(1));
  const term = terms[0];
  let classQuery = client.from('school_classes').select('id,name');
  if (actor.type === 'staff' && actor.role === 'teacher') classQuery = classQuery.in('id', actor.assignedClassIds);
  const classes = actor.type === 'staff' ? await checked(classQuery) : [];
  const rawPupils = await db.listPupils(pupilScope(actor));
  const ids = rawPupils.map(p => p.id);
  const financial = actor.type === 'student' || actor.role === 'admin' || actor.role === 'bursar';
  const academic = actor.type === 'student' || actor.role === 'admin' || actor.role === 'teacher';
  const assignmentQuery = client.from('fee_assignments').select('*').in('pupil_id', ids).eq('term_id', term?.id ?? '00000000-0000-0000-0000-000000000000');
  const [assignments, credits, transactions, reports, rules, logs, plans, storedSettings] = await Promise.all([
    financial && ids.length ? checked(assignmentQuery) : [],
    financial && ids.length && term ? checked(client.from('fee_ledger_entries').select('*').in('pupil_id', ids).eq('term_id', term.id).eq('entry_type', 'credit')) : [],
    financial && ids.length && term ? checked(client.from('payment_transactions').select('*, receipts(receipt_number)').in('intent_id', await checked(client.from('payment_intents').select('id').in('pupil_id', ids).eq('term_id', term.id)).then(rows => rows.map(r => r.id))).order('created_at', { ascending: false })) : [],
    academic && ids.length && term ? checked(actor.type === 'student' ? client.from('academic_results').select('*').in('pupil_id', ids).eq('term_id', term.id).eq('status', 'published') : client.from('academic_results').select('*').in('pupil_id', ids).eq('term_id', term.id)) : [],
    actor.type === 'staff' && financial ? checked(client.from('reminder_rules').select('*')) : [],
    actor.type === 'staff' && financial ? checked(client.from('reminder_attempts').select('*, reminder_jobs(pupil_id, rule_id)').order('created_at', { ascending: false }).limit(100)) : [],
    term ? checked(client.from('fee_plans').select('*').eq('term_id', term.id)) : [],
    checked(client.from('school_settings').select('value').eq('id', 'school').limit(1)),
  ]);
  const pupils = rawPupils.map(p => {
    const assignment = assignments.find(a => a.pupil_id === p.id);
    const charges = Number(assignment?.adjusted_amount_minor ?? 0) / 100;
    const paid = credits.filter(c => c.pupil_id === p.id).reduce((sum, c) => sum + Number(c.amount_minor), 0) / 100;
    return { id: p.id, fullName: `${p.firstName} ${p.lastName}`, admissionNo: p.admissionNumber, classGrade: p.className,
      gender: p.gender === 'female' ? 'Female' as const : 'Male' as const, dateOfBirth: p.dateOfBirth ?? '', guardianName: p.guardianName,
      guardianRelationship: 'Guardian', guardianPhone: p.guardianPhone, guardianEmail: '', charges, paid, balance: Math.max(0, charges - paid),
      status: p.status === 'active' ? 'Active' as const : 'Inactive' as const, remindersEnabled: Boolean(assignment && !assignment.is_paused) };
  });
  const payments: PaymentTransaction[] = transactions.map(tx => {
    const credit = credits.find(c => c.transaction_id === tx.id);
    const pupil = pupils.find(p => p.id === credit?.pupil_id);
    return { id: tx.id, reference: tx.reference, pupilId: pupil?.id ?? '', pupilName: pupil?.fullName ?? '', classGrade: pupil?.classGrade ?? '',
      amount: Number(tx.amount_minor) / 100, channel: tx.channel === 'ussd' ? 'USSD' : tx.channel === 'bank_transfer' ? 'Bank Transfer' : 'Paystack (Card)',
      status: tx.status === 'success' ? 'Verified' : tx.status === 'pending' ? 'Pending' : 'Failed', date: tx.paid_at ?? tx.created_at,
      receiptNumber: tx.receipts?.[0]?.receipt_number ?? '', balanceAfter: Number(credit?.running_balance_minor ?? 0) / 100 };
  });
  const results: TermResultRecord[] = reports.map(r => {
    const pupil = pupils.find(p => p.id === r.pupil_id);
    return { id: r.id, pupilId: r.pupil_id, pupilName: pupil?.fullName ?? '', admissionNo: pupil?.admissionNo ?? '', classGrade: pupil?.classGrade ?? '',
      session: term?.academic_sessions?.name ?? '', term: term?.name ?? '', subjects: Array.isArray(r.subjects) ? r.subjects.map((s: Record<string, unknown>) => ({ subject: String(s.subject ?? ''), continuousAssessment: Number(s.continuousAssessment ?? s.ca ?? 0), examScore: Number(s.examScore ?? s.exam ?? 0), totalScore: Number(s.totalScore ?? s.total ?? 0), grade: String(s.grade ?? '') as 'A', remarks: String(s.remarks ?? ''), teacher: String(s.teacher ?? '') })) : [],
      totalMarks: Number(r.total_score), maxMarks: Number(r.max_score), percentage: Math.round(Number(r.average_score) * 10) / 10,
      classPosition: r.position_in_class ? String(r.position_in_class) : '—', attendanceDays: 0, totalSchoolDays: 0,
      teacherComment: r.teacher_remarks ?? '', headTeacherComment: r.head_remarks ?? '', publishedDate: r.published_at,
      status: r.status === 'published' ? 'Published' : r.status === 'under_review' ? 'Under Review' : r.status === 'under_correction' ? 'Under Correction' : 'Draft' };
  });
  const settings: SchoolSettings = { schoolName: 'Edvora Nursery & Primary School', schoolShortName: 'Edvora', academicSession: term?.academic_sessions?.name ?? '', currentTerm: term?.name ?? '', termStartDate: term?.start_date ?? '', termEndDate: term?.end_date ?? '', contactAddress: '', contactPhone: '', contactEmail: '', bursaryEmail: '', remindersEnabled: false, smsProvider: 'Termii', telegramProvider: 'Telegram', paymentGateway: 'Paystack', feeWaiverAllowed: false, ...storedSettings[0]?.value };
  const totalCharges = pupils.reduce((s, p) => s + p.charges, 0), verifiedPaid = pupils.reduce((s, p) => s + p.paid, 0);
  const summary = { session: settings.academicSession, term: settings.currentTerm, totalPupils: pupils.length, totalCharges, verifiedPaid, totalBalance: pupils.reduce((s,p) => s+p.balance,0), collectionRate: totalCharges ? Math.round(verifiedPaid / totalCharges * 1000) / 10 : 0 };
  const classStats = [...new Set(pupils.map(p => p.classGrade))].map(className => { const rows = pupils.filter(p => p.classGrade === className); const charges = rows.reduce((s,p)=>s+p.charges,0), paid = rows.reduce((s,p)=>s+p.paid,0); return { className, pupils: rows.length, charges, paid, balance: rows.reduce((s,p)=>s+p.balance,0), rate: charges ? Math.round(paid/charges*1000)/10 : 0 }; });
  const plan = plans.find(p => p.class_id === rawPupils[0]?.classId);
  return { classes, pupils, payments, results, settings, summary, classStats, termId: term?.id ?? null,
    feeItems: (plan?.components ?? []).map((c: Record<string, unknown>, i: number) => ({ id: String(i), name: String(c.name ?? ''), category: 'Tuition' as const, amount: Number(c.amountMinor ?? c.amount_minor ?? 0)/100, description: '', mandatory: true })),
    rules: rules.map(r => ({ id: r.id, title: r.name, channel: r.channels.length > 1 ? 'Both' : r.channels[0] === 'telegram' ? 'Telegram' : 'SMS', triggerCondition: `${r.trigger_days_before_due} days before due`, targetClasses: [], messageTemplate: '', isActive: r.is_active, eligibleCount: 0 })),
    logs: logs.map(l => ({ id: l.id, ruleId: l.reminder_jobs?.rule_id ?? '', pupilName: pupils.find(p => p.id === l.reminder_jobs?.pupil_id)?.fullName ?? '', guardianPhone: l.recipient, channel: l.channel === 'telegram' ? 'Telegram' : 'SMS', status: l.status === 'delivered' ? 'Delivered' : l.status === 'accepted' || l.status === 'sent' ? 'Accepted' : l.status === 'started' ? 'Pending' : 'Failed', timestamp: l.created_at, details: l.error_message ?? '' })),
  };
}
