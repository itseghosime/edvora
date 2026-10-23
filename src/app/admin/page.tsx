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

export default function StaffOverviewPage() {
  const { data: summary } = useSchoolSummaryQuery();
  const { data: pupils = [] } = usePupilsQuery();
  const { data: payments = [] } = usePaymentsQuery();

  return (
    <div className="space-y-6">
      <div className="flex flex-col w-full">
<div className="px-0 py-gutter flex flex-col gap-space-xl">
{/* Operational Context & Top Action Row */}
<div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
<div className="flex flex-col gap-space-xs">
<div className="flex items-center gap-space-sm">
<span className="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[14px] text-secondary">verified_user</span>verified_user Secure Payment Only</span>
<span className="font-label-sm text-label-sm text-outline tracking-wider uppercase font-semibold">Audit Session Ref: TXN-LG-2026-T1</span>
</div>
<h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Institutional Operations Ledger</h1>
<p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          Real-time oversight for First Term 2026/2027. Reconciling verified fee tranches, pending curriculum grade audits, and automated guardian advisory dispatches.
        </p>
</div>
<div className="flex items-center gap-space-sm">
<button className="inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container-high text-primary hover:bg-surface-container-highest transition-colors font-title-md text-title-md shadow-sm" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">file_download</span>
<span className="">Term Report Export</span>
</button>
<button className="inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors font-title-md text-title-md shadow-sm" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">person_add</span>
<span className="">Add Pupil</span>
</button>
</div>
</div>
{/* Core Fiscal & Demographic Metric Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
{/* Metric 1: Total Enrolled */}
<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between gap-space-md relative overflow-hidden">
<div className="flex items-start justify-between">
<div className="flex flex-col gap-space-xs">
<span className="font-label-sm text-label-sm uppercase text-outline tracking-wider font-semibold">Active Enrollment</span>
<span className="font-display-lg text-display-lg text-on-surface tracking-tight">180</span>
</div>
<div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
<span aria-hidden="true" className="material-symbols-outlined text-[22px]">groups</span>
</div>
</div>
<div className="flex items-center justify-between pt-space-xs">
<span className="inline-flex items-center gap-1 font-label-md text-label-md text-primary font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">check_circle</span>
            100% Retained (Active)
          </span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Pri 1 to Pri 6</span>
</div>
</div>
{/* Metric 2: Term Charges */}
<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between gap-space-md relative overflow-hidden">
<div className="flex items-start justify-between">
<div className="flex flex-col gap-space-xs">
<span className="font-label-sm text-label-sm uppercase text-outline tracking-wider font-semibold">Term Assessment Sum</span>
<span className="font-headline-lg text-headline-lg text-on-surface tracking-tight">₦21,600,000</span>
</div>
<div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
<span aria-hidden="true" className="material-symbols-outlined text-[22px]">payments</span>
</div>
</div>
<div className="flex flex-col gap-1">
<div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
<span className="">Billable Capacity</span>
<span className="font-semibold text-on-surface">100.0% Assigned</span>
</div>
<div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
<div className="bg-primary h-full w-full"></div>
</div>
</div>
</div>
{/* Metric 3: Verified Test Payments */}
<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between gap-space-md relative overflow-hidden">
<div className="flex items-start justify-between">
<div className="flex flex-col gap-space-xs">
<span className="font-label-sm text-label-sm uppercase text-outline tracking-wider font-semibold">Verified Payments</span>
<span className="font-headline-lg text-headline-lg text-primary tracking-tight">₦12,600,000</span>
</div>
<div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
<span aria-hidden="true" className="material-symbols-outlined text-[22px]">format_image_left</span>
</div>
</div>
<div className="flex flex-col gap-1">
<div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
<span className="">Payment progress</span>
<span className="font-semibold text-secondary">58.3% Settled</span>
</div>
<div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
<div className="bg-secondary h-full" style={{}}></div>
</div>
</div>
</div>
{/* Metric 4: Outstanding Balance */}
<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between gap-space-md relative overflow-hidden">
<div className="flex items-start justify-between">
<div className="flex flex-col gap-space-xs">
<span className="font-label-sm text-label-sm uppercase text-outline tracking-wider font-semibold">Unreconciled Outstanding</span>
<span className="font-headline-lg text-headline-lg text-error tracking-tight">₦9,000,000</span>
</div>
<div className="w-10 h-10 rounded-lg bg-error-container flex items-center justify-center text-on-error-container">
<span aria-hidden="true" className="material-symbols-outlined text-[22px]">pending_actions</span>
</div>
</div>
<div className="flex items-center justify-between pt-space-xs">
<span className="inline-flex items-center gap-1 font-label-md text-label-md text-error font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">priority_high</span>
            41.7% Receivable
          </span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Tranche 2 &amp; 3 Pending</span>
</div>
</div>
</div>
{/* Asymmetric Bento Row: Attention Queue & Visual Context */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
{/* Needs Attention Queue Bento (7 Cols) */}
<div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between gap-space-lg">
<div className="flex items-center justify-between pb-space-sm">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">assignment_late</span>
</div>
<div>
<h2 className="font-headline-sm text-headline-sm text-on-surface">Needs Attention Queue</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant">3 Action streams blocked pending administrative clearing</p>
</div>
</div>
<span className="px-space-sm py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold">3 Active Flags</span>
</div>
<div className="flex flex-col gap-space-sm">
{/* Item 1: Tranche 2 */}
<div className="p-space-md rounded-lg bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-md hover:bg-surface-container transition-colors">
<div className="flex items-start gap-space-md">
<span className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">calendar_clock</span>
</span>
<div className="flex flex-col">
<div className="flex items-center gap-space-xs">
<span className="font-title-md text-title-md text-on-surface">14 Pupils with Tranche 2 Due This Week</span>
<span className="px-space-xs py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">Tuition Installment</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                  Standard reminders armed. Overdue warnings strictly suppressed where recorded ledger balance is ₦0.
                </p>
</div>
</div>
<button className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md hover:opacity-95 whitespace-nowrap self-start sm:self-center" type="button">
              Review Roster
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</div>
{/* Item 2: Grade Approval */}
<div className="p-space-md rounded-lg bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-md hover:bg-surface-container transition-colors">
<div className="flex items-start gap-space-md">
<span className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0 mt-0.5">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">history_edu</span>
</span>
<div className="flex flex-col">
<div className="flex items-center gap-space-xs">
<span className="font-title-md text-title-md text-on-surface">Primary 4 Science Continuous Assessment</span>
<span className="px-space-xs py-0.5 rounded bg-primary-fixed-dim text-on-primary-fixed font-label-sm text-label-sm">Curriculum</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                  6 pupil CA score submissions currently awaiting audit confirmation before Head Teacher formal sign-off.
                </p>
</div>
</div>
<button className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:opacity-95 whitespace-nowrap self-start sm:self-center" type="button">
              Audit Scores
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">edit_note</span>
</button>
</div>
{/* Item 3: Webhooks */}
<div className="p-space-md rounded-lg bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-md hover:bg-surface-container transition-colors">
<div className="flex items-start gap-space-md">
<span className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0 mt-0.5">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">sync_problem</span>
</span>
<div className="flex flex-col">
<div className="flex items-center gap-space-xs">
<span className="font-title-md text-title-md text-on-surface">Paystack Webhooks</span>
<span className="px-space-xs py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm">3 Discrepancies</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                  Manual reconciliation required: Event payload signature mismatch on mocked split settlement accounts.
                </p>
</div>
</div>
<button className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-lg bg-surface-container-highest text-on-surface font-label-md text-label-md hover:bg-outline-variant whitespace-nowrap self-start sm:self-center" type="button">
              Inspect Events
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">terminal</span>
</button>
</div>
</div>
</div>
{/* Campus Life & Institutional Visual Mosaic (5 Cols) */}
<div className="lg:col-span-5 grid grid-rows-2 gap-gutter">
{/* Visual Panel 1 */}
<div className="relative rounded-xl overflow-hidden shadow-sm min-h-[170px] flex flex-col justify-end p-space-md">
<img className="absolute inset-0 w-full h-full object-cover" data- alt="Nigerian elementary school pupils at Edvora Nursery & Primary School engaged in an interactive STEM science classroom, bright morning sunlight filtering through colonial-style louvered windows, botanical warm green and cream classroom interior, highly focused scholarly atmosphere." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1Y3YkHpN4-JyzGYXOWhnGVcj3OBACOT4_Dig6U7TEaAl_i_c9_spSn9RVq80qwNTf5VNwwr_MwfMtfLvV_mN6EpQcaFq4N08rXwydUNSoZmebqqACnVQRoEOjU7otLSYjV9Q5rg-walkW9Pvxs5jZ0tU4hZJSfE5WPNV5a1WSpKSUMyNkSygL8HNsTngxecXjGvDGDRhEuJUckeOD6awUE_PyeDTFRbqNNpjd2ee1nEzQUy0QrFBY" />
<div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/40 to-transparent"></div>
<div className="relative z-10 flex items-center justify-between text-on-primary">
<div>
<span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-fixed">Classroom Operations</span>
<p className="font-title-md text-title-md text-inverse-on-surface">Pri 4 STEM Observation Cycle</p>
</div>
<span className="px-space-sm py-1 rounded bg-surface/20 backdrop-blur-md text-inverse-on-surface font-label-sm text-label-sm">Active Lab</span>
</div>
</div>
{/* Academic Review Status Widget */}
<div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between pb-space-xs">
<div className="flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]">fact_check</span>
<h3 className="font-title-md text-title-md text-on-surface">Academic Review Status</h3>
</div>
<span className="font-label-sm text-label-sm text-outline uppercase font-semibold">First Term 2026/27</span>
</div>
<div className="space-y-space-sm">
{/* Lower Primary */}
<div className="flex items-center justify-between bg-surface-container-low p-space-sm rounded-lg">
<div className="flex items-center gap-space-sm">
<span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0"></span>
<span className="font-body-md text-body-md text-on-surface font-medium">Primary 1 - 3</span>
</div>
<span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">done_all</span>
                Scores Published
              </span>
</div>
{/* Upper Primary */}
<div className="flex items-center justify-between bg-surface-container-low p-space-sm rounded-lg">
<div className="flex items-center gap-space-sm">
<span className="w-2.5 h-2.5 rounded-full bg-secondary shrink-0 animate-pulse"></span>
<span className="font-body-md text-body-md text-on-surface font-medium">Primary 4 - 5</span>
</div>
<span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">hourglass_top</span>
                Head Review in Progress
              </span>
</div>
{/* Graduating Class */}
<div className="flex items-center justify-between bg-surface-container-low p-space-sm rounded-lg">
<div className="flex items-center gap-space-sm">
<span className="w-2.5 h-2.5 rounded-full bg-outline shrink-0"></span>
<span className="font-body-md text-body-md text-on-surface font-medium">Primary 6 (Mock Common Entrance)</span>
</div>
<span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">schedule</span>
                Slated Wk 9
              </span>
</div>
</div>
</div>
</div>
</div>
{/* Communication Pipeline: Reminders Summary Module */}
<div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">forward_to_inbox</span>
</div>
<div>
<h2 className="font-headline-sm text-headline-sm text-on-surface">Parental Advisory &amp; Fee Reminders</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant">Sent through SMS &amp; Telegram</p>
</div>
</div>
<div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
<span className="w-2 h-2 rounded-full bg-primary"></span>
          Gateway Status: Dispatches Synced
        </div>
</div>
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-sm">
{/* Scheduled */}
<div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-1">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase text-outline font-semibold">Scheduled</span>
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-outline">schedule</span>
</div>
<span className="font-headline-md text-headline-md text-on-surface font-semibold">24</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Upcoming auto-pings</span>
</div>
{/* Pending */}
<div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-1">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase text-outline font-semibold">Pending</span>
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-secondary">pending</span>
</div>
<span className="font-headline-md text-headline-md text-on-surface font-semibold">12</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">In dispatch queue</span>
</div>
{/* Sent */}
<div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-1">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase text-outline font-semibold">Sent</span>
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-primary">send</span>
</div>
<span className="font-headline-md text-headline-md text-on-surface font-semibold">144</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Transmitted to carriers</span>
</div>
{/* Delivered */}
<div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-1">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase text-outline font-semibold">Delivered</span>
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-primary">done_all</span>
</div>
<span className="font-headline-md text-headline-md text-primary font-semibold">140</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Handset acknowledged</span>
</div>
{/* Failed */}
<div className="bg-error-container/30 p-space-md rounded-lg flex flex-col gap-1">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase text-error font-semibold">Failed</span>
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-error">error</span>
</div>
<span className="font-headline-md text-headline-md text-error font-semibold">4</span>
<span className="font-body-sm text-body-sm text-error">Unreachable routing</span>
</div>
{/* Paused */}
<div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-1">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase text-outline font-semibold">Paused</span>
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-outline">pause_circle</span>
</div>
<span className="font-headline-md text-headline-md text-outline font-semibold">0</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">All rules active</span>
</div>
</div>
</div>
{/* Verified Test Payments Table Module */}
<div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">receipt_long</span>
</div>
<div>
<h2 className="font-headline-sm text-headline-sm text-on-surface">Recent Verified Payments</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant">Strict chronological audit stream powered by Paystack webhook triggers</p>
</div>
</div>
<div className="flex items-center gap-space-sm">
<div className="relative">
<input className="w-64 pl-9 pr-space-md py-1.5 rounded-lg bg-surface text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Search reference or pupil..." type="text" />
<span aria-hidden="true" className="material-symbols-outlined absolute left-2.5 top-2 text-[18px] text-outline">search</span>
</div>
<button aria-label="Filter records" className="p-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">filter_list</span>
</button>
</div>
</div>
<div className="overflow-x-auto -mx-space-lg px-space-lg">
<table className="w-full text-left font-body-sm text-body-sm min-w-[760px]">
<thead>
<tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
<th className="py-space-sm px-space-md rounded-l-lg font-semibold">Timestamp</th>
<th className="py-space-sm px-space-md font-semibold">Receipt Ref</th>
<th className="py-space-sm px-space-md font-semibold">Pupil Name &amp; Class</th>
<th className="py-space-sm px-space-md text-right font-semibold">Amount</th>
<th className="py-space-sm px-space-md font-semibold">Channel</th>
<th className="py-space-sm px-space-md text-right rounded-r-lg font-semibold">Status</th>
</tr>
</thead>
<tbody className="text-on-surface">
{/* Row 1 */}
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-space-md px-space-md whitespace-nowrap text-on-surface-variant font-mono text-[13px]">2026-10-14 09:42:18</td>
<td className="py-space-md px-space-md font-mono font-medium text-primary">EDV-8842</td>
<td className="py-space-md px-space-md">
<div className="flex flex-col">
<span className="font-title-md text-title-md text-on-surface">Osasere E.</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Pri 3A · St. Jude Arm</span>
</div>
</td>
<td className="py-space-md px-space-md text-right font-semibold text-on-surface font-mono">₦70,000</td>
<td className="py-space-md px-space-md">
<div className="flex items-center gap-1.5 text-on-surface-variant">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="">Online payment</span>
</div>
</td>
<td className="py-space-md px-space-md text-right">
<span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[13px]">check</span>
                  Verified
                </span>
</td>
</tr>
{/* Row 2 */}
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-space-md px-space-md whitespace-nowrap text-on-surface-variant font-mono text-[13px]">2026-10-14 08:15:02</td>
<td className="py-space-md px-space-md font-mono font-medium text-primary">EDV-8841</td>
<td className="py-space-md px-space-md">
<div className="flex flex-col">
<span className="font-title-md text-title-md text-on-surface">Kome A.</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Pri 5B · Emerald Arm</span>
</div>
</td>
<td className="py-space-md px-space-md text-right font-semibold text-on-surface font-mono">₦180,000</td>
<td className="py-space-md px-space-md">
<div className="flex items-center gap-1.5 text-on-surface-variant">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="">Online payment</span>
</div>
</td>
<td className="py-space-md px-space-md text-right">
<span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[13px]">check</span>
                  Verified
                </span>
</td>
</tr>
{/* Row 3 */}
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-space-md px-space-md whitespace-nowrap text-on-surface-variant font-mono text-[13px]">2026-10-13 16:51:44</td>
<td className="py-space-md px-space-md font-mono font-medium text-primary">EDV-8840</td>
<td className="py-space-md px-space-md">
<div className="flex flex-col">
<span className="font-title-md text-title-md text-on-surface">Chukwudi N.</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Pri 1B · Foundation</span>
</div>
</td>
<td className="py-space-md px-space-md text-right font-semibold text-on-surface font-mono">₦240,000</td>
<td className="py-space-md px-space-md">
<div className="flex items-center gap-1.5 text-on-surface-variant">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="">Online payment</span>
</div>
</td>
<td className="py-space-md px-space-md text-right">
<span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[13px]">check</span>
                  Verified
                </span>
</td>
</tr>
{/* Row 4 */}
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-space-md px-space-md whitespace-nowrap text-on-surface-variant font-mono text-[13px]">2026-10-13 14:10:09</td>
<td className="py-space-md px-space-md font-mono font-medium text-primary">EDV-8839</td>
<td className="py-space-md px-space-md">
<div className="flex flex-col">
<span className="font-title-md text-title-md text-on-surface">Zainab B.</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Pri 6A · Gold Arm</span>
</div>
</td>
<td className="py-space-md px-space-md text-right font-semibold text-on-surface font-mono">₦120,000</td>
<td className="py-space-md px-space-md">
<div className="flex items-center gap-1.5 text-on-surface-variant">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="">Online payment</span>
</div>
</td>
<td className="py-space-md px-space-md text-right">
<span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[13px]">check</span>
                  Verified
                </span>
</td>
</tr>
{/* Row 5 */}
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-space-md px-space-md whitespace-nowrap text-on-surface-variant font-mono text-[13px]">2026-10-13 11:29:33</td>
<td className="py-space-md px-space-md font-mono font-medium text-primary">EDV-8838</td>
<td className="py-space-md px-space-md">
<div className="flex flex-col">
<span className="font-title-md text-title-md text-on-surface">Amina D.</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Pri 2A · Ivory Arm</span>
</div>
</td>
<td className="py-space-md px-space-md text-right font-semibold text-on-surface font-mono">₦120,000</td>
<td className="py-space-md px-space-md">
<div className="flex items-center gap-1.5 text-on-surface-variant">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="">Online payment</span>
</div>
</td>
<td className="py-space-md px-space-md text-right">
<span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[13px]">check</span>
                  Verified
                </span>
</td>
</tr>
</tbody>
</table>
</div>
{/* Pagination / Audit Trail Footer */}
<div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-space-xs text-on-surface-variant font-body-sm text-body-sm">
<span className="">Showing latest 5 of 105 settlement records</span>
<div className="flex items-center gap-space-xs">
<button className="px-space-sm py-1 rounded bg-surface-container opacity-50 cursor-not-allowed" disabled type="button">Previous</button>
<span className="px-space-sm py-1 font-semibold text-on-surface">Page 1 of 21</span>
<button className="px-space-sm py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors" type="button">Next</button>
</div>
</div>
</div>
</div>
</div>
    </div>
  );
}
