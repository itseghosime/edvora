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

export default function ResultsAdminPage() {
  const { data: summary } = useSchoolSummaryQuery();
  const { data: pupils = [] } = usePupilsQuery();
  const { data: payments = [] } = usePaymentsQuery();

  const [selectedPupilName, setSelectedPupilName] = useState<string>("Osasere Ehigiator");
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [remarks, setRemarks] = useState(
    "An exceptional first term performance. Commendable curiosity in Basic Science and strong arithmetic foundations."
  );
  const [activeRole, setActiveRole] = useState<"admin" | "bursar" | "teacher">("admin");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handlePublishOrWithdraw = async (
    resultId: string,
    status: "published" | "under_correction"
  ) => {
    if (activeRole === "bursar") {
      alert("Unauthorized: Bursars are not permitted to publish or withdraw academic results.");
      return;
    }

    try {
      const res = await fetch("/api/results/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resultId,
          status,
          actorRole: activeRole,
          actorId: "44444444-4444-4444-4444-000000000001",
          reason:
            status === "under_correction"
              ? "Under administrative grade review"
              : undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMessage(
          status === "published"
            ? "Academic report card signed off and published live to Student Portal!"
            : "Academic report card withdrawn. Student account now reflects Under Correction status."
        );
        setIsPublishModalOpen(false);
        setTimeout(() => setStatusMessage(null), 3500);
      } else {
        alert(data.error || "Failed to update result status");
      }
    } catch {
      alert("Request failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col w-full">

<div className="px-0 py-gutter flex flex-col gap-space-xl">
{/* Header Block */}
<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
<div className="flex flex-col gap-space-xs max-w-3xl">
<div className="flex items-center gap-space-xs text-primary font-label-md text-label-md tracking-wider uppercase">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">verified</span>
<span className="">Academic Evaluation Registry</span>
<span className="text-outline-variant">•</span>
<span className="">First Term Academic Year 2026/2027</span>
</div>
<h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Academic Results &amp; Evaluation Roster</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant">
          Continuous Assessment (CA) recording, Head Teacher review pipeline, and formal term report publishing.
        </p>
</div>
{/* Quick Action Buttons */}
<div className="flex flex-wrap items-center gap-space-sm self-start lg:self-end">
<button className="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container-low text-primary font-title-md text-title-md hover:bg-surface-container transition-all shadow-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">download</span>
<span className="">Download Broadsheet (CSV)</span>
</button>
<button className="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container-high text-primary font-title-md text-title-md hover:bg-surface-variant transition-all shadow-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">fact_check</span>
<span className="">Batch Review &amp; Sign-Off</span>
</button>
<button className="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-primary text-on-primary font-title-md text-title-md hover:bg-primary-container transition-all shadow-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">post_add</span>
<span className="">Enter Class Scores</span>
</button>
</div>
</div>
{/* Core Institutional Dignity Guarantee Banner */}
<div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary via-primary-container to-surface-tint p-space-lg text-on-primary shadow-md">
<div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-primary-fixed-dim opacity-10 pointer-events-none blur-xl"></div>
<div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
<div className="flex items-center gap-space-md">
<div className="w-12 h-12 rounded-lg bg-on-primary/10 flex items-center justify-center shrink-0">
<span aria-hidden="true" className="material-symbols-outlined text-secondary-fixed text-[28px]" style={{ fontVariationSettings: "" }}>shield_with_heart</span>
</div>
<div className="flex flex-col gap-0.5">
<div className="flex items-center gap-space-xs">
<span className="font-title-md text-title-md text-secondary-fixed font-bold">Dignified Policy Guarantee</span>
<span className="px-space-xs py-0.5 rounded bg-surface/20 text-on-primary font-label-sm text-label-sm uppercase tracking-wide">Charter Protected</span>
</div>
<p className="font-body-md text-body-md text-on-primary/90 max-w-4xl">
              Term academic results are never withheld due to unpaid fee balances. Results publish based solely on academic verification by the Head Teacher. Financial stewardship and academic recognition remain respectfully compartmentalized.
            </p>
</div>
</div>
<div className="hidden xl:flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-on-primary/10 font-label-md text-label-md text-primary-fixed shrink-0">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">lock_open</span>
<span className="">Inclusive Access Policy Active</span>
</div>
</div>
</div>
{/* Summary Metrics Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
{/* Total Evaluated */}
<div className="flex flex-col justify-between p-space-md bg-surface-container-lowest rounded-xl shadow-sm">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Pupils</span>
<div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">groups</span>
</div>
</div>
<div className="mt-space-md flex flex-col">
<span className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">180</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Class roster across Pri 1–5</span>
</div>
<div className="mt-space-sm pt-space-xs flex items-center gap-space-xs text-primary font-label-sm text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
<span className="">100% active academic registry</span>
</div>
</div>
{/* CA Scores Drafted */}
<div className="flex flex-col justify-between p-space-md bg-surface-container-lowest rounded-xl shadow-sm">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">CA Drafted</span>
<div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-tertiary">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">edit_note</span>
</div>
</div>
<div className="mt-space-md flex flex-col">
<span className="font-headline-lg text-headline-lg text-tertiary font-semibold tracking-tight">142</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Teachers in progress</span>
</div>
<div className="mt-space-sm pt-space-xs flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
<span className="">CA 1, CA 2 &amp; Mid-Term</span>
</div>
</div>
{/* Awaiting Audit / Sign-off */}
<div className="flex flex-col justify-between p-space-md bg-surface-container-lowest rounded-xl shadow-sm">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Awaiting Audit</span>
<div className="w-8 h-8 rounded-lg bg-secondary-fixed/50 flex items-center justify-center text-secondary">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
</div>
</div>
<div className="mt-space-md flex flex-col">
<span className="font-headline-lg text-headline-lg text-secondary font-semibold tracking-tight">26</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Pending Head Teacher Sign-off</span>
</div>
<div className="mt-space-sm pt-space-xs flex items-center gap-space-xs text-secondary font-label-sm text-label-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">priority_high</span>
<span className="">High Priority Queue</span>
</div>
</div>
{/* Formally Published */}
<div className="flex flex-col justify-between p-space-md bg-surface-container-lowest rounded-xl shadow-sm">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Published</span>
<div className="w-8 h-8 rounded-lg bg-primary-fixed/40 flex items-center justify-center text-primary">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">mark_email_read</span>
</div>
</div>
<div className="mt-space-md flex flex-col">
<span className="font-headline-lg text-headline-lg text-primary font-semibold tracking-tight">12</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Sent to Guardian Portals</span>
</div>
<div className="mt-space-sm pt-space-xs flex items-center gap-space-xs text-primary font-label-sm text-label-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">visibility</span>
<span className="">Live in Parent Accounts</span>
</div>
</div>
{/* Withdrawn / Corrections */}
<div className="flex flex-col justify-between p-space-md bg-surface-container-lowest rounded-xl shadow-sm">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Withdrawn</span>
<div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">undo</span>
</div>
</div>
<div className="mt-space-md flex flex-col">
<span className="font-headline-lg text-headline-lg text-on-surface-variant font-semibold tracking-tight">0</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Pending Correction</span>
</div>
<div className="mt-space-sm pt-space-xs flex items-center gap-space-xs text-primary font-label-sm text-label-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">check_circle</span>
<span className="">Zero discrepancy claims</span>
</div>
</div>
</div>
{/* Role Indicator Banner & Multi-Facet Filtering Desk */}
<div className="flex flex-col gap-space-md p-space-lg bg-surface-container-lowest rounded-xl shadow-sm">
{/* Identity & Privilege Level */}
<div className="flex flex-wrap items-center justify-between gap-space-md pb-space-sm">
<div className="flex items-center gap-space-sm flex-wrap">
<div className="w-3 h-3 rounded-full bg-primary-container"></div>
<span className="font-body-md text-body-md text-on-surface font-semibold">
  Active Role:
</span>
<select
  value={activeRole}
  onChange={(e) => setActiveRole(e.target.value as any)}
  className="bg-surface-container-low border border-outline-variant/30 text-xs font-bold text-primary px-2.5 py-1 rounded-lg"
>
  <option value="admin">Administrator (Superuser - Publishing Permitted)</option>
  <option value="teacher">Class Teacher (Drafting Permitted)</option>
  <option value="bursar">Bursar (Read-only Financials - Publishing Forbidden)</option>
</select>
<span className={`px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
  activeRole === 'bursar' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'
}`}>
  {activeRole === 'bursar' ? 'Publishing Restricted' : 'Publishing Enabled'}
</span>
</div>
{statusMessage && (
  <div className="w-full p-3 bg-primary/10 border border-primary/30 rounded-xl text-primary text-xs font-semibold flex items-center gap-2">
    <span aria-hidden="true" className="material-symbols-outlined text-[18px]">verified</span>
    <span>{statusMessage}</span>
  </div>
)}
<div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-outline">history</span>
<span className="">Last roster synchronization: Today at 10:42 AM (WAT)</span>
</div>
</div>
{/* Filters Matrix */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md pt-space-xs">
{/* Class Selector */}
<div className="flex flex-col gap-space-xs">
<label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Class Arm</label>
<div className="relative">
<select className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md px-space-md py-2 rounded-lg appearance-none cursor-pointer focus:bg-surface-container-lowest transition-colors">
<option >Primary 3A (St. Jude Arm)</option>
<option>Primary 1A</option>
<option>Primary 1B</option>
<option>Primary 1C</option>
<option>Primary 2A</option>
<option>Primary 2B</option>
<option>Primary 4</option>
<option>Primary 5B</option>
<option>Nursery 1 Early Years</option>
<option>Nursery 2 Pre-Prep</option>
</select>
<span aria-hidden="true" className="material-symbols-outlined text-outline pointer-events-none absolute right-3 top-2.5 text-[20px]">unfold_more</span>
</div>
</div>
{/* Subject Selector */}
<div className="flex flex-col gap-space-xs">
<label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Subject Module</label>
<div className="relative">
<select className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md px-space-md py-2 rounded-lg appearance-none cursor-pointer focus:bg-surface-container-lowest transition-colors">
<option >All Subjects Combined (Composite)</option>
<option>Mathematics</option>
<option>English Language &amp; Phonics</option>
<option>Basic Science &amp; Technology</option>
<option>Social Studies &amp; Civics</option>
<option>ICT &amp; Digital Literacy</option>
<option>Agricultural Science</option>
</select>
<span aria-hidden="true" className="material-symbols-outlined text-outline pointer-events-none absolute right-3 top-2.5 text-[20px]">unfold_more</span>
</div>
</div>
{/* Assessment Term */}
<div className="flex flex-col gap-space-xs">
<label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Academic Session</label>
<div className="relative">
<select className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md px-space-md py-2 rounded-lg appearance-none cursor-pointer focus:bg-surface-container-lowest transition-colors">
<option >2026/2027 First Term</option>
<option>2025/2026 Third Term (Archived)</option>
<option>2025/2026 Second Term (Archived)</option>
</select>
<span aria-hidden="true" className="material-symbols-outlined text-outline pointer-events-none absolute right-3 top-2.5 text-[20px]">calendar_today</span>
</div>
</div>
{/* Search pupil */}
<div className="flex flex-col gap-space-xs">
<label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Search Candidate</label>
<div className="relative">
<input className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md pl-9 pr-space-md py-2 rounded-lg focus:bg-surface-container-lowest transition-colors placeholder:text-outline" placeholder="Pupil name, Student ID..." type="text" />
<span aria-hidden="true" className="material-symbols-outlined text-outline absolute left-2.5 top-2.5 text-[18px]">search</span>
</div>
</div>
</div>
{/* Status Quick Filter Pills */}
<div className="flex flex-wrap items-center gap-space-xs pt-space-xs">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase mr-space-xs font-semibold">Filter Roster:</span>
<button className="filter-btn px-space-md py-1 rounded-full bg-primary text-on-primary font-label-md text-label-md transition-colors shadow-sm" id="filter-all">
          All (180)
        </button>
<button className="filter-btn px-space-md py-1 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" id="filter-drafted">
          Drafted (142)
        </button>
<button className="filter-btn px-space-md py-1 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" id="filter-awaiting">
          Awaiting Review (26)
        </button>
<button className="filter-btn px-space-md py-1 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" id="filter-published">
          Formally Published (12)
        </button>
<button className="filter-btn px-space-md py-1 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" id="filter-withdrawn">
          Withdrawn (0)
        </button>
</div>
</div>
{/* Main Results Roster Table */}
<div className="flex flex-col bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
{/* Section subheader & Quick Batch Action */}
<div className="p-space-lg flex flex-wrap items-center justify-between gap-space-md bg-surface-container-low/40">
<div className="flex items-center gap-space-md">
<div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span aria-hidden="true" className="material-symbols-outlined text-[24px]">school</span>
</div>
<div className="flex flex-col">
<div className="flex items-center gap-space-xs">
<h2 className="font-headline-sm text-headline-sm text-on-surface">Primary 3A — St. Jude Arm Class Register</h2>
<span className="px-space-xs py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm">Classroom Teacher: Mrs. V. Alonge</span>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant">Continuous Assessment Weighting: CA1 (15%) + CA2 (15%) + Mid-Term (20%) + Exam (50%) = 100%</span>
</div>
</div>
<div className="flex items-center gap-space-sm">
<button className="px-space-md py-1.5 rounded-lg bg-surface-container-highest text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">print</span>
<span className="">Print Mark Sheet</span>
</button>
<button className="px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors flex items-center gap-space-xs shadow-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">verified</span>
<span className="">Head Teacher Batch Sign-off</span>
</button>
</div>
</div>
{/* Table View */}
<div className="w-full overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
<th className="py-space-md px-space-lg font-semibold">Pupil Information</th>
<th className="py-space-md px-space-md font-semibold text-center">Class Arm</th>
<th className="py-space-md px-space-sm font-semibold text-right">CA 1 (15)</th>
<th className="py-space-md px-space-sm font-semibold text-right">CA 2 (15)</th>
<th className="py-space-md px-space-sm font-semibold text-right">Mid-Term (20)</th>
<th className="py-space-md px-space-sm font-semibold text-right">Exam (50)</th>
<th className="py-space-md px-space-md font-semibold text-right">Total (100)</th>
<th className="py-space-md px-space-sm font-semibold text-center">Grade</th>
<th className="py-space-md px-space-md font-semibold">Status &amp; Verification</th>
<th className="py-space-md px-space-lg font-semibold text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y-0 font-body-md text-body-md text-on-surface">
{/* Pupil 1: Osasere Ehigiator */}
<tr className="roster-row hover:bg-surface-container-low/60 transition-colors" data-status="drafted">
<td className="py-space-md px-space-lg">
<div className="flex items-center gap-space-sm">
<div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-title-md shrink-0">
                    OE
                  </div>
<div className="flex flex-col min-w-0">
<span className="font-title-md text-title-md text-on-surface font-semibold truncate">Osasere Ehigiator</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">EDV-2024-0312</span>
</div>
</div>
</td>
<td className="py-space-md px-space-md text-center">
<span className="px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">Pri 3A</span>
</td>
<td className="py-space-md px-space-sm text-right font-medium">14</td>
<td className="py-space-md px-space-sm text-right font-medium">13</td>
<td className="py-space-md px-space-sm text-right font-medium">18</td>
<td className="py-space-md px-space-sm text-right font-medium">44</td>
<td className="py-space-md px-space-md text-right">
<span className="font-title-md text-title-md text-primary font-bold">89%</span>
</td>
<td className="py-space-md px-space-sm text-center">
<span className="w-7 h-7 rounded-full inline-flex items-center justify-center font-bold font-title-md bg-primary-fixed text-on-primary-fixed">
                  A
                </span>
</td>
<td className="py-space-md px-space-md">
<div className="flex flex-col">
<span className="inline-flex items-center gap-1 text-on-secondary-fixed-variant bg-secondary-fixed/50 px-space-sm py-0.5 rounded-full font-label-sm text-label-sm w-max">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">pending</span>
<span className="">Drafted (Pending HM Sign-off)</span>
</span>
<span className="text-[11px] text-on-surface-variant mt-0.5">Teacher draft ready for review</span>
</div>
</td>
<td className="py-space-md px-space-lg text-right">
<div className="flex items-center justify-end gap-space-xs">
<button className="px-space-sm py-1 rounded bg-surface-container-high text-primary hover:bg-surface-container font-label-md text-label-md transition-colors">
                    Audit Scores
                  </button>
<button className="px-space-sm py-1 rounded bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors">
                    Comment
                  </button>
<button onClick={() => { setSelectedPupilName("Osasere Ehigiator"); setIsPublishModalOpen(true); }} className="px-space-sm py-1 rounded bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md transition-colors shadow-sm">
  Publish
</button>
</div>
</td>
</tr>
{/* Pupil 2: Chinedu Okonkwo */}
<tr className="roster-row bg-surface-container-lowest hover:bg-surface-container-low/60 transition-colors" data-status="published">
<td className="py-space-md px-space-lg">
<div className="flex items-center gap-space-sm">
<div className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-title-md shrink-0">
                    CO
                  </div>
<div className="flex flex-col min-w-0">
<span className="font-title-md text-title-md text-on-surface font-semibold truncate">Chinedu Okonkwo</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">EDV-2022-0198</span>
</div>
</div>
</td>
<td className="py-space-md px-space-md text-center">
<span className="px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">Pri 5B</span>
</td>
<td className="py-space-md px-space-sm text-right font-medium">15</td>
<td className="py-space-md px-space-sm text-right font-medium">15</td>
<td className="py-space-md px-space-sm text-right font-medium">19</td>
<td className="py-space-md px-space-sm text-right font-medium">48</td>
<td className="py-space-md px-space-md text-right">
<span className="font-title-md text-title-md text-primary font-bold">97%</span>
</td>
<td className="py-space-md px-space-sm text-center">
<span className="w-7 h-7 rounded-full inline-flex items-center justify-center font-bold font-title-md bg-secondary-fixed text-on-secondary-fixed">
                  A+
                </span>
</td>
<td className="py-space-md px-space-md">
<div className="flex flex-col">
<span className="inline-flex items-center gap-1 text-primary bg-primary-fixed/40 px-space-sm py-0.5 rounded-full font-label-sm text-label-sm w-max font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "" }}>check_circle</span>
<span className="">Formally Published</span>
</span>
<span className="text-[11px] text-on-surface-variant mt-0.5">Signed off by Head Teacher</span>
</div>
</td>
<td className="py-space-md px-space-lg text-right">
<div className="flex items-center justify-end gap-space-xs">
<button className="px-space-sm py-1 rounded bg-surface-container-low text-primary hover:bg-surface-container font-label-md text-label-md transition-colors flex items-center gap-1">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">badge</span>
<span className="">View Report Card</span>
</button>
<button onClick={() => handlePublishOrWithdraw("dddddddd-dddd-dddd-dddd-000000000001", "under_correction")} className="px-space-sm py-1 rounded bg-error/10 text-error hover:bg-error/20 font-label-md text-label-md transition-colors">
  Withdraw
</button>
</div>
</td>
</tr>
{/* Pupil 3: Amina Bello */}
<tr className="roster-row hover:bg-surface-container-low/60 transition-colors" data-status="awaiting">
<td className="py-space-md px-space-lg">
<div className="flex items-center gap-space-sm">
<div className="w-9 h-9 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-title-md shrink-0">
                    AB
                  </div>
<div className="flex flex-col min-w-0">
<span className="font-title-md text-title-md text-on-surface font-semibold truncate">Amina Bello</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">EDV-2025-0441</span>
</div>
</div>
</td>
<td className="py-space-md px-space-md text-center">
<span className="px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">Pri 2A</span>
</td>
<td className="py-space-md px-space-sm text-right font-medium">12</td>
<td className="py-space-md px-space-sm text-right font-medium">11</td>
<td className="py-space-md px-space-sm text-right font-medium">16</td>
<td className="py-space-md px-space-sm text-right font-medium">38</td>
<td className="py-space-md px-space-md text-right">
<span className="font-title-md text-title-md text-on-surface font-bold">77%</span>
</td>
<td className="py-space-md px-space-sm text-center">
<span className="w-7 h-7 rounded-full inline-flex items-center justify-center font-bold font-title-md bg-surface-container-highest text-on-surface">
                  B+
                </span>
</td>
<td className="py-space-md px-space-md">
<div className="flex flex-col">
<span className="inline-flex items-center gap-1 text-on-secondary-fixed bg-secondary-container px-space-sm py-0.5 rounded-full font-label-sm text-label-sm w-max font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">hourglass_top</span>
<span className="">Awaiting Review</span>
</span>
<span className="text-[11px] text-on-surface-variant mt-0.5">Submitted by Mrs. Bello (Pri 2)</span>
</div>
</td>
<td className="py-space-md px-space-lg text-right">
<div className="flex items-center justify-end gap-space-xs">
<button className="px-space-sm py-1 rounded bg-secondary text-on-secondary hover:bg-secondary/90 font-label-md text-label-md transition-colors shadow-sm">
                    Review &amp; Sign-Off
                  </button>
<button className="px-space-sm py-1 rounded bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors">
                    Edit Scores
                  </button>
</div>
</td>
</tr>
{/* Pupil 4: Kome Agbaje */}
<tr className="roster-row bg-surface-container-lowest hover:bg-surface-container-low/60 transition-colors" data-status="drafted">
<td className="py-space-md px-space-lg">
<div className="flex items-center gap-space-sm">
<div className="w-9 h-9 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center font-bold text-title-md shrink-0">
                    KA
                  </div>
<div className="flex flex-col min-w-0">
<span className="font-title-md text-title-md text-on-surface font-semibold truncate">Kome Agbaje</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">EDV-2023-0284</span>
</div>
</div>
</td>
<td className="py-space-md px-space-md text-center">
<span className="px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">Pri 4</span>
</td>
<td className="py-space-md px-space-sm text-right font-medium">13</td>
<td className="py-space-md px-space-sm text-right font-medium">14</td>
<td className="py-space-md px-space-sm text-right font-medium">17</td>
<td className="py-space-md px-space-sm text-right font-medium">42</td>
<td className="py-space-md px-space-md text-right">
<span className="font-title-md text-title-md text-primary font-bold">86%</span>
</td>
<td className="py-space-md px-space-sm text-center">
<span className="w-7 h-7 rounded-full inline-flex items-center justify-center font-bold font-title-md bg-primary-fixed text-on-primary-fixed">
                  A
                </span>
</td>
<td className="py-space-md px-space-md">
<div className="flex flex-col">
<span className="inline-flex items-center gap-1 text-on-surface-variant bg-surface-container-high px-space-sm py-0.5 rounded-full font-label-sm text-label-sm w-max">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">draw</span>
<span className="">Drafted</span>
</span>
<span className="text-[11px] text-on-surface-variant mt-0.5">Score compilation active</span>
</div>
</td>
<td className="py-space-md px-space-lg text-right">
<div className="flex items-center justify-end gap-space-xs">
<button className="px-space-sm py-1 rounded bg-surface-container-high text-primary hover:bg-surface-container font-label-md text-label-md transition-colors">
                    Audit Scores
                  </button>
<button className="px-space-sm py-1 rounded bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors">
                    Enter Remarks
                  </button>
</div>
</td>
</tr>
{/* Pupil 5: Efosa Nosa-Obahiagbon */}
<tr className="roster-row hover:bg-surface-container-low/60 transition-colors" data-status="published">
<td className="py-space-md px-space-lg">
<div className="flex items-center gap-space-sm">
<div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-title-md shrink-0">
                    EN
                  </div>
<div className="flex flex-col min-w-0">
<span className="font-title-md text-title-md text-on-surface font-semibold truncate">Efosa Nosa-Obahiagbon</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">EDV-2026-0511</span>
</div>
</div>
</td>
<td className="py-space-md px-space-md text-center">
<span className="px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">Pri 1C</span>
</td>
<td className="py-space-md px-space-sm text-right font-medium">14</td>
<td className="py-space-md px-space-sm text-right font-medium">13</td>
<td className="py-space-md px-space-sm text-right font-medium">18</td>
<td className="py-space-md px-space-sm text-right font-medium">45</td>
<td className="py-space-md px-space-md text-right">
<span className="font-title-md text-title-md text-primary font-bold">90%</span>
</td>
<td className="py-space-md px-space-sm text-center">
<span className="w-7 h-7 rounded-full inline-flex items-center justify-center font-bold font-title-md bg-secondary-fixed text-on-secondary-fixed">
                  A
                </span>
</td>
<td className="py-space-md px-space-md">
<div className="flex flex-col">
<span className="inline-flex items-center gap-1 text-primary bg-primary-fixed/40 px-space-sm py-0.5 rounded-full font-label-sm text-label-sm w-max font-semibold">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "" }}>check_circle</span>
<span className="">Formally Published</span>
</span>
<span className="text-[11px] text-on-surface-variant mt-0.5">Signed off by Head Teacher</span>
</div>
</td>
<td className="py-space-md px-space-lg text-right">
<div className="flex items-center justify-end gap-space-xs">
<button className="px-space-sm py-1 rounded bg-surface-container-low text-primary hover:bg-surface-container font-label-md text-label-md transition-colors flex items-center gap-1">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">badge</span>
<span className="">View Report Card</span>
</button>
<button onClick={() => handlePublishOrWithdraw("dddddddd-dddd-dddd-dddd-000000000001", "under_correction")} className="px-space-sm py-1 rounded bg-error/10 text-error hover:bg-error/20 font-label-md text-label-md transition-colors">
  Withdraw
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
{/* Pagination & Count Footer */}
<div className="p-space-md flex flex-col sm:flex-row items-center justify-between gap-space-md bg-surface-container-low/20">
<span className="font-body-sm text-body-sm text-on-surface-variant">Displaying 5 of 180 pupils · 2026/2027 First Term</span>
<div className="flex items-center gap-space-xs">
<button className="px-space-md py-1 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors disabled:opacity-40" disabled>
            Previous
          </button>
<span className="px-space-md py-1 font-label-md text-label-md bg-primary text-on-primary rounded-lg font-bold">1</span>
<button className="px-space-md py-1 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors">2</button>
<button className="px-space-md py-1 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors">3</button>
<button className="px-space-md py-1 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors">
            Next
          </button>
</div>
</div>
</div>
{/* Editorial Role Permission Notice & Academic Standards */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg mb-gutter">
{/* Role Permission Notice Callout */}
<div className="lg:col-span-2 p-space-lg rounded-xl bg-surface-container-low flex flex-col sm:flex-row gap-space-md items-start">
<div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
<span aria-hidden="true" className="material-symbols-outlined text-[24px]">policy</span>
</div>
<div className="flex flex-col gap-space-xs">
<span className="font-title-md text-title-md text-on-surface font-semibold">Role-Sensitive Access Control Architecture</span>
<p className="font-body-md text-body-md text-on-surface-variant">
            Classroom Teachers can draft scores and submit remarks. Only the Head Teacher / Admin can formally execute Publish and Withdraw operations. Bursars have read-only access to broadsheets.
          </p>
<div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
<span className="px-space-sm py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">Teachers: Draft &amp; Remark</span>
<span className="px-space-sm py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">Head Teacher: Audit &amp; Sign-Off</span>
<span className="px-space-sm py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">Admin: Formal Term Release</span>
</div>
</div>
</div>
{/* Nigerian Educational Standards & Verification Info */}
<div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-md">
<div className="flex flex-col gap-space-xs">
<div className="flex items-center gap-space-xs text-primary font-label-md text-label-md">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">verified_user</span>
<span className="">Accredited Assessment Matrix</span>
</div>
<span className="font-title-md text-title-md text-on-surface">Standard Grading Scale</span>
<p className="font-body-sm text-body-sm text-on-surface-variant">
            A+ (95-100%) · A (80-94%) · B+ (70-79%) · B (60-69%) · C (50-59%) · Fail (&lt;50%).
          </p>
</div>
<div className="flex items-center justify-between pt-space-sm text-on-surface-variant font-body-sm text-body-sm">
<span className="">Head Teacher Audit Token:</span>
<span className="font-label-sm text-label-sm text-primary font-mono bg-primary-fixed/40 px-space-xs py-0.5 rounded">HM-VERIFIED-2026</span>
</div>
</div>
</div>
</div>
{/* Interactive Head Teacher Audit / Publish Modal */}
{isPublishModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/40 backdrop-blur-sm">
    <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl p-space-lg shadow-xl flex flex-col gap-space-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-space-sm">
          <div className="w-10 h-10 rounded-lg bg-primary-fixed/40 flex items-center justify-center text-primary">
            <span aria-hidden="true" className="material-symbols-outlined text-[24px]">approval</span>
          </div>
          <div className="flex flex-col">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Head Teacher Assessment Audit</h3>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Terminal Verification &amp; Release</span>
          </div>
        </div>
        <button onClick={() => setIsPublishModalOpen(false)} aria-label="Close dialog" className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container">
          <span aria-hidden="true" className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
      <div className="p-space-md bg-surface-container-low rounded-lg flex flex-col gap-space-xs">
        <div className="flex justify-between items-center">
          <span className="font-body-md text-body-md text-on-surface-variant">Pupil Candidate:</span>
          <span className="font-title-md text-title-md text-on-surface font-semibold">{selectedPupilName}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-body-md text-body-md text-on-surface-variant">Aggregate Score:</span>
          <span className="font-title-md text-title-md text-primary font-bold">87.3% (Grade A Distinction)</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-body-md text-body-md text-on-surface-variant">Financial Verification:</span>
          <span className="font-label-sm text-label-sm text-primary font-semibold">Exempt (Dignity Policy Applies)</span>
        </div>
      </div>
      <div className="flex flex-col gap-space-xs">
        <label className="font-label-md text-label-md text-on-surface font-semibold">Head Teacher Remark</label>
        <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} className="w-full p-space-sm bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg resize-none placeholder:text-outline" rows={3} />
      </div>
      <div className="flex items-center justify-end gap-space-sm pt-space-xs">
        <button onClick={() => setIsPublishModalOpen(false)} className="px-space-md py-2 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors">
          Cancel
        </button>
        <button onClick={() => handlePublishOrWithdraw("dddddddd-dddd-dddd-dddd-000000000001", "published")} className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm flex items-center gap-space-xs">
          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">verified</span>
          <span>Sign-off &amp; Publish Report</span>
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}
