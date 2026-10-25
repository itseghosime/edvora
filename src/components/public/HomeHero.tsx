import Link from "next/link";
import { ArrowUpRight, BookOpen, Heart, Sparkles, Sprout } from "lucide-react";

export default function HomeHero() {
  return <section className="edvora-home-hero">
    <div className="edvora-hero-layout">
      <div className="edvora-hero-copy">
        <span className="edvora-eyebrow"><span /> A little wonder. Every day.</span>
        <h1>Small beginnings.<br /><em>Extraordinary</em><br />possibilities.</h1>
        <p>A warm place to ask big questions. Discover nursery and primary learning that gives children the confidence to be themselves.</p>
        <div className="edvora-hero-actions">
          <Link href="/admissions" className="edvora-primary-link">Come & meet Edvora <ArrowUpRight size={19} /></Link>
          <Link href="/academics" className="edvora-text-link">Explore learning <span>↗</span></Link>
        </div>
        <div className="edvora-hero-footnote"><span className="edvora-mini-icons"><BookOpen size={17}/><Heart size={17}/><Sprout size={17}/></span><span>Curiosity, care & room to grow.<br /><strong>Nursery · Primary · Benin City</strong></span></div>
      </div>
      <div className="edvora-hero-art">
        <div className="edvora-photo-main"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv32FRf_V-hFBVH8yyeLjXWl7AFlO0i6kGKqUK6YpFb5xJQfhP0zUL04CEQzTI7t-_vCNvObN4tBe8jIQgQOn7BL_AH7DmMBcDdsWI7DLjimbVI51WPXBkmjFyBl4JIuALdVBe0wVLAfO1fl-Pa8fTs0lxJsoShBUSAl9lXEfhM3mNO6H-JoTS6Zpd137PyUkKh4cdmfx4SJPZvhxzsUN_xY0eyMXhqI8Ob4SZImoy3pZJdbSfA5W6" alt="Children learning and playing together at school" fetchPriority="high" /><span className="edvora-photo-caption"><span /> A world of little discoveries</span></div>
        <div className="edvora-photo-small"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiX8lWg6WrvRX5LDefHt-QO0QZ0GU9pTZ498rThaCNMBBF67f4XwoNOLKU7GDFnP3tMl7fjavZ3S29QrpaGKWtsYSGKwltJSsHH3jEP-y5DoiyhVJl9aKhaRanT4CtlFzcRgXgvRAOsvjTn2Rjn8w7uSpiYOQiIxBVIXjdrnTn42CTGYC_bQ6Hwt-mkoH0lV_3PQeU6grXxx_EPSVzrPSivIPjo4MyVSdFNinbCzWmICyaGlDIVUst" alt="An educator in a school library" /></div>
        <div className="edvora-wonder-card"><Sparkles size={24}/><strong>Made for<br />curious minds.</strong><span>Learning that feels like discovery.</span></div>
        <svg className="edvora-hero-star" viewBox="0 0 80 80" fill="none" aria-hidden="true"><path d="M40 4 48 28 73 18 57 40 76 57 50 53 45 77 35 55 11 67 23 44 4 28 30 29Z" fill="currentColor"/></svg>
        <span className="edvora-hero-note">A thoughtful start, a brighter future.</span>
      </div>
    </div>
    <div className="edvora-value-strip"><span><Sprout size={19}/> Rooted in care</span><span><BookOpen size={19}/> Growing through discovery</span><span><Heart size={19}/> Connected with families</span><Link href="/school-life">A glimpse of school life <ArrowUpRight size={17}/></Link></div>
  </section>;
}
