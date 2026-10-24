"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePupilQuery, usePaymentsQuery, useFeeBreakdownQuery, useStudentResultQuery, useSchoolSummaryQuery } from '@/lib/query/hooks';
import { formatNaira } from '@/lib/utils';
import PaymentModal from '../payments/PaymentModal';
import PaymentReturnVerifier from '../payments/PaymentReturnVerifier';
import PaymentTimeline from './PaymentTimeline';
import ResultReport from './ResultReport';
import PageHeader from './PageHeader';

export default function StudentAccountView({view}:{view:'overview'|'payments'|'results'}) {
  const {data:pupil}=usePupilQuery();
  const {data:payments=[]}=usePaymentsQuery();
  const {data:fees=[]}=useFeeBreakdownQuery();
  const {data:result}=useStudentResultQuery();
  const {data:summary}=useSchoolSummaryQuery();
  const [paying,setPaying]=useState(false);
  if(!pupil)return <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-8"><h1 className="font-bold text-xl">No pupil account available</h1><p className="mt-2">Please contact the school office to check your account.</p></section>;
  return <div className="space-y-6">
    <PageHeader title={view==='overview'?'Student Overview':view==='payments'?'Fees & Payments':'Academic Results'} subtitle={`${pupil.fullName} · ${pupil.classGrade} · ${pupil.admissionNo}`} />
    <p className="text-sm text-on-surface-variant">{summary?.session} · {summary?.term}</p>
    {view!=='results'&&<>
      <PaymentReturnVerifier />
      <section className="grid gap-4 sm:grid-cols-3" aria-label="Current term balance">
        {[['Total charges',pupil.charges],['Verified paid',pupil.paid],['Outstanding balance',pupil.balance]].map(([label,amount])=><div key={label} className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6"><p className="text-sm text-on-surface-variant">{label}</p><p className="text-3xl font-bold text-primary mt-3">{formatNaira(Number(amount))}</p></div>)}
      </section>
      <div className="flex flex-wrap gap-3">
        {pupil.balance>0&&<button onClick={()=>setPaying(true)} className="rounded-xl bg-primary px-6 py-3 text-white font-semibold">Pay fees</button>}
        {view==='overview'&&<><Link className="rounded-xl border border-outline-variant px-6 py-3" href="/student/payments">Payments & receipts</Link><Link className="rounded-xl border border-outline-variant px-6 py-3" href="/student/results">View results</Link></>}
      </div>
      <PaymentTimeline payments={payments.filter(p=>p.pupilId===pupil.id)} totalCharges={pupil.charges} />
      {view==='payments'&&fees.length>0&&<section className="rounded-2xl bg-surface-container-lowest p-6 border border-outline-variant/30"><h2 className="text-lg font-bold mb-4">Fee breakdown</h2><ul className="divide-y divide-outline-variant/30">{fees.map(f=><li key={f.id} className="py-3 flex justify-between gap-4"><span>{f.name}</span><span className="font-semibold">{formatNaira(f.amount)}</span></li>)}</ul></section>}
      <PaymentModal isOpen={paying} onClose={()=>setPaying(false)} pupilId={pupil.id} pupilName={pupil.fullName} classGrade={pupil.classGrade} currentBalance={pupil.balance} />
    </>}
    {view==='results'&&(result?<ResultReport result={result} />:<section className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-8"><h2 className="font-bold text-lg">No published report for this term</h2><p className="mt-2 text-on-surface-variant">The school will make your report available after publication. Outstanding fees do not block published results.</p></section>)}
  </div>;
}
