import type { Metadata } from "next";
import PublicEnquiryForm from "@/components/public/PublicEnquiryForm";
import React from "react";
import Link from "next/link";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";

export const metadata: Metadata = {"title": "About Edvora", "description": "Discover the learning approach and parent partnership behind Edvora Nursery & Primary School.", "alternates": {"canonical": "/about"}};

export default function AboutPage() {
  return (
    <div data-page="about" className="public-site min-h-screen flex flex-col bg-surface font-body-md text-on-surface">
      <PublicNavbar />
      <main id="main-content" className="public-main w-full flex-1">
        <div className="flex flex-col w-full">
{/* Top Editorial Hero & Narrative Intro */}
<section className="relative w-full overflow-hidden bg-surface-container-low py-space-xl lg:py-28">
<div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
<div className="lg:col-span-7 space-y-space-md">
<div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container text-primary font-label-sm text-label-sm uppercase tracking-widest shadow-sm">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
<span className="">About Edvora</span>
</div>
<h1 className="font-display-lg text-display-lg text-on-surface tracking-tight leading-tight">
            A caring school. A confident start.
          </h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Edvora supports nursery and primary pupils through thoughtful teaching, regular practice and a close partnership with families. Our approach encourages reading, curiosity, confidence and respect.</p>
<div className="pt-space-sm flex flex-wrap items-center gap-space-md">
<a className="inline-flex items-center gap-space-xs px-5 py-3 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg shadow-md hover:bg-primary transition-all" href="#admissions-connect">
<span className="">Visit Our School</span>
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">arrow_forward</span>
</a>
<a className="inline-flex items-center gap-space-xs px-5 py-3 rounded-lg bg-surface-container-lowest text-on-surface font-label-lg text-label-lg shadow-sm hover:bg-surface-variant transition-colors" href="#pedagogy">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]">menu_book</span>
<span className="">How We Teach</span>
</a>
</div>
<div className="grid grid-cols-3 gap-space-sm pt-space-lg">
<div className="p-space-sm rounded-xl bg-surface-container-lowest shadow-sm">
<div className="font-headline-lg text-headline-lg text-primary">Care</div>
<div className="font-label-sm text-label-sm text-on-surface-variant uppercase">Supportive teaching</div>
</div>
<div className="p-space-sm rounded-xl bg-surface-container-lowest shadow-sm">
<div className="font-headline-lg text-headline-lg text-secondary">Read</div>
<div className="font-label-sm text-label-sm text-on-surface-variant uppercase">Reading &amp; discovery</div>
</div>
<div className="p-space-sm rounded-xl bg-surface-container-lowest shadow-sm">
<div className="font-headline-lg text-headline-lg text-on-surface">Grow</div>
<div className="font-label-sm text-label-sm text-on-surface-variant uppercase">Learning &amp; wellbeing</div>
</div>
</div>
</div>
<div className="lg:col-span-5 relative">
<div className="relative rounded-3xl overflow-hidden shadow-xl bg-surface-container">
<img className="w-full h-[460px] object-cover" alt="Warm sunlight filtering through tall timber windows of an African primary school library where a thoughtful school educator reads an illustrated hardback volume with four attentive Nigerian pupils in smart emerald and cream uniforms seated comfortably on a woven natural rug." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2ivCqHGb5yjF1FItHAabNuJ9qcdHgthq1qWbwrYh-L3fy-MfMNaqDJ-9LRn2yw5njLtppo-X_IedvyBjRbAGEkzyLz0Y-kDIiDk-bWyldrHa4ArSxl1c7J61aFeEizmV3WLLfkwi6oPnDoXkE1czpW3y2zY9D3bUlDfxySR3NunCeBfVZy5GwXXp80XdzG5rVkZI_hC_df2sIgqGxGrfAogzYlYktiHHSLzPwZry3YhLzmae_vcEO" />
<div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent flex flex-col justify-end p-space-lg">
<span className="inline-block px-2.5 py-1 rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm w-fit uppercase">Our Haven</span>
<div className="text-on-primary font-headline-sm text-headline-sm mt-1">Stewardship without haste</div>
<p className="text-on-tertiary-container font-body-sm text-body-sm mt-0.5">Every child is heard, anchored in calm routines and unhurried intellectual wonder.</p>
</div>
</div>
</div>
</div>
</div>
</section>
{/* Narrative Founding Chapter */}
<section className="w-full py-space-xl bg-surface">
<div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin">
<div className="max-w-3xl mx-auto text-center space-y-space-sm mb-space-xl">
<span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">The Edvora Chronicle</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Built for Quiet Conviction and Joyful Discovery</h2>
<p className="font-body-md text-body-md text-on-surface-variant">How our founders reimagined early foundational learning in Edo State to honour children's innate natural rhythms.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
<div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-space-md">
<div className="space-y-space-sm">
<div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
<span aria-hidden="true" className="material-symbols-outlined text-[26px]">yard</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">The Botanical Sanctuary</h3>
<p className="font-body-md text-body-md text-on-surface-variant">
              Urban school compounds too often replace earth and trees with asphalt. Edvora's campus incorporates native shade trees, herb patches, and open breezes to ground young senses in natural tranquility.
            </p>
</div>
<div className="font-label-sm text-label-sm text-primary uppercase tracking-wider">Chapter I · Environment</div>
</div>
<div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-space-md">
<div className="space-y-space-sm">
<div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary">
<span aria-hidden="true" className="material-symbols-outlined text-[26px]">psychology_alt</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">De-escalating Early Pressure</h3>
<p className="font-body-md text-body-md text-on-surface-variant">
              We reject high-stakes testing for 4-year-olds. True numeracy and rich phonemic awareness flourish when learners are invited to test theories without the crippling fear of red-ink failure.
            </p>
</div>
<div className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Chapter II · Temperament</div>
</div>
<div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-space-md">
<div className="space-y-space-sm">
<div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary-container">
<span aria-hidden="true" className="material-symbols-outlined text-[26px]">handshake</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Parental Trust as Bedrock</h3>
<p className="font-body-md text-body-md text-on-surface-variant">
              We consider parents co-educators. We share complete qualitative insights—from social regulation triumphs to reading breakthroughs—fostering transparent, reassuring bonds every term.
            </p>
</div>
<div className="font-label-sm text-label-sm text-primary-container uppercase tracking-wider">Chapter III · Alliance</div>
</div>
</div>
</div>
</section>
{/* Mission, Vision & Core Values Mosaic */}
<section className="w-full py-space-xl bg-surface-container-low">
<div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin space-y-space-xl">
<div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg items-stretch">
<div className="p-space-xl rounded-3xl bg-primary text-on-primary shadow-lg flex flex-col justify-between space-y-space-md">
<div className="space-y-space-sm">
<div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm uppercase">
              Core Purpose
            </div>
<h3 className="font-headline-lg text-headline-lg text-on-primary">Our Mission</h3>
<p className="font-body-lg text-body-lg text-primary-fixed leading-relaxed">
              To provide an enriching foundational education that inspires academic excellence, moral depth, and emotional confidence, equipping every child to engage a complex world with intellectual curiosity and dignified self-worth.
            </p>
</div>
<div className="flex items-center gap-space-sm pt-space-md border-t-0">
<span aria-hidden="true" className="material-symbols-outlined text-[20px] text-secondary-fixed">auto_awesome</span>
<span className="font-label-md text-label-md text-on-primary tracking-wide">Rooted in character. Built for life.</span>
</div>
</div>
<div className="p-space-xl rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-space-md">
<div className="space-y-space-sm">
<div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase">
              The Horizon
            </div>
<h3 className="font-headline-lg text-headline-lg text-on-surface">Our Vision</h3>
<p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              A thriving generation of articulate, resilient, and socially compassionate learners who navigate local community obligations and global scholarship with equal grace, purpose, and humane conscience.
            </p>
</div>
<div className="flex items-center gap-space-sm pt-space-md">
<span aria-hidden="true" className="material-symbols-outlined text-[20px] text-primary">verified</span>
<span className="font-label-md text-label-md text-on-surface tracking-wide">Stewardship across Edo State &amp; West Africa</span>
</div>
</div>
</div>
{/* 5 Core Values */}
<div>
<div className="mb-space-md">
<h3 className="font-headline-md text-headline-md text-on-surface">The Five Edvora Pillars</h3>
<p className="font-body-md text-body-md text-on-surface-variant">Our day-to-day behavioural compass across classrooms, playgrounds, and assemblies.</p>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
<div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm space-y-space-xs hover:shadow-md transition-shadow">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[28px]">favorite</span>
<div className="font-headline-sm text-headline-sm text-on-surface">Thoughtful Care</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Attunement to each pupil’s physical safety, emotional baseline, and personal dignity.</p>
</div>
<div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm space-y-space-xs hover:shadow-md transition-shadow">
<span aria-hidden="true" className="material-symbols-outlined text-secondary text-[28px]">lightbulb</span>
<div className="font-headline-sm text-headline-sm text-on-surface">Scholarly Curiosity</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Inspiring independent inquiry, love for literature, and analytical problem-solving.</p>
</div>
<div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm space-y-space-xs hover:shadow-md transition-shadow">
<span aria-hidden="true" className="material-symbols-outlined text-primary-container text-[28px]">gavel</span>
<div className="font-headline-sm text-headline-sm text-on-surface">Moral Integrity</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Nurturing truth-telling, accountability in teamwork, and quiet uprightness.</p>
</div>
<div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm space-y-space-xs hover:shadow-md transition-shadow">
<span aria-hidden="true" className="material-symbols-outlined text-tertiary text-[28px]">groups</span>
<div className="font-headline-sm text-headline-sm text-on-surface">Mutual Respect</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Honouring diverse temperaments, elder wisdom, peer opinions, and environmental care.</p>
</div>
<div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm space-y-space-xs hover:shadow-md transition-shadow">
<span aria-hidden="true" className="material-symbols-outlined text-secondary text-[28px]">published_with_changes</span>
<div className="font-headline-sm text-headline-sm text-on-surface">Open Partnership</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Working hand-in-hand with parents through transparent, respectful communication.</p>
</div>
</div>
</div>
</div>
</section>
{/* Learning & Care Philosophy */}
<section className="w-full py-space-xl bg-surface" id="pedagogy">
<div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
<div className="lg:col-span-6 relative">
<div className="rounded-3xl overflow-hidden shadow-xl">
<img className="w-full h-[480px] object-cover" alt="An engaged small group of primary schoolchildren in a sunlit botanical science courtyard in Benin City, closely observing plant germination under magnifying glasses with their joyful educator holding a clipboard in gentle encouragement." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaJwExPp8MQjDV-G8lO5WM3UCN0NdiOCiVRga8VfBho6P2KGCB6FaPuKZDMhfHOnMTlBeMVFar5vtD1Icn-RGzTyctvS9cZBt1RQHsSpuDju7ySnimtFXvzgvbi4_DrGfeBnRgCnh41V_y7kTgQ6uOV8YCoa4LrXDLKwHhbQOH4QaIzDAGB0ElemjOvpR163ByXnwxMItClz-tV-vfWql5jtTNCS_pAFF45HVI7RqakzLkm8Q77Dt-" />
</div>
<div className="absolute -bottom-6 -right-4 p-space-md rounded-2xl bg-surface-container-lowest shadow-lg max-w-xs">
<div className="flex items-center gap-space-sm mb-1">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]">psychology</span>
<span className="font-label-sm text-label-sm text-primary uppercase">Active Pedagogy</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface">"Children absorb deeply when their natural instinct to touch, question, and reconstruct is protected."</p>
</div>
</div>
<div className="lg:col-span-6 space-y-space-md">
<div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container text-primary font-label-sm text-label-sm uppercase">
            Pedagogical Commitments
          </div>
<h2 className="font-headline-lg text-headline-lg text-on-surface leading-tight">
            Learning Designed Around Joyful Comprehension, Not Fear of Testing
          </h2>
<div className="space-y-space-md text-on-surface-variant font-body-md text-body-md">
<p className="">
              In our early nursery and foundational years, children are never subjected to artificial bell-curve rankings that generate childhood anxiety. Instead, educators employ milestone-tracking portfolios that document oral expression, emergent phonemic mastery, physical spatial reasoning, and social self-regulation.
            </p>
<div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm space-y-space-xs">
<div className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
<span className="">Individual Pacing Architecture</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                Early readers move between reading levels when their intrinsic comprehension and vocabulary are consolidated, preventing premature fatigue or unaddressed gaps.
              </p>
</div>
<div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm space-y-space-xs">
<div className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
<span className="">Positive Emotional Reinforcement</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                Discipline is restorative and instructive. We teach students to name big emotions, negotiate turn-taking respectfully, and repair peer conflicts with sincerity.
              </p>
</div>
<div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm space-y-space-xs">
<div className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-primary-container text-[20px]">check_circle</span>
<span className="">Rich Botanical Play &amp; Movement</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                Daily physical exploration, sensory sand-and-water tables, and structured motor skill intervals activate cognitive pathways that desk-bound worksheets cannot reach.
              </p>
</div>
</div>
</div>
</div>
</div>
</section>
{/* Faculty & Leadership Roles (Archetypes) */}
<section className="w-full py-space-xl bg-surface-container-low">
<div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin space-y-space-xl">
<div className="max-w-3xl mx-auto text-center space-y-space-xs">
<span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">Pedagogical Stewardship</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Faculty Leadership &amp; Mentorship Roles</h2>
<p className="font-body-md text-body-md text-on-surface-variant">
          Edvora is steered by career educators who combine developmental psychology with deep curricular fidelity. Meet the key pedagogical chairs anchoring our cohorts.
        </p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
{/* Archetype 1 */}
<div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-space-md">
<div className="space-y-space-sm">
<div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary">
<span aria-hidden="true" className="material-symbols-outlined text-[30px]">supervisor_account</span>
</div>
<div>
<div className="font-headline-sm text-headline-sm text-on-surface">Head of School &amp; Early Years Specialist</div>
<div className="font-label-sm text-label-sm text-primary uppercase mt-0.5">Academic Directorship</div>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
              Champions developmental transitions between nursery and primary. Focuses on play-based neurodevelopment, teacher mentoring, and wholesome school culture.
            </p>
</div>
<div className="pt-space-sm border-t-0 text-on-surface-variant font-label-sm text-label-sm flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
<span className="">Early Childhood Governance</span>
</div>
</div>
{/* Archetype 2 */}
<div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-space-md">
<div className="space-y-space-sm">
<div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-secondary">
<span aria-hidden="true" className="material-symbols-outlined text-[30px]">calculate</span>
</div>
<div>
<div className="font-headline-sm text-headline-sm text-on-surface">Lead Numeracy &amp; STEM Coordinator</div>
<div className="font-label-sm text-label-sm text-secondary uppercase mt-0.5">Lower &amp; Upper Primary</div>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Supports pupils as they build confidence with numbers, everyday science and practical problem-solving.</p>
</div>
<div className="pt-space-sm border-t-0 text-on-surface-variant font-label-sm text-label-sm flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-primary">science</span>
<span className="">Mathematical Mastery Lead</span>
</div>
</div>
{/* Archetype 3 */}
<div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-space-md">
<div className="space-y-space-sm">
<div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary-container">
<span aria-hidden="true" className="material-symbols-outlined text-[30px]">book_online</span>
</div>
<div>
<div className="font-headline-sm text-headline-sm text-on-surface">Literacy &amp; Language Faculty Head</div>
<div className="font-label-sm text-label-sm text-primary-container uppercase mt-0.5">Phonics to Creative Prose</div>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
              Directs the synthetic phonics sequencing, reading sanctuary routines, and oratory declamation so pupils speak with poise and write with imaginative flair.
            </p>
</div>
<div className="pt-space-sm border-t-0 text-on-surface-variant font-label-sm text-label-sm flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-primary">edit_note</span>
<span className="">Oratory &amp; Literature Lead</span>
</div>
</div>
{/* Archetype 4 */}
<div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-space-md">
<div className="space-y-space-sm">
<div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-tertiary">
<span aria-hidden="true" className="material-symbols-outlined text-[30px]">sentiment_satisfied</span>
</div>
<div>
<div className="font-headline-sm text-headline-sm text-on-surface">Child Wellbeing &amp; Guidance Lead</div>
<div className="font-label-sm text-label-sm text-tertiary uppercase mt-0.5">Emotional &amp; Social Health</div>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
              Oversees emotional attunement, friendship circles, quiet-rest protocols, and pastoral interventions to ensure no child feels unseen or isolated.
            </p>
</div>
<div className="pt-space-sm border-t-0 text-on-surface-variant font-label-sm text-label-sm flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-secondary">health_and_safety</span>
<span className="">Pastoral Wellbeing Lead</span>
</div>
</div>
</div>
</div>
</section>
{/* Family Partnership Charter */}
<section className="w-full py-space-xl bg-surface">
<div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin">
<div className="p-space-xl rounded-3xl bg-surface-container-lowest shadow-md">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
<div className="lg:col-span-5 space-y-space-sm">
<span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">Parental Alliance</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface">The Family Partnership Charter</h2>
<p className="font-body-md text-body-md text-on-surface-variant">
              Education is a mutual pledge. We maintain an open, proactive channel between home and school, ensuring you never wonder how your child is progressing or feeling.
            </p>
<div className="pt-space-sm">
<div className="p-space-md rounded-2xl bg-surface-container-low space-y-1">
<div className="font-label-lg text-label-lg text-primary flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">notifications_active</span>
<span className="">Accessible School Leadership</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                  Our Head of School and Key Stage coordinators preserve daily morning consultation slots for parents wishing to discuss specific developmental needs.
                </p>
</div>
</div>
</div>
<div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-space-md">
<div className="p-space-md rounded-2xl bg-surface-container space-y-space-xs">
<div className="w-10 h-10 rounded-xl bg-surface-container-lowest text-primary flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">forum</span>
</div>
<div className="font-headline-sm text-headline-sm text-on-surface">Weekly Highlights</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                Every Friday, parents receive classroom recaps, thematic project updates, and practical discussion prompts to bridge home conversations.
              </p>
</div>
<div className="p-space-md rounded-2xl bg-surface-container space-y-space-xs">
<div className="w-10 h-10 rounded-xl bg-surface-container-lowest text-secondary flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">event_note</span>
</div>
<div className="font-headline-sm text-headline-sm text-on-surface">Termly Conferences</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                Dedicated 25-minute one-on-one evaluations examining your child's continuous portfolios, reading logs, and peer integration.
              </p>
</div>
<div className="p-space-md rounded-2xl bg-surface-container space-y-space-xs">
<div className="w-10 h-10 rounded-xl bg-surface-container-lowest text-primary-container flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">devices</span>
</div>
<div className="font-headline-sm text-headline-sm text-on-surface">Secure Student Portal</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                Instant digital access to attendance, verified Paystack fee settlements, medical health notes, and verified terminal report cards.
              </p>
</div>
<div className="p-space-md rounded-2xl bg-surface-container space-y-space-xs">
<div className="w-10 h-10 rounded-xl bg-surface-container-lowest text-tertiary flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">campaign</span>
</div>
<div className="font-headline-sm text-headline-sm text-on-surface">Transparent Feedback</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                Regular anonymous parent sentiment reviews ensure policy adjustments reflect the families who place their beloved children in our care.
              </p>
</div>
</div>
</div>
</div>
</div>
</section>
{/* Campus Environment & Community */}
<section className="w-full py-space-xl bg-surface-container-low">
<div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin space-y-space-xl">
<div className="max-w-3xl mx-auto text-center space-y-space-xs">
<span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">The Learning Grounds</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Thoughtfully Designed Spaces for Focus &amp; Wellbeing</h2>
<p className="font-body-md text-body-md text-on-surface-variant">
          Architecture informs how young minds breathe and concentrate. Explore our secure physical environment with your child.
        </p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
<div className="rounded-3xl overflow-hidden bg-surface-container-lowest shadow-sm flex flex-col">
<div className="h-60 overflow-hidden">
<img className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="An expansive secure school courtyard with manicured green lawns, botanical shade trees, clean paved walkways, and wooden play equipment under bright midday Benin City sky." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnJXxlR2X9bumkgnJR3Vfh_CTzw1Fg-pZqy-wJ6ruIcccfxQdInyC9t1n-Yc8nI0anUfrCuBJHQ-qJ_KszgGWVFgftvD4Ebi2pYo11pSeApQz1M88maGuvWKHAztUHQ3pzEDmy8KiQYCWFXZzeWTk-gq1E6VhMOJENolprz7iXNYTxInf4WV39BXn-Cgm7j6zm04_TGhNYDN0eKa53sIjImAqq5k01f8_cSPOX8YtFqe_YQ-5U9aeo" />
</div>
<div className="p-space-lg flex-1 flex flex-col justify-between space-y-space-sm">
<div className="space-y-space-xs">
<span className="inline-block px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm uppercase">Grounds</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Enclosed Safe Grounds</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                Single-gate guarded perimeter, round-the-clock trained safety personnel, biometric pickup verifications, and soft playground surfaces.
              </p>
</div>
<div className="text-primary font-label-sm text-label-sm flex items-center gap-1">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">shield</span>
<span className="">Controlled Safety Protocols</span>
</div>
</div>
</div>
<div className="rounded-3xl overflow-hidden bg-surface-container-lowest shadow-sm flex flex-col">
<div className="h-60 overflow-hidden">
<img className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="An airy primary classroom with high ceilings, louvered cross-ventilation windows, natural timber desks arranged in cooperative clusters, and colorful student art boards." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAph0W_MWbVWQRQU-GKXuqM0AzBgi2JFg3u_vW1zcU3RjeUSwPVpGgeUiIiLV4JKa2w_vDDJc-DMnP_iQBSpdkNi698oG3-KKavDNTKz4sBHca0KgcatXCC8IaotkdppvWceAOG55nEcyhg6Odi5B8-zC4U0FaOsOnw6zRF0Qv0dn3ZIgZBORvpoq3L20t6JajdYky5tAePo2chHp80uGQ-Xma08ashaMWmpB1q1CeX8ruFUoBK6h6_" />
</div>
<div className="p-space-lg flex-1 flex flex-col justify-between space-y-space-sm">
<div className="space-y-space-xs">
<span className="inline-block px-2.5 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm uppercase">Acoustics &amp; Light</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Naturally Ventilated Studios</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                High-volume airflow, solar backup electricity, acoustic soft ceilings, and broad natural daylight reduce ocular fatigue throughout the academic day.
              </p>
</div>
<div className="text-secondary font-label-sm text-label-sm flex items-center gap-1">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">wb_sunny</span>
<span className="">Welcoming learning spaces</span>
</div>
</div>
</div>
<div className="rounded-3xl overflow-hidden bg-surface-container-lowest shadow-sm flex flex-col">
<div className="h-60 overflow-hidden">
<img className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="A tranquil children library sanctuary with low oak shelves filled with colourful storybooks, comfortable emerald cushions on tiered seating, and botanical plants." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTB_AiYTCrclGWMktEXnrLIAYQ2-OFk754HqtMH4VIFENYP7Jb_AIuDmdjv08dez5-UZa6PB017oNJKCsiHmO-QMgOfuTFODzjaZizpFJZvb-faX4tLqAxQi8LkfqUJBlWT1RDU_gcMLakhsYRiWFRphg3sqO-3n77Zcnc-fcB-ddanWdBCgTyAqjbv1seHhuNb4bZXLNp2P6P728gTYnUSmKbSxKNVa-yU39qx8HVh6fkdiKYqHUt" />
</div>
<div className="p-space-lg flex-1 flex flex-col justify-between space-y-space-sm">
<div className="space-y-space-xs">
<span className="inline-block px-2.5 py-0.5 rounded-full bg-surface-container text-primary-container font-label-sm text-label-sm uppercase">Curated Reading</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Dedicated Library Sanctuary</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                Over 3,400 curated fiction, non-fiction, folklore, and scientific reference volumes designed to foster independent, lifelong reading pleasure.
              </p>
</div>
<div className="text-primary-container font-label-sm text-label-sm flex items-center gap-1">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">local_library</span>
<span className="">Daily Story &amp; Research Hours</span>
</div>
</div>
</div>
</div>
</div>
</section>
{/* Invitation to Connect & Admissions CTA */}
<section className="w-full py-space-xl bg-surface" id="admissions-connect">
<div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin">
<div className="rounded-3xl bg-surface-container-high p-space-lg lg:p-space-xl shadow-md">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
<div className="lg:col-span-7 space-y-space-md">
<div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase">
              Admissions Open 2026 / 2027
            </div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">
              Begin Your Family's Journey with Edvora
            </h2>
<p className="font-body-lg text-body-lg text-on-surface-variant">
              We warmly welcome parents to step into our classrooms during regular instructional hours. Experience our tranquil acoustics, observe our educators in action, and see the difference a calm, loving environment makes.
            </p>
<div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md pt-space-xs">
<div className="flex items-center gap-space-xs text-on-surface font-label-md text-label-md">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px]">calendar_month</span>
<span className="">Personalized Campus Visits</span>
</div>
<div className="flex items-center gap-space-xs text-on-surface font-label-md text-label-md">
<span aria-hidden="true" className="material-symbols-outlined text-secondary text-[20px]">call</span>
<span className="">Admissions enquiries</span>
</div>
</div>
</div>
<div className="lg:col-span-5">
<div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm space-y-space-md">
<div className="space-y-space-xs">
<div className="font-headline-sm text-headline-sm text-on-surface">Schedule an Academy Tour</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Prepare your visit details to share with the school office.</p>
</div>
<PublicEnquiryForm idPrefix="about" />

</div>
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

