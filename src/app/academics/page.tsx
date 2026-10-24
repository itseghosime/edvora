import type { Metadata } from "next";
import DailyRhythm from "@/components/public/DailyRhythm";
import React from "react";
import Link from "next/link";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";

export const metadata: Metadata = {"title": "Academics | Edvora", "description": "Explore nursery and primary programmes, daily learning and how results are shared with families.", "alternates": {"canonical": "/academics"}};

export default function AcademicsPage() {
  return (
    <div className="public-site min-h-screen flex flex-col bg-surface font-body-md text-on-surface">
      <PublicNavbar />
      <main id="main-content" className="public-main w-full flex-1">
        <div className="flex flex-col w-full">
{/* SECTION 1: Editorial Academic Header & Blended Curriculum Synthesis */}
<section className="relative w-full overflow-hidden bg-surface-container-low py-space-xl lg:py-28 px-margin-mobile lg:px-margin">
{/* Atmospheric decorative blur */}
<div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-primary-fixed-dim/30 blur-3xl pointer-events-none"></div>
<div className="absolute -bottom-32 left-10 w-80 h-80 rounded-full bg-secondary-fixed/40 blur-3xl pointer-events-none"></div>
<div className="max-w-7xl mx-auto relative z-10">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-end mb-space-xl">
<div className="lg:col-span-8 space-y-space-md">
<div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container-lowest text-primary shadow-sm font-label-sm text-label-sm tracking-wider uppercase">
<span className="w-2 h-2 rounded-full bg-primary"></span>
            Learning at Edvora
          </div>
<h1 className="font-display-lg text-display-lg text-on-surface tracking-tight text-balance">
            Small discoveries. Strong foundations.
          </h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">Our nursery and primary programmes build literacy, numeracy, curiosity and confidence through age-appropriate learning and supportive teaching.</p>
</div>
<div className="lg:col-span-4 flex flex-col justify-end space-y-space-sm bg-surface-container-lowest p-space-lg rounded-3xl shadow-sm">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm uppercase text-secondary font-bold tracking-widest">Pedagogical Framework</span>
<span aria-hidden="true" className="material-symbols-outlined text-secondary text-[22px]">auto_stories</span>
</div>
<div className="font-headline-lg text-headline-lg text-primary">Nursery &amp; Primary Learning</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Learning activities support foundational reading, mathematics, creative expression and understanding of the world.</p>
<div className="pt-2 flex items-center gap-2 text-on-primary-container font-label-md text-label-md">
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-primary">verified</span>
<span className="text-primary">Nursery &amp; Primary Programmes</span>
</div>
</div>
</div>
{/* Bento Overview Highlights */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
<div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between">
<div className="space-y-space-xs mb-space-md">
<div className="w-10 h-10 rounded-xl bg-primary-container/10 text-primary flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">psychology</span>
</div>
<div className="font-headline-sm text-headline-sm text-on-surface pt-2">Cognitive Flourishing</div>
<p className="font-body-md text-body-md text-on-surface-variant">Inquiry-led learning stimulates organic neuro-pathways, encouraging pupils to reason critically rather than rely on rote recitation.</p>
</div>
<div className="flex items-center gap-space-xs font-label-md text-label-md text-primary">
<span className="">Critical analysis from age 4</span>
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">arrow_forward</span>
</div>
</div>
<div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between">
<div className="space-y-space-xs mb-space-md">
<div className="w-10 h-10 rounded-xl bg-secondary-fixed/40 text-secondary flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">public</span>
</div>
<div className="font-headline-sm text-headline-sm text-on-surface pt-2">Cultural &amp; Regional Roots</div>
<p className="font-body-md text-body-md text-on-surface-variant">Deep immersion in Benin heritage, Nigerian civics, indigenous arts, and mother-tongue appreciation embedded seamlessly within modern lessons.</p>
</div>
<div className="flex items-center gap-space-xs font-label-md text-label-md text-secondary">
<span className="">Bespoke Edo cultural studies</span>
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">arrow_forward</span>
</div>
</div>
<div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between">
<div className="space-y-space-xs mb-space-md">
<div className="w-10 h-10 rounded-xl bg-primary-container/10 text-primary flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">sentiment_satisfied</span>
</div>
<div className="font-headline-sm text-headline-sm text-on-surface pt-2">Pastoral Compassion</div>
<p className="font-body-md text-body-md text-on-surface-variant">Teachers support pupils through clear explanations, guided practice and regular feedback.</p>
</div>
<div className="flex items-center gap-space-xs font-label-md text-label-md text-primary">
<span className="">Supportive classroom learning</span>
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">arrow_forward</span>
</div>
</div>
</div>
</div>
</section>
{/* SECTION 2: Programme Pathways & Key Stages (Progressive Asymmetric Flow) */}
<section className="w-full py-space-xl lg:py-28 px-margin-mobile lg:px-margin bg-surface">
<div className="max-w-7xl mx-auto space-y-space-xl">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
<div className="space-y-space-xs">
<div className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest">Linear Growth Pathway</div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Structured Key Stages of Discovery</h2>
</div>
<p className="font-body-md text-body-md text-on-surface-variant max-w-md">
          Each stage deliberately scaffolding upon prior neural and socio-emotional milestones, ensuring no developmental gap is left unaddressed.
        </p>
</div>
{/* Stage 1 & 2 Cards */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
{/* Stage 1: Crèche & Playgroup */}
<div className="bg-surface-container-lowest rounded-3xl p-space-lg lg:p-10 shadow-sm flex flex-col justify-between space-y-space-lg relative overflow-hidden group">
<div className="flex items-start justify-between">
<div className="space-y-1">
<span className="inline-block px-3 py-1 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed font-label-sm text-label-sm uppercase">18 Months – 3 Years</span>
<h3 className="font-headline-lg text-headline-lg text-on-surface pt-2">Crèche &amp; Playgroup</h3>
<p className="font-label-md text-label-md text-on-surface-variant font-normal">Foundational Sensory &amp; Neuro-Motor Atelier</p>
</div>
<span className="font-display-lg text-display-lg text-outline-variant/30 select-none">01</span>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
<div className="relative h-44 rounded-2xl overflow-hidden shadow-inner">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Nigerian toddlers and caregivers engaged in joyful sensory water and wooden block play inside a naturally lit botanical nursery classroom with warm earth tones, soft greenery, and organized wicker baskets." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZoHP94TdpfirURm2ZTvYbMJbE_HUGDY7_SStsPROKQ9AYpCWZVm3qcpmaOpF3DGoebbeb_NMfTHlUNjthjhBW-L4AV8f93RKrui42JTvn-O8g55wJo3rNhwb8DKT_oEa3JknAEa4akwc8k-NATIPR7UPaV1Vo94DDlDJ4ILv0e9o-ySZoH7QzCUKA9GYronrekTYHUYmgFCFCU4leDgzPtQvCevZrzN_4RWjS9AL_8zguRaRMbHHX" />
</div>
<div className="space-y-space-xs flex flex-col justify-center">
<div className="flex items-center gap-space-xs text-primary font-label-md text-label-md">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">check_circle</span>
<span className="">Sensory Play &amp; Textural Tactility</span>
</div>
<div className="flex items-center gap-space-xs text-primary font-label-md text-label-md">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">check_circle</span>
<span className="">Gross &amp; Fine Motor Precision</span>
</div>
<div className="flex items-center gap-space-xs text-primary font-label-md text-label-md">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">check_circle</span>
<span className="">Guided Social Acclimation</span>
</div>
<div className="flex items-center gap-space-xs text-primary font-label-md text-label-md">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">check_circle</span>
<span className="">Immersive Language Milestones</span>
</div>
</div>
</div>
<div className="bg-surface-container-low p-space-md rounded-2xl text-on-surface font-body-sm text-body-sm leading-relaxed">
<strong className="font-label-md text-label-md text-primary">Key Focus:</strong> Child-directed play under constant maternal care, enabling clean spatial exploration, responsive communicative gestures, and gentle daylight routines.
          </div>
</div>
{/* Stage 2: Nursery 1 & 2 */}
<div className="bg-surface-container-lowest rounded-3xl p-space-lg lg:p-10 shadow-sm flex flex-col justify-between space-y-space-lg relative overflow-hidden group">
<div className="flex items-start justify-between">
<div className="space-y-1">
<span className="inline-block px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm uppercase">Ages 3 – 5 Years</span>
<h3 className="font-headline-lg text-headline-lg text-on-surface pt-2">Nursery 1 &amp; Nursery 2</h3>
<p className="font-label-md text-label-md text-on-surface-variant font-normal">Emergent Literacy &amp; Concrete Numeracy</p>
</div>
<span className="font-display-lg text-display-lg text-outline-variant/30 select-none">02</span>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
<div className="relative h-44 rounded-2xl overflow-hidden shadow-inner">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="A small circle of four-year-old pupils in neat emerald and white school uniforms sitting around a low circular pine table with an educator, using Montessori phonics wooden letter cards and counting beads in Benin City." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgmRLmslAlZSComAbKzlkFBySG7xK7Ev9m15i5qmR7PR3m-KZMlfyLDkpkCc7VnfludAO7GPCkeQvxXdoe8ubIl8ku1U91N-Vg_cSNiCjp7_9nn6RHItiIVRiqr9u5RTTucdC27CZ7OBDdJrRHp789TL64IzT0Uznz_OmL_qLKxF7rjwGyzrbMTZhlp2SE76Qg84WDCw-oFLC_25gR1-Jm84gPDsbu_f10B73LAKmiYMx8AXhuxnQA" />
</div>
<div className="space-y-space-xs flex flex-col justify-center">
<div className="flex items-center gap-space-xs text-primary font-label-md text-label-md">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">check_circle</span>
<span className="">Synthetic Phonics Sound Recognition</span>
</div>
<div className="flex items-center gap-space-xs text-primary font-label-md text-label-md">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">check_circle</span>
<span className="">Concrete Quantity Mastery (1–50)</span>
</div>
<div className="flex items-center gap-space-xs text-primary font-label-md text-label-md">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">check_circle</span>
<span className="">Expressive Arts &amp; Hand-Eye Control</span>
</div>
<div className="flex items-center gap-space-xs text-primary font-label-md text-label-md">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">check_circle</span>
<span className="">Self-Regulated Morning Habits</span>
</div>
</div>
</div>
<div className="bg-surface-container-low p-space-md rounded-2xl text-on-surface font-body-sm text-body-sm leading-relaxed">
<strong className="font-label-md text-label-md text-primary">Key Focus:</strong> Translating phonemes into blends and words, connecting spatial shapes to mathematical logic, and building unwavering self-expression.
          </div>
</div>
</div>
{/* Stage 3 & 4 Cards */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
{/* Stage 3: Lower Primary */}
<div className="bg-surface-container-lowest rounded-3xl p-space-lg lg:p-10 shadow-sm flex flex-col justify-between space-y-space-lg relative overflow-hidden group">
<div className="flex items-start justify-between">
<div className="space-y-1">
<span className="inline-block px-3 py-1 rounded-full bg-surface-variant text-primary font-label-sm text-label-sm uppercase">Primary 1 – 3 (Ages 5 – 8)</span>
<h3 className="font-headline-lg text-headline-lg text-on-surface pt-2">Lower Primary</h3>
<p className="font-label-md text-label-md text-on-surface-variant font-normal">Active Fluency &amp; Scientific Discovery</p>
</div>
<span className="font-display-lg text-display-lg text-outline-variant/30 select-none">03</span>
</div>
<div className="space-y-space-sm">
<p className="font-body-md text-body-md text-on-surface-variant">
              Pupils transition from auditory phonics to independent literary comprehension, structured arithmetic operations, and biological exploration in our school vegetable gardens.
            </p>
<div className="grid grid-cols-2 gap-space-sm">
<div className="p-3 bg-surface-container-low rounded-xl">
<div className="font-label-md text-label-md text-primary">Reading Workshops</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">Daily 40-min guided fiction &amp; nonfiction literature.</div>
</div>
<div className="p-3 bg-surface-container-low rounded-xl">
<div className="font-label-md text-label-md text-primary">Quantitative Systems</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">Arithmetic reasoning, place values &amp; measurements.</div>
</div>
<div className="p-3 bg-surface-container-low rounded-xl">
<div className="font-label-md text-label-md text-primary">Environmental Studies</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">Tropical flora, weather cycles &amp; natural sciences.</div>
</div>
<div className="p-3 bg-surface-container-low rounded-xl">
<div className="font-label-md text-label-md text-primary">Heritage Lore</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">Edo traditional history and regional geography.</div>
</div>
</div>
</div>
<div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm pt-2">
<span className="">Reading and comprehension progress</span>
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[18px]">verified</span>
</div>
</div>
{/* Stage 4: Upper Primary */}
<div className="bg-surface-container-lowest rounded-3xl p-space-lg lg:p-10 shadow-sm flex flex-col justify-between space-y-space-lg relative overflow-hidden group">
<div className="flex items-start justify-between">
<div className="space-y-1">
<span className="inline-block px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase">Primary 4 – 6 (Ages 8 – 11)</span>
<h3 className="font-headline-lg text-headline-lg text-on-surface pt-2">Upper Primary</h3>
<p className="font-label-md text-label-md text-on-surface-variant font-normal">Dialectic Logic &amp; Secondary Transition</p>
</div>
<span className="font-display-lg text-display-lg text-outline-variant/30 select-none">04</span>
</div>
<div className="space-y-space-sm">
<p className="font-body-md text-body-md text-on-surface-variant">
              Scholars engage in debate, complex quantitative problem solving, scientific inquiry reports, and comprehensive mock preparations for premier Nigerian and foreign secondary colleges.
            </p>
<div className="grid grid-cols-2 gap-space-sm">
<div className="p-3 bg-surface-container-low rounded-xl">
<div className="font-label-md text-label-md text-primary">Advanced Composition</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">Expository essays, public discourse, elocution.</div>
</div>
<div className="p-3 bg-surface-container-low rounded-xl">
<div className="font-label-md text-label-md text-primary">STEM &amp; Algorithmic Logic</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">Practical problem-solving and digital awareness.</div>
</div>
<div className="p-3 bg-surface-container-low rounded-xl">
<div className="font-label-md text-label-md text-primary">Scientific Hypotheses</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">Empirical lab notebooks and controlled testing.</div>
</div>
<div className="p-3 bg-surface-container-low rounded-xl">
<div className="font-label-md text-label-md text-primary">Entrance Mastery</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">Preparation for the next stage of learning.</div>
</div>
</div>
</div>
<div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm pt-2">
<span className="">Readiness for secondary school</span>
<span aria-hidden="true" className="material-symbols-outlined text-secondary text-[18px]">workspace_premium</span>
</div>
</div>
</div>
</div>
</section>
{/* SECTION 3: Core Disciplines in Action (Rich Bento with Visual Data) */}
<section className="w-full py-space-xl lg:py-28 px-margin-mobile lg:px-margin bg-surface-container-low">
<div className="max-w-7xl mx-auto space-y-space-xl">
<div className="max-w-2xl space-y-space-xs">
<div className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest">Pedagogy In Practice</div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Core Disciplines Designed for Mastery</h2>
<p className="font-body-md text-body-md text-on-surface-variant">
          We treat each discipline not as isolated textbooks, but as interconnected cognitive instruments taught through touch, inquiry, and dialogue.
        </p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
{/* Discipline 1: Literacy & Oracy */}
<div className="bg-surface-container-lowest p-space-lg rounded-3xl shadow-sm flex flex-col justify-between space-y-space-md">
<div className="space-y-space-sm">
<div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-[24px]">record_voice_over</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-surface">Literacy &amp; Oracy</h3>
<p className="font-body-md text-body-md text-on-surface-variant">
              Every pupil speaks from the lectern weekly. From Oxford Reading Tree decoding to classical debate and creative prose composition.
            </p>
</div>
<div className="space-y-space-xs pt-4 bg-surface-container-low p-space-sm rounded-xl">
<div className="flex justify-between font-label-sm text-label-sm text-on-surface">
<span className="">Weekly Guided Reading</span>
<span className="font-bold text-primary">5 Hours</span>
</div>
<div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
<div className="bg-primary h-full rounded-full" style={{}}></div>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant block pt-1">Reading Buddies &amp; Library Pods</span>
</div>
</div>
{/* Discipline 2: Numeracy & Quantitative Reasoning */}
<div className="bg-surface-container-lowest p-space-lg rounded-3xl shadow-sm flex flex-col justify-between space-y-space-md">
<div className="space-y-space-sm">
<div className="w-12 h-12 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-[24px]">calculate</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-surface">Numeracy &amp; Logic</h3>
<p className="font-body-md text-body-md text-on-surface-variant">
              Concrete-Pictorial-Abstract (CPA) heuristic methodology. Children grasp concepts physically before pen encounters ledger.
            </p>
</div>
<div className="space-y-space-xs pt-4 bg-surface-container-low p-space-sm rounded-xl">
<div className="flex justify-between font-label-sm text-label-sm text-on-surface">
<span className="">Mental Math Accuracy</span>
<span className="font-bold text-secondary">Steady progress</span>
</div>
<div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
<div className="bg-secondary h-full rounded-full" style={{}}></div>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant block pt-1">Daily 10-Minute Quantitative Drill</span>
</div>
</div>
{/* Discipline 3: STEM & Discovery */}
<div className="bg-surface-container-lowest p-space-lg rounded-3xl shadow-sm flex flex-col justify-between space-y-space-md">
<div className="space-y-space-sm">
<div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-[24px]">biotech</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-surface">STEM Discovery</h3>
<p className="font-body-md text-body-md text-on-surface-variant">Practical discovery activities encourage pupils to ask questions and explore everyday science.</p>
</div>
<div className="space-y-space-xs pt-4 bg-surface-container-low p-space-sm rounded-xl">
<div className="flex justify-between font-label-sm text-label-sm text-on-surface">
<span className="">Practical In-Lab Sessions</span>
<span className="font-bold text-primary">Practical learning</span>
</div>
<div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
<div className="bg-primary h-full rounded-full" style={{}}></div>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant block pt-1">Hands-on discovery</span>
</div>
</div>
{/* Discipline 4: Creative & Cultural Arts */}
<div className="bg-surface-container-lowest p-space-lg rounded-3xl shadow-sm flex flex-col justify-between space-y-space-md">
<div className="space-y-space-sm">
<div className="w-12 h-12 rounded-2xl bg-surface-variant text-primary flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-[24px]">palette</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-surface">Creative Arts</h3>
<p className="font-body-md text-body-md text-on-surface-variant">
              West African drumming, bronze sculpting appreciation, ceramic pottery, watercolours, and active physical health education.
            </p>
</div>
<div className="space-y-space-xs pt-4 bg-surface-container-low p-space-sm rounded-xl">
<div className="flex justify-between font-label-sm text-label-sm text-on-surface">
<span className="">Studio &amp; Movement</span>
<span className="font-bold text-primary">3 Co-Clubs</span>
</div>
<div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
<div className="bg-primary h-full rounded-full" style={{}}></div>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant block pt-1">Termly Fine Art &amp; Musical Showcase</span>
</div>
</div>
</div>
</div>
</section>
<section className="w-full py-space-xl px-margin-mobile lg:px-margin bg-surface"><div className="max-w-7xl mx-auto space-y-6"><h2 className="font-headline-lg text-headline-lg">The Edvora Daily Rhythm</h2><DailyRhythm /></div></section>
{/* SECTION 5: Thoughtful Assessment & Reporting Philosophy (Continuous Assessment Model) */}
<section className="w-full py-space-xl lg:py-28 px-margin-mobile lg:px-margin bg-surface-container-low">
<div className="max-w-7xl mx-auto space-y-space-xl">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
<div className="lg:col-span-5 space-y-space-md">
<div className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest">Holistic Growth Metrics</div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Assessment Devoid of Fear: The Continuous Insight Model</h2>
<p className="font-body-md text-body-md text-on-surface-variant">
            Learning combines classroom practice, continuous assessment and examinations. The portal records continuous assessment out of 40 and examinations out of 60. Administrators review and publish results for families.
          </p>
<div className="space-y-space-sm pt-2">
<div className="flex items-start gap-space-sm">
<div className="w-8 h-8 rounded-full bg-primary-container/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">rule</span>
</div>
<div>
<div className="font-headline-sm text-headline-sm text-on-surface">Descriptive Progression Rubrics</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">Continuous assessment and examination scores show progress in each subject, alongside teacher feedback.</div>
</div>
</div>
<div className="flex items-start gap-space-sm">
<div className="w-8 h-8 rounded-full bg-primary-container/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">sync_alt</span>
</div>
<div>
<div className="font-headline-sm text-headline-sm text-on-surface">Student Portal Access</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">Published results are available through the Student Portal for pupils and their parents or guardians.</div>
</div>
</div>
<div className="flex items-start gap-space-sm">
<div className="w-8 h-8 rounded-full bg-primary-container/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">forum</span>
</div>
<div>
<div className="font-headline-sm text-headline-sm text-on-surface">Tri-Annual Parent Conferences</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">One-on-one 30-minute developmental consultations with lead educators and subject specialists every term.</div>
</div>
</div>
</div>
</div>
{/* Sample Terminal Progress Report Card Visual */}
<div className="lg:col-span-7 bg-surface-container-lowest p-space-lg lg:p-space-xl rounded-3xl shadow-md space-y-space-md">
<div className="flex items-center justify-between pb-space-sm">
<div>
<div className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider">Sample Terminal Dossier</div>
<div className="font-headline-sm text-headline-sm text-on-surface">Amina Osamede • Primary 3 Rosewood</div>
</div>
<span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-variant text-primary font-label-sm text-label-sm font-bold">First Term · 2026/2027</span>
</div>
{/* Progress Rings & Qualitative Metrics (Inline SVG) */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm py-2">
{/* Metric 1 */}
<div className="bg-surface-container-low p-space-sm rounded-2xl flex flex-col items-center text-center">
<svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
<path className="text-surface-variant" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3.5"></path>
<path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="92, 100" stroke-linecap="round" stroke-width="3.5"></path>
</svg>
<div className="font-headline-sm text-headline-sm text-on-surface mt-2">92%</div>
<span className="font-label-sm text-label-sm text-on-surface-variant">Reading Mastery</span>
</div>
{/* Metric 2 */}
<div className="bg-surface-container-low p-space-sm rounded-2xl flex flex-col items-center text-center">
<svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
<path className="text-surface-variant" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3.5"></path>
<path className="text-secondary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="88, 100" stroke-linecap="round" stroke-width="3.5"></path>
</svg>
<div className="font-headline-sm text-headline-sm text-on-surface mt-2">88%</div>
<span className="font-label-sm text-label-sm text-on-surface-variant">Arithmetic Logic</span>
</div>
{/* Metric 3 */}
<div className="bg-surface-container-low p-space-sm rounded-2xl flex flex-col items-center text-center">
<svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
<path className="text-surface-variant" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3.5"></path>
<path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="96, 100" stroke-linecap="round" stroke-width="3.5"></path>
</svg>
<div className="font-headline-sm text-headline-sm text-on-surface mt-2">96%</div>
<span className="font-label-sm text-label-sm text-on-surface-variant">Social Empathy</span>
</div>
</div>
{/* Qualitative Teacher Note */}
<div className="p-space-md bg-surface-container-low rounded-2xl space-y-space-xs">
<div className="flex items-center gap-space-xs text-primary font-label-md text-label-md">
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">format_quote</span>
<span className="">Lead Educator Observation • Mrs. E. Agho</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface italic">
              “Amina has demonstrated stellar growth in her spatial modeling of fractions. She regularly assists peers during collaborative science workshops and shows a deep affinity for Nigerian folklore composition.”
            </p>
</div>
<div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-2">
<div className="font-body-sm text-body-sm text-on-surface-variant">Contact the school to arrange a progress discussion.</div>
<a className="px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-all" href="/login">
              Access Full Digital Portal Dossier
            </a>
</div>
</div>
</div>
</div>
</section>
{/* SECTION 6: Educational Resources & Academic Support Ecosystem */}
<section className="w-full py-space-xl lg:py-28 px-margin-mobile lg:px-margin bg-surface">
<div className="max-w-7xl mx-auto space-y-space-xl">
<div className="text-center max-w-2xl mx-auto space-y-space-xs">
<div className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest">Nurture &amp; Acceleration</div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Every Learner Seen, Supported, and Stretched</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Pupils learn at different paces. Families can discuss learning needs and suitable classroom support with the school.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
{/* Resource Card 1 */}
<div className="bg-surface-container-lowest p-space-lg rounded-3xl shadow-sm flex flex-col justify-between space-y-space-md">
<div className="space-y-space-sm">
<div className="w-12 h-12 rounded-2xl bg-primary-container/10 text-primary flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-[24px]">spellcheck</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-surface">Early Literacy Intervention</h3>
<p className="font-body-md text-body-md text-on-surface-variant">Guided reading practice helps pupils develop sound recognition, vocabulary and comprehension.</p>
</div>
<ul className="space-y-space-xs pt-4 font-body-sm text-body-sm text-on-surface-variant">
<li className="flex items-center gap-2">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
<span className="">Discuss learning support with the school</span>
</li>
<li className="flex items-center gap-2">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
<span className="">Teacher-guided reading practice</span>
</li>
<li className="flex items-center gap-2">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
<span className="">Zero stigmatization guarantee</span>
</li>
</ul>
</div>
{/* Resource Card 2 */}
<div className="bg-surface-container-lowest p-space-lg rounded-3xl shadow-sm flex flex-col justify-between space-y-space-md">
<div className="space-y-space-sm">
<div className="w-12 h-12 rounded-2xl bg-secondary-fixed/40 text-secondary flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-[24px]">rocket_launch</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-surface">Accelerated Inquiry Lab</h3>
<p className="font-body-md text-body-md text-on-surface-variant">
              Tailored stretch projects for exceptionally gifted learners who master core curricula early, offering advanced mathematical investigations and author studies.
            </p>
</div>
<ul className="space-y-space-xs pt-4 font-body-sm text-body-sm text-on-surface-variant">
<li className="flex items-center gap-2">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span className="">Independent inquiry dissertations</span>
</li>
<li className="flex items-center gap-2">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span className="">Appropriate extension activities</span>
</li>
<li className="flex items-center gap-2">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span className="">Faculty mentorship dialogues</span>
</li>
</ul>
</div>
{/* Resource Card 3 */}
<div className="bg-surface-container-lowest p-space-lg rounded-3xl shadow-sm flex flex-col justify-between space-y-space-md">
<div className="space-y-space-sm">
<div className="w-12 h-12 rounded-2xl bg-surface-variant text-primary flex items-center justify-center">
<span aria-hidden="true" className="material-symbols-outlined text-[24px]">hearing</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-surface">Speaking &amp; Listening</h3>
<p className="font-body-md text-body-md text-on-surface-variant">Classroom conversations, reading aloud and group activities build speaking and listening confidence.</p>
</div>
<ul className="space-y-space-xs pt-4 font-body-sm text-body-sm text-on-surface-variant">
<li className="flex items-center gap-2">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
<span className="">Reading aloud and conversation</span>
</li>
<li className="flex items-center gap-2">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
<span className="">Bilingual mother-tongue transitions</span>
</li>
<li className="flex items-center gap-2">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
<span className="">Weekly confidence building lectern circles</span>
</li>
</ul>
</div>
</div>
{/* Action Callout Bar */}
<div className="bg-primary-container text-on-primary rounded-3xl p-space-lg lg:p-12 shadow-md flex flex-col md:flex-row items-center justify-between gap-space-lg">
<div className="space-y-space-xs text-center md:text-left max-w-2xl">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-fixed">Admissions &amp; Academic Tours</span>
<h3 className="font-headline-lg text-headline-lg text-on-primary">Witness Our Classrooms in Session</h3>
<p className="font-body-md text-body-md text-on-primary-container">Contact the school to learn more about teaching, learning and arranging a visit.</p>
</div>
<div className="flex flex-col sm:flex-row gap-space-sm w-full md:w-auto">
<a className="px-6 py-3.5 rounded-xl bg-on-primary text-primary font-label-lg text-label-lg hover:bg-surface-container-low transition-colors text-center shadow-sm" href="/admissions">
            Apply for Admission
          </a>
<a className="px-6 py-3.5 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg hover:bg-on-primary-fixed-variant transition-colors text-center shadow-sm" href="/contact">
            Schedule a Visit
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

