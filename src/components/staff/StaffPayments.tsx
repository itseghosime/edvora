"use client";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import PageHeader from "../shared/PageHeader";
import { api } from "@/lib/query/hooks";
import { formatNaira, formatDate } from "@/lib/utils";
import {
  Panel,
  Field,
  Empty,
  DataTable,
  Badge,
  Guard,
  inputClass,
  secondaryClass,
  useStaffData,
  downloadCSV,
} from "./StaffUI";
export default function StaffPayments() {
  const data = useStaffData();
  const cache = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [reference, setReference] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  if (!data) return null;
  const rows = data.payments.filter(
    (p) =>
      (!status || p.status === status) &&
      `${p.pupilName} ${p.reference} ${p.receiptNumber}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <Guard data={data} roles={["admin", "bursar"]}>
      <div className="space-y-6">
        <PageHeader
          title="Payment ledger"
          subtitle="Provider-verified payments and issued receipt numbers for the current term."
        />
        <Panel
          title="Verify a payment reference"
          description="Use the reference returned by Paystack. Balances change only after server verification."
        >
          <form
            className="flex flex-col sm:flex-row gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setPending(true);
              setError("");
              setMessage("");
              try {
                const result = await api<{
                  success: boolean;
                  message?: string;
                }>("/api/payments/verify", { reference: reference.trim() });
                if (!result.success)
                  throw new Error(
                    result.message ?? "Payment is not verified yet.",
                  );
                setMessage("Payment verified. Ledger refreshed.");
                await cache.invalidateQueries({ queryKey: ["portal"] });
              } catch (err) {
                setError(
                  err instanceof Error ? err.message : "Verification failed.",
                );
              } finally {
                setPending(false);
              }
            }}
          >
            <label className="flex-1">
              <span className="sr-only">Payment reference</span>
              <input
                className={inputClass}
                required
                maxLength={64}
                placeholder="Paystack payment reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </label>
            <button className={secondaryClass} disabled={pending}>
              {pending ? "Verifying…" : "Verify reference"}
            </button>
          </form>
          {error && (
            <p role="alert" className="text-error text-sm">
              {error}
            </p>
          )}
          {message && (
            <p role="status" className="text-primary text-sm">
              {message}
            </p>
          )}
        </Panel>
        <Panel title="Transactions">
          <div className="grid sm:grid-cols-3 gap-3">
            <Field label="Search transactions">
              <input
                className={inputClass}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pupil, reference or receipt"
              />
            </Field>
            <Field label="Status">
              <select
                className={inputClass}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All statuses</option>
                {["Verified", "Pending", "Failed"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <button
              className={secondaryClass + " self-end"}
              onClick={() =>
                downloadCSV("edvora-payments.csv", [
                  [
                    "Date",
                    "Pupil",
                    "Reference",
                    "Amount (NGN)",
                    "Status",
                    "Receipt",
                  ],
                  ...rows.map((p) => [
                    p.date,
                    p.pupilName,
                    p.reference,
                    p.amount,
                    p.status,
                    p.receiptNumber,
                  ]),
                ])
              }
            >
              Export visible payments
            </button>
          </div>
          {rows.length ? (
            <DataTable
              headers={[
                "Pupil",
                "Payment reference",
                "Amount",
                "Status",
                "Receipt",
                "Date",
              ]}
            >
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>
                    <p className="font-semibold">{p.pupilName}</p>
                    <p className="text-xs">{p.classGrade}</p>
                  </td>
                  <td className="font-mono text-xs break-all">{p.reference}</td>
                  <td>{formatNaira(p.amount)}</td>
                  <td>
                    <Badge>{p.status}</Badge>
                  </td>
                  <td className="text-xs">{p.receiptNumber || "Not issued"}</td>
                  <td className="whitespace-nowrap">{formatDate(p.date)}</td>
                </tr>
              ))}
            </DataTable>
          ) : (
            <Empty>
              No transactions match these filters. Verified payments will appear
              after the provider confirms them.
            </Empty>
          )}
        </Panel>
      </div>
    </Guard>
  );
}
