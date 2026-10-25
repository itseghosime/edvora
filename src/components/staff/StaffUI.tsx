"use client";
import { cloneElement, isValidElement, useId, useRef, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api, usePortalQuery } from "@/lib/query/hooks";
import type { PortalSnapshot } from "@/lib/types/portal";

export const inputClass =
  "w-full rounded-xl border border-outline-variant/60 bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";
export const buttonClass =
  "inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary disabled:opacity-50 disabled:cursor-not-allowed";
export const secondaryClass =
  "inline-flex items-center justify-center rounded-xl border border-outline-variant/60 px-4 py-2.5 text-sm font-semibold text-primary disabled:opacity-50";
export function Panel({
  title,
  description,
  children,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="edvora-panel rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 sm:p-6 space-y-4">
      {title && (
        <div>
          <h2 className="font-bold text-lg">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-on-surface-variant">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5 text-sm font-medium">
      <label htmlFor={id}>{label}</label>
      {isValidElement(children)
        ? cloneElement(children as ReactElement<{ id?: string }>, { id })
        : children}
    </div>
  );
}
export function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="p-5 text-sm text-on-surface-variant rounded-xl bg-surface-container-low">
      {children}
    </p>
  );
}
export function DataTable({
  headers,
  children,
}: {
  headers: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-outline-variant/40 text-on-surface-variant">
            {headers.map((h) => (
              <th
                scope="col"
                key={h}
                className="px-3 py-3 whitespace-nowrap font-medium"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/20 [&_td]:px-3 [&_td]:py-4">
          {children}
        </tbody>
      </table>
    </div>
  );
}
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-surface-container-high px-3 py-1 text-xs font-semibold text-primary">
      {children}
    </span>
  );
}
export function Guard({
  data,
  roles,
  children,
}: {
  data: PortalSnapshot;
  roles: NonNullable<PortalSnapshot["staffRole"]>[];
  children: ReactNode;
}) {
  return data.staffRole && roles.includes(data.staffRole) ? (
    <>{children}</>
  ) : (
    <Empty>Your staff role does not have access to this section.</Empty>
  );
}
export function useStaffAction() {
  const cache = useQueryClient();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const request = useRef<{ fingerprint: string; id: string } | null>(null);
  async function run(
    command: string,
    payload: Record<string, unknown>,
    success = "Changes saved.",
  ) {
    if (pending) return null;
    setPending(true);
    setError("");
    setMessage("");
    const fingerprint = JSON.stringify({ command, payload });
    if (request.current?.fingerprint !== fingerprint)
      request.current = { fingerprint, id: crypto.randomUUID() };
    try {
      const result = await api<{
        id: string;
        admissionNumber?: string;
        assignedCount?: number;
      }>("/api/staff/commands", {
        requestId: request.current.id,
        command,
        payload,
      });
      request.current = null;
      setMessage(success);
      await cache.invalidateQueries({ queryKey: ["portal"] });
      return result;
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Unable to save changes.",
      );
      return null;
    } finally {
      setPending(false);
    }
  }
  return { run, pending, error, message };
}
export function Feedback({
  action,
}: {
  action: { error: string; message: string };
}) {
  return (
    <>
      {action.error && (
        <p
          role="alert"
          className="rounded-xl border border-error/30 bg-error-container/30 p-3 text-sm text-error"
        >
          {action.error}
        </p>
      )}
      {action.message && (
        <p
          role="status"
          className="rounded-xl bg-primary/10 text-primary p-3 text-sm"
        >
          {action.message}
        </p>
      )}
    </>
  );
}
export function useStaffData() {
  return usePortalQuery().data;
}
export function ClassSelect({
  id,
  classes,
  value,
  onChange,
  required = true,
}: {
  id?: string;
  classes: PortalSnapshot["classes"];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <select
      id={id}
      className={inputClass}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    >
      <option value="">Select class</option>
      {classes.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  );
}
export function downloadCSV(filename: string, rows: (string | number)[][]) {
  const cell = (value: string | number) => {
    let text = String(value);
    if (/^[\s]*[=+\-@]/.test(text)) text = "'" + text;
    return '"' + text.replaceAll('"', '""') + '"';
  };
  const url = URL.createObjectURL(
    new Blob(
      ["\ufeff" + rows.map((row) => row.map(cell).join(",")).join("\r\n")],
      { type: "text/csv;charset=utf-8" },
    ),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
