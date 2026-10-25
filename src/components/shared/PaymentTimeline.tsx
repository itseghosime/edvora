"use client";

import { useState } from "react";
import { ArrowUpRight, Check, CheckCircle2, ChevronDown, Clock3, Copy, CreditCard, Receipt, ShieldCheck, XCircle } from "lucide-react";
import type { PaymentTransaction } from "@/lib/mockData";
import { formatNaira, formatDate } from "@/lib/utils";

interface PaymentTimelineProps {
  payments: PaymentTransaction[];
  totalCharges: number;
  onPay?: () => void;
}
const filters = ["All", "Verified", "Pending", "Failed"] as const;
type Filter = typeof filters[number];

export default function PaymentTimeline({ payments, totalCharges, onPay }: PaymentTimelineProps) {
  const [filter, setFilter] = useState<Filter>("All");
  const [copied, setCopied] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const verified = payments.filter(p => p.status === "Verified");
  const totalPaid = verified.reduce((sum,p) => sum + p.amount, 0);
  const remaining = Math.max(0, totalCharges - totalPaid);
  const percent = totalCharges > 0 ? Math.min(100, Math.max(0, Math.round(totalPaid / totalCharges * 100))) : 0;
  const visible = [...payments].filter(p => filter === "All" || p.status === filter)
    .sort((a,b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0));
  async function copyReference(tx: PaymentTransaction) {
    try { await navigator.clipboard.writeText(tx.reference); setCopied(tx.id); setCopyMessage("Payment reference copied."); }
    catch { setCopied(""); setCopyMessage("Copy is unavailable. Select the reference below and copy it manually."); }
  }

  return <section className="payment-journal" aria-labelledby="payment-history-title">
    <div className="payment-journal-heading">
      <div><span className="payment-eyebrow"><Receipt size={13} aria-hidden="true"/> Your term, in transactions</span><h2 id="payment-history-title">Payment history</h2><p>A clear record of every payment along the way.</p></div>
      <span className="payment-trust"><ShieldCheck size={15} aria-hidden="true"/> Verified payments only reduce your balance</span>
    </div>
    <div className="payment-journal-grid">
      <div className="payment-progress-card" aria-label="Term payment progress">
        <div className="payment-progress-top"><span>Term progress</span><span className="payment-small-pill">{remaining === 0 && totalCharges > 0 ? "Fully settled" : totalPaid > 0 ? "In progress" : "Getting started"}</span></div>
        <div className="payment-ring" role="progressbar" aria-label="Term fees paid" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}
          style={{ background: `conic-gradient(#d6b579 ${percent * 3.6}deg, #426657 0deg)` }}>
          <div><strong>{percent}<span>%</span></strong><span>of term fees paid</span></div>
        </div>
        <div className="payment-progress-totals"><div><span>Verified paid</span><strong>{formatNaira(totalPaid)}</strong></div><div><span>Term charges</span><strong>{formatNaira(totalCharges)}</strong></div></div>
        <div className="payment-balance"><span>Left to pay</span><strong>{formatNaira(remaining)}</strong></div>
        {remaining > 0 && onPay ? <button type="button" className="payment-next-action" onClick={onPay}>Make a payment <ArrowUpRight size={16} aria-hidden="true"/></button>
          : <p className="payment-settled-note">{totalCharges > 0 ? "Your verified payments cover this term’s charges." : "Your school has not assigned term fees yet."}</p>}
      </div>
      <div className="payment-activity">
        <div className="payment-activity-toolbar">
          <div className="payment-filters" aria-label="Filter payment history">{filters.map(label => {
            const count = label === "All" ? payments.length : payments.filter(p => p.status === label).length;
            return <button key={label} type="button" aria-pressed={filter === label} onClick={()=>setFilter(label)}>{label}<span>{count}</span></button>;
          })}</div><span className="payment-order">Newest first</span>
        </div>
        <div className="payment-records">
          {visible.length === 0 ? <div className="payment-empty"><span><Receipt size={25} aria-hidden="true"/></span><h3>{payments.length === 0 ? "Your payment journey starts here" : "No " + filter.toLowerCase() + " payments"}</h3><p>{payments.length === 0 ? "Once a payment is recorded, you’ll find its status and details here." : "Try another status to see the rest of your payment history."}</p>{filter !== "All" && <button type="button" onClick={()=>setFilter("All")}>Show all payments <ArrowUpRight size={14} aria-hidden="true"/></button>}</div>
          : visible.map(tx => {
            const Icon = tx.status === "Verified" ? CheckCircle2 : tx.status === "Pending" ? Clock3 : XCircle;
            return <details key={tx.id} className="payment-record">
              <summary>
                <span className={"payment-channel-icon status-" + tx.status.toLowerCase()}><CreditCard size={20} aria-hidden="true"/></span>
                <span className="payment-record-main"><strong>{formatNaira(tx.amount)}</strong><span>{tx.channel} <span aria-hidden="true">·</span> {formatDate(tx.date)}</span></span>
                <span className={"payment-status status-" + tx.status.toLowerCase()}><Icon size={12} aria-hidden="true"/>{tx.status}</span>
                <span className="payment-expand"><span>View details</span><ChevronDown size={17} aria-hidden="true"/></span>
              </summary>
              <div className="payment-record-details">
                <dl><div><dt>Payment reference</dt><dd>{tx.reference || "Not available"}</dd></div>
                  <div><dt>Receipt number</dt><dd>{tx.receiptNumber || (tx.status === "Verified" ? "Contact the school for your receipt number" : "Available after verification")}</dd></div>
                  <div><dt>Payment date</dt><dd>{formatDate(tx.date)}</dd></div><div><dt>Payment status</dt><dd>{tx.status === "Verified" ? "Confirmed and credited" : tx.status === "Pending" ? "Awaiting verification — not credited" : "Not credited"}</dd></div></dl>
                {tx.notes && <p className="payment-record-note">{tx.notes}</p>}
                {tx.reference && <button className="payment-copy" type="button" onClick={()=>void copyReference(tx)}>{copied === tx.id ? <Check size={14} aria-hidden="true"/> : <Copy size={14} aria-hidden="true"/>}{copied === tx.id ? "Reference copied" : "Copy reference"}</button>}
              </div>
            </details>;
          })}
        </div>
        <p className="payment-copy-message" role="status" aria-live="polite">{copyMessage}</p>
        <p className="payment-help"><ShieldCheck size={14} aria-hidden="true"/> Pending and failed payments do not count towards your verified total.</p>
      </div>
    </div>
  </section>;
}
