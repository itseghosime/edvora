import React from "react";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { PaymentTransaction } from "@/lib/mockData";
import { formatNaira, formatDate } from "@/lib/utils";

interface PaymentTimelineProps {
  payments: PaymentTransaction[];
  totalCharges: number;
}

export default function PaymentTimeline({
  payments,
  totalCharges,
}: PaymentTimelineProps) {
  const verifiedPayments = payments.filter((p) => p.status === "Verified");
  const totalPaid = verifiedPayments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = Math.max(0, totalCharges - totalPaid);

  return (
    <div className="bg-white rounded-2xl p-6 border border-ink-border shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-ink-border">
        <div>
          <h3 className="text-base font-bold text-ink font-heading">
            Payment History & Timeline
          </h3>
          <p className="text-xs text-ink-muted mt-0.5">
            Verified instalments credited to current academic term
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-ink-muted">Term Clearance</span>
          <div className="text-sm font-bold text-forest">
            {totalCharges > 0
              ? `${Math.round((totalPaid / totalCharges) * 100)}% Settled`
              : "0%"}
          </div>
        </div>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-ink-border">
        {payments.map((tx) => (
          <div key={tx.id} className="relative flex items-start gap-4">
            {/* Status dot */}
            <div className="absolute -left-6 mt-0.5">
              {tx.status === "Verified" ? (
                <div className="w-5 h-5 rounded-full bg-mint flex items-center justify-center text-forest">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              ) : tx.status === "Pending" ? (
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                  <Clock className="w-3.5 h-3.5" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-rose-700">
                  <AlertCircle className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div className="flex-1 bg-ivory-50/70 rounded-xl p-3.5 border border-ink-border/50">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-bold text-ink">
                  {formatNaira(tx.amount)}
                </span>
                <span className="text-[11px] text-ink-muted">
                  {formatDate(tx.date)}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-ink-muted">
                <span>{tx.channel}</span>
                <span>•</span>
                <span className="font-mono text-[10px] text-ink">
                  {tx.receiptNumber}
                </span>
              </div>
              {tx.notes && (
                <p className="mt-1.5 text-xs text-ink-muted/90 italic">
                  {tx.notes}
                </p>
              )}
            </div>
          </div>
        ))}

        {remaining > 0 && (
          <div className="relative flex items-start gap-4 pt-2">
            <div className="absolute -left-6 mt-1">
              <div className="w-5 h-5 rounded-full border-2 border-dashed border-marigold bg-white flex items-center justify-center text-marigold-dark">
                <Clock className="w-3 h-3" />
              </div>
            </div>
            <div className="flex-1 rounded-xl p-3 border border-dashed border-marigold/70 bg-marigold-light/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink">
                  Remaining Outstanding Balance
                </span>
                <span className="text-sm font-extrabold text-amber-800">
                  {formatNaira(remaining)}
                </span>
              </div>
              <p className="text-[11px] text-ink-muted mt-0.5">
                Payable via flexible parent card or bank transfer instalment
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

