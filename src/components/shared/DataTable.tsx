import React from "react";
import EmptyState from "./EmptyState";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyTitle?: string;
  emptyDescription?: string;
  isLoading?: boolean;
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyTitle,
  emptyDescription,
  isLoading = false,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-ink-border overflow-hidden shadow-sm p-8 text-center">
        <div className="inline-block w-8 h-8 border-4 border-forest-100 border-t-forest rounded-full animate-spin" />
        <p className="mt-3 text-xs text-ink-muted">Loading table records...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-ink-border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-ivory-50/80 border-b border-ink-border text-xs font-semibold text-ink-muted uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={`px-4 sm:px-6 py-3.5 font-heading ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-border/50 text-ink">
            {data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="hover:bg-ivory-50/50 transition-colors"
              >
                {columns.map((col, idx) => (
                  <td
                    key={idx}
                    className={`px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm ${
                      col.className || ""
                    }`}
                  >
                    {col.cell
                      ? col.cell(row)
                      : col.accessorKey
                      ? String(row[col.accessorKey] ?? "")
                      : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

