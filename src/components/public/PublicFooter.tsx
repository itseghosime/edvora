"use client";

import React from "react";
import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-14 pb-10 font-body-md text-on-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 mb-12">
          {/* Identity & Mission (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-sm">
                <span aria-hidden="true" className="material-symbols-outlined text-[24px]">school</span>
              </div>
              <div>
                <div className="font-display font-bold text-xl text-primary tracking-tight">
                  edvora<span className="text-secondary">.</span>
                </div>
                <div className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
                  Nursery &amp; Primary School · Edo State
                </div>
              </div>
            </Link>

            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed max-w-md">
              Nurturing inquisitive minds and confident leaders with dignified academic stewardship,
              botanical play environments, and parental partnership from early years through primary education.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-xs">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>Admissions open for 2026/2027 Academic Session</span>
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
                  Creche &amp; Toddlers
                </Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-primary transition-colors">
                  Nursery I &amp; II
                </Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-primary transition-colors">
                  Lower Primary (1–3)
                </Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-primary transition-colors">
                  Upper Primary (4–6)
                </Link>
              </li>
              <li>
                <Link href="/school-life" className="hover:text-primary transition-colors">
                  Co-curricular Clubs
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
                  Admission Criteria
                </Link>
              </li>
              <li>
                <Link href="/fees" className="hover:text-primary transition-colors">
                  Tuition &amp; Levies Schedule
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition-colors font-semibold text-primary">
                  Student Portal Login
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition-colors">
                  Staff Login
                </Link>
              </li>
              <li>
                <Link href="/school-life" className="hover:text-primary transition-colors">
                  Term Dates &amp; Calendar
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
                <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">
                  schedule
                </span>
                <span>Mon – Fri: 8:00 AM – 3:30 PM</span>
              </p>
              <p className="flex items-start gap-2">
                <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">
                  location_on
                </span>
                <span>Contact the school for directions</span>
              </p>
              <p className="flex items-start gap-2">
                <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">
                  call
                </span>
                <Link href="/contact" className="hover:text-primary transition-colors font-semibold text-on-surface">
                  Contact school office
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer */}
        <div className="pt-6 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <div>© 2026 Edvora Nursery &amp; Primary School. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-primary transition-colors">
              Privacy Notice &amp; Safeguards
            </Link>
            <Link href="/contact" className="hover:text-primary transition-colors">
              Parent Partnership Charter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
