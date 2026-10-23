"use client";

import React from "react";
import Link from "next/link";
import { useStudentResultQuery, usePupilQuery } from "@/lib/query/hooks";

export default function StudentResultsPage() {
  const { data: result } = useStudentResultQuery("osasere-ehigiator");

  return (
    <div className="space-y-6">
      
<div className="p-8 max-w-7xl w-full mx-auto space-y-6">
{/* Page Title & Status Header */}
<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
<div>
<div className="flex items-center gap-2 mb-1.5">
<span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold tracking-wider uppercase">Published Academic Report</span>
<span className="text-on-surface-variant text-xs flex items-center gap-1 font-mono">
<span aria-hidden="true" className="material-symbols-outlined text-[14px] text-primary">lock</span>
              Archival Ref: EDV/2026/P3A/044
            </span>
</div>
<h1 className="font-headline-lg text-2xl lg:text-3xl font-extrabold text-primary tracking-tight">Pupil Academic Performance &amp; Evaluation</h1>
</div>
{/* Child Switcher Tab Pills & Term */}
<div className="flex flex-wrap items-center gap-3">
<div className="inline-flex p-1 rounded-xl bg-surface-container border border-outline-variant/30">
<button className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-surface-container-lowest text-primary shadow-sm text-xs font-semibold transition-all" id="tab-btn-osasere">
<span className="w-2 h-2 rounded-full bg-primary-container"></span>
<span className="">Osasere Ehigiator <span className="text-on-surface-variant font-normal">· Pri 3A</span></span>
</button>
<button className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface text-xs font-medium transition-all" id="tab-btn-efe">
<span className="w-2 h-2 rounded-full bg-outline-variant"></span>
<span className="">Efe Ehigiator <span className="text-on-surface-variant font-normal">· Nur 1B</span></span>
</button>
</div>
<div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface shadow-sm">
<span aria-hidden="true" className="material-symbols-outlined text-secondary text-[18px]">calendar_month</span>
<span className="text-xs text-primary font-bold">First Term (2026/2027)</span>
</div>
</div>
</div>
{/* Dignified School Standard Guarantee */}
<div className="rounded-2xl bg-surface-container-lowest p-4 lg:p-5 shadow-sm border border-outline-variant/30 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
<div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#14695D]"></div>
<div className="flex items-start gap-3 pl-2">
<div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shrink-0 text-primary">
<span aria-hidden="true" className="material-symbols-outlined text-[22px]">verified_user</span>
</div>
<div>
<h2 className="font-title-md text-sm font-bold text-primary tracking-tight">Dignified School Standard Guarantee</h2>
<p className="font-body-sm text-xs text-on-surface-variant mt-0.5 leading-relaxed">
              Academic records reflect pupil developmental growth and are never withheld because of school fee balances. Your child's official results are published below.
            </p>
</div>
</div>
<div className="shrink-0 flex items-center gap-2 pl-2 md:pl-0">
<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-fixed/40 text-on-secondary-fixed border border-secondary/20 text-xs">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="">Fee balance: <strong>₦50,000</strong> pending Tranche 2 — does not affect academic records</span>
<a className="ml-1 px-2 py-0.5 rounded-full bg-secondary text-white font-semibold text-[11px] hover:bg-secondary/90 transition-colors" href="/student/payments">Pay Balance</a>
</div>
</div>
</div>
{/* ================= CHILD 1: OSASERE EHIGIATOR (PRIMARY 3A) ================= */}
<div className="space-y-6" id="osasere-view">
{/* Pupil Profile Header & Summary Bento Cards */}
<div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30">
<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
{/* Pupil Info */}
<div className="flex items-center gap-4">
<div className="relative shrink-0">
<img  alt="Portrait of Osasere Ehigiator in dark green academy blazer" className="w-20 h-20 rounded-2xl object-cover ring-2 ring-primary/20 shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAK7E2_Fn0UFtrrs3QzyKVd8iHNWTu39G4CKb-wKi-yf-3jbdVsml4wUL28T9OW0fIVMFJchJ4DYj3EIip_QMW054MQyJrY4i43vypzzQUpr3N4fFIlhcvLQngZbIq-9kjF8D8VpBJe21H4_hUbkkd0XG1SzzdrjZAxDbM1DWiHNLRKR9FTMgX3I5N3OmbnH6-tGYcV8MGSqgLEqGplid4yHUWRGOJHJZ-437Qr963ntJ58azq1tiCp" />
<div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[11px] font-bold ring-2 ring-white shadow">
                  A
                </div>
</div>
<div>
<div className="flex items-center gap-1.5">
<h2 className="font-headline-md text-xl font-bold text-primary tracking-tight">Osasere Ehigiator</h2>
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]" title="Accredited Pupil">verified</span>
</div>
<p className="font-body-md text-xs text-on-surface-variant mt-0.5">
                  Class: <strong className="text-on-surface font-semibold">Primary 3A (St. Jude Arm)</strong> · Roll No: <strong className="text-on-surface font-semibold">019</strong>
</p>
<div className="flex items-center gap-3 mt-1.5 text-xs text-on-surface-variant">
<span className="">Class Size: <strong className="text-on-surface">32 Pupils</strong></span>
<span className="">•</span>
<span className="">Term Duration: <strong className="text-on-surface">13 Weeks</strong></span>
</div>
</div>
</div>
{/* Bento Summary Metrics */}
<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
{/* Metric 1 */}
<div className="bg-surface-container-low/70 border border-outline-variant/30 p-3.5 rounded-xl text-center flex flex-col justify-center min-w-[125px]">
<span className="text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant">Overall Average</span>
<span className="font-headline-lg text-[#14695D] text-2xl lg:text-3xl font-extrabold tracking-tight mt-1">87.3%</span>
<span className="text-[11px] text-secondary font-semibold mt-0.5">Top 10% Percentile</span>
</div>
{/* Metric 2 */}
<div className="bg-surface-container-low/70 border border-outline-variant/30 p-3.5 rounded-xl text-center flex flex-col justify-center min-w-[125px]">
<span className="text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant">Class Position</span>
<span className="font-headline-lg text-[#14695D] text-2xl lg:text-3xl font-extrabold tracking-tight mt-1">4th</span>
<span className="text-[11px] text-on-surface-variant mt-0.5">Out of 32 Pupils</span>
</div>
{/* Metric 3 */}
<div className="bg-surface-container-low/70 border border-outline-variant/30 p-3.5 rounded-xl text-center flex flex-col justify-center min-w-[125px]">
<span className="text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant">Overall Grade</span>
<span className="font-headline-lg text-secondary text-2xl lg:text-3xl font-extrabold tracking-tight mt-1">Distinction</span>
<span className="text-[11px] text-[#14695D] font-semibold mt-0.5">Grade A Honor</span>
</div>
{/* Metric 4 */}
<div className="bg-surface-container-low/70 border border-outline-variant/30 p-3.5 rounded-xl text-center flex flex-col justify-center min-w-[125px]">
<span className="text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant">Attendance</span>
<span className="font-headline-lg text-[#14695D] text-2xl lg:text-3xl font-extrabold tracking-tight mt-1">98%</span>
<span className="text-[11px] text-on-surface-variant mt-0.5">49 of 50 Sessions</span>
</div>
</div>
</div>
{/* Print & Export Action Header Bar */}
<div className="mt-6 pt-4 border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-4 bg-surface-container/40 px-4 py-3 rounded-xl">
<div className="flex items-center gap-2 text-xs text-on-surface-variant">
<span aria-hidden="true" className="material-symbols-outlined text-[#14695D] text-[18px]">verified</span>
<span className="">Published for 2026/2027 First Term · October 2026</span>
</div>
<div className="flex items-center gap-2.5">
<button className="px-3.5 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/40 text-on-surface text-xs font-semibold shadow-sm flex items-center gap-2 transition-colors">
<span aria-hidden="true" className="material-symbols-outlined text-[17px]">print</span>
<span className="">Print Report Sheet</span>
</button>
<button className="px-3.5 py-1.5 rounded-lg bg-[#14695D] hover:bg-[#0f544a] text-white text-xs font-semibold shadow-sm flex items-center gap-2 transition-colors">
<span aria-hidden="true" className="material-symbols-outlined text-[17px]">download</span>
<span className="">Download Official PDF</span>
</button>
</div>
</div>
</div>
{/* Cognitive Academic Evaluation (Continuous Assessment Breakdown) */}
<div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30 overflow-hidden">
<div className="flex items-center justify-between mb-5">
<div>
<h3 className="font-headline-sm text-lg font-bold text-primary tracking-tight">Cognitive Academic Evaluation</h3>
<p className="font-body-sm text-xs text-on-surface-variant">Continuous Assessment breakdown and comprehensive examination performance</p>
</div>
<span className="px-3 py-1 rounded-full bg-surface-container text-primary font-semibold text-xs border border-outline-variant/20">
              6 Accredited Subjects
            </span>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse min-w-[760px]">
<thead>
<tr className="bg-surface-container/70 text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
<th className="py-3 px-4 rounded-l-xl">Subject &amp; Instructor</th>
<th className="py-3 px-3 text-right">CA 1 (15%)</th>
<th className="py-3 px-3 text-right">CA 2 (15%)</th>
<th className="py-3 px-3 text-right">Mid-Term (20%)</th>
<th className="py-3 px-3 text-right">Exam (50%)</th>
<th className="py-3 px-4 text-right font-bold text-on-surface">Total (100%)</th>
<th className="py-3 px-3 text-center">Grade</th>
<th className="py-3 px-4 rounded-r-xl">Instructor Remark</th>
</tr>
</thead>
<tbody className="text-xs divide-y divide-outline-variant/20 text-on-surface">
{/* Subject 1: Mathematics */}
<tr className="hover:bg-surface-container-low/50 transition-colors">
<td className="py-3.5 px-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-lg bg-[#14695D]/10 text-[#14695D] flex items-center justify-center shrink-0">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">calculate</span>
</div>
<div>
<span className="font-bold text-on-surface block text-sm">Mathematics</span>
<span className="text-[11px] text-on-surface-variant">Lead: Mr. K. Adeleke</span>
</div>
</div>
</td>
<td className="py-3.5 px-3 text-right font-medium">14</td>
<td className="py-3.5 px-3 text-right font-medium">13</td>
<td className="py-3.5 px-3 text-right font-medium">18</td>
<td className="py-3.5 px-3 text-right font-medium">44</td>
<td className="py-3.5 px-4 text-right font-extrabold text-[#14695D] text-sm">89%</td>
<td className="py-3.5 px-3 text-center">
<span className="inline-block px-2.5 py-0.5 rounded-full bg-[#14695D] text-white text-[11px] font-bold">A</span>
</td>
<td className="py-3.5 px-4 text-on-surface-variant max-w-xs text-xs">
                    Exceptional problem-solving in mental arithmetic and fractions.
                  </td>
</tr>
{/* Subject 2: English Language & Diction */}
<tr className="hover:bg-surface-container-low/50 transition-colors">
<td className="py-3.5 px-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-lg bg-[#14695D]/10 text-[#14695D] flex items-center justify-center shrink-0">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">menu_book</span>
</div>
<div>
<span className="font-bold text-on-surface block text-sm">English Language &amp; Diction</span>
<span className="text-[11px] text-on-surface-variant">Lead: Mrs. I. Alabi</span>
</div>
</div>
</td>
<td className="py-3.5 px-3 text-right font-medium">13</td>
<td className="py-3.5 px-3 text-right font-medium">14</td>
<td className="py-3.5 px-3 text-right font-medium">17</td>
<td className="py-3.5 px-3 text-right font-medium">43</td>
<td className="py-3.5 px-4 text-right font-extrabold text-[#14695D] text-sm">87%</td>
<td className="py-3.5 px-3 text-center">
<span className="inline-block px-2.5 py-0.5 rounded-full bg-[#14695D] text-white text-[11px] font-bold">A</span>
</td>
<td className="py-3.5 px-4 text-on-surface-variant max-w-xs text-xs">
                    Strong reading comprehension; expressive creative writing.
                  </td>
</tr>
{/* Subject 3: Basic Science & Technology */}
<tr className="hover:bg-surface-container-low/50 transition-colors">
<td className="py-3.5 px-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-lg bg-[#14695D]/10 text-[#14695D] flex items-center justify-center shrink-0">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">biotech</span>
</div>
<div>
<span className="font-bold text-on-surface block text-sm">Basic Science &amp; Technology</span>
<span className="text-[11px] text-on-surface-variant">Lead: Dr. E. Bassey</span>
</div>
</div>
</td>
<td className="py-3.5 px-3 text-right font-medium">15</td>
<td className="py-3.5 px-3 text-right font-medium">14</td>
<td className="py-3.5 px-3 text-right font-medium">19</td>
<td className="py-3.5 px-3 text-right font-medium">45</td>
<td className="py-3.5 px-4 text-right font-extrabold text-[#14695D] text-sm">93%</td>
<td className="py-3.5 px-3 text-center">
<span className="inline-block px-2.5 py-0.5 rounded-full bg-secondary text-white text-[11px] font-bold">A+</span>
</td>
<td className="py-3.5 px-4 text-on-surface-variant max-w-xs text-xs">
                    Curious and methodical during laboratory science experiments.
                  </td>
</tr>
{/* Subject 4: Social Studies & Civic Education */}
<tr className="hover:bg-surface-container-low/50 transition-colors">
<td className="py-3.5 px-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-lg bg-[#14695D]/10 text-[#14695D] flex items-center justify-center shrink-0">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">public</span>
</div>
<div>
<span className="font-bold text-on-surface block text-sm">Social Studies &amp; Civic Education</span>
<span className="text-[11px] text-on-surface-variant">Lead: Mrs. C. Okeke</span>
</div>
</div>
</td>
<td className="py-3.5 px-3 text-right font-medium">12</td>
<td className="py-3.5 px-3 text-right font-medium">13</td>
<td className="py-3.5 px-3 text-right font-medium">16</td>
<td className="py-3.5 px-3 text-right font-medium">40</td>
<td className="py-3.5 px-4 text-right font-extrabold text-[#14695D] text-sm">81%</td>
<td className="py-3.5 px-3 text-center">
<span className="inline-block px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface text-[11px] font-bold">B+</span>
</td>
<td className="py-3.5 px-4 text-on-surface-variant max-w-xs text-xs">
                    Good grasp of national geography and community roles.
                  </td>
</tr>
{/* Subject 5: ICT & Digital Literacy */}
<tr className="hover:bg-surface-container-low/50 transition-colors">
<td className="py-3.5 px-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-lg bg-[#14695D]/10 text-[#14695D] flex items-center justify-center shrink-0">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">devices</span>
</div>
<div>
<span className="font-bold text-on-surface block text-sm">ICT &amp; Digital Literacy</span>
<span className="text-[11px] text-on-surface-variant">Lead: Mr. T. Balogun</span>
</div>
</div>
</td>
<td className="py-3.5 px-3 text-right font-medium">14</td>
<td className="py-3.5 px-3 text-right font-medium">14</td>
<td className="py-3.5 px-3 text-right font-medium">18</td>
<td className="py-3.5 px-3 text-right font-medium">46</td>
<td className="py-3.5 px-4 text-right font-extrabold text-[#14695D] text-sm">92%</td>
<td className="py-3.5 px-3 text-center">
<span className="inline-block px-2.5 py-0.5 rounded-full bg-secondary text-white text-[11px] font-bold">A+</span>
</td>
<td className="py-3.5 px-4 text-on-surface-variant max-w-xs text-xs">
                    Confident keyboarding and visual block logic.
                  </td>
</tr>
{/* Subject 6: Creative Arts & Cultural Expression */}
<tr className="hover:bg-surface-container-low/50 transition-colors">
<td className="py-3.5 px-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-lg bg-[#14695D]/10 text-[#14695D] flex items-center justify-center shrink-0">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">palette</span>
</div>
<div>
<span className="font-bold text-on-surface block text-sm">Creative Arts &amp; Cultural Expression</span>
<span className="text-[11px] text-on-surface-variant">Lead: Ms. E. Johnson</span>
</div>
</div>
</td>
<td className="py-3.5 px-3 text-right font-medium">13</td>
<td className="py-3.5 px-3 text-right font-medium">12</td>
<td className="py-3.5 px-3 text-right font-medium">15</td>
<td className="py-3.5 px-3 text-right font-medium">42</td>
<td className="py-3.5 px-4 text-right font-extrabold text-[#14695D] text-sm">82%</td>
<td className="py-3.5 px-3 text-center">
<span className="inline-block px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface text-[11px] font-bold">B+</span>
</td>
<td className="py-3.5 px-4 text-on-surface-variant max-w-xs text-xs">
                    Lively sense of color palette and pattern.
                  </td>
</tr>
</tbody>
</table>
</div>
{/* Academic Performance Benchmark & Visual Curve */}
<div className="mt-6 p-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-4">
<div className="space-y-1">
<span className="text-xs font-bold text-primary block">Class Grade Distribution Benchmark</span>
<p className="text-[11px] text-on-surface-variant">Pupil average (87.3%) compared with the class average (74.2%).</p>
</div>
{/* Distribution Marker Graphic */}
<div className="flex items-center gap-4 shrink-0">
<svg className="overflow-visible" fill="none" height="28" viewBox="0 0 140 28" width="140">
<rect className="fill-surface-container-highest" height="8" rx="4" width="140" x="0" y="10"></rect>
<rect className="fill-[#14695D]" height="8" rx="4" width="102" x="0" y="10"></rect>
{/* Class Median Marker */}
<line className="text-secondary stroke-current" stroke-width="2.5" x1="86" x2="86" y1="4" y2="24"></line>
</svg>
<div className="text-[11px] flex flex-col">
<span className="text-[#14695D] font-bold">87.3% (Osasere)</span>
<span className="text-secondary font-semibold">74.2% <span className="font-normal text-on-surface-variant">(Class Median)</span></span>
</div>
</div>
</div>
</div>
{/* Split Layout: Formative Rubrics & Endorsements */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
{/* Affective & Social Development Rubrics (5 cols) */}
<div className="lg:col-span-5 rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-2">
<h3 className="font-headline-sm text-base font-bold text-primary tracking-tight">Affective &amp; Social Development</h3>
<span aria-hidden="true" className="material-symbols-outlined text-secondary text-[22px]">psychology</span>
</div>
<p className="font-body-sm text-xs text-on-surface-variant mb-4">Formative evaluation observed across classroom conduct and peer interactions.</p>
<div className="space-y-2.5">
{/* Rubric 1 */}
<div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low/70 border border-outline-variant/20">
<div className="flex items-center gap-2.5">
<span aria-hidden="true" className="material-symbols-outlined text-[#14695D] text-[18px]">schedule</span>
<div>
<span className="text-xs font-bold text-on-surface block">Punctuality &amp; Regularity</span>
<span className="text-[11px] text-on-surface-variant">Arrives ahead of morning assembly</span>
</div>
</div>
<span className="px-2.5 py-0.5 rounded-full bg-[#14695D] text-white text-[11px] font-semibold">Excellent</span>
</div>
{/* Rubric 2 */}
<div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low/70 border border-outline-variant/20">
<div className="flex items-center gap-2.5">
<span aria-hidden="true" className="material-symbols-outlined text-[#14695D] text-[18px]">visibility</span>
<div>
<span className="text-xs font-bold text-on-surface block">Attentiveness &amp; Focus</span>
<span className="text-[11px] text-on-surface-variant">Sustains engaged participation</span>
</div>
</div>
<span className="px-2.5 py-0.5 rounded-full bg-[#14695D] text-white text-[11px] font-semibold">High</span>
</div>
{/* Rubric 3 */}
<div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low/70 border border-outline-variant/20">
<div className="flex items-center gap-2.5">
<span aria-hidden="true" className="material-symbols-outlined text-[#14695D] text-[18px]">self_improvement</span>
<div>
<span className="text-xs font-bold text-on-surface block">Neatness &amp; Comportment</span>
<span className="text-[11px] text-on-surface-variant">Takes pride in personal uniform &amp; books</span>
</div>
</div>
<span className="px-2.5 py-0.5 rounded-full bg-[#14695D] text-white text-[11px] font-semibold">Excellent</span>
</div>
{/* Rubric 4 */}
<div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low/70 border border-outline-variant/20">
<div className="flex items-center gap-2.5">
<span aria-hidden="true" className="material-symbols-outlined text-[#14695D] text-[18px]">groups</span>
<div>
<span className="text-xs font-bold text-on-surface block">Team Collaboration</span>
<span className="text-[11px] text-on-surface-variant">Cooperative during group projects</span>
</div>
</div>
<span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-semibold">Very Good</span>
</div>
</div>
</div>
<div className="mt-4 p-2.5 rounded-xl bg-surface-container text-on-surface-variant text-[11px] flex items-center gap-2">
<span aria-hidden="true" className="material-symbols-outlined text-[15px] text-[#14695D]">info</span>
<span className="">Evaluated weekly using developmental observational rubrics.</span>
</div>
</div>
{/* Institutional Certifications & Endorsements (7 cols) */}
<div className="lg:col-span-7 rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
<div className="space-y-4">
<div className="flex items-center justify-between">
<div>
<h3 className="font-headline-sm text-base font-bold text-primary tracking-tight">Teacher &amp; School Remarks</h3>
<p className="font-body-sm text-xs text-on-surface-variant">Remarks from the class teacher and school reviewer.</p>
</div>
<span className="px-2.5 py-0.5 rounded-full bg-[#14695D] text-white text-[11px] font-semibold">Formally Verified</span>
</div>
{/* Class Teacher Remark */}
<div className="p-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/20">
<div className="flex items-start gap-3.5">
<div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                    IA
                  </div>
<div className="flex-1">
<div className="flex items-center justify-between">
<span className="text-sm font-bold text-primary">Mrs. I. Alabi</span>
<span className="text-[11px] text-on-surface-variant">Class Teacher · Pri 3A</span>
</div>
<p className="text-xs text-on-surface mt-1.5 italic leading-relaxed">
                      “Osasere has demonstrated outstanding dedication, particularly in science and mathematics. Keep up the disciplined work ethic.”
                    </p>
<div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-on-surface-variant">
<span aria-hidden="true" className="material-symbols-outlined text-[#14695D] text-[15px]">done_all</span>
<span className="">Class Teacher Review · October 2026</span>
</div>
</div>
</div>
</div>
{/* Head Teacher Endorsement & Seal */}
<div className="p-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/20">
<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
<div className="flex items-start gap-3.5">
<div className="w-11 h-11 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-sm shrink-0">
                      MO
                    </div>
<div className="flex-1">
<div className="flex items-center justify-between">
<span className="text-sm font-bold text-primary">Dr. M. Ojo</span>
<span className="text-[11px] text-secondary font-semibold">Head Teacher</span>
</div>
<p className="text-xs text-on-surface mt-1.5 italic leading-relaxed">
                        “A commendable academic performance. Formally certified and released for parent portal publication.”
                      </p>
<div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-on-surface-variant">
<span aria-hidden="true" className="material-symbols-outlined text-[#14695D] text-[15px]">verified</span>
<span className="">School Review Complete · 2026/2027 First Term</span>
</div>
</div>
</div>
{/* Authentic School Seal */}
<div className="shrink-0 self-center sm:self-auto p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col items-center justify-center text-center w-28 h-28 shadow-sm">
<div className="w-8 h-8 rounded-full bg-[#14695D]/20 text-[#14695D] flex items-center justify-center mb-1">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">school</span>
</div>
<span className="text-[10px] font-extrabold text-primary tracking-tight uppercase leading-none">EDVORA ACADEMY</span>
<span className="text-[8px] font-bold text-secondary uppercase mt-0.5 tracking-wider">SEAL OF REGISTRY</span>
<span className="text-[8px] text-on-surface-variant font-medium mt-0.5">FIRST TERM · 2026</span>
</div>
</div>
</div>
</div>
{/* Footer Document Hash */}
<div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-on-surface-variant">
<span className="">Document Hash: <code className="text-primary font-mono font-semibold">0x9d4a...b72e</code></span>
<span className="">Edvora Unified School Records System</span>
</div>
</div>
</div>
</div>
{/* ================= CHILD 2: EFE EHIGIATOR (NURSERY 1B) ================= */}
<div className="hidden space-y-6" id="efe-view">
<div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30">
<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
<div className="flex items-center gap-4">
<div className="relative shrink-0">
<img  alt="Portrait of Efe Ehigiator in academy polo shirt" className="w-20 h-20 rounded-2xl object-cover ring-2 ring-secondary/30 shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHVS5cWXzTGmBDX0yqEoJC3hj8RsPlxXg2prVYb79rw-XxHHcWIXIGTWFtGf0GjSajcHt1g4B4jZPNs_Vs0ZZFLCPIN1EBb64OGYGnji4jBQo_h-daJhKx_ThW5u1fwJoZ8_u6I6HJC_uzygTC_3MHDb4ErpSeynIBVCiuT6mWAEt2ebOPh5DVeRaBzRWHkQlgxNUDGs7EBNPK9UwCwLI_i9aefU7EzFbhz2qownXrTcWSa1Bq8n0u" />
<div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center text-[11px] font-bold ring-2 ring-white shadow">
                  N
                </div>
</div>
<div>
<div className="flex items-center gap-1.5">
<h2 className="font-headline-md text-xl font-bold text-primary tracking-tight">Efe Ehigiator</h2>
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]">verified</span>
</div>
<p className="font-body-md text-xs text-on-surface-variant mt-0.5">
                  Class: <strong className="text-on-surface font-semibold">Nursery 1B (Acorn Early Years)</strong> · Roll No: <strong className="text-on-surface font-semibold">008</strong>
</p>
<div className="flex items-center gap-3 mt-1.5 text-xs text-on-surface-variant">
<span className="">Class Size: <strong className="text-on-surface">18 Pupils</strong></span>
<span className="">•</span>
<span className="">Early Years Foundation Stage (EYFS)</span>
</div>
</div>
</div>
<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
<div className="bg-surface-container-low/70 border border-outline-variant/30 p-3.5 rounded-xl text-center min-w-[125px]">
<span className="text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant">EYFS Milestone</span>
<span className="font-headline-lg text-[#14695D] text-2xl font-bold tracking-tight mt-1 block">Exceeding</span>
<span className="text-[11px] text-secondary font-semibold mt-0.5">Cognitive Growth</span>
</div>
<div className="bg-surface-container-low/70 border border-outline-variant/30 p-3.5 rounded-xl text-center min-w-[125px]">
<span className="text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant">Attendance</span>
<span className="font-headline-lg text-[#14695D] text-2xl font-bold tracking-tight mt-1 block">100%</span>
<span className="text-[11px] text-on-surface-variant mt-0.5">50 of 50 Sessions</span>
</div>
<div className="bg-surface-container-low/70 border border-outline-variant/30 p-3.5 rounded-xl text-center col-span-2 sm:col-span-1 min-w-[125px]">
<span className="text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant">Social Adaptation</span>
<span className="font-headline-lg text-[#14695D] text-2xl font-bold tracking-tight mt-1 block">Outstanding</span>
<span className="text-[11px] text-[#14695D] font-semibold mt-0.5">Peer Interaction</span>
</div>
</div>
</div>
{/* Nursery Rubrics */}
<div className="mt-6 pt-5 border-t border-outline-variant/20 space-y-4">
<h3 className="font-headline-sm text-base font-bold text-primary tracking-tight">Early Years Foundation Assessment</h3>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div className="p-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/20 space-y-1.5">
<div className="flex items-center justify-between">
<strong className="text-xs font-bold text-primary">Phonics &amp; Emergent Literacy</strong>
<span className="px-2 py-0.5 rounded-full bg-[#14695D] text-white text-[11px] font-semibold">Proficient</span>
</div>
<p className="text-xs text-on-surface-variant">Recognizes letter sounds /s/, /a/, /t/, /p/ and writes her first name with confidence.</p>
</div>
<div className="p-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/20 space-y-1.5">
<div className="flex items-center justify-between">
<strong className="text-xs font-bold text-primary">Numeracy &amp; Spatial Sorting</strong>
<span className="px-2 py-0.5 rounded-full bg-[#14695D] text-white text-[11px] font-semibold">Advanced</span>
</div>
<p className="text-xs text-on-surface-variant">Easily sorts objects by color, shape, and size; counts up to 30 unassisted.</p>
</div>
<div className="p-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/20 space-y-1.5">
<div className="flex items-center justify-between">
<strong className="text-xs font-bold text-primary">Fine &amp; Gross Motor Skills</strong>
<span className="px-2 py-0.5 rounded-full bg-[#14695D] text-white text-[11px] font-semibold">High Competence</span>
</div>
<p className="text-xs text-on-surface-variant">Skilled pencil tripod grip; active and balanced during physical movement play.</p>
</div>
<div className="p-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/20 space-y-1.5">
<div className="flex items-center justify-between">
<strong className="text-xs font-bold text-primary">Personal &amp; Emotional Expression</strong>
<span className="px-2 py-0.5 rounded-full bg-[#14695D] text-white text-[11px] font-semibold">Independent</span>
</div>
<p className="text-xs text-on-surface-variant">Articulates needs warmly, shares toys happily, and participates enthusiastically in nursery rhymes.</p>
</div>
</div>
<div className="flex items-center justify-end gap-3 pt-3">
<button className="px-3.5 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-on-surface text-xs font-semibold flex items-center gap-2 hover:bg-surface-container transition-colors">
<span aria-hidden="true" className="material-symbols-outlined text-[17px]">print</span>
<span className="">Print EYFS Profile</span>
</button>
<button className="px-3.5 py-1.5 rounded-lg bg-[#14695D] text-white text-xs font-semibold flex items-center gap-2 hover:bg-[#0f544a] transition-colors">
<span aria-hidden="true" className="material-symbols-outlined text-[17px]">download</span>
<span className="">Download EYFS Sheet</span>
</button>
</div>
</div>
</div>
</div>
</div>
{/* Portal Content Footer */}
<footer className="mt-auto border-t border-outline-variant/30 py-6 px-8 bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
<div className="flex items-center gap-2">
<span className="font-bold text-[#14695D]">edvora<span className="text-secondary">.</span></span>
<span className="">© 2026 Edvora Administrative Systems. All rights reserved.</span>
</div>
<div className="flex items-center gap-4">
<a className="hover:text-on-surface transition-colors" href="/support">Parent Help Desk</a>
<a className="hover:text-on-surface transition-colors" href="/terms-and-privacy">Terms &amp; Data Privacy</a>
</div>
</footer>

    </div>
  );
}
