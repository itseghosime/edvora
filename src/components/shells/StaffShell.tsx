"use client";

import React, { useState } from "react";
import Link from "next/link";
import SignOutButton from "@/components/shared/SignOutButton";
import { usePathname } from "next/navigation";
import { useActorQuery, usePortalQuery } from "@/lib/query/hooks";
import PortalDataBoundary from "@/components/shared/PortalDataBoundary";

interface StaffShellProps {
  children: React.ReactNode;
}

export default function StaffShell({ children }: StaffShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {data:auth}=useActorQuery();
  const {data:portal}=usePortalQuery();
  const role=auth?.actor.type === "staff" ? auth.actor.role : undefined;
  const currentRole=role === "admin" ? "Administrator" : role === "teacher" ? "Teacher" : role === "bursar" ? "Bursar" : "Staff";

  const navItems = [
    { label: "Overview", href: "/admin", icon: "space_dashboard" },
    { label: "Pupils & Guardians", href: "/admin/pupils", icon: "group" },
    { label: "Fees & Billing", href: "/admin/fees", icon: "credit_card" },
    { label: "Payment Ledger", href: "/admin/payments", icon: "receipt_long" },
    { label: "Reminders & Notice", href: "/admin/reminders", icon: "notifications_active" },
    { label: "Results & Grading", href: "/admin/results", icon: "assignment_turned_in" },
    { label: "School Settings", href: "/admin/settings", icon: "settings" },
  ];

  return (
    <div className="portal-shell min-h-screen bg-surface font-body-md text-on-surface">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-72 bg-surface-container-lowest z-50 flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] select-none">
        <div className="flex flex-col">
          {/* Logo Header */}
          <div className="h-24 px-gutter flex items-center justify-between border-b border-outline-variant/20">
            <Link href="/" className="flex items-center gap-space-xs">
              <span className="font-headline-md text-headline-md text-primary tracking-tight font-bold">
                edvora<span className="text-secondary">.</span>
              </span>
            </Link>
            <span className="px-space-sm py-space-xs rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
              Staff Dashboard
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-space-xs px-gutter mt-4">
            {navItems.filter(item => role === "admin" || (role === "teacher" ? ["/admin", "/admin/pupils", "/admin/results"].includes(item.href) : role === "bursar" ? !["/admin/results", "/admin/settings"].includes(item.href) : false)).map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  aria-current={isActive ? "page" : undefined}
                  href={item.href}
                  className={`flex items-center gap-space-md px-space-md py-space-sm rounded-lg transition-colors font-label-lg text-label-lg ${
                    isActive
                      ? "bg-primary text-on-primary font-bold shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                  }`}
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Controls */}
        <div className="p-gutter border-t border-outline-variant/20 space-y-3 bg-surface-container-lowest">
          <div className="p-3 bg-surface-container-low rounded-xl text-xs space-y-1">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline block">
              Active Permission
            </span>
            <span className="font-semibold text-primary">{currentRole}</span>
          </div>

          <SignOutButton />
        </div>
      </aside>

      {/* Main Staff Content Wrapper */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Top Fixed Header */}
        <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline-variant/20">
          {/* Top Session Ribbon */}
          <div className="w-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm px-4 sm:px-gutter py-space-xs flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-secondary">bolt</span>
              <span>{portal?.settings.schoolShortName??"Edvora"} · Staff operations</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-secondary-fixed hidden sm:inline">
              {auth?.actor.name}
            </span>
          </div>

          {/* Sub Header */}
          <div className="h-16 px-4 sm:px-gutter flex items-center justify-between">
            <div className="flex items-center gap-space-md">
              <button
                type="button"
                aria-label="Toggle navigation"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 text-on-surface hover:bg-surface-container-low rounded-lg mr-1"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[24px]">menu</span>
              </button>
              <span className="font-title-md text-title-md text-on-surface font-semibold hidden xl:inline">
                {portal?.settings.schoolName??"Edvora"}
              </span>
              <span className="text-outline-variant font-body-sm text-body-sm hidden xl:inline">
                /
              </span>
              <div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1 rounded-lg text-primary font-label-md text-label-md">
                <span aria-hidden="true" className="material-symbols-outlined text-[16px]">calendar_month</span>
                <span>{portal?.currentTerm?`${portal.currentTerm.sessionName} · ${portal.currentTerm.name}`:"No current term"}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-space-lg">
              <span className="px-space-md py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                {currentRole} Role
              </span>
              <div className="flex items-center gap-space-sm">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xs">
                  {auth?.actor.name?.split(" ").map(n=>n[0]).slice(0,2).join("")??"ST"}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-surface-container-lowest border-b border-outline-variant/20 p-4 space-y-2 shadow-lg">
            <nav className="space-y-1">
              {navItems.filter(item => role === "admin" || (role === "teacher" ? ["/admin", "/admin/pupils", "/admin/results"].includes(item.href) : role === "bursar" ? !["/admin/results", "/admin/settings"].includes(item.href) : false)).map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                      isActive
                        ? "bg-primary text-on-primary font-bold"
                        : "text-on-surface-variant hover:bg-surface-container-low"
                    }`}
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="pt-2 border-t border-outline-variant/20 flex justify-end">
              <SignOutButton />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <PortalDataBoundary>{children}</PortalDataBoundary>
        </main>
      </div>
    </div>
  );
}

