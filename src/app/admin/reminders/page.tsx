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

export default function RemindersPage() {
  const { data: summary } = useSchoolSummaryQuery();
  const { data: pupils = [] } = usePupilsQuery();
  const { data: payments = [] } = usePaymentsQuery();

  const [allPaused, setAllPaused] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [rule1Paused, setRule1Paused] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);

  const toggleAll = () => {
    const next = !allPaused;
    setAllPaused(next);
    setToastText(next ? "All reminder dispatches held" : "Reminder schedules resumed");
    setTimeout(() => setToastText(null), 3000);
  };

  const toggleRule1 = () => {
    const next = !rule1Paused;
    setRule1Paused(next);
    setToastText(next ? "Rule paused for outstanding accounts" : "Rule active");
    setTimeout(() => setToastText(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col w-full">
<div className="px-0 py-space-lg flex flex-col gap-space-lg">
{/* Top Action & Navigation Status Bar */}
<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
<div>
<div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm uppercase tracking-wider mb-1">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">verified_user</span>
<span className="">Deterministic Dispatch Pipeline · Lagos Route #04</span>
</div>
<h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Automated Advisory &amp; Fee Reminders</h1>
<p className="font-body-md text-body-md text-on-surface-variant max-w-3xl mt-1">
          Deterministic one-way SMS and Telegram notification schedules. Zero group spam, zero public broadcast noise, strictly transactional.
        </p>
</div>
{/* Quick Command Group */}
<div className="flex flex-wrap items-center gap-space-sm">
<button onClick={toggleAll} className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors font-label-lg text-label-lg shadow-sm" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-secondary text-[20px]">{allPaused ? "play_circle" : "pause_circle"}</span>
<span>{allPaused ? "Resume Dispatches" : "Pause All Dispatches"}</span>
</button>
<button onClick={() => setPreviewOpen(!previewOpen)} className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-all font-label-lg text-label-lg shadow-md" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">send_time_extension</span>
<span>{previewOpen ? "Hide Preview" : "Preview Reminder"}</span>
</button>
</div>
</div>
{toastText && (
  <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl text-primary text-xs font-semibold flex items-center gap-2">
    <span aria-hidden="true" className="material-symbols-outlined text-[18px]">info</span>
    <span>{toastText}</span>
  </div>
)}
{/* Zero-Debt Guarantee Callout Banner */}
<div className="relative overflow-hidden rounded-xl bg-surface-container-low p-space-md shadow-sm">
<div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-secondary-fixed/20 blur-2xl pointer-events-none"></div>
<div className="flex items-start gap-space-md relative z-10">
<div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 text-on-primary shadow-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[22px]">policy</span>
</div>
<div className="flex flex-col gap-1 pr-6">
<div className="flex items-center gap-space-sm">
<span className="font-title-md text-title-md text-primary font-semibold">Zero-Debt Reminder Suppression Guarantee</span>
<span className="px-space-sm py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase">Active Rule #SYS-01</span>
</div>
<p className="font-body-md text-body-md text-on-surface">
<strong className="font-semibold text-on-surface">Integrity Rule:</strong> Reminders are strictly suppressed when pupil ledger balance is ₦0. Families with completed settlements never receive debt notifications, eliminating awkward billing confusion.
          </p>
</div>
</div>
</div>
{/* Delivery Telemetry KPI Cards */}
<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-space-md">
{/* Scheduled */}
<div className="flex flex-col justify-between p-space-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
<div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
<span className="">SCHEDULED</span>
<span aria-hidden="true" className="material-symbols-outlined text-secondary text-[18px]">schedule</span>
</div>
<div className="mt-space-md">
<div className="font-display-lg text-display-lg text-on-surface">24</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">Armed for upcoming Tranche 2 due dates</p>
</div>
<div className="mt-space-sm pt-space-xs text-secondary font-label-sm text-label-sm flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Week 7 Window
        </div>
</div>
{/* Accepted */}
<div className="flex flex-col justify-between p-space-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
<div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
<span className="">GATEWAY ACCEPTED</span>
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[18px]">cloud_sync</span>
</div>
<div className="mt-space-md">
<div className="font-display-lg text-display-lg text-primary">18</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">Queued with telco aggregators</p>
</div>
<div className="mt-space-sm pt-space-xs text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-primary-fixed-dim"></span> MTN / Airtel Direct
        </div>
</div>
{/* Transmitted */}
<div className="flex flex-col justify-between p-space-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
<div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
<span className="">TRANSMITTED</span>
<span aria-hidden="true" className="material-symbols-outlined text-primary-container text-[18px]">outbox</span>
</div>
<div className="mt-space-md">
<div className="font-display-lg text-display-lg text-on-surface">144</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">Dispatched via Termii SMS / Telegram Bot</p>
</div>
<div className="mt-space-sm pt-space-xs text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1">
<span className="">100% Rate Compliant</span>
</div>
</div>
{/* Handset Delivered */}
<div className="flex flex-col justify-between p-space-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
<div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
<span className="">DELIVERED</span>
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[18px]">done_all</span>
</div>
<div className="mt-space-md">
<div className="font-display-lg text-display-lg text-primary">140</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">97.2% confirmed delivery receipts</p>
</div>
<div className="mt-space-sm pt-space-xs text-primary font-label-sm text-label-sm flex items-center gap-1">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">trending_up</span> Sub-second ACK
        </div>
</div>
{/* Failed / Unreachable */}
<div className="flex flex-col justify-between p-space-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
<div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
<span className="">FAILED / RETRY</span>
<span aria-hidden="true" className="material-symbols-outlined text-error text-[18px]">error</span>
</div>
<div className="mt-space-md">
<div className="font-display-lg text-display-lg text-error">4</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">Safe retry active; check recipient numbers</p>
</div>
<div className="mt-space-sm pt-space-xs text-error font-label-sm text-label-sm flex items-center gap-1">
<span className="">3 in Retry Backoff</span>
</div>
</div>
{/* Paused / Dispute Held */}
<div className="flex flex-col justify-between p-space-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
<div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
<span className="">PAUSED (HELD)</span>
<span aria-hidden="true" className="material-symbols-outlined text-secondary text-[18px]">pause_presentation</span>
</div>
<div className="mt-space-md">
<div className="font-display-lg text-display-lg text-secondary">2</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">Temporarily suppressed per bursar audit</p>
</div>
<div className="mt-space-sm pt-space-xs text-secondary font-label-sm text-label-sm flex items-center gap-1">
<span className="">Under Manual Review</span>
</div>
</div>
</div>
{/* Main Content Grid: Workspace & Side Information Drawer */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
{/* Left 8.5 Columns: Tabs, Action Bar & Detailed Table */}
<div className="lg:col-span-8 flex flex-col gap-space-md">
{/* Channels & Navigation Tabs */}
<div className="flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-lowest p-space-xs rounded-xl shadow-sm">
<div className="flex items-center gap-1" id="channel-tabs">
<button className="tab-button px-space-md py-space-xs rounded-lg font-label-lg text-label-lg bg-primary text-on-primary font-semibold transition-all" data-tab="all">All Dispatches (144)</button>
<button className="tab-button px-space-md py-space-xs rounded-lg font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-tab="sms">SMS Dispatches (92)</button>
<button className="tab-button px-space-md py-space-xs rounded-lg font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-tab="whatsapp">Telegram Notifications (52)</button>
<button className="tab-button px-space-md py-space-xs rounded-lg font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-tab="schedule">Automated Schedule Rules</button>
<button className="tab-button px-space-md py-space-xs rounded-lg font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all" data-tab="audit">Delivery Audit Logs</button>
</div>
<div className="flex items-center gap-space-xs px-space-sm text-on-surface-variant font-label-sm text-label-sm">
<span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
<span className="">Telco Gateway: Live Sync</span>
</div>
</div>
{/* Filter & Search Control Ribbon */}
<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-sm bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
<div className="relative flex-1">
<span aria-hidden="true" className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[20px]">search</span>
<input className="w-full pl-10 pr-4 py-2 bg-surface text-on-surface rounded-lg font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" id="guardian-search" placeholder="Search Guardian Contact (+234...), Ward, or Receipt Ref..." type="text" />
</div>
<div className="flex items-center gap-space-xs flex-shrink-0">
<div className="relative">
<select className="appearance-none bg-surface-container-low text-on-surface font-label-md text-label-md pl-3 pr-8 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer" id="class-filter">
<option value="all">Filter by Class: All Classes</option>
<option value="pri1">Primary 1 (A/B)</option>
<option value="pri2">Primary 2 (A/B)</option>
<option value="pri3">Primary 3 (A/B)</option>
<option value="pri4">Primary 4</option>
<option value="pri5">Primary 5 (A/B)</option>
<option value="nur">Nursery Section</option>
</select>
<span aria-hidden="true" className="material-symbols-outlined pointer-events-none absolute right-2 top-2 text-[18px] text-on-surface-variant">arrow_drop_down</span>
</div>
<div className="relative">
<select className="appearance-none bg-surface-container-low text-on-surface font-label-md text-label-md pl-3 pr-8 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer" id="status-filter">
<option value="all">Status: All</option>
<option value="Scheduled">Scheduled</option>
<option value="Delivered">Delivered</option>
<option value="Failed">Failed / Retrying</option>
</select>
<span aria-hidden="true" className="material-symbols-outlined pointer-events-none absolute right-2 top-2 text-[18px] text-on-surface-variant">arrow_drop_down</span>
</div>
<button aria-label="Download" className="p-2 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors" title="Export Dispatch Ledger">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">download</span>
</button>
</div>
</div>
{/* Dispatch Log Table Panel */}
<div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
<div className="overflow-x-auto">
<table className="w-full text-left font-body-md text-body-md border-collapse">
<thead>
<tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
<th className="py-space-sm px-space-md">Guardian &amp; Pupil Ward</th>
<th className="py-space-sm px-space-md">Channel</th>
<th className="py-space-sm px-space-md">Notification Message Type</th>
<th className="py-space-sm px-space-md">Delivery Status</th>
<th className="py-space-sm px-space-md text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y-0" id="dispatch-rows">
{/* Row 1: Dr. Osasere Senior */}
<tr className="hover:bg-surface-container-high/40 transition-colors" data-channel="whatsapp" data-className="pri3" data-status="Scheduled">
<td className="py-space-md px-space-md">
<div className="flex items-center gap-space-sm">
<div className="w-9 h-9 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-title-md text-title-md flex-shrink-0">
                        O
                      </div>
<div className="flex flex-col">
<span className="font-title-md text-title-md text-on-surface font-semibold">Dr. Osasere Senior</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Guardian to Osasere E. · Pri 3A</span>
<span className="font-label-sm text-label-sm text-primary tracking-tight">+234 803 411 9042</span>
</div>
</div>
</td>
<td className="py-space-md px-space-md">
<span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">chat</span> Telegram
                    </span>
</td>
<td className="py-space-md px-space-md">
<div className="font-label-lg text-label-lg text-on-surface font-medium">Tranche 2 Reminder</div>
<div className="font-body-sm text-body-sm text-secondary font-semibold">₦50,000 due Wk 7 (Nov 04)</div>
<div className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Template: #FEE_TR2_EXPEDITED</div>
</td>
<td className="py-space-md px-space-md">
<div className="flex flex-col">
<span className="inline-flex items-center gap-1 font-label-md text-label-md text-secondary font-semibold">
<span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span> Scheduled
                      </span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Nov 04, 08:00 AM</span>
<span className="font-label-sm text-label-sm text-outline">Queue ID: WAPP-9082</span>
</div>
</td>
<td className="py-space-md px-space-md text-right">
<div className="flex items-center justify-end gap-space-xs">
<button className="px-space-sm py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md">
                        Pause
                      </button>
<button className="px-space-sm py-1 rounded bg-primary-fixed text-on-primary-fixed hover:bg-primary-fixed-dim transition-colors font-label-md text-label-md">
                        Preview
                      </button>
</div>
</td>
</tr>
{/* Row 2: Alhaji Mustapha Bello */}
<tr className="hover:bg-surface-container-high/40 transition-colors" data-channel="sms" data-className="pri2" data-status="Delivered">
<td className="py-space-md px-space-md">
<div className="flex items-center gap-space-sm">
<div className="w-9 h-9 rounded-full bg-surface-container text-on-surface flex items-center justify-center font-title-md text-title-md flex-shrink-0">
                        M
                      </div>
<div className="flex flex-col">
<span className="font-title-md text-title-md text-on-surface font-semibold">Alhaji Mustapha Bello</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Guardian to Amina B. · Pri 2A</span>
<span className="font-label-sm text-label-sm text-primary tracking-tight">+234 802 994 0100</span>
</div>
</div>
</td>
<td className="py-space-md px-space-md">
<span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">sms</span> SMS Direct
                    </span>
</td>
<td className="py-space-md px-space-md">
<div className="font-label-lg text-label-lg text-on-surface font-medium">Overdue Term Fee Notice</div>
<div className="font-body-sm text-body-sm text-error font-semibold">₦115,000 Outstanding</div>
<div className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Template: #DEBT_OVERDUE_WARN</div>
</td>
<td className="py-space-md px-space-md">
<div className="flex flex-col">
<span className="inline-flex items-center gap-1 font-label-md text-label-md text-primary font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">done_all</span> Delivered
                      </span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Receipt #SMS-90214</span>
<span className="font-label-sm text-label-sm text-outline">MTN Nigeria ACK</span>
</div>
</td>
<td className="py-space-md px-space-md text-right">
<div className="flex items-center justify-end gap-space-xs">
<button className="px-space-sm py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md">
                        Inspect
                      </button>
<button className="px-space-sm py-1 rounded bg-surface-container-high text-on-surface hover:bg-surface-container transition-colors font-label-md text-label-md">
                        Retry
                      </button>
</div>
</td>
</tr>
{/* Row 3: Pastor Biodun Adeyemi */}
<tr className="hover:bg-surface-container-high/40 transition-colors" data-channel="sms" data-className="nur" data-status="Delivered">
<td className="py-space-md px-space-md">
<div className="flex items-center gap-space-sm">
<div className="w-9 h-9 rounded-full bg-surface-container-low text-primary flex items-center justify-center font-title-md text-title-md flex-shrink-0">
                        B
                      </div>
<div className="flex flex-col">
<span className="font-title-md text-title-md text-on-surface font-semibold">Pastor Biodun Adeyemi</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Guardian to Folake A. · Nur 2B</span>
<span className="font-label-sm text-label-sm text-primary tracking-tight">+234 809 112 5589</span>
</div>
</div>
</td>
<td className="py-space-md px-space-md">
<span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">sms</span> SMS Direct
                    </span>
</td>
<td className="py-space-md px-space-md">
<div className="font-label-lg text-label-lg text-on-surface font-medium">Settlement Receipt Acknowledgment</div>
<div className="font-body-sm text-body-sm text-primary font-semibold">Ref: EDV-8838 (₦65,000)</div>
<div className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Template: #RECEIPT_PAID_ACK</div>
</td>
<td className="py-space-md px-space-md">
<div className="flex flex-col">
<span className="inline-flex items-center gap-1 font-label-md text-label-md text-primary font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">done_all</span> Delivered
                      </span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Oct 30, 04:12 PM</span>
<span className="font-label-sm text-label-sm text-outline">Balance: ₦0 (Suppressed)</span>
</div>
</td>
<td className="py-space-md px-space-md text-right">
<div className="flex items-center justify-end gap-space-xs">
<button className="px-space-sm py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md">
                        Inspect Payload
                      </button>
</div>
</td>
</tr>
{/* Row 4: Barr. Joy Okonkwo */}
<tr className="hover:bg-surface-container-high/40 transition-colors" data-channel="whatsapp" data-className="pri5" data-status="Delivered">
<td className="py-space-md px-space-md">
<div className="flex items-center gap-space-sm">
<div className="w-9 h-9 rounded-full bg-secondary-fixed-dim text-on-secondary-fixed flex items-center justify-center font-title-md text-title-md flex-shrink-0">
                        J
                      </div>
<div className="flex flex-col">
<span className="font-title-md text-title-md text-on-surface font-semibold">Barr. Joy Okonkwo</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Guardian to Chinedu O. · Pri 5B</span>
<span className="font-label-sm text-label-sm text-primary tracking-tight">+234 803 777 4412</span>
</div>
</div>
</td>
<td className="py-space-md px-space-md">
<span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">chat</span> Telegram
                    </span>
</td>
<td className="py-space-md px-space-md">
<div className="font-label-lg text-label-lg text-on-surface font-medium">CA Scores Signed Off &amp; Ready</div>
<div className="font-body-sm text-body-sm text-on-surface-variant font-medium">Mid-Term Assessment Release</div>
<div className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Template: #ACAD_CA_AVAILABLE</div>
</td>
<td className="py-space-md px-space-md">
<div className="flex flex-col">
<span className="inline-flex items-center gap-1 font-label-md text-label-md text-primary font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">done_all</span> Delivered
                      </span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Oct 28, 11:30 AM</span>
<span className="font-label-sm text-label-sm text-outline">Portal Token Embedded</span>
</div>
</td>
<td className="py-space-md px-space-md text-right">
<div className="flex items-center justify-end gap-space-xs">
<button className="px-space-sm py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md">
                        Inspect Payload
                      </button>
</div>
</td>
</tr>
{/* Row 5: Engr. Tunde Agbaje */}
<tr className="hover:bg-surface-container-high/40 transition-colors" data-channel="sms" data-className="pri4" data-status="Delivered">
<td className="py-space-md px-space-md">
<div className="flex items-center gap-space-sm">
<div className="w-9 h-9 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-title-md text-title-md flex-shrink-0">
                        T
                      </div>
<div className="flex flex-col">
<span className="font-title-md text-title-md text-on-surface font-semibold">Engr. Tunde Agbaje</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Guardian to Kome A. · Pri 4</span>
<span className="font-label-sm text-label-sm text-primary tracking-tight">+234 805 321 8890</span>
</div>
</div>
</td>
<td className="py-space-md px-space-md">
<span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">sms</span> SMS Direct
                    </span>
</td>
<td className="py-space-md px-space-md">
<div className="font-label-lg text-label-lg text-on-surface font-medium">Tranche 2 Part Reminder</div>
<div className="font-body-sm text-body-sm text-secondary font-semibold">₦40,000 balance remaining</div>
<div className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Template: #FEE_PARTIAL_PROMPT</div>
</td>
<td className="py-space-md px-space-md">
<div className="flex flex-col">
<span className="inline-flex items-center gap-1 font-label-md text-label-md text-primary font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">done_all</span> Delivered
                      </span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Receipt #SMS-89102</span>
<span className="font-label-sm text-label-sm text-outline">Airtel DLR Success</span>
</div>
</td>
<td className="py-space-md px-space-md text-right">
<div className="flex items-center justify-end gap-space-xs">
<button className="px-space-sm py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md">
                        Inspect Payload
                      </button>
</div>
</td>
</tr>
{/* Row 6: Chief Emeka Okonkwo */}
<tr className="hover:bg-surface-container-high/40 transition-colors" data-channel="whatsapp" data-className="pri3" data-status="Delivered">
<td className="py-space-md px-space-md">
<div className="flex items-center gap-space-sm">
<div className="w-9 h-9 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-title-md text-title-md flex-shrink-0">
                        E
                      </div>
<div className="flex flex-col">
<span className="font-title-md text-title-md text-on-surface font-semibold">Chief Emeka Okonkwo</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Guardian to Ifeanyi O. · Pri 3B</span>
<span className="font-label-sm text-label-sm text-primary tracking-tight">+234 803 200 4811</span>
</div>
</div>
</td>
<td className="py-space-md px-space-md">
<span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">chat</span> Telegram
                    </span>
</td>
<td className="py-space-md px-space-md">
<div className="font-label-lg text-label-lg text-on-surface font-medium">Academic Term Calendar Update</div>
<div className="font-body-sm text-body-sm text-on-surface-variant font-medium">Mid-Term Break Schedule</div>
<div className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Template: #GEN_CALENDAR_CIRCULAR</div>
</td>
<td className="py-space-md px-space-md">
<div className="flex flex-col">
<span className="inline-flex items-center gap-1 font-label-md text-label-md text-primary font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">done_all</span> Delivered
                      </span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Oct 26, 09:15 AM</span>
<span className="font-label-sm text-label-sm text-outline">Double Blue ACK</span>
</div>
</td>
<td className="py-space-md px-space-md text-right">
<div className="flex items-center justify-end gap-space-xs">
<button className="px-space-sm py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md">
                        Inspect Payload
                      </button>
</div>
</td>
</tr>
{/* Row 7: Test Unregistered / Error Case */}
<tr className="hover:bg-surface-container-high/40 transition-colors" data-channel="sms" data-className="nur" data-status="Failed">
<td className="py-space-md px-space-md">
<div className="flex items-center gap-space-sm">
<div className="w-9 h-9 rounded-full bg-error-container text-error flex items-center justify-center font-title-md text-title-md flex-shrink-0">
                        !
                      </div>
<div className="flex flex-col">
<span className="font-title-md text-title-md text-on-surface font-semibold">Unverified contact</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Guardian</span>
<span className="font-label-sm text-label-sm text-error tracking-tight">+234 800 000 0099</span>
</div>
</div>
</td>
<td className="py-space-md px-space-md">
<span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">sms</span> SMS Direct
                    </span>
</td>
<td className="py-space-md px-space-md">
<div className="font-label-lg text-label-lg text-on-surface font-medium">Tranche 1 Reminder</div>
<div className="font-body-sm text-body-sm text-error font-semibold">Delivery needs review</div>
<div className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Template: #FEE_TR1_GENERIC</div>
</td>
<td className="py-space-md px-space-md">
<div className="flex flex-col">
<span className="inline-flex items-center gap-1 font-label-md text-label-md text-error font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">error_outline</span> Failed
                      </span>
<span className="font-body-sm text-body-sm text-error">Telco Timeout (Err 504)</span>
<span className="font-label-sm text-label-sm text-outline">Safe Retry Armed (2/3)</span>
</div>
</td>
<td className="py-space-md px-space-md text-right">
<div className="flex items-center justify-end gap-space-xs">
<button className="px-space-sm py-1 rounded bg-primary text-on-primary hover:bg-primary-container transition-colors font-label-md text-label-md">
                        Safe Retry
                      </button>
<button className="px-space-sm py-1 rounded bg-error-container text-on-error-container hover:bg-surface-container-high transition-colors font-label-md text-label-md">
                        Diagnostic
                      </button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
{/* Table Footer Pagination */}
<div className="p-space-md bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-sm">
<span className="font-body-sm text-body-sm text-on-surface-variant">Showing 7 of 144 registered advisory dispatches</span>
<div className="flex items-center gap-1 font-label-md text-label-md">
<button className="px-3 py-1 rounded bg-surface-container-lowest text-on-surface-variant hover:text-on-surface disabled:opacity-50" disabled>Previous</button>
<button className="px-3 py-1 rounded bg-primary text-on-primary font-semibold">1</button>
<button className="px-3 py-1 rounded bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high">2</button>
<button className="px-3 py-1 rounded bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high">3</button>
<button className="px-3 py-1 rounded bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high">Next</button>
</div>
</div>
</div>
</div>
{/* Right 4 Columns: Side Drawer / Info Panel */}
<div className="lg:col-span-4 flex flex-col gap-space-md">
{/* Configured Dispatch Rules Panel */}
<div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[22px]">tune</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface">Configured Dispatch Rules</h2>
</div>
<span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">Automated</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
            Rules execute deterministically without staff intervention based on calendar triggers and live fee ledgers.
          </p>
<div className="flex flex-col gap-space-sm">
{/* Rule 1: Resumption */}
<div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-1">
<div className="flex items-center justify-between">
<span className="font-title-md text-title-md text-on-surface font-semibold">Tranche 1 Resumption Reminder</span>
<span className="font-label-sm text-label-sm text-primary font-bold">T-Minus 7 Days</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                Dispatches at 08:00 AM WAT exactly 7 calendar days before term resumption to unpaid ledgers.
              </p>
<div className="flex items-center justify-between mt-2 pt-2 border-t-0 text-on-surface-variant font-label-sm text-label-sm">
<span className="">Channel: Dual (SMS + Telegram)</span>
<span className="text-primary font-medium">Auto-suppress if ₦0</span>
</div>
</div>
{/* Rule 2: Mid-Term */}
<div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-1">
<div className="flex items-center justify-between">
<span className="font-title-md text-title-md text-on-surface font-semibold">Mid-Term Warning (Tranche 2)</span>
<span className="font-label-sm text-label-sm text-secondary font-bold">Term Day 42</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                Triggers mid-term advisory for households carrying open balances prior to midterm break release.
              </p>
<div className="flex items-center justify-between mt-2 pt-2 border-t-0 text-on-surface-variant font-label-sm text-label-sm">
<span className="">Channel: Telegram Preferred</span>
<span className="text-secondary font-medium">Bursar Alert Sync</span>
</div>
</div>
{/* Rule 3: CA Scores */}
<div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-1">
<div className="flex items-center justify-between">
<span className="font-title-md text-title-md text-on-surface font-semibold">Continuous Assessment Publish Ping</span>
<span className="font-label-sm text-label-sm text-primary font-bold">Event Driven</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                Fires in under 120 seconds once headteacher digitally signs off the classroom results register.
              </p>
<div className="flex items-center justify-between mt-2 pt-2 border-t-0 text-on-surface-variant font-label-sm text-label-sm">
<span className="">Channel: Telegram with Link</span>
<span className="text-primary font-medium">Zero Debt Required</span>
</div>
</div>
</div>
<button className="w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg transition-colors flex items-center justify-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">add_circle</span>
<span className="">Define New Schedule Rule</span>
</button>
</div>
{/* Telco Aggregator Routing Box */}
<div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<span className="font-title-md text-title-md text-on-surface font-semibold">Telco Gateway Status</span>
<span className="px-space-sm py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">Healthy</span>
</div>
<div className="flex flex-col gap-space-xs mt-1">
<div className="flex items-center justify-between font-body-sm text-body-sm">
<span className="text-on-surface-variant">Active Pipeline:</span>
<span className="font-medium text-on-surface">SMS delivery route</span>
</div>
<div className="flex items-center justify-between font-body-sm text-body-sm">
<span className="text-on-surface-variant">SMPP Throughput:</span>
<span className="font-medium text-on-surface">45 SMS / second</span>
</div>
<div className="flex items-center justify-between font-body-sm text-body-sm">
<span className="text-on-surface-variant">Meta Cloud API:</span>
<span className="font-medium text-primary">Connected (Verified Tier-2)</span>
</div>
<div className="flex items-center justify-between font-body-sm text-body-sm">
<span className="text-on-surface-variant">Bypass NDNC Filter:</span>
<span className="font-medium text-on-surface">Transactional Exemption</span>
</div>
</div>
{/* Inline Telemetry Visual SVG */}
<div className="mt-space-sm p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-2">
<div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
<span className="">Delivery Latency (Past 60m)</span>
<span className="text-primary font-semibold">0.68s avg</span>
</div>
<svg className="w-full h-12 text-primary overflow-visible" viewBox="0 0 200 40">
<path d="M 0 30 Q 25 15, 50 25 T 100 10 T 150 20 T 200 8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2.5"></path>
<circle cx="200" cy="8" fill="currentColor" r="4"></circle>
</svg>
</div>
</div>
{/* Strict Transactional Protocol Disclaimer Card */}
<div className="p-space-md rounded-xl bg-surface-container-high flex flex-col gap-2">
<div className="flex items-center gap-space-xs text-on-surface font-title-md text-title-md font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-secondary text-[20px]">mark_email_unread</span>
<span className="">No Email Relays &amp; No Chat Box</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
            In compliance with Edvora South-West Nigeria Academy Standards, communications are strictly outbound advisory notifications. Parents cannot reply with unsolicited chit-chat; queries are routed via the Bursary Helpdesk hotline.
          </p>
</div>
</div>
</div>
</div>
{/* Interactive Modal: Preview Message */}
{previewOpen && (
<div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-gutter">
<div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl shadow-xl p-space-xl flex flex-col gap-space-md relative">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[24px]">visibility</span>
<span className="font-headline-sm text-headline-sm text-on-surface">Message Payload Preview</span>
</div>
<button onClick={() => setPreviewOpen(false)} aria-label="Close dialog" className="text-on-surface-variant hover:text-on-surface p-1">
<span aria-hidden="true" className="material-symbols-outlined">close</span>
</button>
</div>
<div className="flex flex-col gap-space-xs p-space-md rounded-xl bg-surface-container-low">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">RECIPIENT</span>
<span className="font-title-md text-title-md text-on-surface font-semibold">Dr. &amp; Mrs. Ehigiator</span>
<span className="font-label-md text-label-md text-primary font-medium">Channel: Telegram Direct &amp; SMS</span>
</div>
<div className="flex flex-col gap-1">
<span className="font-label-sm text-label-sm text-on-surface-variant">TRANSMISSION CONTENT:</span>
<div className="p-space-md rounded-xl bg-surface text-on-surface font-body-md text-body-md whitespace-pre-wrap shadow-inner leading-relaxed text-xs">
Dear Dr. &amp; Mrs. Ehigiator, this is a gentle reminder from Edvora School. The outstanding balance for Osasere Ehigiator (Primary 3A) is ₦50,000. Please visit the secure portal to complete payment: https://edvora.ng/student/payments. Thank you!
</div>
</div>
<div className="flex items-center justify-between pt-space-xs">
<span className="font-label-sm text-label-sm text-secondary font-medium">Outbound Transactional Gateway</span>
<button onClick={() => setPreviewOpen(false)} className="px-space-lg py-2 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary-container transition-colors">
  Dismiss Preview
</button>
</div>
</div>
</div>
)}
{/* Interactive Modal: Send Protected Test Advisory */}
<div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm hidden items-center justify-center p-gutter" id="test-modal">
<div className="bg-surface-container-lowest max-w-md w-full rounded-2xl shadow-xl p-space-xl flex flex-col gap-space-md relative">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[24px]">send_time_extension</span>
<span className="font-headline-sm text-headline-sm text-on-surface">Protected Test Advisory</span>
</div>
<button aria-label="Close dialog" className="text-on-surface-variant hover:text-on-surface">
<span aria-hidden="true" className="material-symbols-outlined">close</span>
</button>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
        Send a non-billable test advisory to verify telco carrier routing. This will not trigger external parent alerts.
      </p>
<div className="flex flex-col gap-space-sm">
<div>
<label className="block font-label-sm text-label-sm text-on-surface mb-1">Select Delivery Channel</label>
<select className="w-full bg-surface-container-low p-2 rounded-lg text-on-surface font-body-md text-body-md focus:outline-none">
<option>SMS (Nigeria DND Bypassed)</option>
<option>Telegram Bot Direct (Dedicated Bot)</option>
</select>
</div>
<div>
<label className="block font-label-sm text-label-sm text-on-surface mb-1">Test Recipient Phone</label>
<input className="w-full bg-surface p-2 rounded-lg text-on-surface font-body-md text-body-md border-0 focus:ring-1 focus:ring-primary" type="text" value="+234 800 000 0099" />
</div>
<div>
<label className="block font-label-sm text-label-sm text-on-surface mb-1">Template Preset</label>
<select className="w-full bg-surface-container-low p-2 rounded-lg text-on-surface font-body-md text-body-md focus:outline-none">
<option>#FEE_TR2_EXPEDITED (Tranche 2 Reminder)</option>
<option>#ACAD_CA_AVAILABLE (CA Scores Notice)</option>
<option>#RECEIPT_PAID_ACK (Settlement Receipt)</option>
</select>
</div>
</div>
<div className="flex items-center justify-end gap-space-sm pt-space-xs">
<button className="px-space-md py-2 rounded-lg text-on-surface-variant hover:bg-surface-container font-label-md text-label-md">
          Cancel
        </button>
<button className="px-space-lg py-2 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary-container transition-colors flex items-center gap-1" id="dispatch-test-btn">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">bolt</span>
<span className="">Fire Protected Test</span>
</button>
</div>
</div>
</div>
{/* Notification Toast */}
<div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-space-md py-space-sm rounded-lg shadow-xl flex items-center gap-space-sm transition-transform duration-300 translate-y-24 opacity-0 pointer-events-none" id="toast-notification">
<span aria-hidden="true" className="material-symbols-outlined text-primary-fixed" id="toast-icon">check_circle</span>
<span className="font-body-md text-body-md" id="toast-message">Action executed successfully.</span>
</div>
{/* Client-side Logic for Screen Interactions */}

</div>
    </div>
  );
}
