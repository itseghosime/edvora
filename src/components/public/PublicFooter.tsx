"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, ArrowUpRight } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-ink-border pt-14 pb-10 font-body-md text-on-surface">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 mb-12">
          {/* Identity & Mission (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest text-white flex items-center justify-center shadow-sm">
                <GraduationCap size={22} aria-hidden="true" />
              </div>
              <div>
                <div className="font-heading font-bold text-xl text-forest-800 tracking-tight">
                  Edvora<span className="text-secondary">.</span>
                </div>
                <div className="font-label-sm text-[11px] text-ink-muted uppercase tracking-wider">
                  Nursery &amp; Primary School · Benin City
                </div>
              </div>
            </Link>

            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed max-w-md">
              Nurturing inquisitive minds and confident young leaders with thoughtful teaching,
              curated learning spaces, and close parental partnership from early childhood through primary education.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-50 border border-forest-200/60 text-forest-800 font-label-sm text-xs">
              <span className="w-2 h-2 rounded-full bg-forest" />
              <span>Now Enrolling · 2026/2027 Academic Session</span>
            </div>
          </div>

          {/* Programmes */}
          <div className="space-y-3">
            <div className="font-label-lg text-xs font-bold text-on-surface uppercase tracking-wider">
              Programmes
            </div>
            <ul className="space-y-2 text-sm text-on-surface-variant font-medium">
              <li>
                <Link href="/academics" className="hover:text-primary transition-colors">
                  Creche &amp; Toddlers (18mo+)
                </Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-primary transition-colors">
                  Nursery I &amp; II (Ages 3–5)
                </Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-primary transition-colors">
                  Lower Primary (Grades 1–3)
                </Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-primary transition-colors">
                  Upper Primary (Grades 4–6)
                </Link>
              </li>
              <li>
                <Link href="/school-life" className="hover:text-primary transition-colors">
                  Co-curricular &amp; Arts
                </Link>
              </li>
            </ul>
          </div>

          {/* Admissions & Portals */}
          <div className="space-y-3">
            <div className="font-label-lg text-xs font-bold text-on-surface uppercase tracking-wider">
              Admissions &amp; Portals
            </div>
            <ul className="space-y-2 text-sm text-on-surface-variant font-medium">
              <li>
                <Link href="/admissions" className="hover:text-primary transition-colors">
                  Admissions Process
                </Link>
              </li>
              <li>
                <Link href="/fees" className="hover:text-primary transition-colors">
                  Tuition &amp; Levies Schedule
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-primary transition-colors font-semibold text-primary inline-flex items-center gap-1"
                >
                  Student Portal (Parents)
                  <ArrowUpRight size={13} aria-hidden="true" />
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  Staff Portal
                  <ArrowUpRight size={13} aria-hidden="true" />
                </Link>
              </li>
              <li>
                <Link href="/school-life" className="hover:text-primary transition-colors">
                  Daily Rhythm &amp; Facilities
                </Link>
              </li>
            </ul>
          </div>

          {/* Visit & Enquiries */}
          <div className="space-y-3">
            <div className="font-label-lg text-xs font-bold text-on-surface uppercase tracking-wider">
              Visit &amp; Enquiries
            </div>
            <div className="space-y-2.5 text-sm text-on-surface-variant">
              <p className="flex items-start gap-2">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5"
                >
                  schedule
                </span>
                <span>Mon – Fri: 8:00 AM – 3:30 PM</span>
              </p>
              <p className="flex items-start gap-2">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5"
                >
                  location_on
                </span>
                <span>Nursery & Primary School</span>
              </p>
              <p className="flex items-start gap-2">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5"
                >
                  contact_support
                </span>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors font-semibold text-primary underline underline-offset-4"
                >
                  Contact school office
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer */}
        <div className="pt-6 border-t border-ink-border/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <div>© 2026 Edvora Nursery &amp; Primary School. All rights reserved.</div>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3">
            <Link href="/contact" className="hover:text-primary transition-colors">
              Campus Visits &amp; Enquiries
            </Link>
            <Link href="/about" className="hover:text-primary transition-colors">
              Parent Partnership Charter
            </Link>
            <Link href="/fees" className="hover:text-primary transition-colors">
              Fee Policy &amp; Portal Guide
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

