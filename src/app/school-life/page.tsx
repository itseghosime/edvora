import type { Metadata } from "next";
import FacilityShowcase from "@/components/public/FacilityShowcase";
import React from "react";
import Link from "next/link";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";

export const metadata: Metadata = {"title": "School Life | Edvora", "description": "Explore learning spaces, creative activities and life beyond the classroom at Edvora.", "alternates": {"canonical": "/school-life"}};

export default function SchoolLifePage() {
  return (
    <div data-page="school-life" className="public-site min-h-screen flex flex-col bg-surface font-body-md text-on-surface">
      <PublicNavbar />
      <main id="main-content" className="public-main w-full flex-1">
        <div className="flex flex-col w-full">
{/* Top Curated Hero Section with Botanical Atmosphere */}
<section className="relative w-full px-margin-mobile lg:px-margin max-w-7xl mx-auto pt-space-lg pb-space-xl">
<div className="relative overflow-hidden rounded-3xl bg-surface-container-lowest shadow-xl">
<div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-primary-fixed/20 blur-3xl pointer-events-none"></div>
<div className="absolute -left-20 bottom-0 w-80 h-80 rounded-full bg-secondary-fixed/30 blur-3xl pointer-events-none"></div>
<div className="relative z-10 p-space-md sm:p-space-lg lg:p-space-xl grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
<div className="lg:col-span-7 flex flex-col gap-space-md">
<div className="inline-flex items-center gap-space-xs self-start px-3 py-1.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm uppercase tracking-wider">
<span className="w-2 h-2 rounded-full bg-primary-container"></span>
<span className="">Benin City Campus Experience</span>
</div>
<h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">
            A Vibrant, Safe Haven for Joyful Growth
          </h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            At Edvora, education is rooted in unhurried wonder. We unite rigorous foundational academics with sunlit courtyards, tactile creative exploration, wholesome communal meals, and dignified pastoral care designed specifically for early learners in Edo State.
          </p>
<div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
<a className="inline-flex items-center gap-space-xs px-5 py-3 rounded-xl bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-primary transition-all shadow-md" href="#facility-showcase">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">explore</span>
<span className="">Explore Campus Spaces</span>
</a>
<a className="inline-flex items-center gap-space-xs px-5 py-3 rounded-xl bg-surface-container text-primary font-label-lg text-label-lg hover:bg-surface-container-high transition-all" href="/contact#enquiry">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">calendar_month</span>
<span className="">Schedule Physical Tour</span>
</a>
</div>
{/* Demo Disclaimer Pill */}
<div className="flex items-center gap-space-xs pt-space-xs text-on-surface-variant font-label-sm text-label-sm">
<span aria-hidden="true" className="material-symbols-outlined text-secondary text-[16px]">verified</span>
<span className="">Illustrative Campus Facilities · Verified On-Site Walkthrough Encouraged</span>
</div>
</div>
{/* Metric Mosaic & Live Atmosphere Card */}
<div className="lg:col-span-5 flex flex-col gap-space-md">
<div className="relative rounded-2xl overflow-hidden shadow-md">
<img className="w-full h-64 object-cover" alt="Joyful Nigerian elementary and nursery school pupils wearing tidy forest green uniforms seated together in an open-air sunlit courtyard library surrounded by lush tropical potted plants and mahogany bookshelves, high-end warm editorial photography style with natural golden sunlight." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-JbyWPv8dTYrsP-9S6NVKD6twThMtmnv1F-UmIXXOqxKOMuhajrRNXfO0-0xoUgu13zb6hbXRCI8ttdrYFXbABs8b5R-7pBzGAmGwxn9SKpwIEKRJi4ro6chYnbRDpTrQxMwgZf71WLrbywZqGUhXuYaVFzNmxbcHQ3pSc4B9-0csUrchtHkgveAwE0u0CHxRMR8oqMwi2K68f9Mh-5CxSgvFYfCsCgsVHhk2w_jupKMUf56YDwNm" />
<div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-inverse-surface/20 to-transparent flex items-end p-space-md">
<div className="text-on-primary">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed">Botanical Learning Habitat</span>
<p className="font-headline-sm text-headline-sm text-on-primary">Sunlit Verandas &amp; Courtyards</p>
</div>
</div>
</div>
{/* Quick Daily Rhythms Stat Row */}
<div className="grid grid-cols-3 gap-space-sm">
<div className="p-space-sm rounded-xl bg-surface-container text-center">
<span className="font-headline-lg text-headline-lg text-primary block">Care</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Early Teacher Ratio</span>
</div>
<div className="p-space-sm rounded-xl bg-surface-container text-center">
<span className="font-headline-lg text-headline-lg text-secondary block">Grow</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Secure Perimeter</span>
</div>
<div className="p-space-sm rounded-xl bg-surface-container text-center">
<span className="font-headline-lg text-headline-lg text-primary block">3,500+</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Curated Children Books</span>
</div>
</div>
</div>
</div>
</div>
</section>
{/* Section 2: Interactive Facility Showcase with Category Tabs & Bento Grid */}
<section className="w-full px-margin-mobile lg:px-margin max-w-7xl mx-auto py-space-xl" id="facility-showcase">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
<div className="space-y-space-xs">
<div className="inline-flex items-center gap-space-xs text-primary font-label-md text-label-md uppercase tracking-wider">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">domain</span>
<span className="">Architectural Sanctuary</span>
</div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Curated Learning Environments</h2>
<p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
          Every space at Edvora is tailored with acoustic tranquility, natural breezes, clean lines, and child-height fittings that empower independent discovery.
        </p>
</div>
</div>
<FacilityShowcase />
</section>
{/* Section 3: The Daily Experience — Beyond the Classroom */}
<section className="w-full bg-surface-container-lowest py-space-xl shadow-sm">
<div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin space-y-space-xl">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
<div>
<span className="font-label-md text-label-md uppercase tracking-wider text-secondary">The Edvora Rhythm</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">A Day in the Life: Beyond the Desk</h2>
</div>
<p className="font-body-md text-body-md text-on-surface-variant max-w-md">
          True confidence blossoms outside standard textbooks. We architect every school day to cultivate mindfulness, healthy nourishment, and collaborative passions.
        </p>
</div>
{/* 3 Key Daily Pillars */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
{/* Pillar 1 */}
<div className="flex flex-col p-space-lg rounded-2xl bg-surface-container-low transition-transform hover:-translate-y-1">
<div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center mb-space-md">
<span aria-hidden="true" className="material-symbols-outlined text-[24px]">self_improvement</span>
</div>
<span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">08:00 AM · Grounding</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 mb-2">Morning Assembly &amp; Mindfulness Circle</h3>
<p className="font-body-md text-body-md text-on-surface-variant">
            Each morning starts not with rigid shouting, but with communal breathing, recitation of personal virtues, student presentations, and cheerful choral singing under shaded palms.
          </p>
</div>
{/* Pillar 2 */}
<div className="flex flex-col p-space-lg rounded-2xl bg-surface-container-low transition-transform hover:-translate-y-1">
<div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-space-md">
<span aria-hidden="true" className="material-symbols-outlined text-[24px]">restaurant</span>
</div>
<span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">10:30 AM · Vitality</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 mb-2">Mid-Morning Hydration &amp; Fresh Fruit</h3>
<p className="font-body-md text-body-md text-on-surface-variant">
            Supervised dining etiquette with farm-fresh sliced pineapples, pawpaw, wholesome whole-grain snacks, and pure chilled water stations to prevent afternoon fatigue.
          </p>
</div>
{/* Pillar 3 */}
<div className="flex flex-col p-space-lg rounded-2xl bg-surface-container-low transition-transform hover:-translate-y-1">
<div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center mb-space-md">
<span aria-hidden="true" className="material-symbols-outlined text-[24px]">extension</span>
</div>
<span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">01:30 PM · Discovery</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 mb-2">Co-Curricular Enrichment Clubs</h3>
<p className="font-body-md text-body-md text-on-surface-variant">
            Students rotate through specialized electives designed to uncover latent talents, build team camaraderie, and spark creative curiosity without exam stress.
          </p>
</div>
</div>
{/* Co-Curricular Mosaic Detail */}
<div className="p-space-lg rounded-2xl bg-surface-container">
<div className="flex items-center justify-between mb-space-md">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Weekly Clubs &amp; Enrichment Tracks</h3>
<span className="font-label-sm text-label-sm px-3 py-1 rounded-full bg-surface-container-lowest text-primary">Included in Tuition</span>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
<div className="p-space-md rounded-xl bg-surface-container-lowest flex items-start gap-space-sm">
<div className="p-2 rounded-lg bg-surface-container text-primary">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">military_tech</span>
</div>
<div>
<h4 className="font-label-lg text-label-lg text-on-surface">Chess &amp; Logic Guild</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Pattern recognition and strategic foresight for classes 2 to 6.</p>
</div>
</div>
<div className="p-space-md rounded-xl bg-surface-container-lowest flex items-start gap-space-sm">
<div className="p-2 rounded-lg bg-surface-container text-primary">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">record_voice_over</span>
</div>
<div>
<h4 className="font-label-lg text-label-lg text-on-surface">Young Orators &amp; Debaters</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Poise, diction, articulate speech, and respectful perspective sharing.</p>
</div>
</div>
<div className="p-space-md rounded-xl bg-surface-container-lowest flex items-start gap-space-sm">
<div className="p-2 rounded-lg bg-surface-container text-primary">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">potted_plant</span>
</div>
<div>
<h4 className="font-label-lg text-label-lg text-on-surface">Junior Green Thumbs</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Organic vegetable beds, rain catchment, and composting stewardship.</p>
</div>
</div>
<div className="p-space-md rounded-xl bg-surface-container-lowest flex items-start gap-space-sm">
<div className="p-2 rounded-lg bg-surface-container text-primary">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">music_note</span>
</div>
<div>
<h4 className="font-label-lg text-label-lg text-on-surface">African Rhythms &amp; Choir</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Bini folklore songs, polyrhythmic drumming, and choral harmony.</p>
</div>
</div>
</div>
</div>
</div>
</section>
{/* Section 4: Child Wellbeing & Safety Architecture */}
<section className="w-full px-margin-mobile lg:px-margin max-w-7xl mx-auto py-space-xl">
<div className="relative overflow-hidden rounded-3xl bg-inverse-surface text-inverse-on-surface p-space-lg sm:p-space-xl">
<div className="absolute -right-10 -bottom-10 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none"></div>
<div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
<div className="lg:col-span-5 space-y-space-md">
<div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-primary-container text-primary-fixed font-label-sm text-label-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">shield</span>
<span className="">Safety Architecture</span>
</div>
<h2 className="font-headline-lg text-headline-lg text-on-primary">
            Peace of Mind Built into Every Square Metre
          </h2>
<p className="font-body-md text-body-md text-surface-variant">
            We operate an uncompromising physical security perimeter and vetting system so educators and children can focus exclusively on the joy of discovery.
          </p>
<div className="pt-space-xs flex flex-col gap-space-sm">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-lg bg-surface-container-highest/20 flex items-center justify-center text-primary-fixed">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">badge</span>
</div>
<span className="font-body-md text-body-md">Biometric &amp; Photo-ID Gate Verification</span>
</div>
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-lg bg-surface-container-highest/20 flex items-center justify-center text-primary-fixed">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">videocam</span>
</div>
<span className="font-body-md text-body-md">School routines support pupil care</span>
</div>
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-lg bg-surface-container-highest/20 flex items-center justify-center text-primary-fixed">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">group_add</span>
</div>
<span className="font-body-md text-body-md">Authorised Guardian Pickup Passcodes</span>
</div>
</div>
</div>
{/* Interactive Safety Checklist Infographic */}
<div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-space-md">
<div className="p-space-md rounded-2xl bg-surface-container-highest/10 backdrop-blur-md">
<span aria-hidden="true" className="material-symbols-outlined text-secondary-fixed text-[30px] mb-space-xs">verified</span>
<h4 className="font-headline-sm text-headline-sm text-on-primary mb-1">Staff &amp; Family Partnership</h4>
<p className="font-body-sm text-body-sm text-surface-variant">Every educator, teaching assistant, and security team member undergoes rigorous Edo State police character screening.</p>
</div>
<div className="p-space-md rounded-2xl bg-surface-container-highest/10 backdrop-blur-md">
<span aria-hidden="true" className="material-symbols-outlined text-primary-fixed text-[30px] mb-space-xs">medical_services</span>
<h4 className="font-headline-sm text-headline-sm text-on-primary mb-1">Wellbeing Support</h4>
<p className="font-body-sm text-body-sm text-surface-variant">Please discuss medical needs and available support directly with the school before enrolment.</p>
</div>
<div className="p-space-md rounded-2xl bg-surface-container-highest/10 backdrop-blur-md">
<span aria-hidden="true" className="material-symbols-outlined text-primary-fixed text-[30px] mb-space-xs">fence</span>
<h4 className="font-headline-sm text-headline-sm text-on-primary mb-1">School Grounds</h4>
<p className="font-body-sm text-body-sm text-surface-variant">Anti-climb gated perimeters with manned security guardhouse and anti-tailgating vehicle barrier bollards.</p>
</div>
<div className="p-space-md rounded-2xl bg-surface-container-highest/10 backdrop-blur-md">
<span aria-hidden="true" className="material-symbols-outlined text-secondary-fixed text-[30px] mb-space-xs">water_drop</span>
<h4 className="font-headline-sm text-headline-sm text-on-primary mb-1">Everyday School Routines</h4>
<p className="font-body-sm text-body-sm text-surface-variant">Dual-stage reverse osmosis filtration tested quarterly for clean, continuous drinking and handwashing access.</p>
</div>
</div>
</div>
</div>
</section>
{/* Section 5: Interactive Photo Lightbox Preview Banner & Physical Tour CTA */}
<section className="w-full px-margin-mobile lg:px-margin max-w-7xl mx-auto pb-space-xl">
<div className="rounded-3xl bg-surface-container-lowest p-space-md sm:p-space-lg shadow-sm">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-md">
<div>
<span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Visual Walkthrough</span>
<h3 className="font-headline-md text-headline-md text-on-surface">Campus Photo Lightbox</h3>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Click any image to enlarge and preview our daily learning environment.</p>
</div>
{/* Clickable Photo Reel */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm">
<div className="group relative  overflow-hidden rounded-xl h-44">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" alt="Playful kindergarten toddlers in Benin City laughing as they assemble large foam geometric building blocks on an outdoor covered deck." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDi-kYdQv11u4xUkUrQk3rXhHtz64f4wl8x5gk9n9xgPVkE94_hp6Gbuhb354_V_viqs5LzTQFxi2uHcWDHJmmE5Um_6HRhwwhwII6yXfUZVVehEW-wr2mpQQn5k0vdhPmhiOo-0Vm-78RPMtQz96R5QIln-d7n6P2PljwtofjS5i47H0AmU7m5kwy0WRLEE_Flu1K7eWlyBg34nR8lKBLYoK6v_MPWenzevytBLvFQg03tXGkycj9R" />
<div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-on-primary text-[28px]">photo_library</span>
</div>
</div>
<div className="group relative  overflow-hidden rounded-xl h-44">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" alt="Primary school students tending to raised organic garden beds with watering cans in Benin City campus, surrounded by tropical lush vegetation." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC50OsguR0WYhMdY9xNindiQhtFwlo2WEbn2VES2rJ-xoeO_34F7AZDJR4ikQW19sSXMeTtgoLkgYPVPY7CHpuOCvvzoyoD_kEHA1jXBa3kHaO5gka_Uny_iMfwcQqc_rAOG0QZkf5xTuOPLdGmlP3qKgT4cB6n1j0C2BrRuMCWviefUdM4du5Dwbe7aJQ_Led-ifKAyeSMoJ-gwsY_aSFAwL9OHqfvFlBMPPN4aVB13hkMcfuT4ypL" />
<div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-on-primary text-[28px]">photo_library</span>
</div>
</div>
<div className="group relative  overflow-hidden rounded-xl h-44">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" alt="Spacious spotless school dining hall with natural timber tables, children seated peacefully eating nutritious fresh meals under ceiling fans." src="https://lh3.googleusercontent.com/aida-public/AB6AXuACu6FEaRLStfLTYTZIWNQ9yxnlLgEOTSIjaOQdAioOIcpr2b8rSmNWBXlEasWJn--NC_hr-N_DJ6DK5aBgqzqbNpzlCTT6VpGtBFpK4z0iFpj0QJ7KdIcfDR__pHq7JrMHPxvH8oXfVZBjwLhhp1eyrPuChx6jkfr78hhHFxebk1roc8AScDK7HfRNJNQarkGhOrBeO7urv8jjp99PocgUS_oe-_9kXmoBgPJLcEBCLjqSmIp9UuOg" />
<div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-on-primary text-[28px]">photo_library</span>
</div>
</div>
<div className="group relative  overflow-hidden rounded-xl h-44">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" alt="Nigerian primary school pupils wearing patterned native Edo fabric sashes playing traditional talking drums and maracas on a wooden stage." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaNWf_gdaM9vEHnwJkhwZhdSDFGAlJ5_IjK88V_TY5d4JgqgolZYB_eXpQPfe0uBD0_d2h2WG09ry9SI1ZGwZn5ekQruuSfnTANRhWdrP6OPOGqZawsL5uhgAeIeerm5e4BfgV5_GnCTGm0H01HwdzVnRu2fpB-GuiSucr5Wct_nTuEgI9hIG4vYvJgfrEzqZxIWJppEhKDj7uOc8yaMynAWCX-sIPd_Hr4dIJqJXE3pKq0Vn_729l" />
<div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-on-primary text-[28px]">photo_library</span>
</div>
</div>
</div>
{/* Bottom Physical Tour Callout */}
<div className="mt-space-lg p-space-md rounded-2xl bg-surface-container flex flex-col md:flex-row items-center justify-between gap-space-md">
<div className="flex items-center gap-space-md">
<div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
<span aria-hidden="true" className="material-symbols-outlined text-[26px]">directions_walk</span>
</div>
<div>
<h4 className="font-headline-sm text-headline-sm text-on-surface">Experience Edvora with Your Child</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Discuss a suitable visit time with the school office before travelling.</p>
</div>
</div>
<div className="flex items-center gap-space-sm w-full md:w-auto">
<a className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-primary transition-all text-center" href="/contact#enquiry">
            Book Guided Visit
          </a>
<a className="px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface font-label-lg text-label-lg hover:bg-surface-container-high transition-all flex items-center gap-1 shrink-0" href="/contact#enquiry">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">call</span>
<span className="hidden sm:inline">Admissions enquiries</span>
</a>
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

