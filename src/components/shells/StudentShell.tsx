"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePupilsQuery } from "@/lib/query/hooks";
import { animateDrawerOpen } from "@/lib/animations";

interface StudentShellProps {
  children: React.ReactNode;
}

export default function StudentShell({ children }: StudentShellProps) {
  const pathname = usePathname();
  const { data: pupils = [] } = usePupilsQuery();
  const [selectedChildId, setSelectedChildId] = useState("osasere-ehigiator");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const selectedPupil = pupils.find((p) => p.id === selectedChildId) || pupils[0];

  const navItems = [
    { label: "Overview", href: "/student", icon: "dashboard" },
    { label: "Fees & Payments", href: "/student/payments", icon: "account_balance_wallet" },
    { label: "Results", href: "/student/results", icon: "history_edu" },
  ];

  // Close mobile drawer on route change or Escape
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Animate drawer when opened
  useEffect(() => {
    if (mobileMenuOpen && drawerRef.current) {
      animateDrawerOpen(drawerRef.current);
    }
  }, [mobileMenuOpen]);

  return (
    <div className="portal-shell min-h-screen bg-surface font-body-md text-on-surface">
      {/* Desktop Persistent Left Sidebar */}
      <aside className="hidden lg:flex w-60 bg-surface-container-lowest border-r border-outline-variant/30 flex-col justify-between shrink-0 fixed inset-y-0 left-0 z-40 select-none">
        {/* Top Branding & Navigation */}
        <div className="flex flex-col">
          {/* Logo Header */}
          <div className="h-20 px-6 flex flex-col justify-center border-b border-outline-variant/20">
            <Link href="/" className="flex items-baseline gap-0.5">
              <span className="font-display font-bold text-2xl tracking-tight text-[#14695D]">
                edvora<span className="text-[#E5AA58]">.</span>
              </span>
            </Link>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#14695D]" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/80">
                Student Portal
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 mt-2" aria-label="Student primary navigation">
            {navItems.map((item) => {
              const isActive =
                item.href === "/student"
                  ? pathname === "/student"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                    isActive
                      ? "bg-[#14695D] text-white shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-[20px]"
                    style={isActive ? { fontVariationSettings: '"FILL" 1' } : {}}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-outline-variant/20 space-y-3 bg-surface-container-lowest">
          {/* School Office Desk Quick Info */}
          <div className="rounded-xl bg-surface-container-low p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-primary text-xs font-semibold">
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">call</span>
              <span>School Office</span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-tight">
              Support &amp; Desk Queries:
            </p>
            <a
              className="block text-xs font-semibold text-on-surface hover:text-primary transition-colors tracking-tight"
              href="tel:+2348030003399"
            >
              +234 803 000 3399
            </a>
            <div className="text-[10px] text-outline font-medium">
              Mon–Fri · 8:00 AM – 4:00 PM
            </div>
          </div>

          {/* Help link & Sign Out */}
          <div className="pt-1 flex items-center justify-between text-xs">
            <Link
              href="/contact"
              className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">help_outline</span>
              <span>Help Desk</span>
            </Link>
            <Link
              href="/login"
              className="text-on-surface-variant hover:text-error transition-colors flex items-center gap-1"
              title="Sign Out"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">logout</span>
              <span>Sign Out</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Column */}
      <div className="lg:pl-60 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="student-topbar min-h-20 bg-surface-container-lowest border-b border-outline-variant/20 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_4px_rgba(28,52,56,0.02)]">
          {/* Left: Hamburger & School Session */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="student-mobile-drawer"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-on-surface hover:bg-surface-container-low rounded-lg mr-1 focus:ring-2 focus:ring-primary"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[24px]">menu</span>
            </button>
            <div className="w-2 h-2 rounded-full bg-[#14695D]" />
            <div className="hidden xl:flex items-center gap-2 text-xs md:text-sm font-medium text-on-surface">
              <span className="font-display font-semibold text-primary">
                Edvora Nursery &amp; Primary School
              </span>
              <span className="text-outline-variant">·</span>
              <span className="text-on-surface-variant">2026/2027 First Term</span>
            </div>
          </div>

          {/* Right: Sibling Switcher & Profile Dropdown */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Interactive Sibling Selector Pill */}
            <div className="relative group">
              <button
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 text-on-surface transition-all text-left focus:ring-2 focus:ring-primary"
                type="button"
                aria-haspopup="true"
                aria-label="Switch household pupil"
              >
                <span className="w-2 h-2 rounded-full bg-[#14695D]" />
                <span className="text-xs font-medium">
                  Viewing:{" "}
                  <strong className="text-primary font-semibold">
                    {selectedPupil?.fullName || "Osasere Ehigiator"} · {selectedPupil?.classGrade || "Pri 3A"}
                  </strong>
                </span>
                <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant text-[18px]">
                  expand_more
                </span>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-1.5 w-72 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 py-2 hidden group-hover:block group-focus-within:block hover:block z-50">
                <div className="px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-outline">
                  Household Pupils
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedChildId("osasere-ehigiator")}
                  className={`w-full px-3.5 py-2 flex items-center justify-between text-left transition-colors ${
                    selectedChildId === "osasere-ehigiator"
                      ? "bg-primary/5 hover:bg-primary/10"
                      : "hover:bg-surface-container-low"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs">
                      OE
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-on-surface">Osasere Ehigiator</div>
                      <div className="text-[11px] text-primary">Primary 3A · Balance ₦50,000</div>
                    </div>
                  </div>
                  {selectedChildId === "osasere-ehigiator" && (
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-primary text-[18px]"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      check_circle
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedChildId("tamara-ehigiator")}
                  className={`w-full px-3.5 py-2 flex items-center justify-between text-left transition-colors ${
                    selectedChildId === "tamara-ehigiator"
                      ? "bg-primary/5 hover:bg-primary/10"
                      : "hover:bg-surface-container-low"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-surface-container text-tertiary flex items-center justify-center font-bold text-xs">
                      TE
                    </div>
                    <div>
                      <div className="text-xs font-medium text-on-surface">Tamara Ehigiator</div>
                      <div className="text-[11px] text-on-surface-variant">Nursery 2A · Settled (₦0)</div>
                    </div>
                  </div>
                  {selectedChildId === "tamara-ehigiator" ? (
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-primary text-[18px]"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      check_circle
                    </span>
                  ) : (
                    <span aria-hidden="true" className="material-symbols-outlined text-outline text-[16px]">
                      swap_horiz
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Guardian Profile Pill */}
            <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-outline-variant/30">
              <div className="w-9 h-9 rounded-full bg-[#14695D] text-white flex items-center justify-center font-semibold text-xs shadow-sm">
                OE
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-on-surface leading-tight">
                  Dr. &amp; Mrs. Ehigiator
                </div>
                <div className="text-[11px] text-on-surface-variant">Guardian Account</div>
              </div>
            </div>
          </div>
        </header>

        {/* Accessible Off-Canvas Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Student navigation menu">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-out drawer panel */}
            <div
              ref={drawerRef}
              id="student-mobile-drawer"
              className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-surface-container-lowest shadow-2xl flex flex-col justify-between z-50 border-r border-outline-variant/30"
            >
              <div>
                <div className="h-16 px-6 flex items-center justify-between border-b border-outline-variant/20">
                  <span className="font-display font-bold text-xl text-[#14695D]">
                    edvora<span className="text-[#E5AA58]">.</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                    className="p-2 text-on-surface-variant hover:text-on-surface rounded-lg"
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                <nav className="p-4 space-y-1.5" aria-label="Mobile navigation">
                  {navItems.map((item) => {
                    const isActive =
                      item.href === "/student"
                        ? pathname === "/student"
                        : pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                          isActive
                            ? "bg-[#14695D] text-white"
                            : "text-on-surface-variant hover:bg-surface-container-low"
                        }`}
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[20px]">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="p-4 border-t border-outline-variant/20 space-y-2">
                <Link
                  href="/contact"
                  className="flex items-center gap-2 text-xs text-on-surface-variant hover:text-primary py-1.5"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">help_outline</span>
                  <span>School Office Support</span>
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-xs text-error hover:text-error/80 py-1.5"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">logout</span>
                  <span>Sign Out</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
