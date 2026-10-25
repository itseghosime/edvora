"use client";
import { useState } from "react";
import Link from "next/link";
import {
  usePupilQuery,
  useResultAccessQuery,
  usePaymentsQuery,
  useFeeBreakdownQuery,
  useStudentResultQuery,
  useSchoolSummaryQuery,
} from "@/lib/query/hooks";
import { formatNaira } from "@/lib/utils";
import PaymentModal from "../payments/PaymentModal";
import PaymentReturnVerifier from "../payments/PaymentReturnVerifier";
import PaymentTimeline from "./PaymentTimeline";
import ResultReport from "./ResultReport";
import PageHeader from "./PageHeader";
import { CreditCard, ArrowRight } from "lucide-react";

export default function StudentAccountView({
  view,
}: {
  view: "overview" | "payments" | "results";
}) {
  const { data: pupil } = usePupilQuery();
  const { data: payments = [] } = usePaymentsQuery();
  const { data: fees = [] } = useFeeBreakdownQuery();
  const { data: result } = useStudentResultQuery();
  const { data: resultAccess } = useResultAccessQuery();
  const { data: summary } = useSchoolSummaryQuery();
  const [paying, setPaying] = useState(false);

  if (!pupil) {
    return (
      <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 text-center max-w-lg mx-auto">
        <h1 className="font-bold text-xl text-ink font-heading">
          No pupil account available
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Please contact the school office to verify enrollment and account activation.
        </p>
      </section>
    );
  }

  const pageTitle =
    view === "overview"
      ? "Student Overview"
      : view === "payments"
      ? "Fees & Payments"
      : "Academic Results";

  const sessionTermText = summary?.session
    ? `${summary.session} · ${summary.term || "Current Term"}`
    : undefined;

  const breadcrumbs =
    view === "overview"
      ? [{ label: "Student Portal" }]
      : [
          { label: "Student Portal", href: "/student" },
          { label: pageTitle },
        ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={pageTitle}
        subtitle={`${pupil.fullName} · ${pupil.classGrade} · ${pupil.admissionNo}${
          sessionTermText ? ` · ${sessionTermText}` : ""
        }`}
        breadcrumbs={breadcrumbs}
        actions={
          view !== "results" && pupil.balance > 0 ? (
            <button
              onClick={() => setPaying(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-forest px-5 py-2.5 text-white font-semibold text-sm shadow-sm hover:bg-forest-600 transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay fees</span>
            </button>
          ) : undefined
        }
      />

      {view !== "results" && (
        <>
          <PaymentReturnVerifier />
          <section
            className="grid gap-4 sm:grid-cols-3"
            aria-label="Current term balance"
          >
            {[
              ["Total charges", pupil.charges],
              ["Verified paid", pupil.paid],
              ["Outstanding balance", pupil.balance],
            ].map(([label, amount]) => (
              <div
                key={label}
                className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  {label}
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold font-heading text-primary mt-2">
                  {formatNaira(Number(amount))}
                </p>
              </div>
            ))}
          </section>

          <div className="flex flex-wrap items-center gap-3">
            {pupil.balance > 0 && (
              <button
                onClick={() => setPaying(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-white font-semibold text-sm shadow-sm hover:opacity-95 transition-all"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay school fees</span>
              </button>
            )}
            {view === "overview" && (
              <>
                <Link
                  className="inline-flex items-center gap-1.5 rounded-xl border border-outline-variant/60 bg-surface-container-lowest px-5 py-3 text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
                  href="/student/payments"
                >
                  <span>Payments & receipts</span>
                  <ArrowRight className="w-4 h-4 text-on-surface-variant" />
                </Link>
                <Link
                  className="inline-flex items-center gap-1.5 rounded-xl border border-outline-variant/60 bg-surface-container-lowest px-5 py-3 text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
                  href="/student/results"
                >
                  <span>View academic results</span>
                  <ArrowRight className="w-4 h-4 text-on-surface-variant" />
                </Link>
              </>
            )}
          </div>

          <PaymentTimeline
            payments={payments.filter((p) => p.pupilId === pupil.id)}
            totalCharges={pupil.charges}
            onPay={() => setPaying(true)}
          />

          {view === "payments" && (
            <section className="rounded-2xl bg-surface-container-lowest p-6 border border-outline-variant/30 shadow-sm">
              <h2 className="text-lg font-bold font-heading text-ink mb-4">
                Approved Fee Breakdown
              </h2>
              {fees.length > 0 ? (
                <ul className="divide-y divide-outline-variant/30">
                  {fees.map((f) => (
                    <li
                      key={f.id}
                      className="py-3.5 flex justify-between items-center gap-4 text-sm"
                    >
                      <span className="font-medium text-ink">{f.name}</span>
                      <span className="font-bold font-heading text-primary">
                        {formatNaira(f.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-on-surface-variant">
                  No individual fee breakdown components configured for this class.
                </p>
              )}
            </section>
          )}

          <PaymentModal
            isOpen={paying}
            onClose={() => setPaying(false)}
            pupilId={pupil.id}
            pupilName={pupil.fullName}
            classGrade={pupil.classGrade}
            currentBalance={pupil.balance}
          />
        </>
      )}

      {view === "results" &&
        (resultAccess?.locked ? (
          <section className="rounded-3xl border border-amber-200 bg-amber-50/70 p-6 sm:p-10 max-w-3xl mx-auto" aria-labelledby="result-locked-title">
            <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">Fee clearance required</span>
            <h2 id="result-locked-title" className="mt-4 font-heading font-bold text-2xl text-ink">Your report is locked</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">Your school has published this term’s report. Complete the outstanding term fees to view, print or download it. The school administrator can also approve an exception.</p>
            <div className="my-6 rounded-2xl bg-white border border-amber-100 p-4"><span className="block text-xs text-ink-muted">Outstanding for this term</span><strong className="block mt-1 text-2xl text-forest">{formatNaira(resultAccess.balance)}</strong></div>
            <div className="flex flex-wrap gap-3"><Link className="rounded-xl bg-forest px-5 py-3 text-sm font-semibold text-white" href="/student/payments">Go to fees &amp; payments</Link><Link className="rounded-xl border border-forest/20 px-5 py-3 text-sm font-semibold text-forest" href="/contact">Contact the school</Link></div>
            <p className="mt-5 text-xs text-ink-muted">Access updates automatically after the school verifies full payment.</p>
          </section>
        ) : result ? (
          <ResultReport result={result} />
        ) : (
          <section className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-8 shadow-sm">
            <h2 className="font-bold text-lg font-heading text-ink">
              No published report for this term
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
              The school will make your academic report available here after official review and publication.
              Published reports become available after fee clearance or an administrator’s access override.
            </p>
          </section>
        ))}
    </div>
  );
}
