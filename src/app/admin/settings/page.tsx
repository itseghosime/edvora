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

export default function SettingsAdminPage() {
  const { data: summary } = useSchoolSummaryQuery();
  const { data: pupils = [] } = usePupilsQuery();
  const { data: payments = [] } = usePaymentsQuery();
  const [activeTab, setActiveTab] = useState<"identity" | "academic" | "staff" | "integrations" | "audit">("identity");
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col w-full">
{/* Top Ambient Glow Decorator */}
<div className="relative w-full">
<div className="absolute top-0 right-12 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none -z-10"></div>
<div className="absolute top-24 left-1/3 w-80 h-80 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none -z-10"></div>
</div>
<div className="px-0 py-space-lg flex flex-col gap-space-xl max-w-7xl">
{/* Header Section with Distinct Administrative Hierarchy */}
<div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
<div className="flex flex-col gap-space-xs max-w-3xl">
<div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm tracking-widest uppercase">
<span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
<span className="">System Administration • Config Version 2026.4</span>
</div>
<h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Institutional Settings &amp; Governance</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant">
          Manage school identity, academic calendars, role-based access control, SMS/Telegram routing, and integration status.
        </p>
</div>
{/* Quick Action Controls */}
<div className="flex items-center gap-space-sm self-start md:self-auto shrink-0">
<button className="px-space-md py-space-sm rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors font-label-lg text-label-lg flex items-center gap-space-xs" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">history</span>
<span className="">View Change Log</span>
</button>
<button onClick={handleSave} className="px-space-lg py-space-sm rounded-lg bg-primary hover:bg-primary-container text-on-primary shadow-sm transition-all font-label-lg text-label-lg flex items-center gap-space-xs" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">verified</span>
<span className="">Save Changes</span>
</button>
</div>
</div>
{savedToast && (
  <div className="p-3 bg-primary/10 border border-primary/30 rounded-xl text-primary text-xs font-semibold flex items-center gap-2">
    <span aria-hidden="true" className="material-symbols-outlined text-[18px]">check_circle</span>
    <span>Governance &amp; integration settings saved successfully!</span>
  </div>
)}
{/* Internal Tabs Navigation */}
<div className="bg-surface-container-lowest p-space-xs rounded-xl shadow-[0_2px_8px_rgba(28,52,56,0.04)] overflow-x-auto">
<nav aria-label="Settings Tabs" className="flex items-center gap-space-xs min-w-max">
<button onClick={() => setActiveTab("identity")} className={`flex items-center gap-space-xs px-space-md py-space-sm rounded-lg font-title-md text-title-md transition-colors shadow-sm ${activeTab === "identity" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container-high"}`}>
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">account_balance</span>
<span className="">School Identity &amp; Contact</span>
</button>
<button onClick={() => setActiveTab("academic")} className={`flex items-center gap-space-xs px-space-md py-space-sm rounded-lg text-body-md transition-colors ${activeTab === "academic" ? "bg-primary text-on-primary font-bold" : "text-on-surface-variant hover:bg-surface-container-high"}`}>
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">date_range</span>
<span className="">Academic Session &amp; Classes</span>
</button>
<button onClick={() => setActiveTab("staff")} className={`flex items-center gap-space-xs px-space-md py-space-sm rounded-lg text-body-md transition-colors ${activeTab === "staff" ? "bg-primary text-on-primary font-bold" : "text-on-surface-variant hover:bg-surface-container-high"}`}>
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">shield_person</span>
<span className="">Staff Roles &amp; Permissions</span>
</button>
<button onClick={() => setActiveTab("integrations")} className={`flex items-center gap-space-xs px-space-md py-space-sm rounded-lg text-body-md transition-colors ${activeTab === "integrations" ? "bg-primary text-on-primary font-bold" : "text-on-surface-variant hover:bg-surface-container-high"}`}>
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">hub</span>
<span className="">Integration Status</span>
</button>
<button onClick={() => setActiveTab("audit")} className={`flex items-center gap-space-xs px-space-md py-space-sm rounded-lg text-body-md transition-colors ${activeTab === "audit" ? "bg-primary text-on-primary font-bold" : "text-on-surface-variant hover:bg-surface-container-high"}`}>
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">menu_book</span>
<span className="">Audit Ledger</span>
</button>
</nav>
</div>
{/* Toast Banner (Dismissible) */}
<div className="hidden transition-all duration-300 p-space-md rounded-xl bg-surface-container-low text-on-surface flex items-center justify-between shadow-sm" id="saveToast">
<div className="flex items-center gap-space-sm">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[22px]">check_circle</span>
<span className="font-body-md text-body-md font-medium">Settings verified and saved to institutional profile. Dispatch webhooks synchronized.</span>
</div>
<button aria-label="Close dialog" className="p-1 text-on-surface-variant hover:text-on-surface">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">close</span>
</button>
</div>
{/* Active Tab Main Content: Mosaic / Bento Grid Layout */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
{/* Left Column: Primary Identity & Academic Parameters (7 Cols) */}
<div className="lg:col-span-7 flex flex-col gap-space-xl">
{/* Panel A: School Profile */}
<section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-[0_2px_8px_rgba(28,52,56,0.04)] flex flex-col gap-space-lg relative overflow-hidden">
<div className="flex items-center justify-between pb-space-xs">
<div className="flex items-center gap-space-sm">
<div className="w-10 h-10 rounded-lg bg-surface-container-high text-primary flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-[22px]">school</span>
</div>
<div>
<span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Institutional Profile</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface">Edvora Nursery &amp; Primary School</h2>
</div>
</div>
<span className="px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">School profile</span>
</div>
{/* Editorial Imagery & Crest Inset */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-md bg-surface-container-low p-space-md rounded-lg">
<div className="md:col-span-1 h-32 rounded-lg overflow-hidden relative">
<img className="w-full h-full object-cover" data- alt="Warm sunlight illuminating the tranquil colonial-brick facade and manicured verdant courtyard of an elite private primary academy in southern Nigeria. Rich architectural details, tranquil morning light." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAq0lFl344PYPhCMGVx-QyIjUI8p9t9Kz1kLQHBQxZW_iMSqyBPj3JSP10zMyRRxp-ChEZR9MYYJ-GhKcNg2DO2iu_2wDKOXn2YfF8bkhtdiblxpTOgCQGnz7spm1Uga0kgfLsR_j23YZ711s2IQhTZBa_E-lnGtzHLHH3kYeJQtuvgwWY94o1ZZNO4ElyfgeNWQ6RCw0rqRPmJNc-t2opSyalf9-LKbcB4q_GAIC1pXOW9vumeSknS" />
<div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
<span className="absolute bottom-2 left-2 px-space-xs py-0.5 rounded bg-surface/90 font-label-sm text-label-sm text-on-surface">Main Gate</span>
</div>
<div className="md:col-span-2 flex flex-col justify-center gap-space-xs">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Institutional Motto</span>
<p className="font-title-md text-title-md text-primary italic">“Thoughtful Minds, Dignified Futures”</p>
<p className="font-body-sm text-body-sm text-on-surface-variant pt-space-xs">
                Founded to cultivate foundational scholarship, dignified moral agency, and linguistic eloquence under private governance.
              </p>
</div>
</div>
{/* Profile Input Matrix */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
<div className="flex flex-col gap-space-xs">
<label className="font-label-md text-label-md text-on-surface-variant">Campus Physical Address</label>
<div className="flex items-center gap-space-xs px-space-md py-space-sm bg-surface rounded-lg">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[18px]">location_on</span>
<input className="w-full bg-transparent font-body-md text-body-md text-on-surface outline-none" type="text" value="Benin City Campus, Edo State, Nigeria" />
</div>
</div>
<div className="flex flex-col gap-space-xs">
<label className="font-label-md text-label-md text-on-surface-variant">Official Telephone Desk</label>
<div className="flex items-center gap-space-xs px-space-md py-space-sm bg-surface rounded-lg">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[18px]">call</span>
<input className="w-full bg-transparent font-body-md text-body-md text-on-surface outline-none" type="text" value="+234 (0) 52 250 000" />
</div>
</div>
<div className="flex flex-col gap-space-xs">
<label className="font-label-md text-label-md text-on-surface-variant">Official Administrative Email</label>
<div className="flex items-center gap-space-xs px-space-md py-space-sm bg-surface rounded-lg">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[18px]">mail</span>
<input className="w-full bg-transparent font-body-md text-body-md text-on-surface outline-none" type="email" value="admin@cedardemo.sch.ng" />
</div>
</div>
<div className="flex flex-col gap-space-xs">
<label className="font-label-md text-label-md text-on-surface-variant">Bursary &amp; Accounts Desk</label>
<div className="flex items-center gap-space-xs px-space-md py-space-sm bg-surface rounded-lg">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[18px]">receipt_long</span>
<input className="w-full bg-transparent font-body-md text-body-md text-on-surface outline-none" type="email" value="bursar@cedardemo.sch.ng" />
</div>
</div>
</div>
{/* Explanatory Callout Banner */}
<div className="flex items-start gap-space-sm p-space-md rounded-lg bg-surface-container text-on-surface">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">info</span>
<div className="flex flex-col gap-space-xs">
<span className="font-label-md text-label-md text-primary font-semibold">Public Notice Disclaimer</span>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                Parent-contact telephone configured here is published to guardians for query resolution on fee receipts and term newsletters.
              </p>
</div>
</div>
</section>
{/* Panel C: Staff Role Permissions Matrix */}
<section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-[0_2px_8px_rgba(28,52,56,0.04)] flex flex-col gap-space-lg">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<div className="w-10 h-10 rounded-lg bg-surface-container-high text-primary flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-[22px]">manage_accounts</span>
</div>
<div>
<span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Access Governance</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface">Role-Based Permission Matrix</h2>
</div>
</div>
<button className="text-primary hover:text-primary-container font-label-md text-label-md flex items-center gap-space-xs" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">add_circle</span>
<span className="">Define Custom Role</span>
</button>
</div>
{/* Role Cards Listing */}
<div className="flex flex-col gap-space-md">
{/* Role 1: Admin / Proprietor */}
<div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<span className="px-space-sm py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm">System Tier 1</span>
<h3 className="font-title-md text-title-md text-on-surface">Admin / Proprietor</h3>
</div>
<span className="font-label-sm text-label-sm text-primary font-medium">3 Active Accounts</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                Full system access, staff provisioning, session roll-over, bank account reconciliation, cryptographic audit export, and architectural lockdowns.
              </p>
<div className="flex flex-wrap gap-space-xs pt-space-xs">
<span className="px-space-xs py-0.5 rounded bg-surface text-on-surface-variant font-label-sm text-label-sm">Session Rollover: Allowed</span>
<span className="px-space-xs py-0.5 rounded bg-surface text-on-surface-variant font-label-sm text-label-sm">Staff Provisioning: Allowed</span>
<span className="px-space-xs py-0.5 rounded bg-surface text-on-surface-variant font-label-sm text-label-sm">Discounts &amp; Waivers: Unrestricted</span>
</div>
</div>
{/* Role 2: Bursar */}
<div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<span className="px-space-sm py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm">Financial Tier 2</span>
<h3 className="font-title-md text-title-md text-on-surface">Bursar &amp; Finance Controller</h3>
</div>
<span className="font-label-sm text-label-sm text-secondary font-medium">2 Active Accounts</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                Fee schedules, Paystack webhook audits, payment reconciliations, waivers. Cannot alter academic grades or pupil report records.
              </p>
<div className="flex flex-wrap gap-space-xs pt-space-xs">
<span className="px-space-xs py-0.5 rounded bg-surface text-on-surface-variant font-label-sm text-label-sm">Paystack Audit: Allowed</span>
<span className="px-space-xs py-0.5 rounded bg-surface text-on-surface-variant font-label-sm text-label-sm">Manual Ledger Entry: Allowed</span>
<span className="px-space-xs py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm">Academic Scores: Denied</span>
</div>
</div>
{/* Role 3: Teacher / Results Officer */}
<div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<span className="px-space-sm py-0.5 rounded-full bg-tertiary-container text-on-tertiary font-label-sm text-label-sm">Academic Tier 3</span>
<h3 className="font-title-md text-title-md text-on-surface">Teacher / Results Officer</h3>
</div>
<span className="font-label-sm text-label-sm text-on-surface-variant font-medium">14 Active Accounts</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                Class continuous assessment (CA) score recording, narrative remarks submission. Cannot edit fees or publish term broadsheets without Head Teacher clearance.
              </p>
<div className="flex flex-wrap gap-space-xs pt-space-xs">
<span className="px-space-xs py-0.5 rounded bg-surface text-on-surface-variant font-label-sm text-label-sm">CA Marks Entry: Allowed</span>
<span className="px-space-xs py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm">Fee Schedules: Denied</span>
<span className="px-space-xs py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm">Term Publishing: Clearance Required</span>
</div>
</div>
</div>
</section>
</div>
{/* Right Column: Academic Term, Quiet Hours & Integrations (5 Cols) */}
<div className="lg:col-span-5 flex flex-col gap-space-xl">
{/* Panel B: Current Academic Term */}
<section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-[0_2px_8px_rgba(28,52,56,0.04)] flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<div className="w-10 h-10 rounded-lg bg-surface-container-high text-primary flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-[22px]">event_available</span>
</div>
<div>
<span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Calendar Bounds</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface">Current Academic Term</h2>
</div>
</div>
<span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
</div>
<div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-sm">
<div className="flex justify-between items-center">
<span className="font-label-md text-label-md text-on-surface-variant">Active Session</span>
<span className="font-title-md text-title-md text-primary font-semibold">2026/2027</span>
</div>
<div className="flex justify-between items-center">
<span className="font-label-md text-label-md text-on-surface-variant">Current Term</span>
<span className="font-label-lg text-label-lg text-on-surface font-semibold">First Term</span>
</div>
<div className="flex justify-between items-center">
<span className="font-label-md text-label-md text-on-surface-variant">Term Duration</span>
<span className="font-body-sm text-body-sm text-on-surface">Sept 14, 2026 – Dec 18, 2026</span>
</div>
</div>
{/* Academic Enrolment & Lock Status Metric Grid */}
<div className="grid grid-cols-2 gap-space-sm">
<div className="p-space-md rounded-lg bg-surface-container flex flex-col gap-space-xs">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Enrolled Pupils</span>
<span className="font-headline-md text-headline-md text-primary">180</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Across 6 classes</span>
</div>
<div className="p-space-md rounded-lg bg-surface-container flex flex-col gap-space-xs">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Fee Schedule Lock</span>
<div className="flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]">lock</span>
<span className="font-headline-md text-headline-md text-on-surface">Enforced</span>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant">Term rates immutable</span>
</div>
</div>
</section>
{/* Panel D: Dispatch & Quiet Hours Policy */}
<section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-[0_2px_8px_rgba(28,52,56,0.04)] flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<div className="w-10 h-10 rounded-lg bg-surface-container-high text-primary flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-[22px]">bedtime</span>
</div>
<div>
<span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Communication Ethics</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface">Dispatch &amp; Quiet Hours</h2>
</div>
</div>
<span className="px-space-sm py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold">
              Strict Policy
            </span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
            To respect Nigerian families’ dignity and avoid intrusive digital harassment, all outgoing notifications are architecturally clamped.
          </p>
<div className="flex flex-col gap-space-sm">
<div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">schedule</span>
<div className="flex flex-col">
<span className="font-title-md text-title-md text-on-surface">Permitted Window: 08:00 AM – 05:00 PM</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Monday through Friday only. Outgoing queue holds outside hours.</span>
</div>
</div>
<div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low">
<span aria-hidden="true" className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">weekend</span>
<div className="flex flex-col">
<span className="font-title-md text-title-md text-on-surface">Zero Weekend Debt Pings</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Automated fee reminders are categorically disabled on Saturdays &amp; Sundays.</span>
</div>
</div>
<div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">group_off</span>
<div className="flex flex-col">
<span className="font-title-md text-title-md text-on-surface">No Group-Chat Feature</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Architecturally enforced one-way broadcast to avoid guardian privacy leakage.</span>
</div>
</div>
</div>
</section>
{/* Panel E: Integration Status Indicators (No Exposed Secrets) */}
<section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-[0_2px_8px_rgba(28,52,56,0.04)] flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<div className="w-10 h-10 rounded-lg bg-surface-container-high text-primary flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-[22px]">cloud_sync</span>
</div>
<div>
<span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Gateway Hub</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface">Integration Status</h2>
</div>
</div>
<span className="px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">Payment settings</span>
</div>
<div className="flex flex-col gap-space-sm">
{/* Paystack Indicator */}
<div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[18px]">payments</span>
<span className="font-title-md text-title-md text-on-surface">Paystack Payment Gateway</span>
</div>
<span className="px-space-sm py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
                  CONNECTED
                </span>
</div>
<div className="flex flex-col font-body-sm text-body-sm text-on-surface-variant gap-0.5 pt-space-xs">
<div className="">Public Key: <span className="font-mono text-on-surface font-medium">pk_test_edvora_••••••••</span></div>
<div className="">Webhook Signature: <span className="text-primary font-medium">SHA512 Verified</span></div>
<div className="text-secondary font-medium">School payment configuration</div>
</div>
</div>
{/* SMS Telco Indicator */}
<div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[18px]">sms</span>
<span className="font-title-md text-title-md text-on-surface">SMS Telco Aggregator</span>
</div>
<span className="px-space-sm py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
                  CONNECTED
                </span>
</div>
<div className="flex flex-col font-body-sm text-body-sm text-on-surface-variant gap-0.5 pt-space-xs">
<div className="">Routing: <span className="text-on-surface font-medium">Direct SMPP NG-Lagos</span></div>
<div className="">Available Balance: <span className="font-title-md text-title-md text-primary font-semibold">4,820 Test Units</span></div>
</div>
</div>
{/* Telegram Bot API */}
<div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-xs">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[18px]">chat</span>
<span className="font-title-md text-title-md text-on-surface">Telegram Bot Gateway</span>
</div>
<span className="px-space-sm py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
                  CONNECTED
                </span>
</div>
<div className="flex flex-col font-body-sm text-body-sm text-on-surface-variant gap-0.5 pt-space-xs">
<div className="">Account Tier: <span style={{ color: "#051f23" }}>School account</span></div>
<div className="">Approved Sender ID: <span className="font-mono text-primary font-semibold">EDVORA</span></div>
</div>
</div>
</div>
</section>
{/* Panel F: Security Snapshot */}
<section className="bg-surface-container-lowest rounded-xl p-space-md shadow-[0_2px_8px_rgba(28,52,56,0.04)] flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[24px]">policy</span>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">System Security &amp; Audit Snapshot</span>
<span className="font-body-sm text-body-sm text-on-surface">
                Last audit entry: <span className="font-semibold text-primary">2026-10-14 09:42</span> by Bursar (Webhook EDV-TEST-8842)
              </span>
</div>
</div>
<button aria-label="Next" className="p-space-xs text-on-surface-variant hover:text-primary transition-colors" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">chevron_right</span>
</button>
</section>
</div>
</div>
{/* Editorial Photographic Break / Campus Vignette */}
<div className="relative w-full rounded-xl overflow-hidden bg-surface-container-lowest p-space-lg shadow-[0_2px_8px_rgba(28,52,56,0.04)] flex flex-col md:flex-row items-center gap-space-lg">
<div className="w-full md:w-1/3 h-48 rounded-lg overflow-hidden shrink-0">
<img className="w-full h-full object-cover" data- alt="A dedicated primary school teacher in Nigeria guiding two pupils through an interactive Montessori wooden alphabet puzzle in a bright, orderly classroom with high ceilings and botanical plants. Warm natural light, calm academic environment." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDM41ChgsJwwywD0FPnUtoHvXlj8hskVcXSypQAYYPYyqjzBZ6JrQL9PJSFGz2VFD9d6VsbranGvmd11lOdpH2B36Ivlo78ezyCdJMqchc8CAmKGM8P0fjuAk3LHp-UVb5_c59myVgLkMzk3GSbSSDw8r9lXN6HgUYBNCycy7uZJrcQ1tUcu7quK8-n_zMUtYrWHKBCMP3Ravwk_2Rvw3fzFlCmzCaE_m8FZORphQYl3UxFQMyl2T4j" />
</div>
<div className="flex flex-col gap-space-xs">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">Institutional Governance Philosophy</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Data Sovereignty &amp; Ethical Stewardship</h3>
<p className="font-body-md text-body-md text-on-surface-variant">Pupil and guardian records are restricted to authorised accounts. Staff should review guardian links and keep school contact information current.</p>
</div>
</div>
{/* Footer Action Toolbar (Action Mandate 4: Save, Cancel, Reset Demo Data) */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-[0_2px_8px_rgba(28,52,56,0.04)] flex flex-col sm:flex-row items-center justify-between gap-space-md">
<div className="flex items-center gap-space-sm w-full sm:w-auto">
<button className="px-space-md py-space-sm rounded-lg text-error hover:bg-error-container hover:text-on-error-container transition-colors font-label-lg text-label-lg flex items-center gap-space-xs" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">restart_alt</span>
<span className="">Reset Records</span>
</button>
</div>
<div className="flex items-center justify-end gap-space-sm w-full sm:w-auto">
<button className="px-space-md py-space-sm rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-lg text-label-lg" type="button">
          Cancel
        </button>
<button className="px-space-xl py-space-sm rounded-lg bg-primary hover:bg-primary-container text-on-primary shadow-sm transition-all font-label-lg text-label-lg flex items-center gap-space-xs" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">save</span>
<span className="">Save Changes</span>
</button>
</div>
</div>
</div>
{/* Reset Confirmation Modal Dialog */}
<div className="hidden fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/40 backdrop-blur-sm" id="resetModal">
<div className="bg-surface-container-lowest rounded-xl p-space-xl max-w-md w-full shadow-[0_12px_32px_rgba(28,52,56,0.16)] flex flex-col gap-space-md animate-in fade-in zoom-in duration-200">
<div className="w-12 h-12 rounded-full bg-error-container text-on-error-container flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-[28px]">warning</span>
</div>
<div className="flex flex-col gap-space-xs">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Reset Demonstration Data?</h3>
<p className="font-body-md text-body-md text-on-surface-variant">
          This will restore Edvora Nursery & Primary School settings, academic session bounds, Paystack test keys, and role permissions to their factory demo defaults.
        </p>
</div>
<div className="flex items-center justify-end gap-space-sm pt-space-xs">
<button className="px-space-md py-space-sm rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-lg text-label-lg" type="button">
          Keep Current Config
        </button>
<button className="px-space-md py-space-sm rounded-lg bg-error text-on-error hover:opacity-90 transition-all font-label-lg text-label-lg" type="button">
          Reset System Settings
        </button>
</div>
</div>
</div>
</div>

    </div>
  );
}
