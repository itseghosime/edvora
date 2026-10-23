"use client";

import React, { useState } from "react";
import Link from "next/link";
import PaymentModal from "@/components/payments/PaymentModal";
import { usePupilQuery, usePaymentsQuery, useStudentResultQuery } from "@/lib/query/hooks";
import { formatNaira } from "@/lib/utils";

export default function StudentOverviewPage() {
  const { data: pupil } = usePupilQuery("osasere-ehigiator");
  const { data: result } = useStudentResultQuery("osasere-ehigiator");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const balance = pupil ? pupil.balance : 50000;

  return (
    <div className="space-y-6">
      
{/* Welcome Banner & Household Pupil Selector Ribbon */}
<section className="bg-surface-container-lowest rounded-2xl p-6 lg:p-7 shadow-[0_2px_12px_rgba(28,52,56,0.03)] border border-outline-variant/20 relative overflow-hidden">
<div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-surface-container-high/30 pointer-events-none blur-3xl"></div>
<div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
<div className="space-y-1.5">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-[#14695D]"></span>
<span className="text-xs font-semibold uppercase tracking-wider text-[#14695D]">Academic Session 2026/2027 · First Term</span>
</div>
<h1 className="font-display font-bold text-2xl lg:text-3xl text-on-surface tracking-tight">
              Welcome, <span className="text-[#14695D]">Dr. Osasere Senior</span> <span className="text-sm font-normal text-on-surface-variant">(Guardian)</span>
</h1>
<p className="text-sm text-on-surface-variant flex flex-wrap items-center gap-x-2 gap-y-1 pt-0.5">
<span className="">Student: <strong className="text-on-surface font-semibold">Osasere Ehigiator</strong></span>
<span className="text-outline-variant">·</span>
<span className="">Primary 3A (St. Jude Arm)</span>
<span className="text-outline-variant">·</span>
<span className="font-mono text-xs bg-surface-container-low px-2 py-0.5 rounded border border-outline-variant/30 text-tertiary">EDP-2026-042</span>
</p>
</div>
{/* Sibling Quick Switch Tabs */}
<div className="bg-surface-container-low p-1.5 rounded-xl flex flex-col sm:flex-row gap-1.5 self-start lg:self-center border border-outline-variant/20">
<button className="flex items-center gap-3 px-3.5 py-2 rounded-lg bg-surface-container-lowest text-primary shadow-[0_1px_4px_rgba(28,52,56,0.05)] text-left transition-all" type="button">
<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                OE
              </div>
<div>
<div className="text-xs font-semibold text-on-surface">Osasere Ehigiator</div>
<div className="text-[11px] text-primary font-medium">Primary 3A · Enrolled (Active)</div>
</div>
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[18px] ml-1" style={{ fontVariationSettings: "" }}>check_circle</span>
</button>
<button className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 text-left transition-all group" type="button">
<div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-tertiary font-bold text-xs group-hover:bg-primary-fixed">
                EE
              </div>
<div>
<div className="text-xs font-medium text-on-surface-variant group-hover:text-on-surface">Efe Ehigiator</div>
<div className="text-[11px] text-outline">Nursery 1B · Sibling Record</div>
</div>
<span aria-hidden="true" className="material-symbols-outlined text-outline-variant text-[16px] ml-1">swap_horiz</span>
</button>
</div>
</div>
</section>
{/* Main Row: Financial Summary & Academic Progress */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
{/* Financial Summary Card (7 cols) */}
<section className="lg:col-span-7 bg-surface-container-lowest rounded-2xl shadow-[0_2px_12px_rgba(28,52,56,0.03)] border border-outline-variant/20 overflow-hidden flex flex-col">
{/* Card Header */}
<div className="bg-surface-container-low/70 px-6 py-4 flex items-center justify-between border-b border-outline-variant/20">
<div className="flex items-center gap-2.5">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[22px]">account_balance_wallet</span>
<h2 className="font-display font-semibold text-base text-on-surface">Term Financial Balance &amp; Ledger</h2>
</div>
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#ffddb5] text-[#633f00] text-xs font-semibold uppercase tracking-wide">
              Tranche 2 Pending
            </span>
</div>
<div className="p-6 space-y-6">
{/* Key Metrics Trio */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
<div className="p-4 rounded-xl bg-surface-container-low/80 border border-outline-variant/20">
<span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Total Charges</span>
<div className="mt-2">
<div className="font-display font-bold text-2xl text-on-surface tabular-nums">₦120,000</div>
<div className="text-xs text-outline mt-0.5">Tuition &amp; Materials</div>
</div>
</div>
<div className="p-4 rounded-xl bg-surface-container-low/80 border border-outline-variant/20">
<span className="text-xs font-semibold text-primary uppercase tracking-wider">Verified Paid</span>
<div className="mt-2">
<div className="font-display font-bold text-2xl text-primary tabular-nums">₦70,000</div>
<div className="text-xs text-on-surface-variant mt-0.5">Tranche 1 Settled</div>
</div>
</div>
<div className="p-4 rounded-xl bg-[#ffddb5]/30 border border-[#ffddb5]/60">
<span className="text-xs font-semibold text-secondary uppercase tracking-wider">Balance Due</span>
<div className="mt-2">
<div className="font-display font-bold text-2xl text-secondary tabular-nums">₦50,000</div>
<div className="text-xs text-secondary mt-0.5 font-medium">Due: Nov 04, 2026</div>
</div>
</div>
</div>
{/* Progress Gauge */}
<div className="space-y-2">
<div className="flex justify-between items-center text-xs font-medium">
<span className="text-on-surface-variant">Term Settlement: <strong className="text-on-surface">58.3% Completed</strong></span>
<span className="text-secondary font-semibold">₦50,000 remaining for Full Clearance</span>
</div>
<div className="w-full h-3 rounded-full bg-surface-container overflow-hidden p-0.5">
<div className="h-full rounded-full bg-[#14695D] transition-all duration-700 ease-out" style={{}}></div>
</div>
<div className="flex justify-between text-xs text-outline pt-0.5">
<span className="">Tranche 1 Resumption (Settled Oct 14)</span>
<span className="">Tranche 2 (Mid-Term Week 7)</span>
</div>
</div>
{/* Direct Payment Action Box */}
<div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-4">
<div className="flex items-start gap-2.5">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px] mt-0.5">verified_user</span>
<div className="text-xs text-on-surface-variant leading-relaxed">
<strong className="text-on-surface">Bursary Clearance:</strong> Instant official payment receipt issued immediately upon confirmation.
                </div>
</div>
<a className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#14695D] hover:bg-primary-dark text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex-shrink-0" href="/student/payments">
<span className="">Make Payment</span>
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>
</div>
</div>
</section>
{/* Academic Progress Card (5 cols) */}
<section className="lg:col-span-5 bg-surface-container-lowest rounded-2xl shadow-[0_2px_12px_rgba(28,52,56,0.03)] border border-outline-variant/20 overflow-hidden flex flex-col justify-between">
<div>
{/* Header */}
<div className="bg-surface-container-low/70 px-6 py-4 flex items-center justify-between border-b border-outline-variant/20">
<div className="flex items-center gap-2.5">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[22px]">history_edu</span>
<h2 className="font-display font-semibold text-base text-on-surface">Academic Results · Term 1</h2>
</div>
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-medium">
                Drafting Phase
              </span>
</div>
<div className="p-6 space-y-4">
<div className="flex items-center justify-between">
<span className="font-display font-semibold text-sm text-on-surface">Continuous Assessment (CA)</span>
<span className="text-xs text-primary font-semibold bg-surface-container px-2.5 py-0.5 rounded-full">4 of 6 Subjects Logged</span>
</div>
<p className="text-xs text-on-surface-variant leading-relaxed">
                Class teachers have published current scores for Mathematics, English Diction, General Sciences, and Civic Studies. Cultural Arts and ICT pending Week 6 assessments.
              </p>
{/* Mini Subject Breakdown Visuals */}
<div className="space-y-2.5 pt-1">
<div>
<div className="flex justify-between items-center text-xs pb-1">
<span className="text-on-surface font-medium">Mathematics (Num. &amp; Logic)</span>
<span className="text-primary font-semibold tabular-nums">18 / 20 (90%)</span>
</div>
<div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
<div className="h-full bg-[#14695D] rounded-full" style={{}}></div>
</div>
</div>
<div>
<div className="flex justify-between items-center text-xs pb-1">
<span className="text-on-surface font-medium">English Studies &amp; Phonics</span>
<span className="text-primary font-semibold tabular-nums">17 / 20 (85%)</span>
</div>
<div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
<div className="h-full bg-[#14695D] rounded-full" style={{}}></div>
</div>
</div>
<div>
<div className="flex justify-between items-center text-xs pb-1">
<span className="text-on-surface font-medium">Basic Science &amp; Nature</span>
<span className="text-primary font-semibold tabular-nums">19 / 20 (95%)</span>
</div>
<div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
<div className="h-full bg-[#14695D] rounded-full" style={{}}></div>
</div>
</div>
</div>
{/* Non-Blocking Institutional Guarantee Policy */}
<div className="p-3.5 rounded-xl bg-surface-container-high/40 border border-outline-variant/20 flex items-start gap-2.5 mt-3">
<span aria-hidden="true" className="material-symbols-outlined text-[#14695D] text-[18px] mt-0.5">policy</span>
<p className="text-xs text-on-surface-variant leading-relaxed"><span style={{ color: "#051f23" }}><strong>Published academic results remain accessible even when fees are outstanding.</strong></span></p>
</div>
</div>
</div>
<div className="p-6 pt-0">
<a className="inline-flex items-center justify-between w-full px-4 py-2.5 bg-surface-container hover:bg-surface-container-high text-primary rounded-lg transition-colors text-xs font-semibold" href="/student/results">
<span className="">View Full Academic Report</span>
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>
</div>
</section>
</div>
{/* Bottom Split: Verified Ledger History & School Office Desk */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
{/* Verified Receipts Register (7 cols) */}
<section className="lg:col-span-7 bg-surface-container-lowest rounded-2xl shadow-[0_2px_12px_rgba(28,52,56,0.03)] border border-outline-variant/20 p-6 flex flex-col justify-between">
<div className="space-y-4">
<div className="flex items-center justify-between pb-2">
<div>
<h2 className="font-display font-semibold text-lg text-on-surface tracking-tight">Recent Verified Payments</h2>
<p className="text-xs text-on-surface-variant">Verified payments and receipts for the selected pupil.</p>
</div>
<a className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold" href="/student/payments">
                All Receipts <span aria-hidden="true" className="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</div>
{/* Receipt Cards */}
<div className="space-y-3">
{/* Item 1: Verified ₦70,000 */}
<div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
<div className="flex items-start gap-3">
<div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm flex-shrink-0">
<span aria-hidden="true" className="material-symbols-outlined text-[22px]">receipt_long</span>
</div>
<div>
<div className="flex items-center gap-2 flex-wrap">
<span className="font-display font-bold text-on-surface text-base tabular-nums">₦70,000</span>
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "" }}>check</span> Verified
                      </span>
</div>
<div className="text-xs text-on-surface-variant mt-0.5">
                      Tranche 1 Resumption · Ref: <code className="text-primary font-mono font-medium">EDV-8842</code>
</div>
<div className="text-[11px] text-outline mt-0.5">
                      Settled Oct 14, 2026 · Official Receipt Stamped
                    </div>
</div>
</div>
<button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs font-medium border border-outline-variant/30 shadow-sm transition-all flex-shrink-0" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[16px]">file_download</span>
<span className="">Download PDF</span>
</button>
</div>
{/* Item 2: Books & Uniform Archived */}
<div className="p-4 rounded-xl bg-surface-container-low/50 border border-outline-variant/10 flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-surface-container-lowest/70 flex items-center justify-center text-outline flex-shrink-0">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">inventory_2</span>
</div>
<div>
<div className="text-xs font-semibold text-on-surface">Previous term · ₦35,000</div>
<div className="text-[11px] text-outline">Ref: EDV-7109 · Verified Sep 03, 2026</div>
</div>
</div>
<span className="text-xs text-outline px-2 py-0.5 rounded bg-surface-container">Archived</span>
</div>
</div>
</div>
<div className="pt-4 flex items-center gap-2 text-on-surface-variant text-xs">
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-primary">verified</span>
<span className="">Keep verified payment receipts for your records.</span>
</div>
</section>
{/* School Office & Queries (5 cols) */}
<section className="lg:col-span-5 bg-surface-container-lowest rounded-2xl shadow-[0_2px_12px_rgba(28,52,56,0.03)] border border-outline-variant/20 p-6 flex flex-col justify-between">
<div className="space-y-3">
<div className="flex items-center gap-2.5">
<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">support_agent</span>
</div>
<h2 className="font-display font-semibold text-lg text-on-surface tracking-tight">School Office &amp; Queries</h2>
</div>
<p className="text-xs text-on-surface-variant leading-relaxed">
              Need clarity on fee tranches, transportation routes, or learning evaluations? Our campus administrative desk provides structured personal assistance.
            </p>
{/* Channels */}
<div className="space-y-2.5 pt-1">
<div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-start gap-2.5">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px] mt-0.5">call</span>
<div>
<div className="text-[11px] text-outline uppercase tracking-wider font-semibold">Direct Desk Telephone</div>
<div className="text-xs font-semibold text-on-surface mt-0.5">Contact school office</div>
<div className="text-[11px] text-on-surface-variant">Monday – Friday · 8:00 AM – 4:00 PM WAT</div>
</div>
</div>
<div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-start gap-2.5">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px] mt-0.5">location_on</span>
<div>
<div className="text-[11px] text-outline uppercase tracking-wider font-semibold">Campus Administration</div>
<div className="text-xs font-semibold text-on-surface mt-0.5">Edvora Nursery &amp; Primary School</div>
<div className="text-[11px] text-on-surface-variant">Contact the school office for directions.</div>
</div>
</div>
</div>
{/* Classroom Dignity Policy */}
<div className="p-3 rounded-xl bg-[#ffddb5]/25 border border-[#ffddb5]/50 flex items-start gap-2">
<span aria-hidden="true" className="material-symbols-outlined text-secondary text-[18px] mt-0.5">notifications_off</span>
<p className="text-xs text-[#633f00] leading-snug">
<strong>Classroom Focus Policy:</strong> Direct unstructured instant messaging during school hours is disabled. All inquiries route through the Administrative Desk.
              </p>
</div>
</div>
<div className="pt-4">
<a className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors" href="/contact">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">help_outline</span>
<span className="">School FAQs</span>
</a>
</div>
</section>
</div>
{/* Teacher Developmental Observations for Osasere */}
<section className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_2px_12px_rgba(28,52,56,0.03)] border border-outline-variant/20">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-outline-variant/20">
<div>
<span className="text-xs font-semibold uppercase tracking-wider text-primary">Portal Help</span>
<h3 className="font-display font-semibold text-base text-on-surface">Student Account Guide</h3>
</div>
<span className="text-xs text-outline font-medium">Manage the selected child’s account</span>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
{/* Reading & Diction */}
<div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between">
<div className="space-y-1.5">
<div className="flex items-center justify-between">
<span className="text-xs font-semibold text-secondary uppercase">Fees &amp; Payments</span>
<span className="text-[11px] text-outline">Yesterday</span>
</div>
<p className="text-xs text-on-surface-variant leading-relaxed">View the term fee breakdown, check your balance and make an instalment payment.</p>
</div>
<div className="pt-3 flex items-center gap-1.5 text-primary text-xs font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">menu_book</span>
<span className="">View fees</span>
</div>
</div>
{/* STEM & Logic */}
<div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between">
<div className="space-y-1.5">
<div className="flex items-center justify-between">
<span className="text-xs font-semibold text-secondary uppercase">Academic Results</span>
<span className="text-[11px] text-outline">Oct 18</span>
</div>
<p className="text-xs text-on-surface-variant leading-relaxed">View results after the school publishes them for the selected child and term.</p>
</div>
<div className="pt-3 flex items-center gap-1.5 text-primary text-xs font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">calculate</span>
<span className="">View results</span>
</div>
</div>
{/* Habits & Conduct */}
<div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between">
<div className="space-y-1.5">
<div className="flex items-center justify-between">
<span className="text-xs font-semibold text-secondary uppercase">School Support</span>
<span className="text-[11px] text-outline">Oct 16</span>
</div>
<p className="text-xs text-on-surface-variant leading-relaxed">Contact the school office if you need help with a payment or account record.</p>
</div>
<div className="pt-3 flex items-center gap-1.5 text-primary text-xs font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">verified</span>
<span className="">Contact office</span>
</div>
</div>
</div>
</section>
{/* Portal Footer */}
<footer className="pt-4 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant border-t border-outline-variant/20">
<div className="flex items-center gap-2">
<span className="font-display font-semibold text-primary">edvora.</span>
<span className="">© 2026 Edvora Administrative Systems. All rights reserved.</span>
</div>
<div className="flex items-center gap-4">
<a className="hover:text-primary transition-colors" href="/contact">School Office Help Desk</a>
<span className="text-outline-variant">·</span>
<a className="hover:text-primary transition-colors" href="/student/privacy">Data Privacy &amp; Records</a>
</div>
</footer>


      {pupil && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          pupilId={pupil.id}
          pupilName={pupil.fullName}
          classGrade={pupil.classGrade}
          currentBalance={balance}
        />
      )}
    </div>
  );
}
