import React from "react";
import Link from "next/link";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";

export default function ContactPage() {
  return (
    <div className="public-site min-h-screen flex flex-col bg-surface font-body-md text-on-surface">
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
<span className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">Sample Config</span>
</div>
<h2 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">Admissions Quadrangle</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Contact the school office for directions and visit arrangements.</p>
</div>
<div className="mt-space-md pt-space-sm">
<span className="inline-flex items-center gap-space-xs font-label-md text-label-md text-primary font-bold">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">navigation</span>
              GRA Gate Access 01
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
<a className="block font-body-md text-body-md text-on-surface font-semibold hover:text-primary transition-colors" href="tel:+23452290840">Contact school office</a>
<a className="block font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="tel:+234800338672">Contact school office</a>
</div>
</div>
<div className="mt-space-md pt-space-sm">
<span className="inline-flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
<span className="w-2 h-2 rounded-full bg-primary-container"></span>
              Live attendant on duty
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
<a className="block font-body-md text-body-md text-on-surface hover:text-primary transition-colors truncate" href="mailto:admissions@edvora.edu.ng">Contact school office</a>
<a className="block font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors truncate" href="mailto:office@edvora.edu.ng">Contact school office</a>
</div>
</div>
<div className="mt-space-md pt-space-sm">
<span className="inline-flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
<span aria-hidden="true" className="material-symbols-outlined text-[14px] text-primary">schedule</span>
              Average response: &lt; 4 hours
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
<h2 className="font-headline-lg text-headline-lg text-on-surface">Direct Message &amp; Tour Scheduling</h2>
</div>
<div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm self-start sm:self-auto">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
                Admissions Session 2026/27
              </div>
</div>
<form className="space-y-space-md" id="contactTourForm">
{/* Name & Phone */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
<div className="space-y-space-xs">
<label className="block font-label-lg text-label-lg text-on-surface" htmlFor="fullName">
                    Parent / Guardian Full Name <span className="text-error">*</span>
</label>
<div className="relative">
<span aria-hidden="true" className="material-symbols-outlined absolute left-3 top-3 text-[20px] text-on-surface-variant">person</span>
<input className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" id="fullName" placeholder="e.g. Dr. Osamwonyi Ighodaro" required type="text" />
</div>
</div>
<div className="space-y-space-xs">
<label className="block font-label-lg text-label-lg text-on-surface" htmlFor="phoneNumber">
                    Contact Telephone <span className="text-error">*</span>
</label>
<div className="relative">
<span aria-hidden="true" className="material-symbols-outlined absolute left-3 top-3 text-[20px] text-on-surface-variant">phone</span>
<input className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" id="phoneNumber" placeholder="+234 803 000 0000" required type="tel" />
</div>
</div>
</div>
{/* Email & Pupil Interest */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
<div className="space-y-space-xs">
<label className="block font-label-lg text-label-lg text-on-surface" htmlFor="emailAddress">
                    Email Address <span className="text-error">*</span>
</label>
<div className="relative">
<span aria-hidden="true" className="material-symbols-outlined absolute left-3 top-3 text-[20px] text-on-surface-variant">alternate_email</span>
<input className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" id="emailAddress" placeholder="parent@domain.com" required type="email" />
</div>
</div>
<div className="space-y-space-xs">
<label className="block font-label-lg text-label-lg text-on-surface" htmlFor="classInterest">
                    Pupil's Age / Class Level
                  </label>
<div className="relative">
<span aria-hidden="true" className="material-symbols-outlined absolute left-3 top-3 text-[20px] text-on-surface-variant">child_care</span>
<select className="w-full pl-10 pr-8 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary shadow-sm appearance-none cursor-pointer" id="classInterest">
<option value="creche">Creche &amp; Toddlers (3 mos – 18 mos)</option>
<option value="playgroup">Playgroup / Early Discovery (18 mos – 3 yrs)</option>
<option value="nursery1">Nursery I (Ages 3 – 4)</option>
<option value="nursery2">Nursery II (Ages 4 – 5)</option>
<option value="primary13">Lower Primary (Grades 1 – 3)</option>
<option value="primary46">Upper Primary (Grades 4 – 6)</option>
<option value="general">Not sure yet / General Assessment</option>
</select>
<span aria-hidden="true" className="material-symbols-outlined absolute right-3 top-3 text-[20px] text-on-surface-variant pointer-events-none">expand_more</span>
</div>
</div>
</div>
{/* Inquiry Type Radio Strip */}
<div className="space-y-space-xs">
<label className="block font-label-lg text-label-lg text-on-surface">
                  Nature of Inquiry <span className="text-error">*</span>
</label>
<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
<label className="relative flex flex-col items-center p-3 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors has-[:checked]:bg-primary-container has-[:checked]:text-on-primary">
<input defaultChecked className="sr-only" name="inquiryType" type="radio" value="Admissions" />
<span aria-hidden="true" className="material-symbols-outlined text-[20px] mb-1">how_to_reg</span>
<span className="font-label-md text-label-md text-center">Admissions</span>
</label>
<label className="relative flex flex-col items-center p-3 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors has-[:checked]:bg-primary-container has-[:checked]:text-on-primary">
<input className="sr-only" name="inquiryType" type="radio" value="Campus Tour" />
<span aria-hidden="true" className="material-symbols-outlined text-[20px] mb-1">hiking</span>
<span className="font-label-md text-label-md text-center">Campus Tour</span>
</label>
<label className="relative flex flex-col items-center p-3 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors has-[:checked]:bg-primary-container has-[:checked]:text-on-primary">
<input className="sr-only" name="inquiryType" type="radio" value="Fee Structure" />
<span aria-hidden="true" className="material-symbols-outlined text-[20px] mb-1">receipt_long</span>
<span className="font-label-md text-label-md text-center">Fee Schedule</span>
</label>
<label className="relative flex flex-col items-center p-3 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors has-[:checked]:bg-primary-container has-[:checked]:text-on-primary">
<input className="sr-only" name="inquiryType" type="radio" value="Portal Support" />
<span aria-hidden="true" className="material-symbols-outlined text-[20px] mb-1">help_center</span>
<span className="font-label-md text-label-md text-center">Portal Help</span>
</label>
</div>
</div>
{/* Message box */}
<div className="space-y-space-xs">
<label className="block font-label-lg text-label-lg text-on-surface" htmlFor="messageBox">
                  Specific Requests or Preferred Tour Window
                </label>
<textarea className="w-full p-3 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary shadow-sm resize-y" id="messageBox" placeholder="Share your pupil's background, specific interests, or suggest dates and morning times between 9:00 AM and 1:00 PM for a personal walking tour..." rows={4}></textarea>
</div>
{/* Reassurance & Action Bar */}
<div className="pt-space-xs flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
<div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "" }}>verified_user</span>
<span className="">Strict confidentiality assured. Swift response within 24 operational hours.</span>
</div>
<button className="inline-flex items-center justify-center gap-space-xs px-6 py-3 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg shadow-md transition-all" type="submit">
<span className="">Submit Inquiry</span>
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">send</span>
</button>
</div>
</form>
{/* Success State Notification Mock */}
<div className="hidden mt-space-md p-space-md rounded-xl bg-primary-fixed text-on-primary-fixed flex items-start gap-space-sm" id="formSuccessToast">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[24px]">task_alt</span>
<div className="font-body-md text-body-md">
<strong className="font-headline-sm text-headline-sm block text-on-primary-fixed">Your request has been logged successfully.</strong>
                An Admissions Administrator will review your inquiry and follow up via telephone and email within 24 hours.
              </div>
</div>
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
<div className="space-y-space-sm" id="schoolFaqAccordion">
{/* Accordion Item 1 */}
<div className="rounded-xl bg-surface-container-low transition-colors duration-200 overflow-hidden">
<button aria-expanded="false" className="faq-toggle w-full px-space-md py-3.5 flex items-center justify-between text-left focus:outline-none" type="button">
<span className="font-headline-sm text-headline-sm text-on-surface pr-2">
                    What are the exact age entry requirements for Nursery and Primary 1?
                  </span>
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px] transition-transform duration-300 transform faq-icon">expand_more</span>
</button>
<div className="faq-content px-space-md pb-space-md text-on-surface-variant font-body-md text-body-md hidden">
                  Pupils entering Nursery I must be 3 years of age by September 30th of the academic year. For Primary 1, children must have completed their 5th year and turned 5 by July preceding entry, accompanied by an early development and phonics readiness assessment.
                </div>
</div>
{/* Accordion Item 2 */}
<div className="rounded-xl bg-surface-container-low transition-colors duration-200 overflow-hidden">
<button aria-expanded="false" className="faq-toggle w-full px-space-md py-3.5 flex items-center justify-between text-left focus:outline-none" type="button">
<span className="font-headline-sm text-headline-sm text-on-surface pr-2">What do pupils learn at Edvora?</span>
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px] transition-transform duration-300 faq-icon">expand_more</span>
</button>
<div className="faq-content px-space-md pb-space-md text-on-surface-variant font-body-md text-body-md hidden">Our nursery and primary programmes develop literacy, numeracy, everyday science, creative expression and social skills. Contact the school for the current curriculum details.</div>
</div>
{/* Accordion Item 3 */}
<div className="rounded-xl bg-surface-container-low transition-colors duration-200 overflow-hidden">
<button aria-expanded="false" className="faq-toggle w-full px-space-md py-3.5 flex items-center justify-between text-left focus:outline-none" type="button">
<span className="font-headline-sm text-headline-sm text-on-surface pr-2">Can families pay school fees in instalments?</span>
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px] transition-transform duration-300 faq-icon">expand_more</span>
</button>
<div className="faq-content px-space-md pb-space-md text-on-surface-variant font-body-md text-body-md hidden">Families can discuss flexible instalments with the school. View the amount due and make payments through the Student Portal. Balances update after payment verification.</div>
</div>
{/* Accordion Item 4 */}
<div className="rounded-xl bg-surface-container-low transition-colors duration-200 overflow-hidden">
<button aria-expanded="true" className="faq-toggle w-full px-space-md py-3.5 flex items-center justify-between text-left focus:outline-none" type="button">
<span className="font-headline-sm text-headline-sm text-on-surface pr-2">
                    How are academic updates shared without noisy group chats?
                  </span>
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px] transition-transform duration-300 faq-icon rotate-180">expand_more</span>
</button>
<div className="faq-content px-space-md pb-space-md text-on-surface-variant font-body-md text-body-md">Parents and guardians can view published results and payment records through the Student Portal. The school sends one-way SMS or Telegram reminders, and the office handles questions directly.</div>
</div>
{/* Accordion Item 5 */}
<div className="rounded-xl bg-surface-container-low transition-colors duration-200 overflow-hidden">
<button aria-expanded="false" className="faq-toggle w-full px-space-md py-3.5 flex items-center justify-between text-left focus:outline-none" type="button">
<span className="font-headline-sm text-headline-sm text-on-surface pr-2">
                    What safety protocols govern campus access and pupil dismissal?
                  </span>
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px] transition-transform duration-300 faq-icon">expand_more</span>
</button>
<div className="faq-content hidden px-space-md pb-space-md text-on-surface-variant font-body-md text-body-md">
                  Campus grounds are guarded 24/7 with strict visitor registration. Pupils are only dismissed to individuals holding an authorized digital security pass or registered parent fingerprint matching our registry. Non-custodial pick-ups require advance written portal dispatch.
                </div>
</div>
</div>
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
<a className="inline-flex items-center justify-center gap-space-xs px-4 py-2.5 rounded-lg bg-primary-container text-on-primary hover:bg-surface-tint font-label-lg text-label-lg transition-all" data-path="charter" href="#">
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
<button className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-6 py-3 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg transition-all shadow-md" type="button">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">calendar_month</span>
<span className="">Reserve a Morning Slot</span>
</button>
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
