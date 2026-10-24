"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BrandMark from "@/components/shared/BrandMark";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"student" | "staff">("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          activeTab === "student"
            ? { type: "student", admissionNumber: identifier, password }
            : { type: "staff", email: identifier, password },
        ),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(
          data.error || "Authentication failed. Please check your details.",
        );
        setIsLoading(false);
        return;
      }

      router.push(
        data.redirect || (activeTab === "student" ? "/student" : "/admin"),
      );
    } catch {
      setErrorMessage("Unable to reach the school portal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface flex flex-col justify-between p-4 sm:p-8">
      {/* Top Bar */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between mb-6">
        <BrandMark showSubtitle />
        <Link
          href="/"
          className="text-xs font-semibold text-on-surface-variant hover:text-primary flex items-center gap-1.5 transition-colors"
        >
          <span
            aria-hidden="true"
            className="material-symbols-outlined text-[18px]"
          >
            arrow_back
          </span>
          <span>Back to School Website</span>
        </Link>
      </div>

      {/* Main Auth Container */}
      <div className="max-w-5xl w-full mx-auto my-auto">
        <div className="w-full bg-surface-container-lowest rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-outline-variant/30">
          {/* Left Column: Branded Warm Editorial Panel */}
          <div className="w-full md:w-5/12 bg-primary-container text-on-primary p-space-lg md:p-space-xl flex flex-col justify-between relative overflow-hidden">
            {/* Ambient Decorative Backdrop Circles */}
            <div className="absolute -top-16 -left-16 w-64 h-64 bg-on-primary-container/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-inverse-primary/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Branding */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-space-lg">
                <div className="flex items-center space-x-space-sm">
                  <div className="w-10 h-10 rounded-xl bg-on-primary/15 flex items-center justify-center text-on-primary">
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-2xl"
                    >
                      school
                    </span>
                  </div>
                  <div>
                    <span className="font-headline-md text-headline-md tracking-tight block">
                      Edvora
                    </span>
                    <span className="font-label-sm text-label-sm text-on-primary-container uppercase tracking-wider block">
                      Institutional Gateway
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-on-primary/10">
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-sm text-secondary-container"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    stars
                  </span>
                  <span className="font-label-sm text-label-sm text-on-primary font-medium">
                    Session 2026/2027
                  </span>
                </div>
              </div>

              {/* Editorial Quote */}
              <div className="mt-space-md mb-space-lg">
                <div className="w-8 h-1 bg-secondary-container rounded-full mb-space-sm" />
                <p className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg font-headline leading-snug tracking-tight text-on-primary mb-space-sm">
                  “Every child’s education runs on trust, clear numbers, and
                  calm communication.”
                </p>
                <span className="font-label-md text-label-md text-on-primary-container font-medium block">
                  Edvora School Operations Canon
                </span>
              </div>

              {/* Dignity Value Badges */}
              <div className="space-y-space-sm">
                <div className="flex items-start space-x-space-sm p-3 rounded-2xl bg-on-primary/5 backdrop-blur-sm">
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-on-primary-container mt-0.5"
                  >
                    verified_user
                  </span>
                  <div>
                    <h4 className="font-label-md text-label-md text-on-primary">
                      Strict role boundaries
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-primary-container/90">
                      Autonomous access vaults for Bursar, Class Teacher, and
                      Administrative Head.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-space-sm p-3 rounded-2xl bg-on-primary/5 backdrop-blur-sm">
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-secondary-container mt-0.5"
                  >
                    account_balance_wallet
                  </span>
                  <div>
                    <h4 className="font-label-md text-label-md text-on-primary">
                      Verified secure fee payments
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-primary-container/90">
                      Zero reconciliation lag with automated real-time NGN bank
                      receipt clearing.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-space-sm p-3 rounded-2xl bg-on-primary/5 backdrop-blur-sm">
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-on-primary-container mt-0.5"
                  >
                    family_restroom
                  </span>
                  <div>
                    <h4 className="font-label-md text-label-md text-on-primary">
                      Independent student record isolation
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-primary-container/90">
                      Secure family logs, fee receipts, and terminal report
                      sheets shielded per family.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="relative z-10 mt-space-lg pt-space-md border-t border-on-primary/10">
              <p className="font-body-sm text-body-sm text-on-primary-container/80 leading-relaxed">
                Accounts are provisioned directly by school administration. For
                invitation link re-sends or enrollment access, contact the
                school office.
              </p>
            </div>
          </div>

          {/* Right Column: Centered Editorial Login Form */}
          <div className="w-full md:w-7/12 p-space-lg md:p-space-xl flex flex-col justify-center bg-surface-container-lowest">
            <div className="max-w-md w-full mx-auto">
              {/* Header */}
              <div className="mb-space-lg">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-surface-container-low text-primary mb-space-sm">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                    Authorized Access Only
                  </span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  Welcome to Edvora
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Sign in to your verified school workspace or parent guardian
                  portal.
                </p>
              </div>

              {/* Role Selector Segmented Controls */}
              <div className="bg-surface-container p-1 rounded-2xl flex mb-space-lg">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("student");
                    setPassword("");
                    setIdentifier("");
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-label-md text-label-md transition-all duration-200 flex items-center justify-center space-x-2 ${
                    activeTab === "student"
                      ? "bg-surface-container-lowest text-primary shadow-sm font-bold"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-[18px]"
                  >
                    family_restroom
                  </span>
                  <span>Student &amp; Parent</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("staff");
                    setPassword("");
                    setIdentifier("");
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-label-md text-label-md transition-all duration-200 flex items-center justify-center space-x-2 ${
                    activeTab === "staff"
                      ? "bg-surface-container-lowest text-primary shadow-sm font-bold"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-[18px]"
                  >
                    badge
                  </span>
                  <span>Staff Workstation</span>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-space-md">
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-error/10 border border-error/20 text-error text-xs flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[18px]"
                    >
                      error
                    </span>
                    <span>{errorMessage}</span>
                  </div>
                )}
                {activeTab === "student" ? (
                  <>
                    <div className="space-y-1">
                      <label
                        htmlFor="student-admission"
                        className="block font-label-md text-label-md text-on-surface"
                      >
                        Pupil Admission Number
                      </label>
                      <div className="relative flex items-center">
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-outline absolute left-3 text-[20px]"
                        >
                          person
                        </span>
                        <input
                          type="text"
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          id="student-admission"
                          autoComplete="username"
                          maxLength={32}
                          placeholder="Your school admission number"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                        />
                      </div>
                      <span className="text-[11px] text-on-surface-variant block mt-1">
                        Parents sign in using their child&apos;s school access
                        details.
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="student-password"
                        className="block font-label-md text-label-md text-on-surface"
                      >
                        Password
                      </label>
                      <input
                        id="student-password"
                        type="password"
                        autoComplete="current-password"
                        required
                        maxLength={128}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest focus:ring-2 focus:ring-primary"
                      />
                      <Link
                        href="/account/access"
                        className="block text-sm text-primary underline pt-2"
                      >
                        First-time access or forgotten password?
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <label className="block font-label-md text-label-md text-on-surface">
                        Staff Workstation Email
                      </label>
                      <div className="relative flex items-center">
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-outline absolute left-3 text-[20px]"
                        >
                          mail
                        </span>
                        <input
                          type="email"
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder="e.g. admin@edvora.edu.ng"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block font-label-md text-label-md text-on-surface">
                          Workstation Security Key
                        </label>
                        <Link
                          href="/contact"
                          className="text-xs text-primary hover:underline font-semibold"
                        >
                          IT Support
                        </Link>
                      </div>
                      <div className="relative flex items-center">
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined text-outline absolute left-3 text-[20px]"
                        >
                          vpn_key
                        </span>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter staff security key"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-primary-container text-on-primary hover:bg-primary font-label-lg text-label-lg transition-all shadow-md flex items-center justify-center space-x-2 mt-space-md disabled:opacity-50"
                >
                  {isLoading && (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  <span>
                    Authenticate &amp; Enter{" "}
                    {activeTab === "student" ? "Student Portal" : "Staff Desk"}
                  </span>
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-[18px]"
                  >
                    arrow_forward
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-on-surface-variant mt-6">
        <p>
          © 2026 Edvora Nursery &amp; Primary School. School account access.
          Contact the school office for assistance.
        </p>
      </div>
    </div>
  );
}
