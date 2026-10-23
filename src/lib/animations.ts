// ==============================================================================
// Edvora Motion System — Restrained Transitions with Reduced-Motion Support
// ==============================================================================

import gsap from 'gsap';

export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function animateFadeIn(target: HTMLElement | string, duration: number = 0.4) {
  if (isReducedMotion()) return;
  gsap.fromTo(
    target,
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration, ease: 'power2.out' }
  );
}

export function animateModalOpen(target: HTMLElement | string) {
  if (isReducedMotion()) return;
  gsap.fromTo(
    target,
    { opacity: 0, scale: 0.96, y: 8 },
    { opacity: 1, scale: 1, y: 0, duration: 0.28, ease: 'power3.out' }
  );
}

export function animateDrawerOpen(target: HTMLElement | string) {
  if (isReducedMotion()) return;
  gsap.fromTo(
    target,
    { x: '-100%' },
    { x: '0%', duration: 0.32, ease: 'power3.out' }
  );
}

