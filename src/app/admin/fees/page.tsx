"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  useSchoolSummaryQuery,
  usePupilsQuery,
  usePaymentsQuery,
  useRemindersQuery,
  useStudentResultQuery,
  useSettingsQuery,
} from "@/lib/query/hooks";

export default function FeesManagementPage() {
  const { data: summary } = useSchoolSummaryQuery();
  const { data: pupils = [] } = usePupilsQuery();
  const { data: payments = [] } = usePaymentsQuery();

  const [adjustmentAmount, setAdjustmentAmount] = useState<number>(35000);
  const [adjustmentType, setAdjustmentType] = useState<
    "waiver" | "scholarship" | "staff_discount" | "sibling_discount" | "correction"
  >("sibling_discount");
  const [adjustmentReason, setAdjustmentReason] = useState(
    "Third child enrolled sibling courtesy tier + deferred Tranche 2"
  );
  const [isPosting, setIsPosting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handlePostAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPosting(true);
    try {
      const res = await fetch("/api/fees/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: "88888888-8888-8888-8888-000000000001",
          amountMinor: adjustmentAmount * 100,
          adjustmentType,
          reason: adjustmentReason,
          authorizedBy: "44444444-4444-4444-4444-000000000002",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setToastMessage(`₦${adjustmentAmount.toLocaleString()} adjustment authorized & posted to ledger!`);
        setTimeout(() => setToastMessage(null), 3500);
      } else {
        alert(data.error || "Failed to post adjustment");
      }
    } catch {
      alert("Adjustment request failed");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col w-full">
{/* Interactive & Notification Banner for Paystack Secured */}
<div className="px-0 pt-space-lg pb-space-sm">
<div className="bg-surface-container-high rounded-xl p-space-md shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
<div className="flex items-center gap-space-md">
<div className="w-10 h-10 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary shrink-0">
<span aria-hidden="true" className="material-symbols-outlined text-[24px]">verified_user</span>
</div>
<div>
<div className="flex items-center gap-space-sm">
<h1 className="font-headline-md text-headline-md text-on-surface">Term Fee Administration</h1>
<span className="px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold tracking-wide uppercase"></span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Payments are credited after verification. Review discrepancies before adjusting a pupil account.</p>
</div>
</div>
<div className="flex items-center gap-space-sm shrink-0 w-full md:w-auto">
<button className="flex-1 md:flex-none flex items-center justify-center gap-space-xs bg-surface-container-lowest text-on-surface hover:bg-surface-dim px-space-md py-space-sm rounded-lg font-label-md text-label-md transition-all shadow-sm" id="downloadCsvBtn">
<span aria-hidden="true" className="material-symbols-outlined text-[18px] text-primary">download</span>
<span className="">Download Term Ledger (CSV)</span>
</button>
<button className="flex-1 md:flex-none flex items-center justify-center gap-space-xs bg-primary text-on-primary hover:bg-primary-container px-space-md py-space-sm rounded-lg font-label-md text-label-md transition-all shadow-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">sync</span>
<span className="">Review Payments</span>
</button>
</div>
</div>
</div>
{/* Key Metric Summary Cards */}
<div className="px-0 py-space-md">
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
{/* Total Term Charges */}
<div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden group">
<div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-surface-container-high/40 pointer-events-none transition-transform group-hover:scale-110"></div>
<div>
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Gross Billed Charges</span>
<span className="p-1.5 rounded-md bg-surface-container-low text-primary">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">receipt_long</span>
</span>
</div>
<div className="mt-space-md">
<span className="font-display-lg text-headline-lg font-semibold text-on-surface">₦21,600,000</span>
</div>
</div>
<div className="mt-space-lg flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
<span className="font-semibold text-on-surface">180 pupils</span>
<span className="">across Nursery &amp; Primary</span>
</div>
</div>
{/* Verified Test Collections */}
<div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden group">
<div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-primary/5 pointer-events-none transition-transform group-hover:scale-110"></div>
<div>
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Verified Collections</span>
<span className="p-1.5 rounded-md bg-primary/10 text-primary">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
</span>
</div>
<div className="mt-space-md flex items-baseline gap-space-sm">
<span className="font-display-lg text-headline-lg font-semibold text-primary">₦12,600,000</span>
<span className="px-space-xs py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm">58.3%</span>
</div>
</div>
<div className="mt-space-lg">
<div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full transition-all duration-700" style={{}}></div>
</div>
<span className="mt-1 block font-label-sm text-label-sm text-on-surface-variant">Verified payments</span>
</div>
</div>
{/* Outstanding Balance */}
<div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden group">
<div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-secondary/5 pointer-events-none transition-transform group-hover:scale-110"></div>
<div>
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Outstanding Receivable</span>
<span className="p-1.5 rounded-md bg-secondary-fixed text-on-secondary-fixed">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">pending_actions</span>
</span>
</div>
<div className="mt-space-md flex items-baseline gap-space-sm">
<span className="font-display-lg text-headline-lg font-semibold text-secondary">₦9,000,000</span>
<span className="px-space-xs py-0.5 rounded bg-secondary-fixed-dim/30 text-secondary font-label-sm text-label-sm">41.7%</span>
</div>
</div>
<div className="mt-space-lg flex items-center justify-between text-body-sm text-on-surface-variant">
<span className="">Tranche 2 pending:</span>
<span className="font-label-md text-label-md text-on-surface font-semibold">Week 7 cutoff</span>
</div>
</div>
{/* Approved Bursary / Fee Adjustments */}
<div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden group">
<div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-surface-container-high/60 pointer-events-none transition-transform group-hover:scale-110"></div>
<div>
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Approved Waivers &amp; Adjustments</span>
<span className="p-1.5 rounded-md bg-surface-container-low text-tertiary">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">rule_folder</span>
</span>
</div>
<div className="mt-space-md">
<span className="font-display-lg text-headline-lg font-semibold text-on-surface">₦420,000</span>
</div>
</div>
<div className="mt-space-lg flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-primary">verified</span>
<span className="text-tertiary font-label-sm text-label-sm">Audited bursary concessions</span>
</div>
</div>
</div>
</div>
{/* Fee Structures & Visual Trajectory */}
<div className="px-0 py-space-sm">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
{/* Fee Plans Breakdown */}
<div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-space-md">
<div>
<h2 className="font-title-md text-title-md text-on-surface">Term Fee Schedules &amp; Structured Instalments</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant">Term fee plans and flexible instalments for 2026/2027 First Term.</p>
</div>
<span className="px-space-sm py-1 rounded-full bg-surface-container-low text-primary font-label-sm text-label-sm font-semibold">2 Active Plans</span>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-md mt-space-md">
{/* Primary 1 to 5 Plan */}
<div className="bg-surface-container-low/70 rounded-xl p-space-md flex flex-col justify-between shadow-sm">
<div>
<div className="flex items-center justify-between">
<span className="px-space-xs py-0.5 rounded bg-surface-container-lowest text-primary font-label-sm text-label-sm font-semibold">Primary Section</span>
<span className="font-title-md text-title-md text-primary font-bold">₦120,000</span>
</div>
<div className="mt-space-sm">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Primary 1 through 5</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Full term composite tuition, enrichment resources &amp; digital learning access.</p>
</div>
<div className="mt-space-md space-y-space-xs">
<div className="flex items-center justify-between p-space-xs rounded bg-surface-container-lowest/80 text-on-surface">
<div className="flex items-center gap-space-xs">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="font-label-sm text-label-sm">Tranche 1 (Week 1 Resumption)</span>
</div>
<span className="font-label-md text-label-md font-semibold text-on-surface">₦70,000</span>
</div>
<div className="flex items-center justify-between p-space-xs rounded bg-surface-container-lowest/80 text-on-surface">
<div className="flex items-center gap-space-xs">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="font-label-sm text-label-sm">Tranche 2 (Mid-Term Week 7)</span>
</div>
<span className="font-label-md text-label-md font-semibold text-on-surface">₦50,000</span>
</div>
</div>
</div>
<div className="mt-space-md pt-space-sm border-t border-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center justify-between">
<span className="">Total Enrollment: 140 Pupils</span>
<span className="text-primary font-semibold">₦16,800,000 Total Billed</span>
</div>
</div>
{/* Nursery 1 to 2 Plan */}
<div className="bg-surface-container-low/70 rounded-xl p-space-md flex flex-col justify-between shadow-sm">
<div>
<div className="flex items-center justify-between">
<span className="px-space-xs py-0.5 rounded bg-surface-container-lowest text-secondary font-label-sm text-label-sm font-semibold">Early Years Foundation</span>
<span className="font-title-md text-title-md text-secondary font-bold">₦120,000</span>
</div>
<div className="mt-space-sm">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Nursery 1 &amp; Nursery 2</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Montessori apparatus, sensory supplies, term nursery welfare &amp; care kit.</p>
</div>
<div className="mt-space-md space-y-space-xs">
<div className="flex items-center justify-between p-space-xs rounded bg-surface-container-lowest/80 text-on-surface">
<div className="flex items-center gap-space-xs">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="font-label-sm text-label-sm">Tranche 1 (Resumption)</span>
</div>
<span className="font-label-md text-label-md font-semibold text-on-surface">₦70,000</span>
</div>
<div className="flex items-center justify-between p-space-xs rounded bg-surface-container-lowest/80 text-on-surface">
<div className="flex items-center gap-space-xs">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="font-label-sm text-label-sm">Tranche 2 (Mid-Term)</span>
</div>
<span className="font-label-md text-label-md font-semibold text-on-surface">₦50,000</span>
</div>
</div>
</div>
<div className="mt-space-md pt-space-sm border-t border-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center justify-between">
<span className="">Total Enrollment: 40 Pupils</span>
<span className="text-secondary font-semibold">₦4,800,000 Total Billed</span>
</div>
</div>
</div>
</div>
<div className="mt-space-lg flex items-center justify-between bg-surface-container-lowest rounded-lg p-space-sm text-on-surface-variant font-body-sm text-body-sm">
<div className="flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-[18px] text-primary">security_update_good</span>
<span className="">Parent portal displays direct Paystack checkout popups with instant receipt validation.</span>
</div>
<span className="font-label-sm text-label-sm text-primary font-semibold">Zero Bank Reconciliation Friction</span>
</div>
</div>
{/* Live Webhook Feed & Settlement Pulse */}
<div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-space-sm">
<div className="flex items-center gap-space-xs">
<span className="relative flex h-2.5 w-2.5">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
<span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
</span>
<h3 className="font-title-md text-title-md text-on-surface">Verified Payment Activity</h3>
</div>
<span className="text-on-surface-variant font-label-sm text-label-sm">Payment verification</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Recent verified payments credited to pupil accounts.</p>
<div className="mt-space-md space-y-space-sm" id="webhookLogContainer">
<div className="p-space-sm bg-surface-container-low rounded-lg transition-all hover:bg-surface-container">
<div className="flex items-center justify-between text-label-sm font-label-sm">
<span className="text-primary font-semibold">charge.success (Tranche 1)</span>
<span className="text-on-surface-variant">2 mins ago</span>
</div>
<div className="mt-1 flex items-center justify-between font-body-sm text-body-sm">
<span className="text-on-surface font-medium">₦70,000 · Pupil: P-0428 (P3)</span>
<span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-lowest text-primary">AUTH_TEST_839</span>
</div>
</div>
<div className="p-space-sm bg-surface-container-low rounded-lg transition-all hover:bg-surface-container">
<div className="flex items-center justify-between text-label-sm font-label-sm">
<span className="text-primary font-semibold">charge.success (Full Term)</span>
<span className="text-on-surface-variant">14 mins ago</span>
</div>
<div className="mt-1 flex items-center justify-between font-body-sm text-body-sm">
<span className="text-on-surface font-medium">₦120,000 · Pupil: P-0193 (P5)</span>
<span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-lowest text-primary">AUTH_TEST_104</span>
</div>
</div>
<div className="p-space-sm bg-surface-container-low rounded-lg transition-all hover:bg-surface-container">
<div className="flex items-center justify-between text-label-sm font-label-sm">
<span className="text-primary font-semibold">charge.success (Tranche 1)</span>
<span className="text-on-surface-variant">1 hour ago</span>
</div>
<div className="mt-1 flex items-center justify-between font-body-sm text-body-sm">
<span className="text-on-surface font-medium">₦55,000 · Pupil: N-0012 (N1)</span>
<span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-lowest text-primary">AUTH_TEST_992</span>
</div>
</div>
</div>
</div>
<div className="mt-space-md pt-space-sm bg-surface-container-high/40 p-space-sm rounded-lg flex items-center justify-between">
<div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-secondary">shield</span>
<span className="">Signed HMAC: SHA512</span>
</div>
<span className="text-primary font-label-sm text-label-sm font-medium">Status: 200 OK</span>
</div>
</div>
</div>
</div>
{/* Class-by-Class Bursary Ledger Table */}
<div className="px-0 py-space-md">
<div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
<div className="p-space-lg flex flex-col md:flex-row md:items-center justify-between gap-space-md bg-surface-container-lowest">
<div>
<div className="flex items-center gap-space-sm">
<h2 className="font-headline-sm text-headline-sm text-on-surface">Class-by-Class Bursary Ledger</h2>
<span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold">7 Grade Cohorts</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Real-time aggregation of collections, pending tranche balances, and cohort completion rates.</p>
</div>
{/* Filter and Search Row */}
<div className="flex items-center gap-space-sm">
<div className="relative">
<span aria-hidden="true" className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-on-surface-variant">search</span>
<input className="pl-9 pr-space-md py-space-xs h-10 rounded-lg bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary" id="classSearchInput" placeholder="Filter by class..." type="text" />
</div>
<select className="h-10 px-space-md rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md focus:outline-none" id="sectionSelect">
<option value="ALL">All Sections</option>
<option value="NURSERY">Nursery Section</option>
<option value="PRIMARY">Primary Section</option>
</select>
</div>
</div>
{/* Responsive Table */}
<div className="overflow-x-auto">
<table className="w-full text-left" id="ledgerTable">
<thead>
<tr className="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
<th className="py-space-md px-space-lg">Class / Section</th>
<th className="py-space-md px-space-md text-center">Enrolled</th>
<th className="py-space-md px-space-md text-right">Total Billed</th>
<th className="py-space-md px-space-md text-right">Verified Paid</th>
<th className="py-space-md px-space-md text-right">Outstanding</th>
<th className="py-space-md px-space-md text-center">Collection Rate</th>
<th className="py-space-md px-space-lg text-right">Status</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container text-body-md text-on-surface font-body-md" id="ledgerTableBody">
{/* Nursery 1 */}
<tr className="hover:bg-surface-container-low/50 transition-colors" data-className="Nursery 1" data-section="NURSERY">
<td className="py-space-md px-space-lg">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center font-title-md text-title-md text-primary font-bold">N1</div>
<div>
<span className="font-title-md text-title-md font-medium text-on-surface">Nursery 1</span>
<span className="block font-label-sm text-label-sm text-on-surface-variant">Early Years Foundation · Daisy Room</span>
</div>
</div>
</td>
<td className="py-space-md px-space-md text-center font-label-md text-label-md">20 Pupils</td>
<td className="py-space-md px-space-md text-right font-medium">₦2,400,000</td>
<td className="py-space-md px-space-md text-right font-semibold text-primary">₦1,400,000</td>
<td className="py-space-md px-space-md text-right text-secondary">₦1,000,000</td>
<td className="py-space-md px-space-md">
<div className="flex items-center justify-center gap-space-xs">
<div className="w-16 bg-surface-container h-1.5 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full" style={{}}></div>
</div>
<span className="font-label-sm text-label-sm text-on-surface font-semibold">58.3%</span>
</div>
</td>
<td className="py-space-md px-space-lg text-right">
<span className="px-space-sm py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-medium">On Track</span>
</td>
</tr>
{/* Nursery 2 */}
<tr className="hover:bg-surface-container-low/50 transition-colors" data-className="Nursery 2" data-section="NURSERY">
<td className="py-space-md px-space-lg">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center font-title-md text-title-md text-primary font-bold">N2</div>
<div>
<span className="font-title-md text-title-md font-medium text-on-surface">Nursery 2</span>
<span className="block font-label-sm text-label-sm text-on-surface-variant">Early Years Foundation · Buttercup Room</span>
</div>
</div>
</td>
<td className="py-space-md px-space-md text-center font-label-md text-label-md">20 Pupils</td>
<td className="py-space-md px-space-md text-right font-medium">₦2,400,000</td>
<td className="py-space-md px-space-md text-right font-semibold text-primary">₦1,400,000</td>
<td className="py-space-md px-space-md text-right text-secondary">₦1,000,000</td>
<td className="py-space-md px-space-md">
<div className="flex items-center justify-center gap-space-xs">
<div className="w-16 bg-surface-container h-1.5 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full" style={{}}></div>
</div>
<span className="font-label-sm text-label-sm text-on-surface font-semibold">58.3%</span>
</div>
</td>
<td className="py-space-md px-space-lg text-right">
<span className="px-space-sm py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-medium">On Track</span>
</td>
</tr>
{/* Primary 1 */}
<tr className="hover:bg-surface-container-low/50 transition-colors" data-className="Primary 1" data-section="PRIMARY">
<td className="py-space-md px-space-lg">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center font-title-md text-title-md text-on-primary-fixed font-bold">P1</div>
<div>
<span className="font-title-md text-title-md font-medium text-on-surface">Primary 1</span>
<span className="block font-label-sm text-label-sm text-on-surface-variant">Lower Primary · Grade 1</span>
</div>
</div>
</td>
<td className="py-space-md px-space-md text-center font-label-md text-label-md">28 Pupils</td>
<td className="py-space-md px-space-md text-right font-medium">₦3,360,000</td>
<td className="py-space-md px-space-md text-right font-semibold text-primary">₦1,960,000</td>
<td className="py-space-md px-space-md text-right text-secondary">₦1,400,000</td>
<td className="py-space-md px-space-md">
<div className="flex items-center justify-center gap-space-xs">
<div className="w-16 bg-surface-container h-1.5 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full" style={{}}></div>
</div>
<span className="font-label-sm text-label-sm text-on-surface font-semibold">58.3%</span>
</div>
</td>
<td className="py-space-md px-space-lg text-right">
<span className="px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-medium">Pending T2</span>
</td>
</tr>
{/* Primary 2 */}
<tr className="hover:bg-surface-container-low/50 transition-colors" data-className="Primary 2" data-section="PRIMARY">
<td className="py-space-md px-space-lg">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center font-title-md text-title-md text-on-primary-fixed font-bold">P2</div>
<div>
<span className="font-title-md text-title-md font-medium text-on-surface">Primary 2</span>
<span className="block font-label-sm text-label-sm text-on-surface-variant">Lower Primary · Grade 2</span>
</div>
</div>
</td>
<td className="py-space-md px-space-md text-center font-label-md text-label-md">28 Pupils</td>
<td className="py-space-md px-space-md text-right font-medium">₦3,360,000</td>
<td className="py-space-md px-space-md text-right font-semibold text-primary">₦1,960,000</td>
<td className="py-space-md px-space-md text-right text-secondary">₦1,400,000</td>
<td className="py-space-md px-space-md">
<div className="flex items-center justify-center gap-space-xs">
<div className="w-16 bg-surface-container h-1.5 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full" style={{}}></div>
</div>
<span className="font-label-sm text-label-sm text-on-surface font-semibold">58.3%</span>
</div>
</td>
<td className="py-space-md px-space-lg text-right">
<span className="px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-medium">Pending T2</span>
</td>
</tr>
{/* Primary 3 */}
<tr className="hover:bg-surface-container-low/50 transition-colors" data-className="Primary 3" data-section="PRIMARY">
<td className="py-space-md px-space-lg">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center font-title-md text-title-md text-on-primary-fixed font-bold">P3</div>
<div>
<span className="font-title-md text-title-md font-medium text-on-surface">Primary 3</span>
<span className="block font-label-sm text-label-sm text-on-surface-variant">Mid Primary · Grade 3</span>
</div>
</div>
</td>
<td className="py-space-md px-space-md text-center font-label-md text-label-md">28 Pupils</td>
<td className="py-space-md px-space-md text-right font-medium">₦3,360,000</td>
<td className="py-space-md px-space-md text-right font-semibold text-primary">₦1,960,000</td>
<td className="py-space-md px-space-md text-right text-secondary">₦1,400,000</td>
<td className="py-space-md px-space-md">
<div className="flex items-center justify-center gap-space-xs">
<div className="w-16 bg-surface-container h-1.5 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full" style={{}}></div>
</div>
<span className="font-label-sm text-label-sm text-on-surface font-semibold">58.3%</span>
</div>
</td>
<td className="py-space-md px-space-lg text-right">
<span className="px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-medium">Pending T2</span>
</td>
</tr>
{/* Primary 4 */}
<tr className="hover:bg-surface-container-low/50 transition-colors" data-className="Primary 4" data-section="PRIMARY">
<td className="py-space-md px-space-lg">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center font-title-md text-title-md text-on-primary-fixed font-bold">P4</div>
<div>
<span className="font-title-md text-title-md font-medium text-on-surface">Primary 4</span>
<span className="block font-label-sm text-label-sm text-on-surface-variant">Upper Primary · Grade 4</span>
</div>
</div>
</td>
<td className="py-space-md px-space-md text-center font-label-md text-label-md">28 Pupils</td>
<td className="py-space-md px-space-md text-right font-medium">₦3,360,000</td>
<td className="py-space-md px-space-md text-right font-semibold text-primary">₦1,960,000</td>
<td className="py-space-md px-space-md text-right text-secondary">₦1,400,000</td>
<td className="py-space-md px-space-md">
<div className="flex items-center justify-center gap-space-xs">
<div className="w-16 bg-surface-container h-1.5 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full" style={{}}></div>
</div>
<span className="font-label-sm text-label-sm text-on-surface font-semibold">58.3%</span>
</div>
</td>
<td className="py-space-md px-space-lg text-right">
<span className="px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-medium">Pending T2</span>
</td>
</tr>
{/* Primary 5 */}
<tr className="hover:bg-surface-container-low/50 transition-colors" data-className="Primary 5" data-section="PRIMARY">
<td className="py-space-md px-space-lg">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center font-title-md text-title-md text-on-primary-fixed font-bold">P5</div>
<div>
<span className="font-title-md text-title-md font-medium text-on-surface">Primary 5</span>
<span className="block font-label-sm text-label-sm text-on-surface-variant">Graduating Class · Grade 5</span>
</div>
</div>
</td>
<td className="py-space-md px-space-md text-center font-label-md text-label-md">28 Pupils</td>
<td className="py-space-md px-space-md text-right font-medium">₦3,360,000</td>
<td className="py-space-md px-space-md text-right font-semibold text-primary">₦1,960,000</td>
<td className="py-space-md px-space-md text-right text-secondary">₦1,400,000</td>
<td className="py-space-md px-space-md">
<div className="flex items-center justify-center gap-space-xs">
<div className="w-16 bg-surface-container h-1.5 rounded-full overflow-hidden">
<div className="bg-secondary-fixed-dim h-full rounded-full" style={{}}></div>
</div>
<span className="font-label-sm text-label-sm text-on-surface font-semibold">58.3%</span>
</div>
</td>
<td className="py-space-md px-space-lg text-right">
<span className="px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-medium">Pending T2</span>
</td>
</tr>
</tbody>
<tfoot>
<tr className="bg-surface-container font-title-md text-title-md text-on-surface font-bold">
<td className="py-space-md px-space-lg">Aggregate Total (180 Pupils)</td>
<td className="py-space-md px-space-md text-center">100% Active</td>
<td className="py-space-md px-space-md text-right">₦21,600,000</td>
<td className="py-space-md px-space-md text-right text-primary">₦12,600,000</td>
<td className="py-space-md px-space-md text-right text-secondary">₦9,000,000</td>
<td className="py-space-md px-space-md text-center text-primary">58.3%</td>
<td className="py-space-md px-space-lg text-right">
<span className="px-space-sm py-0.5 rounded-full bg-surface-container-lowest text-primary text-label-sm font-semibold">Term Normal</span>
</td>
</tr>
</tfoot>
</table>
</div>
</div>
</div>
{/* Approved Adjustments, Instalments & Audit Trail Section */}
<div className="px-0 pt-space-sm pb-space-xl">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
{/* Audit Trail Table */}
<div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
<div className="flex items-center justify-between mb-space-md">
<div>
<div className="flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[22px]">policy</span>
<h2 className="font-title-md text-title-md text-on-surface">Approved Bursary Adjustments &amp; Custom Agreements</h2>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Immutable administrative log of ratified sibling waivers, staff concessions, and split payment agreements.</p>
</div>
<span className="px-space-sm py-1 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold">₦420,000 Total Logged</span>
</div>
<div className="space-y-space-sm">
{/* Item 1 */}
<div className="p-space-md rounded-xl bg-surface-container-low/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md hover:bg-surface-container-low transition-colors">
<div className="flex items-start gap-space-md">
<div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0 mt-0.5">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">family_restroom</span>
</div>
<div>
<div className="flex items-center gap-space-sm flex-wrap">
<span className="font-title-md text-title-md text-on-surface">Sibling Instalment Adjustment</span>
<span className="px-space-xs py-0.5 rounded bg-primary/10 text-primary font-label-sm text-label-sm font-semibold">Approved</span>
</div>
<div className="flex items-center gap-space-md text-on-surface-variant font-body-sm text-body-sm mt-1">
<span className="">Pupils: <strong>David &amp; Sarah Adeleke</strong> (P2 &amp; P4)</span>
<span className="">•</span>
<span className="">Approver: <strong>Head Bursar (M. Ojo)</strong></span>
<span className="">•</span>
<span className="">Date: <strong>12 Jan 2026</strong></span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1 italic">Reason: Third child enrolled sibling courtesy tier + deferred Tranche 2 due date to Week 9.</p>
</div>
</div>
<div className="text-left sm:text-right shrink-0">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">₦180,000</span>
<span className="block font-label-sm text-label-sm text-on-surface-variant">Adjusted from ₦240,000</span>
</div>
</div>
{/* Item 2 */}
<div className="p-space-md rounded-xl bg-surface-container-low/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md hover:bg-surface-container-low transition-colors">
<div className="flex items-start gap-space-md">
<div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed shrink-0 mt-0.5">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">badge</span>
</div>
<div>
<div className="flex items-center gap-space-sm flex-wrap">
<span className="font-title-md text-title-md text-on-surface">Academic Staff Child Concession</span>
<span className="px-space-xs py-0.5 rounded bg-primary/10 text-primary font-label-sm text-label-sm font-semibold">Approved</span>
</div>
<div className="flex items-center gap-space-md text-on-surface-variant font-body-sm text-body-sm mt-1">
<span className="">Pupil: <strong>Zainab Okon</strong> (Primary 1)</span>
<span className="">•</span>
<span className="">Approver: <strong>Head Bursar</strong></span>
<span className="">•</span>
<span className="">Date: <strong>09 Jan 2026</strong></span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1 italic">Reason: 50% staff tuition assistance policy ratified by School Advisory Council.</p>
</div>
</div>
<div className="text-left sm:text-right shrink-0">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">₦140,000</span>
<span className="block font-label-sm text-label-sm text-on-surface-variant">Waiver Applied</span>
</div>
</div>
{/* Item 3 */}
<div className="p-space-md rounded-xl bg-surface-container-low/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md hover:bg-surface-container-low transition-colors">
<div className="flex items-start gap-space-md">
<div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-tertiary shrink-0 mt-0.5">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">calendar_today</span>
</div>
<div>
<div className="flex items-center gap-space-sm flex-wrap">
<span className="font-title-md text-title-md text-on-surface">Special 3-Stage Tranche Re-structuring</span>
<span className="px-space-xs py-0.5 rounded bg-primary/10 text-primary font-label-sm text-label-sm font-semibold">Approved</span>
</div>
<div className="flex items-center gap-space-md text-on-surface-variant font-body-sm text-body-sm mt-1">
<span className="">Pupil: <strong>Emeka Chukwuma</strong> (Nursery 2)</span>
<span className="">•</span>
<span className="">Approver: <strong>Head Bursar</strong></span>
<span className="">•</span>
<span className="">Date: <strong>06 Jan 2026</strong></span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1 italic">Reason: Medical recovery expense grace period; 3 installments scheduled via Paystack tokens.</p>
</div>
</div>
<div className="text-left sm:text-right shrink-0">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">₦100,000</span>
<span className="block font-label-sm text-label-sm text-on-surface-variant">Re-scheduled</span>
</div>
</div>
</div>
</div>
{/* Action Panel & Settlement Security Protocol */}
<div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center gap-space-xs mb-space-sm">
<span aria-hidden="true" className="material-symbols-outlined text-secondary text-[22px]">gavel</span>
<h3 className="font-title-md text-title-md text-on-surface">Bursar Authorization Rules</h3>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">Fee records and authorised adjustments preserve a clear audit history.</p>
<div className="space-y-space-md">
<div className="flex items-start gap-space-sm">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[18px] mt-0.5">lock</span>
<div>
<h4 className="font-label-md text-label-md font-semibold text-on-surface">No Bank Transfer Bypass</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Account balances update only after the payment has been verified.</p>
</div>
</div>
<div className="flex items-start gap-space-sm">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[18px] mt-0.5">fact_check</span>
<div>
<h4 className="font-label-md text-label-md font-semibold text-on-surface">Permanent Audit Record</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Every waiver or tranche date modification issues a timestamped signature logged directly to school records.</p>
</div>
</div>
<div className="flex items-start gap-space-sm">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[18px] mt-0.5">mail_lock</span>
<div>
<h4 className="font-label-md text-label-md font-semibold text-on-surface">Automated Parent Reminders</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">SMS and Telegram reminders follow the school schedule and use the latest outstanding balance.</p>
</div>
</div>
</div>
</div>
<div className="mt-space-lg pt-space-md border-t border-surface-container">
<button className="w-full flex items-center justify-center gap-space-xs bg-primary text-on-primary hover:bg-primary-container px-space-md py-space-sm rounded-lg font-label-md text-label-md transition-colors shadow-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">add_circle</span>
<span className="">Record New Bursary Waiver</span>
</button>
</div>
</div>
</div>
</div>
{/* Modal: Record Bursary Waiver (Demo Interaction) */}
<div className="hidden fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/40 backdrop-blur-sm" id="adjustmentModal">
<div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-space-lg shadow-xl relative animate-in fade-in zoom-in duration-150">
<div className="flex items-center justify-between pb-space-sm border-b border-surface-container">
<div className="flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[22px]">edit_document</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Record Bursary Concession</h3>
</div>
<button aria-label="Close dialog" className="text-on-surface-variant hover:text-on-surface">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
<div className="mt-space-md space-y-space-md font-body-sm text-body-sm">
<div>
<label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase font-semibold">Select Enrolled Pupil</label>
<select className="w-full h-10 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-sm focus:outline-none focus:ring-2 focus:ring-primary">
<option>P-0112 · Joshua Okafor (Primary 3)</option>
<option>P-0220 · Miracle Eze (Primary 1)</option>
<option>N-0008 · Sophia Bello (Nursery 1)</option>
</select>
</div>
<div>
<label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase font-semibold">Concession / Adjustment Type</label>
<select value={adjustmentType} onChange={(e) => setAdjustmentType(e.target.value as any)} className="w-full h-10 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-sm focus:outline-none focus:ring-2 focus:ring-primary">
<option value="sibling_discount">Sibling Enrollment Courtesy Tier (15%)</option>
<option value="staff_discount">Staff Child Bursary Grant (50%)</option>
<option value="waiver">Hardship Split-Tranche Grace Period / Waiver</option>
<option value="scholarship">Academic Merit Scholarship</option>
<option value="correction">Administrative Ledger Correction</option>
</select>
</div>
<div>
<label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase font-semibold">Amount to Waive / Adjust (₦)</label>
<input value={adjustmentAmount} onChange={(e) => setAdjustmentAmount(Number(e.target.value) || 0)} className="w-full h-10 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-sm focus:outline-none focus:ring-2 focus:ring-primary" type="number" step="1000" />
</div>
<div>
<label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase font-semibold">Audit Justification Notes</label>
<textarea value={adjustmentReason} onChange={(e) => setAdjustmentReason(e.target.value)} className="w-full p-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Describe board reference or verified parent request..." rows={2} />
</div>
<div className="p-space-sm rounded bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-secondary">info</span>
<span className="">Logged into the immutable audit trial under operator: Head Bursar (M. Ojo)</span>
</div>
</div>
<div className="mt-space-lg flex items-center justify-end gap-space-sm pt-space-sm border-t border-surface-container">
<button type="button" onClick={() => setAdjustmentAmount(0)} className="px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container font-label-md text-label-md">Reset</button>
<button type="button" disabled={isPosting} onClick={handlePostAdjustment} className="px-space-md py-space-sm rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md shadow-sm disabled:opacity-50">
  {isPosting ? "Posting..." : "Authorize & Post to Ledger"}
</button>
</div>
</div>
</div>
{/* Notification Toast Container */}
{toastMessage && (
<div className="fixed bottom-6 right-6 z-50 transition-all duration-300">
<div className="bg-inverse-surface text-inverse-on-surface px-space-md py-space-sm rounded-xl shadow-xl flex items-center gap-space-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[20px] text-primary-fixed">check_circle</span>
<span className="font-body-sm text-body-sm">{toastMessage}</span>
</div>
</div>
)}
</div>

    </div>
  );
}
