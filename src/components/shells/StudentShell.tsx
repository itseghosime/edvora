"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePupilsQuery, useSchoolSummaryQuery } from "@/lib/query/hooks";
import SignOutButton from "@/components/shared/SignOutButton";
import PortalDataBoundary from "@/components/shared/PortalDataBoundary";

const items = [
  { label: "Overview", href: "/student", icon: "dashboard" },
  {
    label: "Fees & Payments",
    href: "/student/payments",
    icon: "account_balance_wallet",
  },
  { label: "Results", href: "/student/results", icon: "history_edu" },
  { label: "Account", href: "/student/account", icon: "manage_accounts" },
];
export default function StudentShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  const { data: pupils = [] } = usePupilsQuery();
  const { data: summary } = useSchoolSummaryQuery();
  const pupil = pupils[0];
  const [open, setOpen] = useState(false);
  const drawer = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const links = () =>
      Array.from(
        drawer.current?.querySelectorAll<HTMLElement>(
          "a,button:not([disabled])",
        ) ?? [],
      );
    links()[0]?.focus();
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const list = links();
        const first = list[0],
          last = list.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", key);
      opener.current?.focus();
    };
  }, [open]);
  const navigation = (
    <>
      <Link href="/" className="text-2xl font-bold text-primary">
        edvora<span className="text-secondary">.</span>
      </Link>
      <p className="text-xs uppercase tracking-wider text-on-surface-variant mt-2 mb-8">
        Student Portal
      </p>
      <nav aria-label="Student navigation" className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={path === item.href ? "page" : undefined}
            className={
              "flex gap-3 rounded-xl px-4 py-3 text-sm font-semibold " +
              (path === item.href
                ? "bg-primary text-white"
                : "text-on-surface-variant hover:bg-surface-container")
            }
          >
            <span
              aria-hidden="true"
              className="material-symbols-outlined text-lg"
            >
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-8 space-y-4">
        <Link href="/contact" className="block text-sm text-primary">
          School office support
        </Link>
        <SignOutButton />
      </div>
    </>
  );
  return (
    <div className="portal-shell student-shell min-h-screen bg-surface text-on-surface">
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-60 p-6 flex-col border-r border-outline-variant/30 bg-surface-container-lowest">
        {navigation}
      </aside>
      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 bg-surface-container-lowest/95 border-b border-outline-variant/30 p-4 sm:px-8 flex items-center justify-between gap-4">
          <button
            ref={opener}
            className="lg:hidden rounded-lg border border-outline-variant p-2"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            aria-expanded={open}
            aria-controls="student-navigation"
          >
            ☰
          </button>
          <div>
            <p className="font-semibold">
              {pupil?.fullName ?? "Student account"}
            </p>
            <p className="text-xs text-on-surface-variant">
              {pupil?.classGrade}
            </p>
          </div>
          <p className="text-xs text-on-surface-variant">
            {summary?.session} · {summary?.term}
          </p>
        </header>
        <main className="p-4 sm:p-8 max-w-7xl mx-auto">
          <PortalDataBoundary>{children}</PortalDataBoundary>
        </main>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div
            id="student-navigation"
            ref={drawer}
            role="dialog"
            aria-modal="true"
            aria-label="Student navigation"
            className="relative flex flex-col h-full w-72 max-w-[85vw] bg-surface-container-lowest p-6"
          >
            <button
              className="self-end p-2"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
            >
              ✕
            </button>
            {navigation}
          </div>
        </div>
      )}
    </div>
  );
}
