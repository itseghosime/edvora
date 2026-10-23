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

export default function PaymentLedgerPage() {
  const { data: summary } = useSchoolSummaryQuery();
  const { data: pupils = [] } = usePupilsQuery();
  const { data: payments = [] } = usePaymentsQuery();

  return (
    <div className="space-y-6">
      <div className="flex flex-col w-full">
{/* Active Sidebar Nav State Sync Script */}

{/* Main Content Space Container */}
<div className="px-0 py-gutter flex flex-col gap-space-lg max-w-[1440px] mx-auto w-full">
{/* Top Headline Section with Status Ticker */}
<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
<div className="flex flex-col gap-space-xs max-w-2xl">
<div className="flex items-center gap-space-sm">
<span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm tracking-wider uppercase">Institutional Treasury</span>
<span className="text-outline-variant">•</span>
<span className="text-on-surface-variant font-label-md text-label-md flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Webhook Ingress Active (Port 443 TLS)
          </span>
</div>
<h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Payment Ledger &amp; Settlement Audit</h1>
<p className="font-body-md text-body-md text-on-surface-variant">
          Strict chronological record of verified Paystack test transactions, simulated checkout events, and cryptographic ledger reconciliation flags.
        </p>
</div>
{/* Action Cluster */}
<div className="flex items-center gap-space-sm flex-wrap">
<button className="flex items-center gap-space-xs px-space-md h-10 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-lg text-label-lg transition-colors shadow-sm" id="btnSimulateWebhook">
<span aria-hidden="true" className="material-symbols-outlined text-[18px] text-secondary">bolt</span>
<span className="">Simulate Webhook Ping</span>
</button>
<button className="flex items-center gap-space-xs px-space-md h-10 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg transition-all shadow-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">download</span>
<span className="">Export Ledger (CSV)</span>
</button>
</div>
</div>
{/* Reconciliation Cryptographic Security Callout Banner */}
<div className="relative overflow-hidden rounded-xl bg-surface-container-low p-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md shadow-sm">
<div className="flex items-start sm:items-center gap-space-md">
<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[22px]">verified_user</span>
</div>
<div className="flex flex-col">
<div className="flex items-center gap-space-xs">
<span className="font-title-md text-title-md text-primary">Paystack Test Webhook Verification Protocol</span>
<span className="font-label-sm text-label-sm px- space-xs py-0.5 rounded bg-primary-fixed text-on-primary-fixed uppercase tracking-wider">HMAC SHA512</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
            Payments update pupil ledger balances once and only once upon cryptographic SHA512 signature validation. No manual cash bypass.
          </p>
</div>
</div>
<div className="flex items-center gap-space-xs shrink-0 bg-surface-container-lowest px-space-sm py-1 rounded-lg">
<span aria-hidden="true" className="material-symbols-outlined text-secondary text-[16px]">lock</span>
<span className="font-label-sm text-label-sm text-on-surface"></span>
</div>
</div>
{/* 4 Summary Metrics Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
{/* Total Verified */}
<div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
<div className="flex items-center justify-between mb-space-sm">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Total Verified Collections</span>
<div className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "" }}>check_circle</span>
</div>
</div>
<div className="flex flex-col gap-1">
<span className="font-headline-md text-headline-md text-on-surface tracking-tight">₦12,600,000</span>
<div className="flex items-center gap-1.5 text-primary font-label-md text-label-md">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">event_available</span>
<span className="">105 successful webhook events</span>
</div>
</div>
{/* Progress Sparkline Micro-visual */}
<div className="w-full bg-surface-container mt-space-md rounded-full h-1.5 overflow-hidden">
<div className="bg-primary h-full rounded-full" style={{}}></div>
</div>
</div>
{/* Pending Webhooks */}
<div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
<div className="flex items-center justify-between mb-space-sm">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Pending Webhooks</span>
<div className="w-7 h-7 rounded-lg bg-secondary-fixed/50 flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-secondary text-[16px]">sync</span>
</div>
</div>
<div className="flex flex-col gap-1">
<span className="font-headline-md text-headline-md text-on-surface tracking-tight">₦350,000</span>
<div className="flex items-center gap-1.5 text-secondary font-label-md text-label-md">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">pending</span>
<span className="">3 transactions in verification transit</span>
</div>
</div>
<div className="w-full bg-surface-container mt-space-md rounded-full h-1.5 overflow-hidden">
<div className="bg-secondary-container h-full rounded-full" style={{}}></div>
</div>
</div>
{/* Failed / Abandoned */}
<div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
<div className="flex items-center justify-between mb-space-sm">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Failed / Cancelled</span>
<div className="w-7 h-7 rounded-lg bg-error-container/60 flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-error text-[16px]">cancel</span>
</div>
</div>
<div className="flex flex-col gap-1">
<span className="font-headline-md text-headline-md text-on-surface tracking-tight">₦140,000</span>
<div className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-label-md">
<span aria-hidden="true" className="material-symbols-outlined text-[14px] text-error">info</span>
<span className="">2 abandoned test modal sessions</span>
</div>
</div>
<div className="w-full bg-surface-container mt-space-md rounded-full h-1.5 overflow-hidden">
<div className="bg-error h-full rounded-full" style={{}}></div>
</div>
</div>
{/* Unreconciled Discrepancies */}
<div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
<div className="flex items-center justify-between mb-space-sm">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Unreconciled Discrepancy</span>
<div className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[16px]">balance</span>
</div>
</div>
<div className="flex flex-col gap-1">
<span className="font-headline-md text-headline-md text-on-surface tracking-tight">₦0.00</span>
<div className="flex items-center gap-1.5 text-primary font-label-md text-label-md">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">all_inclusive</span>
<span className="">100% matched to pupil ledger accounts</span>
</div>
</div>
<div className="w-full bg-surface-container mt-space-md rounded-full h-1.5 overflow-hidden">
<div className="bg-primary h-full rounded-full" style={{}}></div>
</div>
</div>
</div>
{/* Filters & Action Bar Card */}
<div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-space-md">
{/* Search Input Container */}
<div className="relative flex-1 min-w-[280px]">
<span aria-hidden="true" className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
<input className="w-full pl-10 pr-space-md h-10 rounded-lg bg-surface text-on-surface placeholder:text-outline font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none transition-all" id="ledgerSearch" placeholder="Search by ref (EDV-TEST-...), pupil name, or receipt #" type="text" />
</div>
{/* Segmented Select Filters */}
<div className="flex items-center gap-space-sm flex-wrap xl:flex-nowrap">
{/* Status Dropdown */}
<div className="flex items-center gap-1.5 bg-surface rounded-lg px-space-sm h-10">
<span className="font-label-sm text-label-sm text-on-surface-variant">Status:</span>
<select className="bg-transparent text-on-surface font-label-md text-label-md focus:outline-none cursor-pointer" id="statusFilter">
<option value="all">All Transactions</option>
<option value="verified">Verified Only</option>
<option value="pending">Pending Ingress</option>
<option value="failed">Failed / Cancelled</option>
<option value="discrepancy">Discrepancy (₦0)</option>
</select>
</div>
{/* Class Filter Dropdown */}
<div className="flex items-center gap-1.5 bg-surface rounded-lg px-space-sm h-10">
<span className="font-label-sm text-label-sm text-on-surface-variant">Class:</span>
<select className="bg-transparent text-on-surface font-label-md text-label-md focus:outline-none cursor-pointer" id="classFilter">
<option value="all">All Levels</option>
<option value="nursery">Nursery Early Years</option>
<option value="pri1">Primary 1 (A-C)</option>
<option value="pri2">Primary 2</option>
<option value="pri3">Primary 3</option>
<option value="pri4">Primary 4</option>
<option value="pri5">Primary 5</option>
</select>
</div>
{/* Date Range Pill Button */}
<div className="flex items-center gap-space-xs bg-surface-container-high text-primary px-space-md h-10 rounded-lg font-label-md text-label-md shrink-0">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">calendar_today</span>
<span className="">2026/2027 First Term</span>
</div>
</div>
</div>
{/* Data Table Container */}
<div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden flex flex-col">
<div className="overflow-x-auto w-full">
<table className="w-full text-left border-collapse min-w-[960px]">
<thead>
<tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
<th className="py-space-md px-0 font-semibold">Ref &amp; Timestamp</th>
<th className="py-space-md px-space-md font-semibold">Pupil / Class</th>
<th className="py-space-md px-space-md font-semibold">Payment Narration</th>
<th className="py-space-md px-space-md font-semibold">Method &amp; Channel</th>
<th className="py-space-md px-space-md font-semibold text-right">Amount (NGN)</th>
<th className="py-space-md px-space-md font-semibold text-center">Status</th>
<th className="py-space-md px-0 font-semibold text-right">Verification Action</th>
</tr>
</thead>
<tbody className="font-body-sm text-body-sm text-on-surface" id="ledgerTableBody">
{/* Row 1: Osasere */}
<tr className="hover:bg-surface-container-low/60 transition-colors">
<td className="py-space-md px-0 align-top">
<div className="flex flex-col">
<span className="font-label-md text-label-md text-primary font-medium tracking-tight">EDV-TEST-8842</span>
<span className="text-on-surface-variant font-label-sm text-label-sm">Today, 09:42:18</span>
</div>
</td>
<td className="py-space-md px-space-md align-top">
<div className="flex flex-col">
<span className="font-title-md text-title-md text-on-surface">Osasere Ehigiator</span>
<span className="text-on-surface-variant font-label-sm text-label-sm">Primary 3A • CED-2024-091</span>
</div>
</td>
<td className="py-space-md px-space-md align-top">
<div className="flex flex-col max-w-xs">
<span className="font-medium text-on-surface">Tranche 1 (Full Resumption Fee)</span>
<span className="text-on-surface-variant font-label-sm text-label-sm">Termly Tuition + Textbook Kit</span>
</div>
</td>
<td className="py-space-md px-space-md align-top">
<div className="flex items-center gap-space-xs text-on-surface-variant">
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-tertiary">credit_card</span>
<span className="">Paystack Test Card (•••• 4081)</span>
</div>
</td>
<td className="py-space-md px-space-md align-top text-right">
<span className="font-title-md text-title-md text-on-surface tabular-nums">₦70,000.00</span>
</td>
<td className="py-space-md px-space-md align-top text-center">
<span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">check_circle</span>
<span className="">Verified</span>
</span>
</td>
<td className="py-space-md px-0 align-top text-right">
<div className="flex items-center justify-end gap-space-xs">
<button className="px-2.5 py-1 rounded bg-surface hover:bg-surface-container text-primary font-label-sm text-label-sm transition-colors flex items-center gap-1">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">receipt</span>
<span className="">Receipt</span>
</button>
<button className="px-2.5 py-1 rounded bg-surface hover:bg-surface-container text-on-surface-variant font-label-sm text-label-sm transition-colors flex items-center gap-1">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">code</span>
<span className="">JSON</span>
</button>
</div>
</td>
</tr>
{/* Row 2: Kome Agbaje */}
<tr className="hover:bg-surface-container-low/60 transition-colors">
<td className="py-space-md px-0 align-top">
<div className="flex flex-col">
<span className="font-label-md text-label-md text-primary font-medium tracking-tight">EDV-TEST-8841</span>
<span className="text-on-surface-variant font-label-sm text-label-sm">Yesterday, 16:15:02</span>
</div>
</td>
<td className="py-space-md px-space-md align-top">
<div className="flex flex-col">
<span className="font-title-md text-title-md text-on-surface">Kome Agbaje</span>
<span className="text-on-surface-variant font-label-sm text-label-sm">Primary 4 • CED-2023-142</span>
</div>
</td>
<td className="py-space-md px-space-md align-top">
<div className="flex flex-col max-w-xs">
<span className="font-medium text-on-surface">Tranche 1 &amp; 2 Part</span>
<span className="text-on-surface-variant font-label-sm text-label-sm">Classroom Levy &amp; STEM Lab Kit</span>
</div>
</td>
<td className="py-space-md px-space-md align-top">
<div className="flex items-center gap-space-xs text-on-surface-variant">
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-tertiary">smartphone</span>
<span className="">Paystack Test Mobile (•••• 9180)</span>
</div>
</td>
<td className="py-space-md px-space-md align-top text-right">
<span className="font-title-md text-title-md text-on-surface tabular-nums">₦85,000.00</span>
</td>
<td className="py-space-md px-space-md align-top text-center">
<span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">check_circle</span>
<span className="">Verified</span>
</span>
</td>
<td className="py-space-md px-0 align-top text-right">
<div className="flex items-center justify-end gap-space-xs">
<button className="px-2.5 py-1 rounded bg-surface hover:bg-surface-container text-primary font-label-sm text-label-sm transition-colors flex items-center gap-1">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">receipt</span>
<span className="">Receipt</span>
</button>
<button className="px-2.5 py-1 rounded bg-surface hover:bg-surface-container text-on-surface-variant font-label-sm text-label-sm transition-colors flex items-center gap-1">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">code</span>
<span className="">JSON</span>
</button>
</div>
</td>
</tr>
{/* Row 3: Chukwudi Nwosu */}
<tr className="hover:bg-surface-container-low/60 transition-colors">
<td className="py-space-md px-0 align-top">
<div className="flex flex-col">
<span className="font-label-md text-label-md text-primary font-medium tracking-tight">EDV-TEST-8840</span>
<span className="text-on-surface-variant font-label-sm text-label-sm">Oct 12, 11:30:45</span>
</div>
</td>
<td className="py-space-md px-space-md align-top">
<div className="flex flex-col">
<span className="font-title-md text-title-md text-on-surface">Chukwudi Nwosu</span>
<span className="text-on-surface-variant font-label-sm text-label-sm">Primary 1B • CED-2025-014</span>
</div>
</td>
<td className="py-space-md px-space-md align-top">
<div className="flex flex-col max-w-xs">
<span className="font-medium text-on-surface">Full Term Settlement</span>
<span className="text-on-surface-variant font-label-sm text-label-sm">Full Fee with Extended Daycare</span>
</div>
</td>
<td className="py-space-md px-space-md align-top">
<div className="flex items-center gap-space-xs text-on-surface-variant">
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-tertiary">account_balance</span>
<span className="">Paystack Test Transfer (Mock)</span>
</div>
</td>
<td className="py-space-md px-space-md align-top text-right">
<span className="font-title-md text-title-md text-on-surface tabular-nums">₦120,000.00</span>
</td>
<td className="py-space-md px-space-md align-top text-center">
<span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">check_circle</span>
<span className="">Verified</span>
</span>
</td>
<td className="py-space-md px-0 align-top text-right">
<div className="flex items-center justify-end gap-space-xs">
<button className="px-2.5 py-1 rounded bg-surface hover:bg-surface-container text-primary font-label-sm text-label-sm transition-colors flex items-center gap-1">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">receipt</span>
<span className="">Receipt</span>
</button>
<button className="px-2.5 py-1 rounded bg-surface hover:bg-surface-container text-on-surface-variant font-label-sm text-label-sm transition-colors flex items-center gap-1">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">code</span>
<span className="">JSON</span>
</button>
</div>
</td>
</tr>
{/* Row 4: Amina Bello (Pending Yellow) */}
<tr className="hover:bg-surface-container-low/60 transition-colors bg-secondary-fixed/15">
<td className="py-space-md px-0 align-top">
<div className="flex flex-col">
<span className="font-label-md text-label-md text-secondary font-medium tracking-tight">EDV-TEST-8839</span>
<span className="text-on-surface-variant font-label-sm text-label-sm">Oct 11, 14:02:11</span>
</div>
</td>
<td className="py-space-md px-space-md align-top">
<div className="flex flex-col">
<span className="font-title-md text-title-md text-on-surface">Amina Bello</span>
<span className="text-on-surface-variant font-label-sm text-label-sm">Primary 2A • CED-2024-118</span>
</div>
</td>
<td className="py-space-md px-space-md align-top">
<div className="flex flex-col max-w-xs">
<span className="font-medium text-on-surface">Tranche 1 Part</span>
<span className="text-on-surface-variant font-label-sm text-label-sm">Instalment fee via USSD Gateway</span>
</div>
</td>
<td className="py-space-md px-space-md align-top">
<div className="flex items-center gap-space-xs text-on-surface-variant">
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-secondary">dialpad</span>
<span className="">Paystack Test USSD (*737#)</span>
</div>
</td>
<td className="py-space-md px-space-md align-top text-right">
<span className="font-title-md text-title-md text-on-surface tabular-nums">₦50,000.00</span>
</td>
<td className="py-space-md px-space-md align-top text-center">
<span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[14px] animate-spin">autorenew</span>
<span className="">Pending Verification</span>
</span>
</td>
<td className="py-space-md px-0 align-top text-right">
<div className="flex items-center justify-end gap-space-xs">
<button className="px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim font-label-sm text-label-sm transition-colors flex items-center gap-1 font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">refresh</span>
<span className="">Retry Verify</span>
</button>
<button className="px-2.5 py-1 rounded bg-surface hover:bg-surface-container text-on-surface-variant font-label-sm text-label-sm transition-colors flex items-center gap-1">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">receipt_long</span>
<span className="">Inspect Log</span>
</button>
</div>
</td>
</tr>
{/* Row 5: Folake Adeyemi */}
<tr className="hover:bg-surface-container-low/60 transition-colors">
<td className="py-space-md px-0 align-top">
<div className="flex flex-col">
<span className="font-label-md text-label-md text-primary font-medium tracking-tight">EDV-TEST-8838</span>
<span className="text-on-surface-variant font-label-sm text-label-sm">Oct 10, 08:20:59</span>
</div>
</td>
<td className="py-space-md px-space-md align-top">
<div className="flex flex-col">
<span className="font-title-md text-title-md text-on-surface">Folake Adeyemi</span>
<span className="text-on-surface-variant font-label-sm text-label-sm">Nursery 2B • CED-2025-201</span>
</div>
</td>
<td className="py-space-md px-space-md align-top">
<div className="flex flex-col max-w-xs">
<span className="font-medium text-on-surface">Full Term Early Years</span>
<span className="text-on-surface-variant font-label-sm text-label-sm">Includes Montessori Materials pack</span>
</div>
</td>
<td className="py-space-md px-space-md align-top">
<div className="flex items-center gap-space-xs text-on-surface-variant">
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-tertiary">credit_card</span>
<span className="">Paystack Test Card (•••• 1004)</span>
</div>
</td>
<td className="py-space-md px-space-md align-top text-right">
<span className="font-title-md text-title-md text-on-surface tabular-nums">₦95,000.00</span>
</td>
<td className="py-space-md px-space-md align-top text-center">
<span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">check_circle</span>
<span className="">Verified</span>
</span>
</td>
<td className="py-space-md px-0 align-top text-right">
<div className="flex items-center justify-end gap-space-xs">
<button className="px-2.5 py-1 rounded bg-surface hover:bg-surface-container text-primary font-label-sm text-label-sm transition-colors flex items-center gap-1">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">receipt</span>
<span className="">Receipt</span>
</button>
<button className="px-2.5 py-1 rounded bg-surface hover:bg-surface-container text-on-surface-variant font-label-sm text-label-sm transition-colors flex items-center gap-1">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">code</span>
<span className="">JSON</span>
</button>
</div>
</td>
</tr>
{/* Row 6: Chinedu Okonkwo */}
<tr className="hover:bg-surface-container-low/60 transition-colors">
<td className="py-space-md px-0 align-top">
<div className="flex flex-col">
<span className="font-label-md text-label-md text-primary font-medium tracking-tight">EDV-TEST-8837</span>
<span className="text-on-surface-variant font-label-sm text-label-sm">Oct 09, 13:45:10</span>
</div>
</td>
<td className="py-space-md px-space-md align-top">
<div className="flex flex-col">
<span className="font-title-md text-title-md text-on-surface">Chinedu Okonkwo</span>
<span className="text-on-surface-variant font-label-sm text-label-sm">Primary 5B • CED-2022-049</span>
</div>
</td>
<td className="py-space-md px-space-md align-top">
<div className="flex flex-col max-w-xs">
<span className="font-medium text-on-surface">Full Term + Uniform levy</span>
<span className="text-on-surface-variant font-label-sm text-label-sm">Graduation transition bundle &amp; PTA</span>
</div>
</td>
<td className="py-space-md px-space-md align-top">
<div className="flex items-center gap-space-xs text-on-surface-variant">
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-tertiary">credit_card</span>
<span className="">Paystack Test Card (•••• 4420)</span>
</div>
</td>
<td className="py-space-md px-space-md align-top text-right">
<span className="font-title-md text-title-md text-on-surface tabular-nums">₦135,000.00</span>
</td>
<td className="py-space-md px-space-md align-top text-center">
<span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">check_circle</span>
<span className="">Verified</span>
</span>
</td>
<td className="py-space-md px-0 align-top text-right">
<div className="flex items-center justify-end gap-space-xs">
<button className="px-2.5 py-1 rounded bg-surface hover:bg-surface-container text-primary font-label-sm text-label-sm transition-colors flex items-center gap-1">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">receipt</span>
<span className="">Receipt</span>
</button>
<button className="px-2.5 py-1 rounded bg-surface hover:bg-surface-container text-on-surface-variant font-label-sm text-label-sm transition-colors flex items-center gap-1">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">code</span>
<span className="">JSON</span>
</button>
</div>
</td>
</tr>
{/* Row 7: Efosa Nosa-Obahiagbon */}
<tr className="hover:bg-surface-container-low/60 transition-colors">
<td className="py-space-md px-0 align-top">
<div className="flex flex-col">
<span className="font-label-md text-label-md text-primary font-medium tracking-tight">EDV-TEST-8836</span>
<span className="text-on-surface-variant font-label-sm text-label-sm">Oct 08, 10:12:33</span>
</div>
</td>
<td className="py-space-md px-space-md align-top">
<div className="flex flex-col">
<span className="font-title-md text-title-md text-on-surface">Efosa Nosa-Obahiagbon</span>
<span className="text-on-surface-variant font-label-sm text-label-sm">Primary 1C • CED-2025-078</span>
</div>
</td>
<td className="py-space-md px-space-md align-top">
<div className="flex flex-col max-w-xs">
<span className="font-medium text-on-surface">Tranche 1 Settlement</span>
<span className="text-on-surface-variant font-label-sm text-label-sm">Direct portal tuition payment</span>
</div>
</td>
<td className="py-space-md px-space-md align-top">
<div className="flex items-center gap-space-xs text-on-surface-variant">
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-tertiary">credit_card</span>
<span className="">Paystack Test Card (•••• 8092)</span>
</div>
</td>
<td className="py-space-md px-space-md align-top text-right">
<span className="font-title-md text-title-md text-on-surface tabular-nums">₦110,000.00</span>
</td>
<td className="py-space-md px-space-md align-top text-center">
<span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">check_circle</span>
<span className="">Verified</span>
</span>
</td>
<td className="py-space-md px-0 align-top text-right">
<div className="flex items-center justify-end gap-space-xs">
<button className="px-2.5 py-1 rounded bg-surface hover:bg-surface-container text-primary font-label-sm text-label-sm transition-colors flex items-center gap-1">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">receipt</span>
<span className="">Receipt</span>
</button>
<button className="px-2.5 py-1 rounded bg-surface hover:bg-surface-container text-on-surface-variant font-label-sm text-label-sm transition-colors flex items-center gap-1">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">code</span>
<span className="">JSON</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
{/* Pagination Footer */}
<div className="px-0 py-space-md bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-space-md">
<span className="font-body-sm text-body-sm text-on-surface-variant">
          Showing <span className="font-medium text-on-surface">1–7</span> of <span className="font-medium text-on-surface">105</span> verified test transactions
        </span>
<div className="flex items-center gap-space-xs">
<button className="px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-on-surface-variant font-label-md text-label-md disabled:opacity-50 transition-colors flex items-center gap-1" disabled>
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">chevron_left</span>
<span className="">Prev</span>
</button>
<button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold">1</button>
<button className="w-8 h-8 rounded-lg bg-surface hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors">2</button>
<button className="w-8 h-8 rounded-lg bg-surface hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors">3</button>
<span className="px-1 text-on-surface-variant font-label-md text-label-md">...</span>
<button className="w-8 h-8 rounded-lg bg-surface hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors">15</button>
<button className="px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors flex items-center gap-1">
<span className="">Next</span>
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">chevron_right</span>
</button>
</div>
</div>
</div>
{/* Audit Traceability Bottom Footnote */}
<div className="flex flex-col sm:flex-row items-center justify-between text-on-surface-variant font-body-sm text-body-sm px-space-xs py-space-sm gap-space-sm">
<div className="flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-primary">verified</span>
<span className="">Cryptographic Hash Traceability: <code>SHA512(payload, paystack_secret_key)</code> validated on ingress.</span>
</div>
<div className="flex items-center gap-space-md">
<span className=""></span>
<span className=""></span>
</div>
</div>
</div>
{/* Micro Modal 1: Webhook Payload Inspector */}
<div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm hidden flex items-center justify-center p-space-md" id="webhookModal">
<div className="bg-surface-container-lowest rounded-xl max-w-xl w-full p-space-lg shadow-xl flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[22px]">code</span>
<span className="font-headline-sm text-headline-sm text-on-surface">Inspect Webhook Payload</span>
</div>
<button aria-label="Close dialog" className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
<div className="flex flex-col gap-1 text-on-surface-variant font-body-sm text-body-sm">
<div className="flex items-center justify-between">
<span className="">Event Type: <strong className="text-on-surface">charge.success</strong></span>
<span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-label-sm">Signature Verified</span>
</div>
<div className="">Reference: <span className="text-primary font-medium" id="modalRefCode">EDV-TEST-8842</span></div>
</div>
{/* JSON Preview Box */}
<pre className="bg-surface-container-low p-space-md rounded-lg font-mono text-label-md text-on-surface overflow-x-auto max-h-72 leading-relaxed whitespace-pre-wrap select-all" id="jsonContent">{`{
  "event": "charge.success",
  "data": {
    "id": 302910811,
    "domain": "test",
    "status": "success",
    "reference": "EDV-TEST-8842",
    "amount": 7000000,
    "gateway_response": "Successful (Test Mode)",
    "paid_at": "2026-10-14T09:42:18.000Z",
    "channel": "card",
    "currency": "NGN",
    "ip_address": "102.89.34.12",
    "metadata": {
      "pupil_id": "CED-2024-091",
      "pupil_name": "Osasere Ehigiator",
      "session_term": "2026/2027 First Term"
    }
  }
}
      `}</pre>
<div className="flex items-center justify-end gap-space-sm pt-space-xs">
<button className="px-space-md h-9 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-1">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">content_copy</span>
<span id="copyBtnText" className="">Copy Raw Payload</span>
</button>
<button className="px-space-md h-9 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md">
          Dismiss
        </button>
</div>
</div>
</div>
{/* Micro Modal 2: Verified Receipt Preview */}
<div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm hidden flex items-center justify-center p-space-md" id="receiptModal">
<div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-space-lg shadow-xl flex flex-col gap-space-md">
<div className="flex items-center justify-between pb-space-xs">
<div className="flex items-center gap-space-xs">
<div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[18px]">receipt</span>
</div>
<span className="font-headline-sm text-headline-sm text-on-surface">Edvora Nursery & Primary School</span>
</div>
<button aria-label="Close dialog" className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
{/* Receipt Card Surface */}
<div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Official Payment Voucher</span>
<span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-semibold">PAID / AUDITED</span>
</div>
<div className="flex flex-col gap-1 py-space-xs">
<span className="text-on-surface-variant font-label-sm text-label-sm">Pupil Beneficiary</span>
<span className="font-title-md text-title-md text-on-surface" id="rcptPupil">Osasere Ehigiator</span>
<span className="text-on-surface-variant font-body-sm text-body-sm" id="rcptClass">Primary 3A • 2026/2027 Term 1</span>
</div>
<div className="p-space-sm bg-surface-container-lowest rounded-lg flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface-variant">Settled Amount</span>
<span className="font-headline-md text-headline-md text-primary font-bold" id="rcptAmount">₦70,000.00</span>
</div>
<div className="flex flex-col gap-1 text-on-surface-variant font-label-sm text-label-sm pt-space-xs">
<div className="flex justify-between">
<span className="">Paystack Reference:</span>
<span className="font-mono text-on-surface" id="rcptRef">EDV-TEST-8842</span>
</div>
<div className="flex justify-between">
<span className="">Ledger Ledger Post Time:</span>
<span className="text-on-surface">Oct 14, 2026 • 09:42 West Africa Time</span>
</div>
<div className="flex justify-between">
<span className="">Channel Provider:</span>
<span className="text-on-surface">Paystack Secure Gateway</span>
</div>
</div>
</div>
<div className="flex items-center justify-end gap-space-sm pt-space-xs">
<button className="px-space-md h-9 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-1">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">print</span>
<span className="">Print Voucher</span>
</button>
<button className="px-space-md h-9 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md">
          Close
        </button>
</div>
</div>
</div>
{/* Toast Notification Container */}
<div className="fixed bottom-6 right-6 z-50 bg-surface-container-lowest text-on-surface shadow-xl rounded-xl p-space-md hidden flex items-center gap-space-md transform transition-all duration-300" id="toastNotification">
<div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center" id="toastIconContainer">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]" id="toastIcon">check</span>
</div>
<div className="flex flex-col">
<span className="font-title-md text-title-md text-on-surface" id="toastTitle">Notification</span>
<span className="font-body-sm text-body-sm text-on-surface-variant" id="toastMessage">Action completed</span>
</div>
</div>
{/* Interactive Logic Script */}

</div>
    </div>
  );
}
