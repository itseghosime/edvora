import type { Metadata } from "next";
import PublicAccordion from "@/components/public/PublicAccordion";
import PublicEnquiryForm from "@/components/public/PublicEnquiryForm";
import React from "react";
import Link from "next/link";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";

export const metadata: Metadata = {"title": "Admissions | Edvora", "description": "Understand the admissions journey, prepare your questions and learn how families receive Student portal access.", "alternates": {"canonical": "/admissions"}};

export default function AdmissionsPage() {
  return (
    <div className="public-site min-h-screen flex flex-col bg-surface font-body-md text-on-surface">
      <PublicNavbar />
      <main id="main-content" className="public-main w-full flex-1">
        <div className="flex flex-col w-full">
{/* HERO / EDITORIAL WELCOME BAND */}
<section className="relative w-full overflow-hidden bg-surface-container-low py-space-xl lg:py-28">
<div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none"></div>
<div className="absolute left-1/3 bottom-0 w-80 h-80 rounded-full bg-secondary-fixed/20 blur-3xl pointer-events-none"></div>
<div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin relative z-10">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
<div className="lg:col-span-7 space-y-space-md">
<div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container text-primary font-label-sm text-label-sm tracking-wider uppercase shadow-sm">
<span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
<span className="">Now Enrolling · 2026 / 2027 Academic Session</span>
</div>
<h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">
            Welcoming Families into the <span className="text-primary underline decoration-secondary-container decoration-wavy decoration-2 underline-offset-8">Edvora Community</span>
</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
            We understand that choosing an early childhood or primary home for your child is an act of deep trust. At Edvora, our rolling admissions model honours every family’s pace, welcoming prospective parents to tour our botanical grounds, inspect active classrooms in session, and experience our calm, structured stewardship firsthand.
          </p>
<div className="flex flex-wrap items-center gap-space-md pt-space-xs">
<a className="inline-flex items-center gap-space-xs px-6 py-3.5 rounded-lg bg-primary-container text-on-primary hover:bg-primary font-label-lg text-label-lg transition-all shadow-md" href="#enquiry-form">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">calendar_month</span>
<span className="">Book a School Visit</span>
</a>
<a className="inline-flex items-center gap-space-xs px-6 py-3.5 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-variant font-label-lg text-label-lg transition-all shadow-sm" href="#journey">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">checklist</span>
<span className="">View 5-Stage Journey</span>
</a>
</div>
<div className="flex items-center gap-space-lg pt-space-sm text-on-surface-variant font-label-md text-label-md">
<div className="flex items-center gap-2">
<span aria-hidden="true" className="material-symbols-outlined text-secondary text-[18px]">verified</span>
<span className="">Max 18–20 Pupils / Stream</span>
</div>
<div className="flex items-center gap-2">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[18px]">park</span>
<span className="">Nursery & Primary School</span>
</div>
</div>
</div>
<div className="lg:col-span-5 relative">
<div className="relative mx-auto max-w-md lg:max-w-none">
<div className="rounded-3xl overflow-hidden shadow-xl bg-surface-container-lowest p-2">
<img className="w-full h-80 lg:h-96 object-cover rounded-2xl" alt="A sunlit, tranquil Montessori-inspired classroom at Edvora Nursery in Benin City with polished wooden shelves, leafy botanical planters, and a caring Nigerian female teacher reading gently with smiling young pupils on an woven linen rug." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAziif3GGbldb9LyhVFPl1gQ-UBlJOLmfV2EAdQLJD0EkqHG0WkMTmIu7IknaCTWVKjrR2igPR7SYVG2_sD0VnLIqhJkjy56SHIuTYMsghQ2GJqqTJ0QhLa0BMRTymqhQDunjgSadazCesU8bF1ze4RnPxBmlSkGpkUtHLSiTigsyFegI95rekKFSAMPxJXrfRYLh5FMP1Qz5xN7MvS1cyABs71w1TXKbbCjLJ8BdZ3yeVhnpmReKRw" />
</div>
{/* Editorial metric tag badge */}
<div className="absolute -bottom-4 -left-4 bg-surface-container-lowest p-4 rounded-2xl shadow-lg max-w-[220px]">
<div className="flex items-center gap-2 text-primary font-headline-sm text-headline-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[26px]">groups</span>
<span className="">1 : 8 Ratio</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Nursery &amp; Early Years Teacher-to-Child Care Factor</p>
</div>
</div>
</div>
</div>
</div>
</section>
{/* FIVE-STAGE ADMISSIONS JOURNEY */}
<section className="py-space-xl lg:py-24 max-w-7xl mx-auto px-margin-mobile lg:px-margin w-full" id="journey">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
<div className="space-y-space-xs max-w-xl">
<span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">Transparent Pathway</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface">The Five-Stage Admissions Journey</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Our friendly, low-stress process is crafted to understand your child's innate curiosity and provide parents with absolute clarity at every step.</p>
</div>
<div className="hidden md:flex items-center gap-2 text-on-surface-variant font-label-md text-label-md bg-surface-container px-4 py-2 rounded-full">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[18px]">timelapse</span>
<span className="">Typical turnaround: 4 to 6 business days</span>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-space-md">
{/* Step 1 */}
<div className="group bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
<div className="space-y-4">
<div className="flex items-center justify-between">
<span className="w-8 h-8 rounded-full bg-primary-fixed text-primary font-label-md text-label-md flex items-center justify-center font-bold">01</span>
<span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary transition-colors text-[24px]">chat_bubble_outline</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Initial Enquiry &amp; Conversation</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Submit our online tour form or call our admissions coordinator to discuss your child's age, milestones, and family aspirations.</p>
</div>
<div className="mt-6 pt-3 text-secondary font-label-sm text-label-sm uppercase tracking-wide">Stage 1 · Day 1</div>
</div>
{/* Step 2 */}
<div className="group bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
<div className="space-y-4">
<div className="flex items-center justify-between">
<span className="w-8 h-8 rounded-full bg-primary-fixed text-primary font-label-md text-label-md flex items-center justify-center font-bold">02</span>
<span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary transition-colors text-[24px]">explore</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Campus Visit &amp; Walkthrough</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Tour our botanical play courtyards, STEM corner, and quiet nap suites during active morning sessions to witness our daily rhythm.</p>
</div>
<div className="mt-6 pt-3 text-secondary font-label-sm text-label-sm uppercase tracking-wide">Stage 2 · Scheduled</div>
</div>
{/* Step 3 */}
<div className="group bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
<div className="space-y-4">
<div className="flex items-center justify-between">
<span className="w-8 h-8 rounded-full bg-primary-fixed text-primary font-label-md text-label-md flex items-center justify-center font-bold">03</span>
<span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary transition-colors text-[24px]">sentiment_satisfied</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Pupil Readiness Observation</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">A non-intrusive, playful interaction with an educator. We evaluate developmental milestones, motor play, phonics, or numeracy gently.</p>
</div>
<div className="mt-6 pt-3 text-secondary font-label-sm text-label-sm uppercase tracking-wide">Stage 3 · Low Stress</div>
</div>
{/* Step 4 */}
<div className="group bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
<div className="space-y-4">
<div className="flex items-center justify-between">
<span className="w-8 h-8 rounded-full bg-primary-fixed text-primary font-label-md text-label-md flex items-center justify-center font-bold">04</span>
<span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary transition-colors text-[24px]">mark_email_read</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Review &amp; Admission Offer</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Within 48 hours, receiving your official offer dossier containing class stream allocation, uniform measurement guide, and fee schedule.</p>
</div>
<div className="mt-6 pt-3 text-secondary font-label-sm text-label-sm uppercase tracking-wide">Stage 4 · Written Dossier</div>
</div>
{/* Step 5 */}
<div className="group bg-primary-container text-on-primary p-6 rounded-2xl shadow-md hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden">
<div className="space-y-4">
<div className="flex items-center justify-between">
<span className="w-8 h-8 rounded-full bg-surface-container-lowest text-primary font-label-md text-label-md flex items-center justify-center font-bold">05</span>
<span aria-hidden="true" className="material-symbols-outlined text-primary-fixed text-[24px]">key</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-primary">Enrolment &amp; Portal Invitation</h3>
<p className="font-body-sm text-body-sm text-on-primary-container">Upon acceptance, guardians receive digital authentication codes for the Edvora Student Portal to manage fees, track naps, and view reports.</p>
</div>
<div className="mt-6 pt-3 text-primary-fixed font-label-sm text-label-sm uppercase tracking-wide">Stage 5 · Fully Welcomed</div>
</div>
</div>
</section>
{/* TWO-COLUMN SECTION: DOCUMENT CHECKLIST & MAIN INTERACTIVE ENQUIRY FORM */}
<section className="bg-surface-container-lowest py-space-xl lg:py-24 shadow-sm w-full">
<div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
{/* LEFT COLUMN: DOCUMENT CHECKLIST & ADVICE */}
<div className="lg:col-span-5 space-y-space-lg">
<div className="space-y-space-xs">
<span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">Preparation Dossier</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Required Documents Checklist</h2>
<p className="font-body-md text-body-md text-on-surface-variant">
              To assist our administrative registrar in drafting your pupil's permanent student file, please prepare clear photocopies of the following items prior to Stage 4.
            </p>
</div>
<div className="space-y-space-sm">
<div className="flex items-start gap-3 p-4 rounded-xl bg-surface-container-low">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[22px] mt-0.5 shrink-0">badge</span>
<div>
<div className="font-headline-sm text-headline-sm text-on-surface">Pupil's Birth Certificate or Age Declaration</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Government-issued NPC statutory certificate verifying date of birth for correct early-years cohort placement.</p>
</div>
</div>
<div className="flex items-start gap-3 p-4 rounded-xl bg-surface-container-low">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[22px] mt-0.5 shrink-0">portrait</span>
<div>
<div className="font-headline-sm text-headline-sm text-on-surface">Recent Passport Photographs (2 Copies)</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Clear frontal portraits with white or pale background for school identity badges and safety collection registries.</p>
</div>
</div>
<div className="flex items-start gap-3 p-4 rounded-xl bg-surface-container-low">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[22px] mt-0.5 shrink-0">history_edu</span>
<div>
<div className="font-headline-sm text-headline-sm text-on-surface">Previous Academic Progress Report</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Required for transfers entering Nursery 2 through Primary 6. Helps our educators preserve continuity in phonics and numeracy.</p>
</div>
</div>
<div className="flex items-start gap-3 p-4 rounded-xl bg-surface-container-low">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[22px] mt-0.5 shrink-0">vaccines</span>
<div>
<div className="font-headline-sm text-headline-sm text-on-surface">Child Immunization Record &amp; Medical Form</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Essential for nursery and creche care. Enables our school nurse to record allergies, dietary caveats, and emergency protocols.</p>
</div>
</div>
<div className="flex items-start gap-3 p-4 rounded-xl bg-surface-container-low">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[22px] mt-0.5 shrink-0">home_pin</span>
<div>
<div className="font-headline-sm text-headline-sm text-on-surface">Guardian Identification &amp; Proof of Address</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">NIN slip, International Passport, or Driver’s License paired with a recent utility statement in Edo State.</p>
</div>
</div>
</div>
{/* Physical photo callout card */}
<div className="p-4 rounded-2xl bg-surface-container flex items-center gap-4">
<img className="w-16 h-16 object-cover rounded-xl shrink-0" alt="Close up photograph of a neat school registrar folder with embossed emblem, clean administrative stationery, brass paperclip, and high-quality child enrolment files on a clean oak desk." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPaJNnoJsQiXHyEiJSCxo4a8cCLkAnJnC_aNICuDnd0tXejW_RSfCvbw1cJKApMPb9Tpa2igTnSYDT66EB_YA4PVjE-4GZnWtUdIrVgv6w2yQ-1x-7XS0-POTKM8F7pHDp1FDoz1IxQUUH3W8bv2888k4kSmzt-elibphlnZk5QdH0s4N5jtN-lFiMPUInahFrPgU8lCNTbjBIfkQpJyPGZPfj6UFtmtm8JX_d3vosWUpLZwVJqEa9" />
<div>
<div className="font-label-lg text-label-lg text-on-surface">Need help compiling files?</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">The admissions office can explain which documents are needed and how to submit them.</p>
</div>
</div>
</div>
{/* RIGHT COLUMN: INTERACTIVE ENQUIRY & VISIT BOOKING FORM */}
<div className="lg:col-span-7 bg-surface-container-lowest p-6 lg:p-8 rounded-3xl shadow-lg border-0" id="enquiry-form">
<div className="mb-space-md">
<div className="flex items-center gap-2 text-secondary font-label-sm text-label-sm uppercase tracking-wider font-bold">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">how_to_reg</span>
<span className="">Direct Registrar Submission</span>
</div>
<h3 className="font-headline-lg text-headline-lg text-on-surface mt-1">Book a Campus Tour &amp; Enquire</h3>
<p className="font-body-md text-body-md text-on-surface-variant">Prepare an admissions enquiry and keep a copy for your conversation with the school office.</p>
</div>
{/* JavaScript-managed submission flow */}
<PublicEnquiryForm idPrefix="admissions" />
{/* Success Notification Banner (Initially Hidden) */}

</div>
</div>
</div>
</section>
{/* ADMISSIONS FREQUENTLY ASKED QUESTIONS */}
<section className="py-space-xl lg:py-24 max-w-5xl mx-auto px-margin-mobile lg:px-margin w-full">
<div className="text-center space-y-space-xs mb-space-xl">
<span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">Clarity For Parents</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Frequently Asked Questions</h2>
<p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto">Straightforward answers regarding our age cut-offs, transfer protocols, and classroom standards.</p>
</div>
{/* Accordion Group */}
<PublicAccordion items={[{"id": "faqAccordion0", "question": "How do families apply?", "answer": "Start by discussing the child\u2019s age, previous learning and class availability with the school office. Prepare your questions using the enquiry form. A visit is confirmed only when the office agrees a time."}, {"id": "faqAccordion1", "question": "How do parents access the portal?", "answer": "Parents use their child\u2019s Student account. The school issues a private setup link so the family can choose a password. Admission number and password are required to sign in."}, {"id": "faqAccordion2", "question": "Where can parents pay fees?", "answer": "Sign in to the Student portal to see the pupil\u2019s assigned fees and make a payment. Balances and receipts update only after the payment has been verified."}, {"id": "faqAccordion3", "question": "When can families see results?", "answer": "Results appear in the Student portal after an administrator publishes them. An unpaid fee balance does not block access to published results."}, {"id": "faqAccordion4", "question": "How can a family recover account access?", "answer": "Contact the school office. An administrator verifies the guardian\u2019s identity before issuing a private, single-use password setup link. Links expire after 30 minutes."}]} />
</section>
{/* CONTACT ADMISSIONS OFFICE CALLOUT BAND */}
<section className="bg-surface-container-high py-space-xl lg:py-20 w-full">
<div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin">
<div className="bg-surface-container-lowest rounded-3xl p-8 lg:p-12 shadow-xl">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
<div className="lg:col-span-8 space-y-space-sm">
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold uppercase">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">support_agent</span>
<span className="">Physical Visit &amp; Security Protocols</span>
</div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">
              Prefer to Visit or Speak with Us in Person?
            </h2>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed max-w-2xl">
              Our Admissions Reception in the Main Administration Quadrangle is open Monday to Friday, 8:00 AM to 3:30 PM. For child safeguarding and campus tranquility, all adult visitors are gently requested to present a valid photo ID at the Main Gate Security checkpoint upon arrival.
            </p>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-space-sm pt-space-xs font-body-sm text-body-sm">
<div className="flex items-center gap-2 text-on-surface">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]">call</span>
<span className="font-semibold">Contact school office</span>
</div>
<div className="flex items-center gap-2 text-on-surface">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]">mail</span>
<span className="">admissions@edvora.edu.ng</span>
</div>
<div className="flex items-center gap-2 text-on-surface">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]">near_me</span>
<span className="">Arrange a visit with the school office</span>
</div>
</div>
</div>
<div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center items-stretch">
<a className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-primary-container text-on-primary hover:bg-primary font-label-lg text-label-lg transition-all shadow-md text-center" href="/contact#enquiry">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">phone_in_talk</span>
<span className="">Call Admissions Registrar</span>
</a>
<a className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-surface-container text-primary hover:bg-surface-container-high font-label-lg text-label-lg transition-all text-center" href="#enquiry-form">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">event_note</span>
<span className="">Fill Quick Enquiry Online</span>
</a>
</div>
</div>
</div>
</div>
</section>
</div>

      </main>
      <PublicFooter />
    </div>
  );
}

