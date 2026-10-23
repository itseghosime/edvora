"use client";

import React, { useState } from "react";
import Link from "next/link";
import PaymentModal from "@/components/payments/PaymentModal";
import { usePupilQuery, usePaymentsQuery, useFeeBreakdownQuery } from "@/lib/query/hooks";
import { formatNaira } from "@/lib/utils";

export default function StudentPaymentsPage() {
  const { data: pupil } = usePupilQuery("osasere-ehigiator");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const balance = pupil ? pupil.balance : 50000;

  return (
    <div className="space-y-6">
      
<div className="p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">
{/* Breadcrumbs & Heading */}
<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
<div className="space-y-1">
<div className="flex items-center gap-2">
<span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-semibold uppercase tracking-wider">Edvora Nursery &amp; Primary School</span>
<span className="text-on-surface-variant text-xs">•</span>
<span className="text-on-surface-variant text-xs font-mono">ID: EDV-2026-0391</span>
</div>
<h1 className="text-3xl font-headline-lg font-bold text-primary tracking-tight">Fees &amp; Payments</h1>
<p className="text-sm font-body-md text-on-surface-variant max-w-2xl">
            Official term billing ledger, verified bursary receipts, and structured instalment schedule for Osasere Ehigiator.
          </p>
</div>
{/* Term Selector Widget */}
<div className="flex items-center gap-2">
<div className="flex items-center gap-2 bg-surface-container-lowest px-3.5 py-2 rounded-xl border border-outline-variant/30 shadow-sm text-on-surface">
<span aria-hidden="true" className="material-symbols-outlined text-secondary text-[20px]">calendar_month</span>
<span className="font-label-md font-medium text-xs">2026/2027 Academic Session · First Term</span>
</div>
</div>
</div>
{/* Financial Bento Summary Cards */}
<div className="grid grid-cols-1 md:grid-cols-12 gap-5">
{/* 1. Total Term Assessment */}
<div className="md:col-span-4 bg-surface-container-lowest rounded-2xl p-6 shadow-[0_2px_12px_rgba(28,52,56,0.04)] border border-outline-variant/20 flex flex-col justify-between relative overflow-hidden group">
<div className="absolute -right-6 -bottom-6 w-24 h-24 bg-surface-container rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
<div className="space-y-1.5 relative z-10">
<div className="flex items-center justify-between">
<span className="text-[11px] font-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">Total Term Assessment</span>
<span aria-hidden="true" className="material-symbols-outlined text-outline text-[20px]">account_balance_wallet</span>
</div>
<div className="text-4xl font-display-lg font-bold text-primary tracking-tight">₦120,000</div>
</div>
<div className="pt-4 mt-4 border-t border-surface-container-low flex items-center justify-between text-xs font-body-sm text-on-surface-variant relative z-10">
<span className="">4 Approved Invoiced Heads</span>
<span className="font-label-md font-semibold text-primary">Consolidated Bill</span>
</div>
</div>
{/* 2. Verified Paid to Date */}
<div className="md:col-span-4 bg-surface-container-lowest rounded-2xl p-6 shadow-[0_2px_12px_rgba(28,52,56,0.04)] border border-outline-variant/20 flex flex-col justify-between relative overflow-hidden group">
<div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary-fixed/30 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
<div className="space-y-1.5 relative z-10">
<div className="flex items-center justify-between">
<span className="text-[11px] font-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">Verified Paid to Date</span>
<span className="inline-flex items-center gap-1 text-[11px] font-label-sm font-semibold text-primary bg-primary-fixed px-2 py-0.5 rounded-full">
<span aria-hidden="true" className="material-symbols-outlined text-[13px]">check_circle</span> 58.3% Cleared
              </span>
</div>
<div className="text-4xl font-display-lg font-bold text-[#14695D] tracking-tight">₦70,000</div>
</div>
<div className="pt-4 mt-4 space-y-1 relative z-10">
<div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
<div className="bg-[#14695D] h-full rounded-full transition-all duration-1000" style={{}}></div>
</div>
<div className="flex justify-between text-xs font-body-sm text-on-surface-variant">
<span className="">Tranche 1 Reconciled</span>
<span className="text-primary font-medium">Oct 14, 2026</span>
</div>
</div>
</div>
{/* 3. Outstanding Balance */}
<div className="md:col-span-4 bg-surface-container-low rounded-2xl p-6 shadow-[0_2px_12px_rgba(28,52,56,0.04)] border border-outline-variant/30 flex flex-col justify-between relative overflow-hidden">
<div className="space-y-1.5">
<div className="flex items-center justify-between">
<span className="text-[11px] font-label-sm font-semibold uppercase tracking-wider text-secondary">Remaining Outstanding</span>
<span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed-dim/40 text-on-secondary-fixed text-[11px] font-bold">Due Week 7</span>
</div>
<div className="text-4xl font-display-lg font-bold text-secondary tracking-tight">₦50,000</div>
</div>
<div className="pt-4 mt-4 border-t border-outline-variant/20 flex items-center justify-between">
<div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-body-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-secondary">event</span>
<span className="">Due: Nov 04, 2026</span>
</div>
<a className="inline-flex items-center gap-1 text-xs font-label-md font-semibold text-secondary hover:text-on-secondary-container transition-colors" href="#checkout-action-box">
              Pay Now <span aria-hidden="true" className="material-symbols-outlined text-[15px]">arrow_downward</span>
</a>
</div>
</div>
</div>
{/* Main Two-Column Content Grid */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
{/* ================= LEFT COLUMN (Col 7) ================= */}
<div className="lg:col-span-7 space-y-6">
{/* Itemized Assessment Breakdown */}
<div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_2px_12px_rgba(28,52,56,0.04)] border border-outline-variant/20 space-y-4">
<div className="flex items-center justify-between">
<div>
<h2 className="text-lg font-headline-sm font-bold text-primary">Itemized Assessment Breakdown</h2>
<p className="text-xs font-body-sm text-on-surface-variant">Fee breakdown for 2026/2027 First Term.</p>
</div>
<span aria-hidden="true" className="material-symbols-outlined text-outline text-[20px]" title="Ledger specification">fact_check</span>
</div>
<div className="space-y-2 pt-1">
{/* Item 1 */}
<div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low/70 hover:bg-surface-container-low transition-colors">
<div className="flex items-center gap-3 min-w-0">
<div className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shrink-0 shadow-sm border border-outline-variant/20">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">menu_book</span>
</div>
<div className="min-w-0">
<p className="text-sm font-title-md font-semibold text-on-surface truncate">Tuition</p>
<p className="text-xs text-on-surface-variant">Full curriculum instruction, literacy, and continuous assessments</p>
</div>
</div>
<div className="text-right shrink-0 pl-3">
<span className="text-sm font-title-md font-bold text-on-surface">₦70,000</span>
<span className="block text-[11px] text-on-surface-variant font-medium">Billable Head</span>
</div>
</div>
{/* Item 2 */}
<div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low/70 hover:bg-surface-container-low transition-colors">
<div className="flex items-center gap-3 min-w-0">
<div className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shrink-0 shadow-sm border border-outline-variant/20">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">science</span>
</div>
<div className="min-w-0">
<p className="text-sm font-title-md font-semibold text-on-surface truncate">STEM &amp; Computer Lab Resource Materials</p>
<p className="text-xs text-on-surface-variant">Robotics kits, coding terminals, and hands-on lab apparatus</p>
</div>
</div>
<div className="text-right shrink-0 pl-3">
<span className="text-sm font-title-md font-bold text-on-surface">₦25,000</span>
<span className="block text-[11px] text-on-surface-variant font-medium">Resource Levy</span>
</div>
</div>
{/* Item 3 */}
<div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low/70 hover:bg-surface-container-low transition-colors">
<div className="flex items-center gap-3 min-w-0">
<div className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shrink-0 shadow-sm border border-outline-variant/20">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">lunch_dining</span>
</div>
<div className="min-w-0">
<p className="text-sm font-title-md font-semibold text-on-surface truncate">Co-curricular Activities</p>
<p className="text-xs text-on-surface-variant">Daily fresh seasonal fruit collation, filtered water &amp; infirmary retainer</p>
</div>
</div>
<div className="text-right shrink-0 pl-3">
<span className="text-sm font-title-md font-bold text-on-surface">₦15,000</span>
<span className="block text-[11px] text-on-surface-variant font-medium">Student Welfare</span>
</div>
</div>
{/* Item 4 */}
<div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low/70 hover:bg-surface-container-low transition-colors">
<div className="flex items-center gap-3 min-w-0">
<div className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shrink-0 shadow-sm border border-outline-variant/20">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">palette</span>
</div>
<div className="min-w-0">
<p className="text-sm font-title-md font-semibold text-on-surface truncate">Assessment &amp; Reporting</p>
<p className="text-xs text-on-surface-variant">Swimming coaching, visual studio canvases, and athletic track gear</p>
</div>
</div>
<div className="text-right shrink-0 pl-3">
<span className="text-sm font-title-md font-bold text-on-surface">₦10,000</span>
<span className="block text-[11px] text-on-surface-variant font-medium">Activity Fee</span>
</div>
</div>
</div>
{/* Total Bar */}
<div className="p-4 rounded-xl bg-surface-container-high/60 border border-outline-variant/30 flex items-center justify-between">
<span className="font-title-md text-base text-primary font-bold">Total Structured Bill</span>
<span className="text-xl font-headline-sm text-primary font-bold">₦120,000</span>
</div>
</div>
{/* Academic Instalment Schedule (2-Tranche Model) */}
<div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_2px_12px_rgba(28,52,56,0.04)] border border-outline-variant/20 space-y-4">
<div className="flex items-center justify-between">
<div>
<h2 className="text-lg font-headline-sm font-bold text-primary">Instalment Payment Schedule</h2>
<p className="text-xs font-body-sm text-on-surface-variant">Agreed termly split plan between parent and school bursary.</p>
</div>
<span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-semibold">Flexible Instalments</span>
</div>
{/* Timeline */}
<div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-surface-container-highest">
{/* Tranche 1 */}
<div className="relative space-y-1">
<div className="absolute -left-[1.85rem] top-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white shadow-sm ring-2 ring-surface-container-lowest">
<span aria-hidden="true" className="material-symbols-outlined text-[13px]">check</span>
</div>
<div className="p-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
<div className="space-y-0.5">
<div className="flex items-center gap-2">
<span className="font-title-md text-sm text-on-surface font-bold">Tranche 1 (Resumption Clearance)</span>
<span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-semibold">Verified Paid</span>
</div>
<p className="text-xs font-body-sm text-on-surface-variant">Receipt #EDV-8842 • Settled on Oct 14, 2026</p>
</div>
<div className="text-left sm:text-right">
<span className="text-sm font-title-md text-primary font-bold">₦70,000</span>
<span className="block text-[11px] text-primary font-medium">100% Cleared</span>
</div>
</div>
</div>
{/* Tranche 2 */}
<div className="relative space-y-1">
<div className="absolute -left-[1.85rem] top-1.5 w-5 h-5 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shadow-sm ring-2 ring-surface-container-lowest">
<span aria-hidden="true" className="material-symbols-outlined text-[13px]">schedule</span>
</div>
<div className="p-4 rounded-xl bg-surface-container-high/40 border border-secondary-fixed-dim/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
<div className="space-y-0.5">
<div className="flex items-center gap-2">
<span className="font-title-md text-sm text-on-surface font-bold">Tranche 2 (Mid-Term Week 7)</span>
<span className="px-2 py-0.5 rounded-full bg-secondary-fixed-dim/50 text-secondary text-[11px] font-bold">Pending Settlement</span>
</div>
<p className="text-xs font-body-sm text-on-surface-variant">Due Date: Wednesday, Nov 04, 2026</p>
</div>
<div className="text-left sm:text-right">
<span className="text-sm font-title-md text-secondary font-bold">₦50,000</span>
<span className="block text-[11px] text-secondary font-medium">Awaiting Checkout</span>
</div>
</div>
</div>
</div>
</div>
</div>
{/* ================= RIGHT COLUMN (Col 5) ================= */}
<div className="lg:col-span-5 space-y-6">
{/* Interactive Payment Action Box */}
<div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_4px_20px_rgba(28,52,56,0.06)] border border-outline-variant/30 space-y-5" id="checkout-action-box">
<div className="flex items-center justify-between">
<div className="space-y-0.5">
<div className="flex items-center gap-1.5">
<span className="text-[11px] font-label-sm uppercase tracking-wider text-primary font-bold">Checkout Engine</span>
<span className="px-2 py-0.2 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-medium">Secure Channel</span>
</div>
<h2 className="text-lg font-headline-sm font-bold text-on-surface">Choose Payment Option</h2>
</div>
<div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
<span aria-hidden="true" className="material-symbols-outlined text-[22px]">payments</span>
</div>
</div>
{/* Radio Options */}
<div className="space-y-2.5">
{/* Option A: Full Balance */}
<label className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-low border border-primary/20 cursor-pointer transition-all" id="label-opt-a">
<input defaultChecked className="mt-0.5 w-4 h-4 text-primary focus:ring-primary accent-[#14695D]" name="payment_choice" type="radio" value="50000" />
<div className="flex-1 min-w-0">
<div className="flex items-center justify-between">
<span className="text-sm font-title-md font-semibold text-on-surface">Pay Outstanding Tranche 2</span>
<span className="text-sm font-title-md font-bold text-primary">₦50,000</span>
</div>
<p className="text-xs text-on-surface-variant mt-0.5">Clears the term balance after payment verification.</p>
</div>
</label>
{/* Option B: Custom Part Payment */}
<label className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant/30 cursor-pointer transition-all" id="label-opt-b">
<input className="mt-0.5 w-4 h-4 text-primary focus:ring-primary accent-[#14695D]" name="payment_choice" type="radio" value="custom" />
<div className="flex-1 min-w-0">
<div className="flex items-center justify-between">
<span className="text-sm font-title-md font-semibold text-on-surface">Custom Part-Payment</span>
<span className="text-xs text-on-surface-variant font-medium">Amount up to ₦50,000</span>
</div>
<p className="text-xs text-on-surface-variant mt-0.5">Enter an advance amount toward Tranche 2 balance.</p>
{/* Custom Input Area */}
<div className="hidden mt-3" id="custom-amount-wrapper">
<div className="flex items-center bg-surface-container-lowest rounded-lg px-3 py-2 border border-outline-variant/40 shadow-inner">
<span className="text-on-surface-variant font-semibold mr-1.5">₦</span>
<input className="w-full bg-transparent text-on-surface font-semibold text-sm focus:outline-none" id="custom-amount-input" max="50000" min="10000" step="5000" type="number" value="25000" />
</div>
<span className="text-[11px] text-on-surface-variant mt-1.5 block">
                      Remaining balance after payment: <span className="text-secondary font-bold" id="projected-remaining">₦25,000</span>
</span>
</div>
</div>
</label>
</div>
{/* Primary CTA & Security Notice */}
<div className="space-y-3 pt-1">
<button className="w-full py-3.5 px-4 rounded-xl bg-[#14695D] hover:bg-primary text-white font-headline-sm text-sm font-bold active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm" id="secure-cta-btn" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[19px]">lock</span>
<span id="cta-button-text" className="">Proceed to Secure Payment (₦50,000)</span>
</button>
{/* Clean Production Security Notice */}
<div className="p-3 rounded-xl bg-surface-container-low/70 border border-outline-variant/25 flex items-start gap-2.5 text-on-surface">
<span aria-hidden="true" className="material-symbols-outlined text-[#14695D] text-[18px] shrink-0 mt-0.5">verified_user</span>
<p className="text-xs text-on-surface-variant leading-relaxed">
                  Secured via 256-bit payment encryption. Instant bursary reconciliation upon confirmation.
                </p>
</div>
</div>
{/* Confirmation Feedback Banner */}
<div className="hidden p-3.5 rounded-xl bg-primary-fixed border border-primary/20 text-on-primary-fixed space-y-1 transition-all" id="payment-success-banner">
<div className="flex items-center gap-2">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
<span className="text-sm font-headline-sm font-bold text-primary">Payment Reconciled</span>
</div>
<p className="text-xs text-on-primary-fixed">
                Receipt #EDV-8843 generated. Ledger balance successfully updated.
              </p>
</div>
</div>
{/* Official Receipts Archive */}
<div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_2px_12px_rgba(28,52,56,0.04)] border border-outline-variant/20 space-y-4">
<div className="flex items-center justify-between">
<h2 className="text-lg font-headline-sm font-bold text-primary">Official Receipts Archive</h2>
<span className="text-xs font-medium text-on-surface-variant">1 Reconciled Record</span>
</div>
<div className="p-4 rounded-xl bg-surface-container-low/60 border border-outline-variant/25 space-y-3">
<div className="flex items-start justify-between">
<div>
<div className="flex items-center gap-2">
<span className="text-sm font-title-md font-bold text-on-surface">Receipt #EDV-8842</span>
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
<span className="text-[11px] font-semibold text-primary">Reconciled</span>
</div>
<p className="text-xs text-on-surface-variant mt-0.5">Paid via Bursary Payment Gateway • Oct 14, 2026, 09:42 AM</p>
</div>
<span className="text-sm font-title-md font-bold text-primary">₦70,000</span>
</div>
<div className="pt-1 flex items-center justify-between border-t border-outline-variant/20">
<span className="text-[11px] font-mono text-on-surface-variant">Ref: EDV-REC-99812738</span>
<button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-primary text-xs font-semibold border border-outline-variant/30 transition-colors shadow-sm" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[15px]">download</span>
<span className="">Download Official PDF Receipt</span>
</button>
</div>
</div>
</div>
{/* Zero Debt Spam Protocol & Helpline */}
<div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/25 space-y-4 shadow-sm">
<div className="flex items-start gap-3">
<div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shrink-0">
<span aria-hidden="true" className="material-symbols-outlined text-[19px]">verified_user</span>
</div>
<div className="space-y-1">
<h3 className="text-sm font-title-md font-bold text-primary">Zero Debt Spam Protocol</h3>
<p className="text-xs text-on-surface-variant leading-relaxed">When your balance reaches ₦0, SMS and Telegram fee reminders stop for this term.</p>
</div>
</div>
<div className="p-3 bg-surface-container-lowest rounded-xl flex items-center justify-between text-xs border border-outline-variant/20">
<div className="flex items-center gap-2 text-on-surface-variant">
<span aria-hidden="true" className="material-symbols-outlined text-secondary text-[17px]">support_agent</span>
<span className="">Bursar Desk Direct Inquiry:</span>
</div>
<a className="font-bold text-primary hover:underline" href="tel:+23452250000">Contact school office</a>
</div>
</div>
</div>
</div>
</div>
{/* Minimal Student Dashboard Footer */}
<footer className="w-full bg-surface-container-lowest border-t border-outline-variant/25 py-4 px-8 mt-auto">
<div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant">
<div className="flex items-center gap-2">
<span className="font-bold text-[#14695D]">edvora<span className="text-secondary">.</span></span>
<span className="">© 2026 Edvora Administrative Systems. All rights reserved.</span>
</div>
<div className="flex items-center gap-4">
<a className="hover:text-primary transition-colors" href="/contact">Parent Help Desk</a>
<a className="hover:text-primary transition-colors" href="/privacy">Terms &amp; Data Privacy</a>
</div>
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
