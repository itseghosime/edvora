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

export default function PupilsManagementPage() {
  const { data: summary } = useSchoolSummaryQuery();
  const { data: pupils = [] } = usePupilsQuery();
  const { data: payments = [] } = usePaymentsQuery();

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    classId: "33333333-3333-3333-3333-000000000005",
    gender: "male" as "male" | "female",
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
  });

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setRegisterSuccess(null);

    const names = formData.fullName.trim().split(" ");
    const firstName = names[0] || "Pupil";
    const lastName = names.slice(1).join(" ") || "Enrolled";

    try {
      const res = await fetch("/api/pupils", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          classId: formData.classId,
          gender: formData.gender,
          guardianName: formData.guardianName,
          guardianPhone: formData.guardianPhone,
          guardianEmail: formData.guardianEmail || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setRegisterSuccess(`Pupil ${data.pupil.admissionNumber} enrolled successfully!`);
        setTimeout(() => {
          setIsRegisterOpen(false);
          setRegisterSuccess(null);
        }, 1200);
      } else {
        alert(data.error || "Failed to register pupil");
      }
    } catch {
      alert("Registration request failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col w-full">
{/* Top Headline & Administrative Metadata Bar */}
<section className="flex flex-col xl:flex-row xl:items-end justify-between gap-space-lg mb-space-lg">
<div className="flex flex-col gap-space-xs max-w-2xl">
<div className="flex items-center gap-space-sm mb-1">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-wider">
<span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          Registrar &amp; Bursary Rosters
        </span>
<span className="text-outline text-body-sm">·</span>
<span className="font-label-md text-label-md text-on-surface-variant font-normal">Active Term: 2026/2027 First Term</span>
</div>
<h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Pupils &amp; Guardians Directory</h1>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
        Manage enrollment credentials, class assignments, and linked legal guardians across Edvora Nursery & Primary School. Enforcing strict ward isolation and verified telecom links for all 180 pupils.
      </p>
</div>
{/* Quick Stats Bento Strip */}
<div className="grid grid-cols-3 gap-space-sm bg-surface-container-lowest p-space-sm rounded-2xl shadow-sm">
<div className="px-space-md py-space-sm rounded-xl bg-surface-container-low flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Total Active</span>
<span className="font-display-lg text-display-lg text-primary leading-none mt-1">180</span>
</div>
<div className="px-space-md py-space-sm rounded-xl bg-surface-container-low flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Cleared Fees</span>
<span className="font-currency-display text-currency-display text-on-surface leading-tight mt-1">114 <span className="font-label-sm text-label-sm text-outline font-normal">/ 180</span></span>
</div>
<div className="px-space-md py-space-sm rounded-xl bg-surface-container-low flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Telegram Alerts</span>
<span className="font-currency-display text-currency-display text-primary leading-tight mt-1">94%</span>
</div>
</div>
</section>
{/* Filter & Action Console Card */}
<section className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm mb-space-lg flex flex-col gap-space-md">
<div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
{/* Search Input Container */}
<div className="relative flex-1 min-w-0">
<span aria-hidden="true" className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">search</span>
<input className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md pl-11 pr-4 py-2.5 rounded-xl placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" id="pupilDirectorySearch" placeholder="Search by pupil name, admission number (e.g., EDV/2024/0042), or guardian phone..." type="text"/>
<div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
<span>⌘</span><span>K</span>
</div>
</div>
{/* Action Buttons */}
<div className="flex items-center gap-space-sm flex-shrink-0">
<button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg transition-colors" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">file_download</span>
<span>Export CSV</span>
</button>
<button onClick={() => setIsRegisterOpen(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg shadow-sm transition-all" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">person_add</span>
<span>Register New Pupil</span>
</button>
</div>
</div>
{/* Dropdown / Select Filter Controls Strip */}
<div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
<div className="flex items-center gap-2">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Class:</span>
<div className="relative">
<select className="appearance-none bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md pl-3 pr-8 py-1.5 rounded-lg focus:outline-none cursor-pointer transition-colors">
<option>All Classes (180)</option>
<option>Nursery 1 (22)</option>
<option>Nursery 2 (24)</option>
<option>Primary 1A (18)</option>
<option>Primary 1B (19)</option>
<option>Primary 2 (25)</option>
<option>Primary 3A (16)</option>
<option>Primary 3B (15)</option>
<option>Primary 4A (14)</option>
<option>Primary 4B (13)</option>
<option>Primary 5 (14)</option>
<option>Primary 6 (Prep / 10)</option>
</select>
<span aria-hidden="true" className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] text-outline pointer-events-none">arrow_drop_down</span>
</div>
</div>
<div className="flex items-center gap-2">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Fee Balance:</span>
<div className="relative">
<select className="appearance-none bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md pl-3 pr-8 py-1.5 rounded-lg focus:outline-none cursor-pointer transition-colors">
<option>All Statuses</option>
<option>Fully Paid (Cleared)</option>
<option>Partial Balance</option>
<option>Unpaid (Action Required)</option>
</select>
<span aria-hidden="true" className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] text-outline pointer-events-none">arrow_drop_down</span>
</div>
</div>
<div className="flex items-center gap-2">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Academic Report:</span>
<div className="relative">
<select className="appearance-none bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md pl-3 pr-8 py-1.5 rounded-lg focus:outline-none cursor-pointer transition-colors">
<option>All Statuses</option>
<option>Published</option>
<option>Review Pending</option>
<option>Draft</option>
</select>
<span aria-hidden="true" className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] text-outline pointer-events-none">arrow_drop_down</span>
</div>
</div>
<div className="flex items-center gap-2">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Guardian Link:</span>
<div className="relative">
<select className="appearance-none bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md pl-3 pr-8 py-1.5 rounded-lg focus:outline-none cursor-pointer transition-colors">
<option>All Comms Channels</option>
<option>Telegram Link Active</option>
<option>SMS Fallback Only</option>
<option>Needs Verification</option>
</select>
<span aria-hidden="true" className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] text-outline pointer-events-none">arrow_drop_down</span>
</div>
</div>
<button className="ml-auto inline-flex items-center gap-1 text-on-surface-variant hover:text-primary font-label-sm text-label-sm transition-colors py-1" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">restart_alt</span>
<span>Reset Filters</span>
</button>
</div>
</section>
{/* Pupils & Linked Guardians Table Container */}
<section className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden mb-space-lg">
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead>
<tr className="bg-surface-container-low text-on-surface font-label-md text-label-md uppercase tracking-wider">
<th className="py-3.5 px-space-lg font-semibold">Pupil Information</th>
<th className="py-3.5 px-space-md font-semibold">Class / Arm</th>
<th className="py-3.5 px-space-md font-semibold">Primary Legal Guardian</th>
<th className="py-3.5 px-space-md font-semibold">Term Plan &amp; Balance</th>
<th className="py-3.5 px-space-md font-semibold">Report Card</th>
<th className="py-3.5 px-space-lg font-semibold text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y-0 text-on-surface">
{/* Row 1: Chidubem Okafor */}
<tr className="hover:bg-surface-bright/70 transition-colors group">
<td className="py-4 px-space-lg">
<div className="flex items-center gap-space-md">
<div className="relative">
<img className="w-11 h-11 rounded-full object-cover flex-shrink-0 bg-surface-container" data- alt="Close-up portrait of a sharp 9-year-old Nigerian schoolboy wearing a dark green forest blazer with pristine white collar shirt in a sunlit classroom, confident smiling expression, photorealistic editorial school photography." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAim02RabWQugpzy3ydcrKFuRIlj0S9-zY91TDLjqL4mcgF9cLKdI4Qjjv1kaOdEpfMHGEaPhHDyphHeNaq6eJCCQAYVW9Fyoz3uUvjDL7aVMooSrVT-pekWFrBt2og1Wv69Lfxa-C9tJjx-9Fj7e_7qWqlf3YR6QFJy39zSoJYYNtLWVEiqz0t00hrSUc-8eO9y5pF62D45PLWhuTAYnr2ZzDtCyRF2qWtkkXHdf_J0WJwvzF6btkK"/>
<span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-primary ring-2 ring-surface-container-lowest" title="Active Enrollment"></span>
</div>
<div className="flex flex-col min-w-0">
<div className="flex items-center gap-2">
<span className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors truncate">Chidubem Okafor</span>
<span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium">Male</span>
</div>
<div className="flex items-center gap-2 mt-0.5">
<span className="font-label-sm text-label-sm font-semibold tracking-wide text-primary">EDV/2024/0042</span>
<span className="text-outline text-body-sm">·</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">DOB: 14 Oct 2015 (9 yrs)</span>
</div>
</div>
</div>
</td>
<td className="py-4 px-space-md">
<div className="flex flex-col">
<span className="font-label-lg text-label-lg text-on-surface">Primary 4B</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Curia House · Seat 14</span>
</div>
</td>
<td className="py-4 px-space-md">
<div className="flex flex-col max-w-xs">
<div className="flex items-center gap-1.5">
<span className="font-label-md text-label-md text-on-surface font-semibold truncate">Dr. Emeka Okafor</span>
<span className="font-label-sm text-label-sm text-outline-variant font-normal">(Father)</span>
</div>
<div className="flex items-center gap-2 mt-1">
<span className="font-body-sm text-body-sm text-on-surface-variant font-currency-cell tracking-tight">+234 803 219 4488</span>
<span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[12px] text-primary">chat</span>
<span>Telegram</span>
</span>
</div>
</div>
</td>
<td className="py-4 px-space-md">
<div className="flex flex-col">
<span className="font-body-sm text-body-sm text-on-surface-variant">Standard Day (₦120,000)</span>
<div className="flex items-center gap-2 mt-0.5">
<span className="font-currency-cell text-currency-cell text-secondary font-bold">₦50,000.00</span>
<span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
                    Partial Balance
                  </span>
</div>
</div>
</td>
<td className="py-4 px-space-md">
<div className="flex flex-col items-start gap-1">
<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[13px] text-primary">verified</span>
<span>Published</span>
</span>
<span className="font-body-sm text-body-sm text-outline">T1 Final · T2 Mid-term</span>
</div>
</td>
<td className="py-4 px-space-lg text-right">
<div className="flex items-center justify-end gap-1.5">
<button aria-label="View fee account" className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" title="View Pupil Fee Ledger" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[19px]">account_balance_wallet</span>
</button>
<button aria-label="View results" className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" title="Academic Report &amp; Marks" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[19px]">assignment_turned_in</span>
</button>
<button aria-label="More options" className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors" title="More actions" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[19px]">more_vert</span>
</button>
</div>
</td>
</tr>
{/* Row 2: Amara Okafor (Sibling to Chidubem) */}
<tr className="hover:bg-surface-bright/70 transition-colors group bg-surface-container-low/20">
<td className="py-4 px-space-lg">
<div className="flex items-center gap-space-md">
<div className="relative">
<img className="w-11 h-11 rounded-full object-cover flex-shrink-0 bg-surface-container" data- alt="Editorial portrait of a 4-year-old Nigerian nursery girl with neatly styled braided hair, wearing a forest green checked school apron uniform, soft morning natural light in an early childhood activity room." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQgWSrl7mzLFunAXRXpI3gWfV9gL8rfS6rd_7J1Ed2FvXib4Mcit8BQoILueHaw1P3WRtzrk5b2rI8c6e3tzq0AiMwYVgQYpGZNQwU6GW99MzqwmJigiJouVrCCw4mFekMWIcUK1m5PwcDLiyhqcRpFEhEB2UiGYUzt3PBZ3A_JglaiAV0-z5jSyv1OKdjPPNenH-HhIe4ifkJo2dHCNggf59ieTS6pfyVku8ssaci5pUVl7PbQUiJ"/>
<span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-primary ring-2 ring-surface-container-lowest" title="Active Enrollment"></span>
</div>
<div className="flex flex-col min-w-0">
<div className="flex items-center gap-2">
<span className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors truncate">Amara Okafor</span>
<span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium">Female</span>
</div>
<div className="flex items-center gap-2 mt-0.5">
<span className="font-label-sm text-label-sm font-semibold tracking-wide text-primary">EDV/2025/0118</span>
<span className="text-outline text-body-sm">·</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">DOB: 02 Mar 2020 (4 yrs)</span>
</div>
</div>
</div>
</td>
<td className="py-4 px-space-md">
<div className="flex flex-col">
<span className="font-label-lg text-label-lg text-on-surface">Nursery 2</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Early Years Pod A</span>
</div>
</td>
<td className="py-4 px-space-md">
<div className="flex flex-col max-w-xs">
<div className="flex items-center gap-1.5">
<span className="font-label-md text-label-md text-on-surface font-semibold truncate">Dr. Emeka Okafor</span>
<span className="font-label-sm text-label-sm text-outline-variant font-normal">(Father)</span>
</div>
<div className="flex items-center gap-2 mt-1">
<span className="font-body-sm text-body-sm text-on-surface-variant font-currency-cell tracking-tight">+234 803 219 4488</span>
<span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[12px] text-primary">chat</span>
<span>Telegram</span>
</span>
</div>
</div>
</td>
<td className="py-4 px-space-md">
<div className="flex flex-col">
<span className="font-body-sm text-body-sm text-on-surface-variant">Early Years (₦95,000)</span>
<div className="flex items-center gap-2 mt-0.5">
<span className="font-currency-cell text-currency-cell text-primary font-bold">₦0.00</span>
<span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm">
                    Fully Cleared
                  </span>
</div>
</div>
</td>
<td className="py-4 px-space-md">
<div className="flex flex-col items-start gap-1">
<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[13px] text-primary">verified</span>
<span>Published</span>
</span>
<span className="font-body-sm text-body-sm text-outline">Observations up to date</span>
</div>
</td>
<td className="py-4 px-space-lg text-right">
<div className="flex items-center justify-end gap-1.5">
<button aria-label="View fee account" className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" title="View Pupil Fee Ledger" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[19px]">account_balance_wallet</span>
</button>
<button aria-label="View results" className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" title="Academic Report &amp; Marks" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[19px]">assignment_turned_in</span>
</button>
<button aria-label="More options" className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors" title="More actions" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[19px]">more_vert</span>
</button>
</div>
</td>
</tr>
{/* Row 3: Osasere Enahoro */}
<tr className="hover:bg-surface-bright/70 transition-colors group">
<td className="py-4 px-space-lg">
<div className="flex items-center gap-space-md">
<div className="relative">
<img className="w-11 h-11 rounded-full object-cover flex-shrink-0 bg-surface-container" data- alt="Dignified close portrait of an 11-year-old Nigerian female primary graduate candidate pupil wearing neat bottle green tie and school blazer in Benin City school setting, natural illumination, polished editorial." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyNxAPkN-EPhFaQvkmzmsXGwCEO5Rrnanau6oTKxTVqLivoCXQfVU_ifqDRkGoMM5_N8hu_8eGv2EmZmVtnchmDrzE2KFY1CFBuguvRLtq-m9rylcjempMBfeQ1cANXmtJzu2gDXf9Znek3GWKLCl72ZGHxiUhXK0caTmJPyYtG4UqtNGxeVZKAJAms68op6WxQHXNfYgGAT9j_Pq_4NnFYgsImK0xz020PPhq12sYVaSUfj6PEbTT"/>
<span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-primary ring-2 ring-surface-container-lowest" title="Active Enrollment"></span>
</div>
<div className="flex flex-col min-w-0">
<div className="flex items-center gap-2">
<span className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors truncate">Osasere Enahoro</span>
<span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium">Female</span>
</div>
<div className="flex items-center gap-2 mt-0.5">
<span className="font-label-sm text-label-sm font-semibold tracking-wide text-primary">EDV/2024/0015</span>
<span className="text-outline text-body-sm">·</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">DOB: 19 Jun 2013 (11 yrs)</span>
</div>
</div>
</div>
</td>
<td className="py-4 px-space-md">
<div className="flex flex-col">
<span className="font-label-lg text-label-lg text-on-surface">Primary 6</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Common Entrance Track</span>
</div>
</td>
<td className="py-4 px-space-md">
<div className="flex flex-col max-w-xs">
<div className="flex items-center gap-1.5">
<span className="font-label-md text-label-md text-on-surface font-semibold truncate">Mrs. Adesua Enahoro</span>
<span className="font-label-sm text-label-sm text-outline-variant font-normal">(Mother)</span>
</div>
<div className="flex items-center gap-2 mt-1">
<span className="font-body-sm text-body-sm text-on-surface-variant font-currency-cell tracking-tight">+234 802 884 1120</span>
<span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[12px]">sms</span>
<span>SMS Only</span>
</span>
</div>
</div>
</td>
<td className="py-4 px-space-md">
<div className="flex flex-col">
<span className="font-body-sm text-body-sm text-on-surface-variant">Primary Final Year (₦135,000)</span>
<div className="flex items-center gap-2 mt-0.5">
<span className="font-currency-cell text-currency-cell text-primary font-bold">₦0.00</span>
<span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm">
                    Fully Cleared
                  </span>
</div>
</div>
</td>
<td className="py-4 px-space-md">
<div className="flex flex-col items-start gap-1">
<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[13px] text-primary">verified</span>
<span>Published</span>
</span>
<span className="font-body-sm text-body-sm text-outline">Distinction Merit</span>
</div>
</td>
<td className="py-4 px-space-lg text-right">
<div className="flex items-center justify-end gap-1.5">
<button aria-label="View fee account" className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" title="View Pupil Fee Ledger" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[19px]">account_balance_wallet</span>
</button>
<button aria-label="View results" className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" title="Academic Report &amp; Marks" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[19px]">assignment_turned_in</span>
</button>
<button aria-label="More options" className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors" title="More actions" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[19px]">more_vert</span>
</button>
</div>
</td>
</tr>
{/* Row 4: Tega Oghenekaro */}
<tr className="hover:bg-surface-bright/70 transition-colors group">
<td className="py-4 px-space-lg">
<div className="flex items-center gap-space-md">
<div className="relative">
<img className="w-11 h-11 rounded-full object-cover flex-shrink-0 bg-surface-container" data- alt="Authentic portrait of an 8-year-old Nigerian boy student wearing smart school uniform pullover, cheerful eyes, seated in bright modern library setting, warm wood background tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQRDnDQvNoLO_Xlzb2MF6EvHayjxmh3BOOjgY0vTN-BGWBilSacAoCB24XqBRw5O6tFg7YrWV3BM--fucOmtzk33-sCyYImLwJ2kSVTwjapiIF0CHhFPDsqmyACrQ6qhn65kNLbY-WMZYFiaLgOUnIxxHRzpUmoHqjnYKcQMotqWe3Dh279bSM3RXmgFc4tD-3x7Wdsa3M7y7mlRfHPQBvLvGRUe13B_of8O4Z78l2evCNY_J2HYTS"/>
<span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-primary ring-2 ring-surface-container-lowest" title="Active Enrollment"></span>
</div>
<div className="flex flex-col min-w-0">
<div className="flex items-center gap-2">
<span className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors truncate">Tega Oghenekaro</span>
<span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium">Male</span>
</div>
<div className="flex items-center gap-2 mt-0.5">
<span className="font-label-sm text-label-sm font-semibold tracking-wide text-primary">EDV/2024/0079</span>
<span className="text-outline text-body-sm">·</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">DOB: 11 Nov 2016 (8 yrs)</span>
</div>
</div>
</div>
</td>
<td className="py-4 px-space-md">
<div className="flex flex-col">
<span className="font-label-lg text-label-lg text-on-surface">Primary 3A</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Ovonramwen House</span>
</div>
</td>
<td className="py-4 px-space-md">
<div className="flex flex-col max-w-xs">
<div className="flex items-center gap-1.5">
<span className="font-label-md text-label-md text-on-surface font-semibold truncate">Mr. Oghenekaro Victor</span>
<span className="font-label-sm text-label-sm text-outline-variant font-normal">(Uncle/Guardian)</span>
</div>
<div className="flex items-center gap-2 mt-1">
<span className="font-body-sm text-body-sm text-on-surface-variant font-currency-cell tracking-tight">+234 805 400 9931</span>
<span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[12px] text-primary">chat</span>
<span>Telegram</span>
</span>
</div>
</div>
</td>
<td className="py-4 px-space-md">
<div className="flex flex-col">
<span className="font-body-sm text-body-sm text-on-surface-variant">Standard Day (₦120,000)</span>
<div className="flex items-center gap-2 mt-0.5">
<span className="font-currency-cell text-currency-cell text-secondary font-bold">₦60,000.00</span>
<span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
                    Partial Balance
                  </span>
</div>
</div>
</td>
<td className="py-4 px-space-md">
<div className="flex flex-col items-start gap-1">
<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[13px] text-secondary">pending_actions</span>
<span>In Review</span>
</span>
<span className="font-body-sm text-body-sm text-outline">Class Teacher Grading</span>
</div>
</td>
<td className="py-4 px-space-lg text-right">
<div className="flex items-center justify-end gap-1.5">
<button aria-label="View fee account" className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" title="View Pupil Fee Ledger" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[19px]">account_balance_wallet</span>
</button>
<button aria-label="View results" className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" title="Academic Report &amp; Marks" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[19px]">assignment_turned_in</span>
</button>
<button aria-label="More options" className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors" title="More actions" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[19px]">more_vert</span>
</button>
</div>
</td>
</tr>
{/* Row 5: Ifeoma Nnamdi */}
<tr className="hover:bg-surface-bright/70 transition-colors group">
<td className="py-4 px-space-lg">
<div className="flex items-center gap-space-md">
<div className="relative">
<img className="w-11 h-11 rounded-full object-cover flex-shrink-0 bg-surface-container" data- alt="Thoughtful Nigerian schoolgirl aged 9 with short neat hair wearing dark green primary academy uniform with gold emblem patch, natural warm daylight, high detail studio school photograph." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOod9Yj2UOFm8pt7ssYhdxAety_F8cnDpDe0Wr4itEjVDkEbTniJClf-G2_ErPwmY6ulYgd4MBuPnzCjNNTfr8006v_3IedY6d_4sPLuP2dDlr_gSIYBXh0XNCmb_pjRj7rRAZKsAcNTwvMjWknZk_5nvx4JHWi4ubGGkF56IyT_B_m_gkovka8wikiYDmidSbR9oFvCWCiN3Slxl8UKS69Kwfe9V6ymh2dpuYvKrfukUgKA0kD3fJ"/>
<span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-primary ring-2 ring-surface-container-lowest" title="Active Enrollment"></span>
</div>
<div className="flex flex-col min-w-0">
<div className="flex items-center gap-2">
<span className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors truncate">Ifeoma Nnamdi</span>
<span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium">Female</span>
</div>
<div className="flex items-center gap-2 mt-0.5">
<span className="font-label-sm text-label-sm font-semibold tracking-wide text-primary">EDV/2024/0055</span>
<span className="text-outline text-body-sm">·</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">DOB: 28 Jan 2015 (9 yrs)</span>
</div>
</div>
</div>
</td>
<td className="py-4 px-space-md">
<div className="flex flex-col">
<span className="font-label-lg text-label-lg text-on-surface">Primary 4A</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Idia House · Seat 09</span>
</div>
</td>
<td className="py-4 px-space-md">
<div className="flex flex-col max-w-xs">
<div className="flex items-center gap-1.5">
<span className="font-label-md text-label-md text-on-surface font-semibold truncate">Pastor Godwin Nnamdi</span>
<span className="font-label-sm text-label-sm text-outline-variant font-normal">(Father)</span>
</div>
<div className="flex items-center gap-2 mt-1">
<span className="font-body-sm text-body-sm text-on-surface-variant font-currency-cell tracking-tight">+234 803 771 2005</span>
<span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[12px] text-primary">chat</span>
<span>Telegram</span>
</span>
</div>
</div>
</td>
<td className="py-4 px-space-md">
<div className="flex flex-col">
<span className="font-body-sm text-body-sm text-on-surface-variant">Standard Day (₦120,000)</span>
<div className="flex items-center gap-2 mt-0.5">
<span className="font-currency-cell text-currency-cell text-error font-bold">₦120,000.00</span>
<span className="inline-flex items-center px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm">
                    Unpaid
                  </span>
</div>
</div>
</td>
<td className="py-4 px-space-md">
<div className="flex flex-col items-start gap-1">
<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[13px] text-primary">verified</span>
<span>Published</span>
</span>
<span className="font-body-sm text-body-sm text-outline">Released to Portal</span>
</div>
</td>
<td className="py-4 px-space-lg text-right">
<div className="flex items-center justify-end gap-1.5">
<button aria-label="Send reminder" className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-error transition-colors" title="Issue Immediate Tuition Reminder" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[19px]">forward_to_inbox</span>
</button>
<button aria-label="View fee account" className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" title="View Pupil Fee Ledger" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[19px]">account_balance_wallet</span>
</button>
<button aria-label="More options" className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors" title="More actions" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[19px]">more_vert</span>
</button>
</div>
</td>
</tr>
{/* Row 6: Kelvin Osagie */}
<tr className="hover:bg-surface-bright/70 transition-colors group">
<td className="py-4 px-space-lg">
<div className="flex items-center gap-space-md">
<div className="relative">
<img className="w-11 h-11 rounded-full object-cover flex-shrink-0 bg-surface-container" data- alt="Editorial headshot of an energetic 10-year-old Nigerian pupil boy in neat dark green academic sweater, sharp lighting, confident look, educational studio portrait." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEYxNZyKtqizM5n7tM0ypB0CgJl3pvgNVHSUfgqYNhq4O9f-QyO0Hp9-vxuJL6ocCFJ0nM7WTPRj5G6fmZKYHF7zZnjiq0YrinCLzvScKohUHhIZwNOkPPIgkHFSMLk08GmL2eMu74rSSvfyBBCGFq6s9lzoxAXYSkhUdRe4SVlAMzVAaKxra-5fkXuomNre4EBmpHPbCDWcu2u__HW4AgcDXwXAayRe3-qM9gf4LUNGl9w3u710a5"/>
<span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-primary ring-2 ring-surface-container-lowest" title="Active Enrollment"></span>
</div>
<div className="flex flex-col min-w-0">
<div className="flex items-center gap-2">
<span className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors truncate">Kelvin Osagie</span>
<span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium">Male</span>
</div>
<div className="flex items-center gap-2 mt-0.5">
<span className="font-label-sm text-label-sm font-semibold tracking-wide text-primary">EDV/2024/0008</span>
<span className="text-outline text-body-sm">·</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">DOB: 17 Aug 2014 (10 yrs)</span>
</div>
</div>
</div>
</td>
<td className="py-4 px-space-md">
<div className="flex flex-col">
<span className="font-label-lg text-label-lg text-on-surface">Primary 5</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Eweka House · Seat 04</span>
</div>
</td>
<td className="py-4 px-space-md">
<div className="flex flex-col max-w-xs">
<div className="flex items-center gap-1.5">
<span className="font-label-md text-label-md text-on-surface font-semibold truncate">Barr. (Mrs.) Osagie</span>
<span className="font-label-sm text-label-sm text-outline-variant font-normal">(Mother)</span>
</div>
<div className="flex items-center gap-2 mt-1">
<span className="font-body-sm text-body-sm text-on-surface-variant font-currency-cell tracking-tight">+234 802 119 8834</span>
<span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[12px] text-primary">chat</span>
<span>Telegram</span>
</span>
</div>
</div>
</td>
<td className="py-4 px-space-md">
<div className="flex flex-col">
<span className="font-body-sm text-body-sm text-on-surface-variant">Standard Day (₦120,000)</span>
<div className="flex items-center gap-2 mt-0.5">
<span className="font-currency-cell text-currency-cell text-secondary font-bold">₦30,000.00</span>
<span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
                    Partial Balance
                  </span>
</div>
</div>
</td>
<td className="py-4 px-space-md">
<div className="flex flex-col items-start gap-1">
<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[13px] text-secondary">pending_actions</span>
<span>In Review</span>
</span>
<span className="font-body-sm text-body-sm text-outline">Pending Math Moderation</span>
</div>
</td>
<td className="py-4 px-space-lg text-right">
<div className="flex items-center justify-end gap-1.5">
<button aria-label="View fee account" className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" title="View Pupil Fee Ledger" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[19px]">account_balance_wallet</span>
</button>
<button aria-label="View results" className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" title="Academic Report &amp; Marks" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[19px]">assignment_turned_in</span>
</button>
<button aria-label="More options" className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors" title="More actions" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[19px]">more_vert</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
{/* Pagination & Audit Footer */}
<div className="px-space-lg py-4 bg-surface-container-low/60 flex flex-col md:flex-row items-center justify-between gap-space-md">
<div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
<span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
<span>Showing <strong className="text-on-surface font-semibold">1–6</strong> of <strong className="text-on-surface font-semibold">180</strong> pupils</span>
<span className="text-outline">·</span>
<span className="hidden sm:inline">180 linked guardians verified</span>
<span className="text-outline hidden sm:inline">·</span>
<span className="hidden lg:inline text-primary font-medium">Strict parent ward isolation active</span>
</div>
{/* Page Controls */}
<div className="flex items-center gap-1.5">
<button className="px-2.5 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface disabled:opacity-40 transition-colors font-label-md text-label-md flex items-center" disabled type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">chevron_left</span>
<span className="hidden sm:inline ml-1">Prev</span>
</button>
<button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center shadow-xs" type="button">
          1
        </button>
<button className="w-8 h-8 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center transition-colors" type="button">
          2
        </button>
<button className="w-8 h-8 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center transition-colors" type="button">
          3
        </button>
<span className="px-1 text-outline font-label-md text-label-md">...</span>
<button className="w-8 h-8 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center transition-colors" type="button">
          30
        </button>
<button className="px-2.5 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface transition-colors font-label-md text-label-md flex items-center" type="button">
<span className="hidden sm:inline mr-1">Next</span>
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">chevron_right</span>
</button>
</div>
</div>
</section>
{/* Bento Governance Grid: Security Rule & Quick Enrollment Telemetry */}
<section className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg mb-space-lg">
{/* Guardian Linking Mandate Card */}
<div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm relative overflow-hidden flex flex-col justify-between">
<div className="flex items-start gap-space-md">
<div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center flex-shrink-0">
<span aria-hidden="true" className="material-symbols-outlined text-[26px] text-primary">policy</span>
</div>
<div className="flex flex-col gap-1">
<div className="flex items-center gap-2">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Guardian Linking Protocol &amp; Privacy Isolation</h3>
<span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm uppercase tracking-wide">Strict Compliance</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Every pupil record must have at least one verified primary Nigerian telecom MSISDN (+234) for terminal report access tokens and Paystack settlement receipts. Incoming unstructured chat messages are never accepted.
          </p>
</div>
</div>
<div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md mt-space-lg pt-space-md bg-surface-container-low rounded-xl p-space-md">
<div className="flex items-center gap-2.5">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]">shield</span>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Ward Separation</span>
<span className="font-label-md text-label-md text-on-surface font-semibold">100% Cryptographic</span>
</div>
</div>
<div className="flex items-center gap-2.5">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]">notifications_active</span>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Outbound Channel</span>
<span className="font-label-md text-label-md text-on-surface font-semibold">Automated Webhook Only</span>
</div>
</div>
<div className="flex items-center gap-2.5">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]">receipt</span>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Paystack Webhook</span>
<span className="font-label-md text-label-md text-on-surface font-semibold">Realtime Reconciled</span>
</div>
</div>
</div>
</div>
{/* Quick Class Distribution Visual Card */}
<div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="font-headline-sm text-headline-sm text-on-surface">Class Roster Split</span>
<span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">12 Sections</span>
</div>
<div className="my-space-md flex flex-col gap-2.5">
<div className="flex flex-col gap-1">
<div className="flex justify-between font-label-sm text-label-sm">
<span className="text-on-surface">Early Years (Nursery 1 &amp; 2)</span>
<span className="font-semibold text-primary">46 Pupils (25%)</span>
</div>
<div className="h-2 w-full bg-surface-container-low rounded-full overflow-hidden">
<div className="h-full bg-primary rounded-full" style={{}}></div>
</div>
</div>
<div className="flex flex-col gap-1">
<div className="flex justify-between font-label-sm text-label-sm">
<span className="text-on-surface">Lower Primary (P1 — P3)</span>
<span className="font-semibold text-primary">68 Pupils (38%)</span>
</div>
<div className="h-2 w-full bg-surface-container-low rounded-full overflow-hidden">
<div className="h-full bg-primary-container rounded-full" style={{}}></div>
</div>
</div>
<div className="flex flex-col gap-1">
<div className="flex justify-between font-label-sm text-label-sm">
<span className="text-on-surface">Upper Primary (P4 — P6)</span>
<span className="font-semibold text-primary">66 Pupils (37%)</span>
</div>
<div className="h-2 w-full bg-surface-container-low rounded-full overflow-hidden">
<div className="h-full bg-secondary rounded-full" style={{}}></div>
</div>
</div>
</div>
<div className="flex items-center justify-between pt-2">
<span className="font-body-sm text-body-sm text-on-surface-variant">Class Average: 15 pupils/arm</span>
<button className="text-primary hover:underline font-label-md text-label-md flex items-center gap-1" type="button">
<span>Manage Arms</span>
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">arrow_forward</span>
</button>
</div>
</div>
</section>
{/* Slide-out Pupil Details / Ledger Side Drawer (Interactive Prototype) */}
<div className="fixed inset-0 z-50 pointer-events-none transition-opacity duration-300 opacity-0 bg-inverse-surface/40 backdrop-blur-xs flex justify-end" id="pupilQuickDrawer">
<div className="w-full max-w-lg bg-surface-container-lowest h-full shadow-2xl p-space-lg flex flex-col justify-between overflow-y-auto transform translate-x-full transition-transform duration-300 pointer-events-auto" id="drawerContainer">
<div className="flex flex-col gap-space-lg">
{/* Drawer Header */}
<div className="flex items-center justify-between pb-space-sm border-b-0">
<div className="flex items-center gap-space-sm">
<div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
<span aria-hidden="true" className="material-symbols-outlined">badge</span>
</div>
<div className="flex flex-col">
<span className="font-headline-sm text-headline-sm text-on-surface" id="drawerPupilName">Chidubem Okafor</span>
<span className="font-label-sm text-label-sm text-primary font-semibold" id="drawerPupilID">EDV/2024/0042</span>
</div>
</div>
<button aria-label="Close dialog" className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
{/* Pupil & Guardian Profile Highlights */}
<div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Current Class</span>
<span className="font-label-md text-label-md text-on-surface font-semibold" id="drawerPupilClass">Primary 4B</span>
</div>
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Designated Guardian</span>
<span className="font-label-md text-label-md text-on-surface font-semibold" id="drawerGuardianName">Dr. Emeka Okafor</span>
</div>
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Outstanding Tuition</span>
<span className="font-currency-display text-currency-display text-secondary" id="drawerPupilBalance">₦50,000.00</span>
</div>
</div>
{/* Ledger Snapshot for Selected Pupil */}
<div className="flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<h4 className="font-label-lg text-label-lg text-on-surface">Term 2 Ledger Entries</h4>
<span className="font-label-sm text-label-sm text-primary font-semibold">Paystack Verified</span>
</div>
<div className="space-y-2">
<div className="p-3 rounded-lg bg-surface-bright flex items-center justify-between">
<div className="flex flex-col">
<span className="font-label-md text-label-md text-on-surface">Tuition Tranche 1 (Bank Transfer)</span>
<span className="font-body-sm text-body-sm text-outline">12 Jan 2025 · Ref: PST-09827411</span>
</div>
<span className="font-currency-cell text-currency-cell text-primary">₦70,000.00</span>
</div>
<div className="p-3 rounded-lg bg-surface-bright flex items-center justify-between">
<div className="flex flex-col">
<span className="font-label-md text-label-md text-on-surface">PTA Levy &amp; Learning Pack</span>
<span className="font-body-sm text-body-sm text-outline">12 Jan 2025 · Ref: PST-09827412</span>
</div>
<span className="font-currency-cell text-currency-cell text-primary">₦25,000.00</span>
</div>
<div className="p-3 rounded-lg bg-error-container/40 flex items-center justify-between">
<div className="flex flex-col">
<span className="font-label-md text-label-md text-on-error-container font-semibold">Remaining Term Tuition Due</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Due Date: 15 Mar 2025</span>
</div>
<span className="font-currency-cell text-currency-cell text-error font-bold" id="drawerBalanceDue">₦50,000.00</span>
</div>
</div>
</div>
{/* Parent Portal Quick Access Link Simulation */}
<div className="p-space-md rounded-xl bg-surface-container-high/60 flex items-center justify-between">
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-primary uppercase font-bold">Guardian Secret Token</span>
<span className="font-label-md text-label-md text-on-surface font-mono mt-0.5">EDV-LINK-99214-OKA</span>
</div>
<button aria-label="Copy" className="p-2 rounded-lg bg-surface-container-lowest text-primary hover:bg-surface-container transition-colors" title="Copy Direct Access Link" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">content_copy</span>
</button>
</div>
</div>
{/* Drawer Bottom Action Buttons */}
<div className="flex items-center gap-space-sm pt-space-md border-t-0">
<button className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg text-center transition-colors" type="button">
          Send Telegram Notice
        </button>
<button className="px-4 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg transition-colors" type="button">
          Close
        </button>
</div>
</div>
</div>
{/* Register New Pupil Modal Dialog (Modal & Drawer Tier) */}
{isRegisterOpen && (
<div className="fixed inset-0 z-50 transition-opacity duration-300 bg-inverse-surface/45 backdrop-blur-xs flex items-center justify-center p-4">
<div className="w-full max-w-2xl bg-surface-container-lowest rounded-3xl p-space-lg shadow-2xl flex flex-col gap-space-md transform scale-100 transition-transform duration-300 pointer-events-auto">
<div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-[24px]">school</span>
</div>
<div>
<h3 className="font-headline-md text-headline-md text-on-surface">Register New Pupil</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Edvora Nursery & Primary School · 2026/2027 First Term Admission</p>
</div>
</div>
<button onClick={() => setIsRegisterOpen(false)} aria-label="Close dialog" className="p-2 rounded-full hover:bg-surface-container text-outline transition-colors" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">close</span>
</button>
</div>

{registerSuccess && (
  <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold flex items-center gap-2">
    <span aria-hidden="true" className="material-symbols-outlined text-[20px]">check_circle</span>
    <span>{registerSuccess}</span>
  </div>
)}

<form onSubmit={handleRegisterSubmit} className="flex flex-col gap-space-md">
{/* Pupil Particulars */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
<div className="flex flex-col gap-1">
<label className="font-label-md text-label-md text-on-surface">Pupil Full Name *</label>
<input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="bg-surface-container-low text-on-surface font-body-md text-body-md px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Osayande Agho" required type="text"/>
</div>
<div className="flex flex-col gap-1">
<label className="font-label-md text-label-md text-on-surface">Admission Number (Auto-assigned)</label>
<input className="bg-surface-container text-outline font-label-md text-label-md px-3.5 py-2.5 rounded-lg cursor-not-allowed" disabled type="text" value={`EDV/2026/${String(pupils.length + 43).padStart(4, '0')}`}/>
</div>
</div>
<div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
<div className="flex flex-col gap-1">
<label className="font-label-md text-label-md text-on-surface">Class Arm *</label>
<select value={formData.classId} onChange={(e) => setFormData({ ...formData, classId: e.target.value })} className="bg-surface-container-low text-on-surface font-body-md text-body-md px-3 py-2.5 rounded-lg focus:outline-none cursor-pointer">
<option value="33333333-3333-3333-3333-000000000001">Nursery 1</option>
<option value="33333333-3333-3333-3333-000000000002">Nursery 2A</option>
<option value="33333333-3333-3333-3333-000000000003">Primary 1A</option>
<option value="33333333-3333-3333-3333-000000000004">Primary 2A</option>
<option value="33333333-3333-3333-3333-000000000005">Primary 3A</option>
<option value="33333333-3333-3333-3333-000000000006">Primary 4A</option>
<option value="33333333-3333-3333-3333-000000000007">Primary 5A</option>
</select>
</div>
<div className="flex flex-col gap-1">
<label className="font-label-md text-label-md text-on-surface">Gender *</label>
<select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })} className="bg-surface-container-low text-on-surface font-body-md text-body-md px-3 py-2.5 rounded-lg focus:outline-none cursor-pointer">
<option value="male">Male</option>
<option value="female">Female</option>
</select>
</div>
<div className="flex flex-col gap-1">
<label className="font-label-md text-label-md text-on-surface">Date of Birth *</label>
<input className="bg-surface-container-low text-on-surface font-body-md text-body-md px-3 py-2.5 rounded-lg focus:outline-none" required type="date" defaultValue="2018-05-12"/>
</div>
</div>
{/* Guardian Particulars Section */}
<div className="pt-2 flex flex-col gap-space-xs">
<span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">Primary Legal Guardian Linking</span>
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
<div className="flex flex-col gap-1">
<label className="font-label-md text-label-md text-on-surface">Guardian Name &amp; Honorific *</label>
<input value={formData.guardianName} onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })} className="bg-surface-container-low text-on-surface font-body-md text-body-md px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Chief Dr. Victor Agho" required type="text"/>
</div>
<div className="flex flex-col gap-1">
<label className="font-label-md text-label-md text-on-surface">Relationship to Ward *</label>
<select className="bg-surface-container-low text-on-surface font-body-md text-body-md px-3 py-2.5 rounded-lg focus:outline-none cursor-pointer">
<option>Father</option>
<option>Mother</option>
<option>Legal Guardian / Foster</option>
<option>Uncle / Aunt</option>
</select>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-md mt-1">
<div className="flex flex-col gap-1">
<label className="font-label-md text-label-md text-on-surface">Phone (+234 format) *</label>
<input value={formData.guardianPhone} onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })} className="bg-surface-container-low text-on-surface font-body-md text-body-md px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 font-currency-cell" placeholder="+234 803 000 0000" required type="tel"/>
</div>
<div className="flex flex-col gap-1">
<label className="font-label-md text-label-md text-on-surface">Fee Structure Plan</label>
<select className="bg-surface-container-low text-on-surface font-body-md text-body-md px-3 py-2.5 rounded-lg focus:outline-none cursor-pointer">
<option>Standard Day Pupil (₦120,000 / Term)</option>
<option>Early Years Nursery (₦95,000 / Term)</option>
<option>Primary Final Year Prep (₦135,000 / Term)</option>
</select>
</div>
</div>
</div>
<div className="flex items-center justify-end gap-space-sm pt-space-sm border-t border-outline-variant/20">
<button onClick={() => setIsRegisterOpen(false)} className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg transition-colors" type="button">
  Cancel
</button>
<button disabled={isSubmitting} className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg shadow-sm transition-all flex items-center gap-2 disabled:opacity-50" type="submit">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">how_to_reg</span>
<span>{isSubmitting ? "Enrolling..." : "Enroll Pupil"}</span>
</button>
</div>
</form>
</div>
</div>
)}
</div>

    </div>
  );
}
