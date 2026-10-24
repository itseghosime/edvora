"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Menu, X, ArrowUpRight } from "lucide-react";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Academics", href: "/academics" },
  { label: "Admissions", href: "/admissions" },
  { label: "School Life", href: "/school-life" },
  { label: "Fees", href: "/fees" },
  { label: "Contact", href: "/contact" },
];

export default function PublicNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-border bg-white/95 backdrop-blur-xl">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Top Banner */}
      <div className="bg-forest-50 border-b border-ink-border/60">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 h-9 flex items-center justify-between gap-3 text-xs text-forest-700">
          <Link
            href="/admissions"
            className="inline-flex items-center gap-2 font-medium hover:text-forest transition-colors"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-forest shrink-0" />
            Admissions · 2026/2027
            <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
          <span className="hidden sm:inline text-ink-muted">
            Nursery & Primary School
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 h-20 flex items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="Edvora Nursery & Primary School Home"
          className="flex items-center gap-2.5 shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-forest text-white flex items-center justify-center shadow-sm">
            <GraduationCap size={23} aria-hidden="true" />
          </div>
          <div>
            <span className="block font-heading text-xl font-bold tracking-tight text-forest-800">
              Edvora
            </span>
            <span className="hidden sm:block text-[11px] text-ink-muted">
              Nursery &amp; Primary School
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-0.5">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`px-2 xl:px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "text-forest bg-forest-50 font-semibold"
                    : "text-ink-muted hover:text-forest hover:bg-forest-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 min-h-11 px-3.5 sm:px-4 rounded-lg bg-forest text-white text-sm font-semibold hover:bg-forest-700 transition-colors shadow-sm"
          >
            <span>School Portal</span>
            <ArrowUpRight size={16} className="hidden sm:block" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            className="lg:hidden w-11 h-11 flex items-center justify-center rounded-lg border border-ink-border text-forest hover:bg-forest-50 transition-colors"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="lg:hidden absolute top-full inset-x-0 max-h-[calc(100dvh-116px)] overflow-y-auto border-b border-ink-border bg-white px-5 py-4 shadow-lg space-y-1"
        >
          <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-muted px-3 pb-2 pt-1">
            Navigation Menu
          </div>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`block px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-forest-50 text-forest font-semibold"
                    : "text-ink-muted hover:bg-forest-50 hover:text-forest"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 mt-2 border-t border-ink-border">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-forest text-white text-sm font-semibold"
            >
              <span>Enter School Portal (Staff &amp; Student)</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

