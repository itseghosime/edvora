"use client";

import { useState, type FormEvent } from "react";

export default function PublicEnquiryForm({ idPrefix = "enquiry" }: { idPrefix?: string }) {
  const [summary, setSummary] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSummary(`Edvora enquiry\nParent / guardian: ${String(data.get("name")).trim()}\nContact: ${String(data.get("contact")).trim()}\nProgramme: ${data.get("programme")}\nQuestions / preferred visit time: ${String(data.get("message")).trim() || "To be discussed"}`);
    setCopyStatus("");
  }
  async function copy() {
    try { await navigator.clipboard.writeText(summary); setCopyStatus("Enquiry copied."); }
    catch { setCopyStatus("Copy is unavailable. Select the summary below and copy it manually."); }
  }
  const field = "w-full px-3 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface text-sm focus:ring-2 focus:ring-primary";
  return <div className="space-y-4">
    <p className="rounded-xl bg-surface-container p-3 text-sm text-on-surface-variant">Prepare an enquiry to share with the school office. This form does not send a message or reserve a visit.</p>
    <form onSubmit={prepare} className="space-y-4">
      <div><label htmlFor={`${idPrefix}-name`} className="block text-sm font-semibold mb-1">Parent / guardian name</label><input className={field} id={`${idPrefix}-name`} name="name" autoComplete="name" maxLength={120} required pattern=".*\S.*" /></div>
      <div><label htmlFor={`${idPrefix}-contact`} className="block text-sm font-semibold mb-1">Contact phone or email</label><input className={field} id={`${idPrefix}-contact`} name="contact" maxLength={160} required pattern=".*\S.*" /></div>
      <div><label htmlFor={`${idPrefix}-programme`} className="block text-sm font-semibold mb-1">Programme of interest</label><select className={field} id={`${idPrefix}-programme`} name="programme"><option>Nursery</option><option>Lower Primary (1–3)</option><option>Upper Primary (4–6)</option><option>General enquiry / portal support</option></select></div>
      <div><label htmlFor={`${idPrefix}-message`} className="block text-sm font-semibold mb-1">Questions or preferred visit time</label><textarea className={field} id={`${idPrefix}-message`} name="message" rows={3} maxLength={2000} /></div>
      <button type="submit" className="w-full rounded-xl bg-primary text-on-primary px-4 py-3 font-semibold">Prepare enquiry</button>
    </form>
    {summary && <div className="space-y-3 rounded-xl border border-ink-border p-4">
      <h3 className="font-semibold" role="status">Your enquiry is ready to copy. It has not been sent.</h3>
      <label className="block text-sm" htmlFor={`${idPrefix}-summary`}>Enquiry summary</label>
      <textarea id={`${idPrefix}-summary`} className={field} value={summary} readOnly rows={7} />
      <button type="button" onClick={copy} className="rounded-lg bg-surface-container px-4 py-2 font-semibold text-primary">Copy enquiry</button>
      <p role="status" className="text-sm">{copyStatus}</p>
    </div>}
  </div>;
}
