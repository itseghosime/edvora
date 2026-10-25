"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";

/** Progressive enhancement: server content remains visible without JavaScript. */
export default function SiteExperience() {
  const pathname = usePathname();
  const progress = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    let cancelled = false;
    let observer: IntersectionObserver | undefined;
    let revert: (() => void) | undefined;
    let frame = 0;
    const publicPage = !pathname.startsWith("/admin") && !pathname.startsWith("/student");
    const update = () => {
      frame = 0;
      const range = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
      if (progress.current) progress.current.style.transform = `scaleX(${ratio})`;
      setShowTop(publicPage && window.scrollY > 700);
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", scroll, { passive: true });
    update();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      void import("gsap").then(({ gsap }) => {
        if (cancelled) return;
        const context = gsap.context(() => {
          const seen = new WeakSet<Element>();
          observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
              if (!entry.isIntersecting || seen.has(entry.target)) return;
              seen.add(entry.target);
              context.add(() => { gsap.fromTo(entry.target, { opacity: 0.35, y: 20 }, {
                opacity: 1, y: 0, duration: 0.7, ease: "power2.out", clearProps: "opacity,transform",
                overwrite: "auto",
              }); });
              observer?.unobserve(entry.target);
            });
          }, { threshold: 0.07 });
          document.querySelectorAll(
            ".public-main section > div, .edvora-hero-copy, .edvora-hero-art, .portal-page-header, .edvora-panel"
          ).forEach(el => observer?.observe(el));
        });
        revert = () => context.revert();
      });
    }
    return () => {
      cancelled = true;
      observer?.disconnect();
      revert?.();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scroll);
    };
  }, [pathname]);
  return <>
    <div className="reading-progress" aria-hidden="true"><div ref={progress} /></div>
    {showTop && <button className="back-to-top" aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}>
      <ArrowUp size={18} /><span>Back to top</span>
    </button>}
  </>;
}
