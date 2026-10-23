import React from "react";
import Link from "next/link";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";

export default function FeesPage() {
  return (
    <div className="public-site min-h-screen flex flex-col bg-surface font-body-md text-on-surface">
      <PublicNavbar />
      <main id="main-content" className="public-main w-full flex-1">
        <div className="flex flex-col w-full">
{/* Subtle Ambient Glow Element */}
<div className="relative w-full overflow-hidden">
<div className="absolute -top-40 right-10 w-96 h-96 bg-primary-fixed-dim/20 rounded-full blur-3xl pointer-events-none"></div>
<div className="absolute top-80 -left-20 w-80 h-80 bg-secondary-fixed/30 rounded-full blur-3xl pointer-events-none"></div>
{/* Editorial Intro & Commitment Header */}
<section className="max-w-7xl mx-auto px-margin-mobile lg:px-margin pt-space-lg pb-space-xl relative z-10">
<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
<div className="max-w-3xl space-y-space-sm">
<div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm uppercase tracking-wider shadow-sm"><span className="w-2 h-2 rounded-full bg-primary-fixed"></span>Approved Term Fee Schedule</div>
<h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">
            Transparent School Fees &amp; Considerate Family Planning
          </h1>
<p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            We believe in complete institutional clarity, zero unannounced levies, and structured instalment flexibility. Our stewardship is designed so Edo State families can nurture their children’s early formative years with unhurried dignity and absolute peace of mind.
          </p>
</div>
{/* Metric Highlight Plaque */}
<div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between min-w-[280px]">
<div className="flex items-center justify-between pb-space-sm">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Academic Term Benchmark</span>
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]">verified</span>
</div>
<div className="font-currency-display text-currency-display text-primary font-bold tabular-nums">
            ₦120,000<span className="font-body-sm text-body-sm text-on-surface-variant font-normal"> / term (Primary)</span>
</div>
<div className="pt-space-xs flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
<span className="">All-inclusive instructional resources &amp; laboratory access</span>
</div>
</div>
</div>
</section>
{/* Public Benchmark Fee Breakdown & Visual Ledger Cards */}
<section className="max-w-7xl mx-auto px-margin-mobile lg:px-margin pb-space-xl">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
{/* Primary School Schedule Card */}
<div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-start justify-between gap-space-md mb-space-md">
<div>
<span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest">Primary Division</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface mt-0.5">Lower &amp; Upper Primary</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Grades 1 through 6 · Comprehensive Academic Programme</p>
</div>
<div className="text-right">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Benchmark Schedule</span>
<div className="font-currency-display text-currency-display text-on-surface font-bold tabular-nums">₦120,000.00</div>
</div>
</div>
{/* Ledger Breakdown Items */}
<div className="space-y-space-sm my-space-md">
<div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low transition-colors hover:bg-surface-container">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">menu_book</span>
</div>
<div>
<div className="font-label-lg text-label-lg text-on-surface">Tuition &amp; Academic Instruction</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">Curriculum delivery, qualified specialists, phonics &amp; core STEM</div>
</div>
</div>
<div className="font-currency-cell text-currency-cell text-on-surface tabular-nums">₦70,000.00</div>
</div>
<div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low transition-colors hover:bg-surface-container">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">science</span>
</div>
<div>
<div className="font-label-lg text-label-lg text-on-surface">Learning Materials, STEM Lab &amp; Library Resources</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">Class library books, discovery kits, consumables &amp; robotics access</div>
</div>
</div>
<div className="font-currency-cell text-currency-cell text-on-surface tabular-nums">₦25,000.00</div>
</div>
<div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low transition-colors hover:bg-surface-container">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">sports_soccer</span>
</div>
<div>
<div className="font-label-lg text-label-lg text-on-surface">Co-Curricular Arts, Sports &amp; School Activities</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">Athletics coaching, cultural ensemble, club societies &amp; inter-house events</div>
</div>
</div>
<div className="font-currency-cell text-currency-cell text-on-surface tabular-nums">₦15,000.00</div>
</div>
<div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low transition-colors hover:bg-surface-container">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">assessment</span>
</div>
<div>
<div className="font-label-lg text-label-lg text-on-surface">Continuous Assessment &amp; Digital Reporting</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">Portal records, diagnostic psychometrics &amp; terminal report collation</div>
</div>
</div>
<div className="font-currency-cell text-currency-cell text-on-surface tabular-nums">₦10,000.00</div>
</div>
</div>
</div>
{/* Total Calculation Footer */}
<div className="pt-space-md mt-space-sm bg-surface-container-high/40 p-space-md rounded-xl flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider">Total Scheduled Term Fee</span>
<span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm">Fully Reconciled</span>
</div>
<div className="font-currency-display text-currency-display text-primary font-bold tabular-nums">
              ₦120,000.00
            </div>
</div>
</div>
{/* Early Years / Nursery Schedule Card */}
<div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-start justify-between gap-space-sm mb-space-md">
<div>
<span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-widest">Early Years</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface mt-0.5">Nursery</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Ages 18 Months – 5 Years</p>
</div>
<div className="text-right">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Benchmark Schedule</span>
<div className="font-currency-display text-currency-display text-on-surface font-bold tabular-nums">₦120,000.00</div>
</div>
</div>
{/* Descriptive Breakdown */}
<div className="p-space-md rounded-xl bg-surface-container-low space-y-space-sm mb-space-md">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">child_care</span>
</div>
<div>
<div className="font-label-lg text-label-lg text-on-surface">Sensory &amp; Montessori Apparatus</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">Comprehensive developmental kit per term</div>
</div>
</div>
<p className="font-body-md text-body-md text-on-surface-variant pt-space-xs">
                Includes sensorial Montessori apparatus, practical life exercises, tactile early literacy materials, nap cot hygiene, daily observation logging, and sanitary care materials.
              </p>
<div className="flex items-center justify-between pt-space-xs text-on-surface">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Combined Package Total</span>
<span className="font-currency-cell text-currency-cell font-bold tabular-nums">₦120,000.00</span>
</div>
</div>
{/* Photo of classroom harmony */}
<div className="rounded-xl overflow-hidden relative shadow-inner">
<img className="w-full h-40 object-cover" alt="Warm, natural-lit Nigerian preschool Montessori classroom in Edo State featuring wooden tactile blocks, miniature reading stools, clean botanical planters, and orderly learning materials on low shelves." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWUMZ5vLeWCt_dGsS0AZmns5IjkXIPAxpZkkGkmLhEgLlQb_Cp7WA-PMsPzCnjOriLfHFVtWsYoS7daIcOkdQk4IEiRxKtO7TBQTKNWFAwjv5P62WZfDTh7AK1-rsLA_ULQuY5PUGpqXFXeo86m5Bkj-SYckqgYGhqeoEXi-l_SImSpIpQcWqpyoWH7QZh75_7ezyoVbYguhEUjbHJdrLzxVdhdZU5NARXhXaSnxErZd1A2H9Fthts" />
<div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent flex items-end p-space-sm">
<span className="font-label-sm text-label-sm text-on-primary font-medium">Sensory playrooms engineered for safety &amp; unhindered exploration</span>
</div>
</div>
</div>
<div className="pt-space-md mt-space-md bg-secondary-container/20 p-space-md rounded-xl flex items-center justify-between">
<span className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider">Early Years Term Fee</span>
<span className="font-currency-display text-currency-display text-secondary font-bold tabular-nums">₦120,000.00</span>
</div>
</div>
</div>
</section>
{/* Flexible 2-Tranche Instalment Policy & Zero Embarrassment Guarantee */}
<section className="max-w-7xl mx-auto px-margin-mobile lg:px-margin pb-space-xl">
<div className="bg-surface-container rounded-3xl p-space-lg lg:p-space-xl">
<div className="max-w-2xl mb-space-lg">
<div className="inline-flex items-center gap-space-xs px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm uppercase mb-space-xs">
            Family Budget Flexibility
          </div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Flexible Instalments</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant">
            To accommodate family budgetary schedules without penalising administrative readiness, all tuition can be settled systematically across the school term.
          </p>
</div>
{/* Tranche Visual Stepper / Breakdown */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter items-stretch">
{/* Tranche 1 */}
<div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-space-sm">
<span className="w-7 h-7 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm flex items-center justify-center font-bold">1</span>
<span className="px-2 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold">Resumption</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-surface">Payment received</h3>
<p className="font-body-md text-body-md text-on-surface-variant mt-space-xs mb-space-md">
                Due on or before the opening week of the academic term to confirm instructional enrolment and reserve curriculum kits.
              </p>
</div>
<div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Benchmark (Primary)</span>
<span className="font-currency-cell text-currency-cell text-primary font-bold tabular-nums">₦70,000.00</span>
</div>
</div>
{/* Tranche 2 */}
<div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-space-sm">
<span className="w-7 h-7 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm flex items-center justify-center font-bold">2</span>
<span className="px-2 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-semibold">Mid-Term</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-surface">Remaining balance</h3>
<p className="font-body-md text-body-md text-on-surface-variant mt-space-xs mb-space-md">
                Due during Mid-Term Break (Week 7) prior to continuous assessment synthesis and closing term festivities.
              </p>
</div>
<div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Benchmark (Primary)</span>
<span className="font-currency-cell text-currency-cell text-secondary font-bold tabular-nums">₦50,000.00</span>
</div>
</div>
{/* Zero Embarrassment Guarantee Card */}
<div className="bg-primary-container text-on-primary rounded-2xl p-space-lg shadow-md flex flex-col justify-between md:col-span-2 lg:col-span-1">
<div>
<div className="w-10 h-10 rounded-xl bg-on-primary/10 flex items-center justify-center mb-space-sm">
<span aria-hidden="true" className="material-symbols-outlined text-on-primary text-[24px]">verified_user</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-primary">Zero Embarrassment Guarantee</h3>
<p className="font-body-md text-body-md text-on-primary/90 mt-space-xs leading-relaxed">
                Edvora strictly prohibits discussing fee balances in classrooms, at school gates, or before any pupil. Financial discussions remain exclusively between parents and the Bursar via confidential, private channels.
              </p>
</div>
<div className="pt-space-md flex items-center gap-2 font-label-sm text-label-sm text-on-primary/80">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">lock</span>
<span className="">Child dignity safeguarded at all times</span>
</div>
</div>
</div>
</div>
</section>
{/* Comprehensive Parent Guide to the Edvora Portal */}
<section className="max-w-7xl mx-auto px-margin-mobile lg:px-margin pb-space-xl">
<div className="text-center max-w-2xl mx-auto mb-space-xl">
<span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest">Digital Simplicity</span>
<h2 className="font-display-lg text-display-lg text-on-surface mt-1">Student Portal Guide</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant mt-space-xs">
          Engineered for ease on mobile devices. Manage fee verification, track academic progression, and switch between siblings without administrative friction.
        </p>
</div>
{/* 5-Step Process Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-md">
{/* Step 1 */}
<div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
<div className="space-y-space-sm">
<div className="w-9 h-9 rounded-xl bg-surface-container text-primary flex items-center justify-center font-headline-sm text-headline-sm font-bold">
              1
            </div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Secure Invite Link</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">
              Upon enrolment approval, your verified phone and email receive a direct magic passkey link. No complicated passwords required.
            </p>
</div>
<div className="pt-space-md">
<span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">link</span> One-tap access
            </span>
</div>
</div>
{/* Step 2 */}
<div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
<div className="space-y-space-sm">
<div className="w-9 h-9 rounded-xl bg-surface-container text-primary flex items-center justify-center font-headline-sm text-headline-sm font-bold">
              2
            </div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Sibling Switcher</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Parents with more than one enrolled child can switch between authorised pupil accounts within the Student Portal.</p>
</div>
<div className="pt-space-md">
<span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">family_restroom</span> Multi-child ready
            </span>
</div>
</div>
{/* Step 3 */}
<div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
<div className="space-y-space-sm">
<div className="w-9 h-9 rounded-xl bg-surface-container text-secondary flex items-center justify-center font-headline-sm text-headline-sm font-bold">
              3
            </div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Secure Payment</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Make payments through the Student Portal. A receipt is available after payment has been verified.</p>
</div>
<div className="pt-space-md">
<span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary font-bold">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">receipt_long</span> Instant receipts
            </span>
</div>
</div>
{/* Step 4 */}
<div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
<div className="space-y-space-sm">
<div className="w-9 h-9 rounded-xl bg-surface-container text-primary flex items-center justify-center font-headline-sm text-headline-sm font-bold">
              4
            </div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Unconditional Reports</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">
              Terminal reports are sacred educational benchmarks. Edvora never blocks digital report card access during ongoing reconciliation.
            </p>
</div>
<div className="pt-space-md">
<span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">school</span> Always accessible
            </span>
</div>
</div>
{/* Step 5 */}
<div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
<div className="space-y-space-sm">
<div className="w-9 h-9 rounded-xl bg-surface-container text-primary flex items-center justify-center font-headline-sm text-headline-sm font-bold">
              5
            </div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Direct School Help</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">
              Enquiries are resolved via private phone lines and bursary appointments—never exposed in messy parent Telegram chat groups.
            </p>
</div>
<div className="pt-space-md">
<span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">support_agent</span> Dedicated desk
            </span>
</div>
</div>
</div>
</section>
{/* Interactive Interactive Paystack Test Simulator & Payment Safety Notice */}
<section className="max-w-7xl mx-auto px-margin-mobile lg:px-margin pb-space-xl">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
{/* Safety Banner & Guidelines */}
<div className="lg:col-span-7 space-y-space-md">
<div className="bg-surface-container-low p-space-lg rounded-2xl">
<div className="flex items-start gap-space-md">
<div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
<span aria-hidden="true" className="material-symbols-outlined text-[28px]">payments</span>
</div>
<div className="space-y-1.5">
<h3 className="font-headline-md text-headline-md text-on-surface">Payment Guidance</h3>
<p className="font-body-md text-body-md text-on-surface-variant">Use the Student Portal to view fees, make payments and check receipts. Contact the school office if a payment record needs checking.</p>
<div className="pt-space-xs flex flex-wrap gap-space-sm">
<div className="inline-flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[16px]">check</span> Zero physical cash loss
                  </div>
<div className="inline-flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[16px]">check</span> Real-time automated ledger update
                  </div>
<div className="inline-flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[16px]">check</span> Secure digital PDF receipts
                  </div>
</div>
</div>
</div>
</div>
{/* Direct Bursary Office Action Toolbar */}
<div className="flex flex-col sm:flex-row items-center gap-space-md pt-space-xs">
<a className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-lg py-3 rounded-lg bg-primary-container text-on-primary hover:bg-primary font-label-lg text-label-lg shadow-sm transition-all" href="tel:+23452290840">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">call</span>
<span className="">Contact Bursary Desk (+234 52 290 840)</span>
</a>
<button className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-lg py-3 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-label-lg text-label-lg transition-colors">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">download</span>
<span className="">Download Fee Schedule (PDF)</span>
</button>
</div>
</div>
{/* Parent Fee Calculation Guide / Portal Preview Widget */}
<div className="lg:col-span-5">
<div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-md relative overflow-hidden">
<div className="flex items-center justify-between pb-space-sm"><div className="flex items-center gap-space-xs"><span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]">lock</span><span className="font-label-sm text-label-sm font-bold text-on-surface uppercase tracking-wider">Online Payment Portal</span></div><span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">SECURE CHECKOUT</span></div>
{/* Student Selection Preview */}
<div className="mt-space-md space-y-space-sm">
<div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between">
<div>
<div className="font-label-sm text-label-sm text-on-surface-variant">Pupil Profile</div>
<div className="font-label-lg text-label-lg text-on-surface">Osagie E. (Primary 3A)</div>
</div>
<span className="px-2 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm">Enrolled</span>
</div>
{/* Tranche Selection Selector */}
<div className="space-y-1">
<label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Select Payment Tranche</label>
<div className="grid grid-cols-2 gap-space-xs p-1 bg-surface-container-low rounded-lg">
<button className="py-2 px-3 rounded text-center font-label-sm text-label-sm transition-all bg-surface-container-lowest text-primary shadow-sm font-bold" id="btnTranche1">
                    Tranche 1 (₦70,000)
                  </button>
<button className="py-2 px-3 rounded text-center font-label-sm text-label-sm transition-all text-on-surface-variant hover:text-on-surface" id="btnTranche2">
                    Full Term (₦120,000)
                  </button>
</div>
</div>
{/* Fee Breakdown Guide */}
<div className="space-y-1.5 pt-space-xs text-on-surface-variant font-body-sm text-body-sm">
<div className="flex justify-between">
<span className="">Tuition &amp; Assessment:</span>
<span className="font-medium text-on-surface tabular-nums" id="txtSubtotal">₦70,000.00</span>
</div>
<div className="flex justify-between">
<span className="">Payment processing fee:</span>
<span className="font-medium text-on-surface tabular-nums">₦0.00 (Waived)</span>
</div>
<div className="flex justify-between font-label-lg text-label-lg text-on-surface pt-1">
<span className="">Total Payable:</span>
<span className="font-bold text-primary tabular-nums" id="txtTotal">₦70,000.00</span>
</div>
</div>
{/* Action Button */}
<div className="pt-space-sm">
<button className="w-full py-3 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary-container transition-all flex items-center justify-center gap-space-xs shadow-sm" id="btnSimulatePay"><span aria-hidden="true" className="material-symbols-outlined text-[18px]">credit_card</span><span className="">Make Payment</span></button>
</div>
{/* Receipt Modal Confirmation Area (Hidden by default) */}
<div className="hidden mt-space-sm p-space-sm rounded-lg bg-primary-fixed text-on-primary-fixed text-center space-y-1 animate-pulse" id="receiptAlert">
<div className="flex items-center justify-center gap-1 font-label-sm text-label-sm font-bold">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">check_circle</span>
<span className="">TEST TRANSACTION SUCCESSFUL</span>
</div>
<div className="font-body-sm text-body-sm">
                  Receipt #EDV-2026-0891 generated. Sent to demo parent email.
                </div>
</div>
<div className="text-center font-body-sm text-body-sm text-on-surface-variant pt-space-xs">Secured with 256-bit bank-grade encryption · Instant Bursary reconciliation</div>
</div>
</div>
</div>
</div>
</section>
{/* Dignified Stewardship FAQ Grid */}
<section className="max-w-7xl mx-auto px-margin-mobile lg:px-margin pb-space-xl">
<div className="border-t border-surface-variant/50 pt-space-xl">
<div className="max-w-2xl mb-space-lg">
<span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest">Helpful Clarity</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">Frequently Addressed Inquiries</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Clear answers regarding payment options, sibling adjustments, and fee certainty.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
<div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm space-y-space-xs">
<h4 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]">tune</span>
              Are there unexpected mid-term levies?
            </h4>
<p className="font-body-md text-body-md text-on-surface-variant">
              No. Our published schedule encompasses instructional apparatus, labs, and arts. We do not issue unannounced weekend levies or ad-hoc demands for basic curriculum tools.
            </p>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm space-y-space-xs">
<h4 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]">diversity_3</span>
              Is there a sibling fee accommodation?
            </h4>
<p className="font-body-md text-body-md text-on-surface-variant">
              Yes. Families with three or more concurrently enrolled pupils receive a 5% tuition adjustment on the third child’s tuition, applied directly in the bursary portal upon enrolment.
            </p>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm space-y-space-xs">
<h4 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]">history_edu</span>
              What if bank transfers delay confirmation?
            </h4>
<p className="font-body-md text-body-md text-on-surface-variant">If a payment is still pending, keep its reference and contact the school office. Your balance updates after verification.</p>
</div>
</div>
</div>
</section>
</div>
</div>

      </main>
      <PublicFooter />
    </div>
  );
}
