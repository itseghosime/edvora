import type { Metadata } from "next";
import PublicAccordion from "@/components/public/PublicAccordion";
import PublicEnquiryForm from "@/components/public/PublicEnquiryForm";
import React from "react";
import Link from "next/link";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";

export const metadata: Metadata = {"title": "Contact & Enquiries | Edvora", "description": "Prepare admissions, visit and portal questions for the Edvora school office.", "alternates": {"canonical": "/contact"}};

export default function ContactPage() {
  return (
    <div data-page="contact" className="public-site min-h-screen flex flex-col bg-surface font-body-md text-on-surface">
      <PublicNavbar />
      <main id="main-content" className="public-main w-full flex-1">
        <div className="flex flex-col w-full">
{/* Atmospheric Botanical Glow & Top Anchor */}
<div className="relative w-full overflow-hidden pb-space-xl">
<div className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-primary-fixed-dim/20 blur-3xl pointer-events-none"></div>
<div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-secondary-fixed/25 blur-3xl pointer-events-none"></div>
<div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin pt-space-lg">
{/* Top Section Header (Editorial & Dignified) */}
<div className="max-w-3xl space-y-space-sm mb-space-xl">
<div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-widest">
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "" }}>forum</span>
          Direct Parent &amp; Visitor Line
        </div>
<h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">
          We Are Here to Listen &amp; Welcome You
        </h1>
<p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
          Have questions about admissions, our curriculum, or scheduling a personal tour? Our school administration is at your service.
        </p>
</div>
{/* Quick Contact Cards Grid (Configurable Placeholders) */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-space-xl">
{/* Campus Location */}
<div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-md flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
<div>
<div className="w-12 h-12 rounded-xl bg-surface-container-low text-primary flex items-center justify-center mb-space-md group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
<span aria-hidden="true" className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "" }}>location_on</span>
</div>
<div className="flex items-center gap-space-xs mb-1">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Campus Reception</span>
<span className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">Visits by arrangement</span>
</div>
<h2 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">Admissions Quadrangle</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Contact the school office for directions and visit arrangements.</p>
</div>
<div className="mt-space-md pt-space-sm">
<span className="inline-flex items-center gap-space-xs font-label-md text-label-md text-primary font-bold">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">navigation</span>
              Arrange your visit in advance
            </span>
</div>
</div>
{/* Phone Inquiries */}
<div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-md flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
<div>
<div className="w-12 h-12 rounded-xl bg-surface-container-low text-primary flex items-center justify-center mb-space-md group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
<span aria-hidden="true" className="material-symbols-outlined text-[24px]">call</span>
</div>
<div className="flex items-center gap-space-xs mb-1">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Voice Inquiries</span>
<span className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">Hotlines</span>
</div>
<h2 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">Telephone Direct</h2>
<div className="space-y-1">
<a className="block font-body-md text-body-md text-on-surface font-semibold hover:text-primary transition-colors" href="/contact#enquiry">Contact school office</a>
<a className="block font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="/contact#enquiry">Contact school office</a>
</div>
</div>
<div className="mt-space-md pt-space-sm">
<span className="inline-flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
<span className="w-2 h-2 rounded-full bg-primary-container"></span>
              Contact details to be confirmed
            </span>
</div>
</div>
{/* Direct Email */}
<div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-md flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
<div>
<div className="w-12 h-12 rounded-xl bg-surface-container-low text-primary flex items-center justify-center mb-space-md group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
<span aria-hidden="true" className="material-symbols-outlined text-[24px]">mark_email_read</span>
</div>
<div className="flex items-center gap-space-xs mb-1">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Written Dispatch</span>
<span className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">Institutional</span>
</div>
<h2 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">Official Desks</h2>
<div className="space-y-1">
<a className="block font-body-md text-body-md text-on-surface hover:text-primary transition-colors truncate" href="/contact#enquiry">Contact school office</a>
<a className="block font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors truncate" href="/contact#enquiry">Contact school office</a>
</div>
</div>
<div className="mt-space-md pt-space-sm">
<span className="inline-flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
<span aria-hidden="true" className="material-symbols-outlined text-[14px] text-primary">schedule</span>
              Prepare an enquiry below
            </span>
</div>
</div>
{/* Hours of Operation */}
<div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-md flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
<div>
<div className="w-12 h-12 rounded-xl bg-surface-container-low text-primary flex items-center justify-center mb-space-md group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
<span aria-hidden="true" className="material-symbols-outlined text-[24px]">timelapse</span>
</div>
<div className="flex items-center gap-space-xs mb-1">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Academic Term</span>
<span className="px-1.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">Mon – Fri</span>
</div>
<h2 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">Office Hours</h2>
<p className="font-body-md text-body-md text-on-surface font-semibold">
              8:00 AM – 3:30 PM
            </p>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Administrative desks remain open during term breaks by prior appointment.
            </p>
</div>
<div className="mt-space-md pt-space-sm">
<span className="inline-flex items-center gap-space-xs font-label-sm text-label-sm text-primary">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">event_available</span>
              Visits: 9:00 AM – 1:00 PM
            </span>
</div>
</div>
</div>
{/* Main Two-Column Structure: Form & FAQ Repository */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
{/* Left Column: Form & Personal Tour Scheduling (7 cols) */}
<div className="lg:col-span-7 space-y-space-lg">
<div className="bg-surface-container-lowest rounded-2xl shadow-xl p-space-md sm:p-space-xl">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-lg">
<div>
<span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">Interactive Registry</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Admissions &amp; Visit Enquiries</h2>
</div>
<div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm self-start sm:self-auto">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
                Admissions Session 2026/27
              </div>
</div>
<div id="enquiry"><PublicEnquiryForm idPrefix="contact" /></div>
{/* Success State Notification Mock */}

</div>
{/* Editorial Photography Accent */}
<div className="relative rounded-2xl overflow-hidden shadow-lg h-56 bg-surface-container">
<div className="w-full h-full bg-cover bg-center" data-alt="Sunlit botanical courtyard of a prestigious primary school in Edo State Nigeria with children in neat spruce green uniforms engaging in experiential nature learning under shady native trees." style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAVbkE67Wcmv4suJRfxMGv22jijNHDauKLycmRE9hJa1T_Tfu9PNo6M62g1hpE74Kc9MK-rf4a6pL-h1CqKWhiFUcG7BoECeCw5bftWDrtVR_4fS7x-BUGYH0G0YCNB9fbrUsbRd7EQIml0ulxzlVuGZigDwMMjGYNRCz0WKfeVT96clojCCzXZnaE8LFIKx6w1qwnrktra46H1yTrxbLl9X58b-godi1czzUPZJHo2HFQZcjaCMtH8")` }}>
<div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/30 to-transparent flex flex-col justify-end p-space-lg text-inverse-on-surface">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed">Campus Grounds</span>
<p className="font-headline-sm text-headline-sm">"Children flourish in spaces designed with sunlight, safety, and respect for their natural curiosity."</p>
</div>
</div>
</div>
</div>
{/* Right Column: Accordion FAQs & Helpful Gateways (5 cols) */}
<div className="lg:col-span-5 space-y-space-lg">
{/* School FAQ Section Card */}
<div className="bg-surface-container-lowest rounded-2xl shadow-xl p-space-md sm:p-space-lg">
<div className="mb-space-md">
<div className="inline-flex items-center gap-1 font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
<span aria-hidden="true" className="material-symbols-outlined text-[14px]">psychology_alt</span>
                Clarifications &amp; Guidance
              </div>
<h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">Frequently Asked Questions</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Transparent answers regarding entry prerequisites, dual curriculum standards, and campus welfare.
              </p>
</div>
{/* Accordion List */}
<PublicAccordion items={[{"id": "schoolFaqAccordion0", "question": "How do families apply?", "answer": "Start by discussing the child\u2019s age, previous learning and class availability with the school office. Prepare your questions using the enquiry form. A visit is confirmed only when the office agrees a time."}, {"id": "schoolFaqAccordion1", "question": "How do parents access the portal?", "answer": "Parents use their child\u2019s Student account. The school issues a private setup link so the family can choose a password. Admission number and password are required to sign in."}, {"id": "schoolFaqAccordion2", "question": "Where can parents pay fees?", "answer": "Sign in to the Student portal to see the pupil\u2019s assigned fees and make a payment. Balances and receipts update only after the payment has been verified."}, {"id": "schoolFaqAccordion3", "question": "When can families see results?", "answer": "Results appear in the Student portal after an administrator publishes them. An unpaid fee balance does not block access to published results."}, {"id": "schoolFaqAccordion4", "question": "How can a family recover account access?", "answer": "Contact the school office. An administrator verifies the guardian\u2019s identity before issuing a private, single-use password setup link. Links expire after 30 minutes."}]} />
</div>
{/* Direct Enrolled Parent Gateway Card */}
<div className="p-space-lg rounded-2xl bg-primary text-on-primary shadow-xl relative overflow-hidden">
<div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-primary-fixed-dim/10 pointer-events-none"></div>
<div className="flex items-center gap-space-xs font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider mb-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">vpn_key</span>
              Enrolled Community Service
            </div>
<h3 className="font-headline-md text-headline-md text-on-primary mb-space-xs">
              Already an Enrolled Parent?
            </h3>
<p className="font-body-md text-body-md text-primary-fixed mb-space-md">
              Access your child's terminal cognitive transcripts, verify pending tuition settlements via Paystack, or schedule emergency teacher conferences directly.
            </p>
<div className="flex flex-col sm:flex-row gap-space-sm">
<a className="inline-flex items-center justify-center gap-space-xs px-4 py-2.5 rounded-lg bg-surface-container-lowest text-primary hover:bg-surface-container-low font-label-lg text-label-lg transition-all shadow-sm" href="/login">
<span className="">Enter Student Portal</span>
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">arrow_forward</span>
</a>
<a className="inline-flex items-center justify-center gap-space-xs px-4 py-2.5 rounded-lg bg-primary-container text-on-primary hover:bg-surface-tint font-label-lg text-label-lg transition-all" data-path="charter" href="/about">
<span className="">Parent Help Guide</span>
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">menu_book</span>
</a>
</div>
</div>
</div>
</div>
{/* Campus Walking Tour Invitation Banner */}
<div className="mt-space-xl p-space-lg lg:p-space-xl rounded-2xl bg-surface-container-lowest shadow-xl flex flex-col lg:flex-row items-center justify-between gap-space-lg">
<div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md">
<div className="w-16 h-16 rounded-2xl bg-secondary-container/40 text-on-secondary-container flex items-center justify-center shrink-0">
<span aria-hidden="true" className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "" }}>tour</span>
</div>
<div>
<div className="inline-flex items-center gap-space-xs px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm uppercase font-bold mb-1">
              Personalized Walking Tours
            </div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Experience Our Classrooms in Session</h2>
<p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              We warmly invite families to observe instructional moments firsthand. Guided walking tours are conducted Monday through Friday between <strong>9:00 AM and 1:00 PM</strong> to observe active teacher-pupil engagement and botanical play grounds.
            </p>
</div>
</div>
<div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-space-sm shrink-0">
<a className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-6 py-3 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg transition-all shadow-md"  href="#enquiry">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">calendar_month</span>
<span className="">Reserve a Morning Slot</span>
</a>
</div>
</div>
</div>
</div>
</div>

      </main>
      <PublicFooter />
    </div>
  );
}

