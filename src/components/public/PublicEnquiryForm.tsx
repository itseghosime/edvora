"use client";

import React, { useState } from "react";
import Link from "next/link";

interface PublicEnquiryFormProps {
  idPrefix?: string;
  defaultProgramme?: string;
}

export default function PublicEnquiryForm({
  idPrefix = "enquiry",
  defaultProgramme = "Nursery I & II",
}: PublicEnquiryFormProps) {
  const [formData, setFormData] = useState({
    parentName: "",
    phone: "",
    email: "",
    programme: defaultProgramme,
    preferredMorning: "Tuesday Morning (9:30 AM)",
    notes: "",
  });

  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Do NOT simulate a fake network success; state the operational status clearly.
    setStatus("submitted");
  };

  const handleReset = () => {
    setStatus("idle");
  };

  return (
    <div className="space-y-4">
      {status === "idle" ? (
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="p-3 rounded-xl bg-forest-50/70 border border-forest-200/60 text-xs text-forest-800 leading-relaxed">
            <div className="font-semibold flex items-center gap-1.5 mb-0.5">
              <span className="material-symbols-outlined text-[16px] text-forest">info</span>
              Admissions Walkthrough Notice
            </div>
            Online enquiry dispatch is awaiting integration with the school office dispatch queue. To book an immediate walkthrough, visit the school office in GRA, Benin City or contact the administrative desk.
          </div>

          <div className="space-y-1">
            <label
              htmlFor={`${idPrefix}-parentName`}
              className="block font-label-md text-xs font-semibold text-on-surface"
            >
              Parent / Guardian Full Name <span className="text-error">*</span>
            </label>
            <input
              id={`${idPrefix}-parentName`}
              type="text"
              required
              value={formData.parentName}
              onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
              placeholder="e.g. Dr. & Mrs. O. Adeleke"
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label
                htmlFor={`${idPrefix}-phone`}
                className="block font-label-md text-xs font-semibold text-on-surface"
              >
                Phone Number <span className="text-error">*</span>
              </label>
              <input
                id={`${idPrefix}-phone`}
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0803 XXX XXXX"
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor={`${idPrefix}-programme`}
                className="block font-label-md text-xs font-semibold text-on-surface"
              >
                Programme of Interest
              </label>
              <select
                id={`${idPrefix}-programme`}
                value={formData.programme}
                onChange={(e) => setFormData({ ...formData, programme: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              >
                <option value="Creche (18mo+)">Creche (18mo+)</option>
                <option value="Nursery I & II">Nursery I &amp; II (Ages 3–5)</option>
                <option value="Lower Primary (1–3)">Lower Primary (Grades 1–3)</option>
                <option value="Upper Primary (4–6)">Upper Primary (Grades 4–6)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor={`${idPrefix}-morning`}
              className="block font-label-md text-xs font-semibold text-on-surface"
            >
              Preferred Morning (9:00 AM – 1:00 PM)
            </label>
            <select
              id={`${idPrefix}-morning`}
              value={formData.preferredMorning}
              onChange={(e) => setFormData({ ...formData, preferredMorning: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            >
              <option value="Tuesday Morning (9:30 AM)">Tuesday Morning (9:30 AM)</option>
              <option value="Thursday Morning (10:00 AM)">Thursday Morning (10:00 AM)</option>
              <option value="Friday Morning (9:00 AM)">Friday Morning (9:00 AM)</option>
              <option value="Other Weekday Morning">Other Weekday Morning (by arrangement)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label
              htmlFor={`${idPrefix}-notes`}
              className="block font-label-md text-xs font-semibold text-on-surface"
            >
              Additional Notes or Questions (Optional)
            </label>
            <textarea
              id={`${idPrefix}-notes`}
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Tell us about your child's age, specific interests, or any questions about admission..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm resize-y"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-primary text-white hover:bg-forest-700 font-label-lg text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            Request Walkthrough Appointment
          </button>
        </form>
      ) : (
        <div className="p-5 rounded-2xl bg-surface-container border border-ink-border space-y-3">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-[28px] shrink-0 mt-0.5">
              assignment_turned_in
            </span>
            <div className="space-y-1">
              <h4 className="font-headline-sm text-base font-bold text-on-surface">
                Walkthrough Details Prepared
              </h4>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                Thank you, <strong>{formData.parentName || "Parent"}</strong>. Please note that automated online form dispatch is pending school desk connection.
              </p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-surface-container-lowest border border-ink-border/60 text-xs text-on-surface space-y-1">
            <div className="font-semibold text-primary uppercase tracking-wider">Requested Summary:</div>
            <div><strong>Programme:</strong> {formData.programme}</div>
            <div><strong>Preferred Time:</strong> {formData.preferredMorning}</div>
            <div><strong>Contact Phone:</strong> {formData.phone}</div>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Please present these details at the school admissions reception in GRA, Benin City, or visit our <Link href="/contact" className="text-primary font-semibold underline">Contact page</Link> during office hours (Monday – Friday, 8:00 AM – 3:30 PM).
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-primary hover:underline"
          >
            ← Modify Walkthrough Request
          </button>
        </div>
      )}
    </div>
  );
}

