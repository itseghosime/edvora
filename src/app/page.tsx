import type { Metadata } from "next";
import PublicEnquiryForm from "@/components/public/PublicEnquiryForm";
import React from "react";
import Link from "next/link";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";

export const metadata: Metadata = {"title": "Edvora Nursery & Primary School", "description": "Explore nursery and primary learning, admissions and school life. Parents use the Student portal for fees and published results.", "alternates": {"canonical": "/"}};

export default function HomePage() {
  return (
    <div className="public-site min-h-screen flex flex-col bg-surface font-body-md text-on-surface">
      <PublicNavbar />
      <main id="main-content" className="public-main w-full flex-1">
        <div className="flex flex-col w-full">
{/* SECTION 1: EDITORIAL HERO & BENTO COMPOSITION */}
<section className="relative w-full overflow-hidden pb-space-xl pt-space-lg">
{/* Ambient organic gradient glow */}
<div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-primary-fixed/30 via-secondary-fixed/20 to-transparent blur-3xl rounded-full -z-10"></div>
<div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin">
{/* Top Editorial Header Block */}
<div className="max-w-3xl mx-auto text-center space-y-space-md mb-space-xl">
<div className="inline-flex items-center gap-space-xs px-3.5 py-1 rounded-full bg-secondary-container/40 text-on-secondary-fixed backdrop-blur-sm shadow-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-secondary">eco</span>
<span className="font-label-sm text-label-sm uppercase tracking-wider">A Calmer, Thoughtful Learning Environment</span>
</div>
<h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">
          A thoughtful start.<br />
<span className="text-primary-container font-display-lg">A brighter future.</span>
</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          A welcoming nursery and primary school in Benin City, where curious children learn, play, and grow with confidence.
        </p>
{/* Primary & Secondary Actions */}
<div className="pt-space-xs flex flex-wrap items-center justify-center gap-space-md">
<a className="inline-flex items-center gap-space-xs px-6 py-3.5 rounded-xl bg-primary-container text-on-primary hover:bg-primary font-label-lg text-label-lg shadow-md transition-all" href="#visit-booking">
<span aria-hidden="true" className="material-symbols-outlined text-[20px]">calendar_month</span>
<span className="">Schedule a School Visit</span>
</a>
<a className="inline-flex items-center gap-space-xs px-6 py-3.5 rounded-xl bg-surface-container-lowest text-primary hover:bg-surface-container-low font-label-lg text-label-lg shadow-sm transition-all" href="#programmes">
<span className="">Explore Our Programmes</span>
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">arrow_forward</span>
</a>
</div>
</div>
{/* Hero Bento Photography & Trust Grid */}
<div className="grid grid-cols-1 md:grid-cols-12 gap-space-md items-stretch">
{/* Bento Tile 1: Primary Large Image (Classroom Engagement) */}
<div className="md:col-span-7 relative group overflow-hidden rounded-2xl shadow-sm min-h-[360px] md:min-h-[440px] flex flex-col justify-end p-space-lg text-on-primary bg-primary-container">
<div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" data-alt="Modern bright Nigerian classroom in Benin City with vibrant natural daylight, happy elementary school pupils wearing clean emerald and cream uniforms gathered attentively around an inspiring teacher reading an illustrated book, warm editorial documentary photography with dignified tone." style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBjkVZ2_oFpwU2yW0tkUH9W55sbsICJgpiS5ZcVzc77QuL6zPO0HO0PBP2bH_tX9v8-o-6UVqOmwkZaTi2g7zVrrNBl3qk33dTtREROxrxbd-XiLL-XoFpyYLe4ccNDZM_a3LxggDZzMZ_Vjdv44o9xRaMUTKOcf3HXrywyAjSF5hmSNXyCBPyJtrcG3zrwE13cQHwpFwNUN0PJEqwkftz6mYZAzBQVYyMKulp5CHZqm7EMwYZkGDxD")` }}>
</div>
<div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/40 to-transparent"></div>
<div className="relative z-10 space-y-space-xs">
<div className="inline-flex items-center gap-space-xs px-2.5 py-1 rounded-full bg-surface-container-lowest/20 backdrop-blur-md text-on-primary font-label-sm text-label-sm">
<span className="w-2 h-2 rounded-full bg-secondary-container"></span>
<span className="">Foundation Years &amp; Key Stage 1</span>
</div>
<h3 className="font-headline-lg text-headline-lg text-on-primary">Room to learn. Space to grow.</h3>
<p className="font-body-md text-body-md text-primary-fixed max-w-md">Every school morning begins with shared stories, vocabulary discovery, and phonemic confidence.</p>
</div>
</div>
{/* Bento Right Column: 2 stacked cards */}
<div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-space-md">
{/* Science & Discovery Station */}
<div className="relative group overflow-hidden rounded-2xl shadow-sm min-h-[200px] flex flex-col justify-end p-space-md text-on-primary bg-surface-container">
<div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" data-alt="Two cheerful young Nigerian pupils conducting a safe, colorful botanical leaf experiment with magnifying glasses at a clean wooden discovery bench, soft sunlight, vibrant leaves, joyful natural expressions, high-end school photography." style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuD8Gtr0HmNB_nSfF7Aj_ofVHnXxh0MYqF51Pbw4zXlTs30MHqLi420PFoOunW2tboAX1H3tUzZK0zA22m7oRUgagNng6_zE-WnzNEc8Z3TcZDm5gInzGx2P44-7GHvOqWdXfeFFCnUJOp51PEB5EgdgA1eStj6ATfOQZwO7nkizrLDy_f8pbOtSdlMpbR4fj1M2YKQYFWixxxlfD1wfzpLNlj9y0VrfmMTCguxVCcMnJGMir8YUVL9_")` }}>
</div>
<div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/30 to-transparent"></div>
<div className="relative z-10">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-container font-semibold">Practical Curiosity</span>
<h4 className="font-headline-sm text-headline-sm text-on-primary">Sensory &amp; Natural Science</h4>
</div>
</div>
{/* Creative Arts & Craft Studio */}
<div className="relative group overflow-hidden rounded-2xl shadow-sm min-h-[200px] flex flex-col justify-end p-space-md text-on-primary bg-surface-container">
<div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" data-alt="Children in an early childhood art studio working on vibrant paintings with tempera colors on easels, sunlit serene room, warm wood furniture, joyful smiles and creative focus, documentary high quality." style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDFfz_nR3gr3H64qIqGTU_mryjzt4JuqdglLQqf8mBx3LTUaHIBcBn5KDTu5vpBB56ApAiye-IotFjYq9hhSVN5vxyrveCojhcNJEoH3JIG5YVHT9L7jwi56I48DtzjyRporLieHWAM2KlWX4fm9idbabzDfr08F3VmjzazCh9eaXmu80PBmEUj9ywd1gyMYe2ZymIhAUa3zpVBgcQzEJtzSRUQEt503oJTmYnOmUrVRBHu8wd3xU86")` }}>
</div>
<div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/30 to-transparent"></div>
<div className="relative z-10">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-fixed font-semibold">Self-Expression</span>
<h4 className="font-headline-sm text-headline-sm text-on-primary">Expressive Arts &amp; Fine Motor Craft</h4>
</div>
</div>
</div>
{/* Bottom Bento Stat / Value Ribbon */}
<div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-space-md pt-space-xs">
<div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex items-center gap-space-md">
<div className="w-12 h-12 rounded-xl bg-primary-fixed/50 flex items-center justify-center text-primary shrink-0">
<span aria-hidden="true" className="material-symbols-outlined text-[26px]">groups</span>
</div>
<div>
<div className="font-headline-md text-headline-md text-on-surface">1 : 12</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">Early Years Teacher Ratio</div>
</div>
</div>
<div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex items-center gap-space-md">
<div className="w-12 h-12 rounded-xl bg-secondary-fixed/50 flex items-center justify-center text-secondary shrink-0">
<span aria-hidden="true" className="material-symbols-outlined text-[26px]">psychology</span>
</div>
<div>
<div className="font-headline-md text-headline-md text-on-surface">Integrated</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">Nigerian &amp; International Standards</div>
</div>
</div>
<div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex items-center gap-space-md">
<div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary-container shrink-0">
<span aria-hidden="true" className="material-symbols-outlined text-[26px]">family_restroom</span>
</div>
<div>
<div className="font-headline-md text-headline-md text-on-surface">Clear fee information</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">Parent Ledger &amp; Observation Care</div>
</div>
</div>
</div>
</div>
</div>
</section>
{/* SECTION 2: LEADERSHIP EDITORIAL WELCOME */}
<section className="w-full py-space-xl bg-surface-container-low/50">
<div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin">
<div className="bg-surface-container-lowest rounded-3xl p-space-lg md:p-space-xl shadow-sm">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
{/* Portrait & Vignette */}
<div className="lg:col-span-5 relative">
<div className="relative overflow-hidden rounded-2xl shadow-md aspect-[4/5] bg-surface-container">
<img className="w-full h-full object-cover" alt="Dignified, warm and approachable Nigerian female headmistress in smart professional attire sitting in a sunlit school library with wooden bookshelves, holding a curriculum binder, smiling reassuringly, warm editorial lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiX8lWg6WrvRX5LDefHt-QO0QZ0GU9pTZ498rThaCNMBBF67f4XwoNOLKU7GDFnP3tMl7fjavZ3S29QrpaGKWtsYSGKwltJSsHH3jEP-y5DoiyhVJl9aKhaRanT4CtlFzcRgXgvRAOsvjTn2Rjn8w7uSpiYOQiIxBVIXjdrnTn42CTGYC_bQ6Hwt-mkoH0lV_3PQeU6grXxx_EPSVzrPSivIPjo4MyVSdFNinbCzWmICyaGlDIVUst" />
</div>
<div className="absolute -bottom-4 -right-4 bg-primary-container text-on-primary p-space-md rounded-2xl shadow-lg hidden sm:block max-w-xs">
<div className="font-label-md text-label-md uppercase tracking-wider text-primary-fixed">Head of School</div>
<div className="font-headline-sm text-headline-sm">Mrs. Adesua E. Osagie</div>
<div className="font-body-sm text-body-sm text-on-primary/80">M.Ed. Early Childhood Leadership</div>
</div>
</div>
{/* Thoughtful Leadership Message */}
<div className="lg:col-span-7 space-y-space-md">
<div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container text-primary font-label-sm text-label-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">draw</span>
<span className="">A Letter From Our Head of School</span>
</div>
<h2 className="font-headline-lg text-headline-lg text-on-surface leading-tight">
              "We believe childhood is not a race, but a sacred season of purposeful discovery."
            </h2>
<div className="space-y-space-md font-body-lg text-body-lg text-on-surface-variant">
<p className="">Welcome to Edvora. We work with families to help children develop strong foundations in reading, mathematics, curiosity and confidence through supportive teaching and everyday practice.</p>
<p className="">
                From toddlers exploring botanical textures in our courtyard to Primary Six candidates preparing with poise for prominent secondary schools across Nigeria and abroad, we cultivate children who speak with quiet self-assurance and solve problems with joyful vigor.
              </p>
</div>
<div className="pt-space-xs flex items-center gap-space-md">
<div className="space-y-0.5">
<div className="font-headline-sm text-headline-sm text-on-surface">Mrs. Adesua E. Osagie</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">Headmistress &amp; Academic Director · Edvora School</div>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
{/* SECTION 3: EDUCATIONAL PROGRAMMES */}
<section className="w-full py-space-xl" id="programmes">
<div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin space-y-space-xl">
<div className="max-w-2xl space-y-space-xs">
<span className="font-label-md text-label-md text-secondary uppercase tracking-wider">Structured Pathways</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Programmes Designed for Every Milestone</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant">We align play-based natural curiosity with international foundational literacy and classical numeracy.</p>
</div>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
{/* Programme Card 1: Early Years */}
<div className="bg-surface-container-lowest rounded-3xl p-space-lg md:p-space-xl shadow-sm flex flex-col justify-between space-y-space-lg group hover:shadow-md transition-shadow">
<div className="space-y-space-md">
<div className="flex items-center justify-between">
<div className="w-12 h-12 rounded-2xl bg-secondary-container/40 flex items-center justify-center text-secondary">
<span aria-hidden="true" className="material-symbols-outlined text-[26px]">child_care</span>
</div>
<span className="px-3 py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface">Ages 18mo – 5 Years</span>
</div>
<div>
<h3 className="font-headline-lg text-headline-lg text-on-surface mb-space-xs">Early Years Foundation</h3>
<p className="font-body-md text-body-md text-on-surface-variant">Creche, Toddler Discovery, Nursery I &amp; II</p>
</div>
<p className="font-body-md text-body-md text-on-surface-variant">
              In these formative seasons, our purpose is sensory fluency, joyful phonics, confident social communication, and unhurried physical balance. Children learn to love reading through daily oral storytelling and tactile manipulative mathematics.
            </p>
<div className="flex flex-wrap gap-space-xs pt-space-xs">
<span className="px-3 py-1 rounded-full bg-surface-container-low text-on-surface font-label-sm text-label-sm">Montessori-Inspired Sensorial</span>
<span className="px-3 py-1 rounded-full bg-surface-container-low text-on-surface font-label-sm text-label-sm">Jolly Phonics Mastery</span>
<span className="px-3 py-1 rounded-full bg-surface-container-low text-on-surface font-label-sm text-label-sm">Courtyard Botanical Play</span>
<span className="px-3 py-1 rounded-full bg-surface-container-low text-on-surface font-label-sm text-label-sm">Supportive teaching</span>
</div>
</div>
<div className="pt-space-md flex items-center justify-between">
<span className="font-label-md text-label-md text-primary font-semibold">Morning Care from 7:30 AM</span>
<a className="inline-flex items-center gap-1 font-label-lg text-label-lg text-primary hover:text-primary-container transition-colors" href="#visit-booking">
<span className="">Nursery Prospectus</span>
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">chevron_right</span>
</a>
</div>
</div>
{/* Programme Card 2: Primary School */}
<div className="bg-surface-container-lowest rounded-3xl p-space-lg md:p-space-xl shadow-sm flex flex-col justify-between space-y-space-lg group hover:shadow-md transition-shadow">
<div className="space-y-space-md">
<div className="flex items-center justify-between">
<div className="w-12 h-12 rounded-2xl bg-primary-fixed/40 flex items-center justify-center text-primary">
<span aria-hidden="true" className="material-symbols-outlined text-[26px]">menu_book</span>
</div>
<span className="px-3 py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface">Ages 5 – 11 Years</span>
</div>
<div>
<h3 className="font-headline-lg text-headline-lg text-on-surface mb-space-xs">Primary School Mastery</h3>
<p className="font-body-md text-body-md text-on-surface-variant">Lower Primary (1–3) &amp; Upper Primary (4–6)</p>
</div>
<p className="font-body-md text-body-md text-on-surface-variant">
              A rigorous yet nurturing curriculum combining the Nigerian National Primary syllabus with Cambridge Primary benchmarks. Emphasis on analytical problem solving, expressive English composition, coding fundamentals, and cultural heritage.
            </p>
<div className="flex flex-wrap gap-space-xs pt-space-xs">
<span className="px-3 py-1 rounded-full bg-surface-container-low text-on-surface font-label-sm text-label-sm">Singapore-Style Math Reasoning</span>
<span className="px-3 py-1 rounded-full bg-surface-container-low text-on-surface font-label-sm text-label-sm">Practical STEM Lab</span>
<span className="px-3 py-1 rounded-full bg-surface-container-low text-on-surface font-label-sm text-label-sm">Edo Cultural Heritage &amp; French</span>
<span className="px-3 py-1 rounded-full bg-surface-container-low text-on-surface font-label-sm text-label-sm">Public Speaking &amp; Debate</span>
</div>
</div>
<div className="pt-space-md flex items-center justify-between">
<span className="font-label-md text-label-md text-primary font-semibold">Standard School Hours: 8:00 – 2:30 PM</span>
<a className="inline-flex items-center gap-1 font-label-lg text-label-lg text-primary hover:text-primary-container transition-colors" href="#visit-booking">
<span className="">Primary Syllabus Guide</span>
<span aria-hidden="true" className="material-symbols-outlined text-[18px]">chevron_right</span>
</a>
</div>
</div>
</div>
</div>
</section>
{/* SECTION 4: FOUR PILLARS LEARNING & CARE PHILOSOPHY */}
<section className="w-full py-space-xl bg-surface-container-low">
<div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin space-y-space-xl">
<div className="text-center max-w-2xl mx-auto space-y-space-xs">
<span className="font-label-md text-label-md text-primary uppercase tracking-wider">The Edvora Standard</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Our Four Pillars of Growth</h2>
<p className="font-body-md text-body-md text-on-surface-variant">How we cultivate character, sharp thinking, and rooted emotional security in every learner.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
{/* Pillar 1 */}
<div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm space-y-space-sm">
<div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
<span aria-hidden="true" className="material-symbols-outlined text-[22px]">record_voice_over</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Confident Communication</h3>
<p className="font-body-md text-body-md text-on-surface-variant">
            From daily show-and-tell to weekly assembly recitations, children articulate their thoughts with courtesy, poise, and expansive vocabulary.
          </p>
</div>
{/* Pillar 2 */}
<div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm space-y-space-sm">
<div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
<span aria-hidden="true" className="material-symbols-outlined text-[22px]">calculate</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Mathematical Thinking</h3>
<p className="font-body-md text-body-md text-on-surface-variant">
            Moving beyond simple rote counting into patterns, visual models, spatial reasoning, and practical daily mental calculations.
          </p>
</div>
{/* Pillar 3 */}
<div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm space-y-space-sm">
<div className="w-10 h-10 rounded-xl bg-surface-variant flex items-center justify-center text-primary-container">
<span aria-hidden="true" className="material-symbols-outlined text-[22px]">favorite</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Moral &amp; Social Wellbeing</h3>
<p className="font-body-md text-body-md text-on-surface-variant">
            Kindness, personal integrity, dining etiquette, respect for elders and peers, and stewardship of our community and learning spaces.
          </p>
</div>
{/* Pillar 4 */}
<div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm space-y-space-sm">
<div className="w-10 h-10 rounded-xl bg-secondary-container/40 flex items-center justify-center text-secondary">
<span aria-hidden="true" className="material-symbols-outlined text-[22px]">biotech</span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Inquisitive Science</h3>
<p className="font-body-md text-body-md text-on-surface-variant">
            Active hands-on observation: weather tracking, plant growth cycles, basic mechanics, and safe digital logic literacy.
          </p>
</div>
</div>
</div>
</section>
{/* SECTION 5: CAMPUS LIFE & VISUAL VIGNETTES */}
<section className="w-full py-space-xl">
<div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin space-y-space-xl">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
<div className="space-y-space-xs max-w-xl">
<span className="font-label-md text-label-md text-secondary uppercase tracking-wider">A Glimpse Into Daily Life</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Joyful Spaces Built for Exploration</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Our learning environment provides clean botanical lawns, air-conditioned acoustic classrooms, and dedicated creative studios.</p>
</div>
<div className="flex items-center gap-space-sm">
<span className="font-label-md text-label-md text-on-surface-variant">Campus Visits: Mon – Fri (9:00 AM – 1:00 PM)</span>
</div>
</div>
{/* Vignette Mosaic */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
{/* Photo 1: Reading Library Corner */}
<div className="group relative overflow-hidden rounded-2xl shadow-sm aspect-[4/3] bg-surface-container">
<img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Children in comfortable colorful floor cushions in a peaceful reading corner of a modern school library, browsing hardcover picture books, warm soft lighting, peaceful and inspiring atmosphere." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv32FRf_V-hFBVH8yyeLjXWl7AFlO0i6kGKqUK6YpFb5xJQfhP0zUL04CEQzTI7t-_vCNvObN4tBe8jIQgQOn7BL_AH7DmMBcDdsWI7DLjimbVI51WPXBkmjFyBl4JIuALdVBe0wVLAfO1fl-Pa8fTs0lxJsoShBUSAl9lXEfhM3mNO6H-JoTS6Zpd137PyUkKh4cdmfx4SJPZvhxzsUN_xY0eyMXhqI8Ob4SZImoy3pZJdbSfA5W6" />
<div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent"></div>
<div className="absolute bottom-3 left-4 right-4 text-on-primary">
<div className="font-label-sm text-label-sm text-primary-fixed uppercase">Sanctuary</div>
<div className="font-headline-sm text-headline-sm">The Curated Library &amp; Reading Den</div>
</div>
</div>
{/* Photo 2: Green Sports & Play */}
<div className="group relative overflow-hidden rounded-2xl shadow-sm aspect-[4/3] bg-surface-container">
<img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Young primary school students in crisp PE sports kits running playfully on clean green grass during outdoor physical education, tropical trees in background, sunny joyful school ground." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_YG_6Z05CncQRrtJHhlsyNoDkyPw1vINinY45vb-aymeM_CTMOcVtE6Qs4iyfoiAnOvXuD_KpTlNhdHVLDOyi3mkZ83MIyuddZO7zyoOdNwWP1WZd19I-0-D6_VhPiRouoyW3TFpnNsU8Wc417Txwb1TyUJAtWjMsYZ_Yrm_p9vMWeS7jfMQod1aZVN1bD9fMNwDYZFSAFRvCPqRV-v3xHA_eowBCx046t--jaFqzaYJCxkcnr49U" />
<div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent"></div>
<div className="absolute bottom-3 left-4 right-4 text-on-primary">
<div className="font-label-sm text-label-sm text-secondary-container uppercase">Physical Health</div>
<div className="font-headline-sm text-headline-sm">Active Outdoor Athletics &amp; Play</div>
</div>
</div>
{/* Photo 3: Cultural Day & Heritage Celebration */}
<div className="group relative overflow-hidden rounded-2xl shadow-sm aspect-[4/3] bg-surface-container">
<img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Nigerian primary school pupils wearing traditional Edo coral beaded crowns and ceremonial fabrics during school cultural heritage celebration, smiling proudly in high-resolution joyful portrait." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1687J2sWGrsKI16lt9_hKLBxUc8mbMm848DUzm_86bGa1F7Ljxj-nQWE8iuysAIephLXzGRVtxdBJV4ldDJvfmAuw44P3WmPPvXzpdwEgl-CrbIj_V6jDo8mIPP1sHRhIY3a_XVaqZlXEzqdcRWaqVJNXNrDSqhPahIfljuiKBzoVg48RymtWonQA1OoElevkY0tyaHOdLDMQqWU9HaHM_2Nta8xsvpGrMcp6CFxVPMv1p4PKnvwl" />
<div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent"></div>
<div className="absolute bottom-3 left-4 right-4 text-on-primary">
<div className="font-label-sm text-label-sm text-primary-fixed uppercase">Roots &amp; Identity</div>
<div className="font-headline-sm text-headline-sm">Edo Heritage &amp; Global Citizens Day</div>
</div>
</div>
</div>
</div>
</section>
{/* SECTION 6: THE PARENT PARTNERSHIP & DIGITAL EASE */}
<section className="w-full py-space-xl bg-surface-container-low/70">
<div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
{/* Editorial Text Column */}
<div className="lg:col-span-6 space-y-space-md">
<div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container text-primary-container font-label-sm text-label-sm">
<span aria-hidden="true" className="material-symbols-outlined text-[16px]">verified_user</span>
<span className="">Parent Peace of Mind</span>
</div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">
            Stay close to your child’s school journey.
          </h2>
<p className="font-body-lg text-body-lg text-on-surface-variant">
            We respect our parents' time and emotional investment. Instead of chaotic chat group spam, Edvora provides a private, encrypted digital window into your child’s educational life.
          </p>
<div className="space-y-space-sm pt-space-xs">
<div className="flex items-start gap-space-sm">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-1">check_circle</span>
<div>
<strong className="text-on-surface font-headline-sm text-headline-sm block">Daily Gentle Observations</strong>
<span className="text-on-surface-variant font-body-md text-body-md">For early years: peaceful midday updates on rest, nutritious lunch intake, and milestone moments.</span>
</div>
</div>
<div className="flex items-start gap-space-sm">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-1">check_circle</span>
<div>
<strong className="text-on-surface font-headline-sm text-headline-sm block">Secure School Payments</strong>
<span className="text-on-surface-variant font-body-md text-body-md">Instant receipts, zero surprise levies, and clear termly installment choices visible from any smartphone.</span>
</div>
</div>
<div className="flex items-start gap-space-sm">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-1">check_circle</span>
<div>
<strong className="text-on-surface font-headline-sm text-headline-sm block">Dignified Continuous Assessment</strong>
<span className="text-on-surface-variant font-body-md text-body-md">Terminal reports that celebrate individual growth trajectory rather than anxiety-inducing public rankings.</span>
</div>
</div>
</div>
</div>
{/* Visual Stationery / Portal Showcase Card */}
<div className="lg:col-span-6">
<div className="bg-surface-container-lowest rounded-3xl p-space-lg md:p-space-xl shadow-md space-y-space-md relative overflow-hidden">
{/* Decorative badge watermark */}
<div className="absolute -right-12 -top-12 w-48 h-48 bg-primary-fixed/20 rounded-full blur-2xl pointer-events-none"></div>
<div className="flex items-center justify-between pb-space-xs">
<div className="flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-primary text-[22px]">vpn_key</span>
<span className="font-headline-sm text-headline-sm text-on-surface">Secure Student Portal</span>
</div>
<span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed font-label-sm text-label-sm">Invitation Only</span>
</div>
{/* Mock Terminal Ledger / Milestone Snippet */}
<div className="bg-surface-container-low rounded-2xl p-space-md space-y-space-sm">
<div className="flex items-center justify-between font-label-sm text-label-sm">
<span className="text-on-surface-variant uppercase tracking-wider">Learner Profile</span>
<span className="text-primary font-semibold">Active Session 2026/27</span>
</div>
<div className="flex items-center gap-space-sm">
<div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center font-headline-sm text-primary font-bold">
                  O
                </div>
<div>
<div className="font-headline-sm text-headline-sm text-on-surface">Osagie Imasuen</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">Nursery II (Botanical Room)</div>
</div>
</div>
</div>
{/* Daily observation vignette */}
<div className="bg-surface-container rounded-2xl p-space-md space-y-space-xs">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface font-semibold flex items-center gap-1">
<span aria-hidden="true" className="material-symbols-outlined text-[16px] text-secondary">sentiment_satisfied</span>
<span className="">Daily Nursery Note</span>
</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Today at 1:15 PM</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant italic">
                "Osagie completed his two-digit bead frame puzzle independently and ate a full lunch of steamed beans and plantain. Rested serenely for 45 minutes."
              </p>
</div>
{/* Terminal fee clear status */}
<div className="p-space-md rounded-2xl bg-surface-container-low flex items-center justify-between">
<div>
<div className="font-label-sm text-label-sm text-on-surface-variant">Term II Tuition &amp; Lunch Ledger</div>
<div className="font-currency-cell text-currency-cell text-on-surface">₦285,000.00</div>
</div>
<span className="px-3 py-1 rounded-full bg-[#E2F3EE] text-[#177C65] font-label-sm text-label-sm flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-[#177C65]"></span>
<span className="">Verified Paid</span>
</span>
</div>
</div>
</div>
</div>
</div>
</section>
{/* SECTION 7: ADMISSIONS & VISIT STEPS */}
<section className="w-full py-space-xl">
<div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin space-y-space-xl">
<div className="text-center max-w-2xl mx-auto space-y-space-xs">
<span className="font-label-md text-label-md text-secondary uppercase tracking-wider">Simple, Considerate Process</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Joining the Edvora Family</h2>
<p className="font-body-md text-body-md text-on-surface-variant">We make welcoming new families transparent, respectful, and free of unnecessary friction.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
{/* Step 1 */}
<div className="bg-surface-container-lowest p-space-lg rounded-3xl shadow-sm space-y-space-md relative">
<div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center font-display-lg text-display-lg text-primary">
            1
          </div>
<div className="space-y-space-xs">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Campus Tour &amp; Discussion</h3>
<p className="font-body-md text-body-md text-on-surface-variant">
              Book a 30-minute private walkthrough to observe active classrooms, inspect sanitation standards, and meet our early years coordinators.
            </p>
</div>
</div>
{/* Step 2 */}
<div className="bg-surface-container-lowest p-space-lg rounded-3xl shadow-sm space-y-space-md relative">
<div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center font-display-lg text-display-lg text-primary">
            2
          </div>
<div className="space-y-space-xs">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Gentle Child Observation</h3>
<p className="font-body-md text-body-md text-on-surface-variant">
              A stress-free conversational interaction where our teachers gauge reading comfort, social readiness, and developmental milestones with empathy.
            </p>
</div>
</div>
{/* Step 3 */}
<div className="bg-surface-container-lowest p-space-lg rounded-3xl shadow-sm space-y-space-md relative">
<div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center font-display-lg text-display-lg text-primary">
            3
          </div>
<div className="space-y-space-xs">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Offer &amp; Digital Welcome</h3>
<p className="font-body-md text-body-md text-on-surface-variant">
              Upon confirmation, families receive clear fee installment guidelines, uniform fittings, and portal credentials for immediate term onboarding.
            </p>
</div>
</div>
</div>
</div>
</section>
{/* SECTION 8: CALL TO ACTION & VISIT BOOKING */}
<section className="w-full pb-space-xl" id="visit-booking">
<div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin">
<div className="bg-primary-container text-on-primary rounded-3xl p-space-lg md:p-space-xl shadow-lg relative overflow-hidden">
{/* Warm background flourish */}
<div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"></div>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center relative z-10">
<div className="lg:col-span-7 space-y-space-md">
<div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container-lowest/15 backdrop-blur-sm text-primary-fixed font-label-sm text-label-sm">
<span className="w-2 h-2 rounded-full bg-secondary-container"></span>
<span className="">2026 / 2027 Academic Session Enrolment</span>
</div>
<h2 className="font-display-lg text-display-lg text-on-primary leading-tight">
              Come and meet Edvora.
            </h2>
<p className="font-body-lg text-body-lg text-primary-fixed/90 max-w-xl">
              Tours are hosted on weekday mornings while learning is quietly underway. Meet Mrs. Osagie and witness the warmth that makes Edvora so distinct.
            </p>
<div className="pt-space-xs flex flex-wrap gap-space-lg text-on-primary">
<div className="flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-[20px] text-secondary-container">location_on</span>
<span className="font-body-md text-body-md">Contact the school for directions</span>
</div>
<div className="flex items-center gap-space-xs">
<span aria-hidden="true" className="material-symbols-outlined text-[20px] text-secondary-container">call</span>
<span className="font-body-md text-body-md">School office enquiries</span>
</div>
</div>
</div>
{/* Quick Visit Enquiry Card Form */}
<div className="lg:col-span-5 bg-surface-container-lowest text-on-surface rounded-2xl p-space-lg shadow-md space-y-space-md">
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Book a school visit</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Prepare your questions before speaking with the school office.</p>
</div>
<PublicEnquiryForm idPrefix="page" />
{/* Success State Feedback */}

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

