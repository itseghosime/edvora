"use client";
import Link from "next/link";
import PageHeader from "../shared/PageHeader";
import { formatNaira } from "@/lib/utils";
import { Panel, Empty, DataTable, useStaffData } from "./StaffUI";
export default function StaffOverview() {
  const data = useStaffData();
  if (!data) return null;
  const teacher = data.staffRole === "teacher";
  const published = data.results.filter((r) => r.status === "Published").length;
  const cards = teacher
    ? [
        ["Assigned classes", data.classes.length],
        ["Pupils", data.pupils.length],
        ["Published reports", published],
      ]
    : [
        ["Enrolled pupils", data.summary.totalPupils],
        ["Verified payments", formatNaira(data.summary.verifiedPaid)],
        ["Outstanding fees", formatNaira(data.summary.totalBalance)],
      ];
  return (
    <div className="space-y-6">
      <PageHeader
        title="School overview"
        subtitle={
          data.currentTerm
            ? `${data.currentTerm.sessionName} · ${data.currentTerm.name}`
            : "School operations at a glance"
        }
      />
      {!data.currentTerm && (
        <Empty>
          No current term has been opened.{" "}
          {data.staffRole === "admin" ? (
            <Link className="underline text-primary" href="/admin/settings">
              Set up the school term and classes
            </Link>
          ) : (
            "Ask the school administrator to open the current term."
          )}
        </Empty>
      )}
      <section
        className="grid sm:grid-cols-3 gap-4"
        aria-label="School summary"
      >
        {cards.map(([label, value]) => (
          <Panel key={label}>
            <p className="text-sm text-on-surface-variant">{label}</p>
            <p className="text-3xl font-bold text-primary">{value}</p>
          </Panel>
        ))}
      </section>
      <Panel title={teacher ? "Your classes" : "Collection by class"}>
        {data.classStats.length ? (
          <DataTable
            headers={
              teacher
                ? ["Class", "Pupils"]
                : ["Class", "Pupils", "Charges", "Verified paid", "Balance"]
            }
          >
            {data.classStats.map((c) => (
              <tr key={c.className}>
                <td className="font-semibold">{c.className}</td>
                <td>{c.pupils}</td>
                {!teacher && (
                  <>
                    <td>{formatNaira(c.charges)}</td>
                    <td>{formatNaira(c.paid)}</td>
                    <td>{formatNaira(c.balance)}</td>
                  </>
                )}
              </tr>
            ))}
          </DataTable>
        ) : (
          <Empty>No pupils have been enrolled in your available classes.</Empty>
        )}
      </Panel>
      <Panel title="Your workspace">
        <div className="grid sm:grid-cols-2 gap-3">
          {(teacher
            ? [
                ["/admin/pupils", "Pupils & guardians"],
                ["/admin/results", "Results & grading"],
              ]
            : data.staffRole === "bursar"
              ? [
                  ["/admin/fees", "Fees & billing"],
                  ["/admin/payments", "Payment ledger"],
                ]
              : [
                  ["/admin/pupils", "Pupils & guardians"],
                  ["/admin/fees", "Fees & billing"],
                  ["/admin/results", "Results & grading"],
                  ["/admin/settings", "School settings"],
                ]
          ).map(([href, label]) => (
            <Link
              className="rounded-xl border border-outline-variant/40 p-4 text-primary font-semibold hover:bg-surface-container-low"
              key={href}
              href={href}
            >
              {label} <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </Panel>
    </div>
  );
}
