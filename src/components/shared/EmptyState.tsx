import React from "react";
import { FolderSearch } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export default function EmptyState({
  title = "No records found",
  description = "There are no matching entries for the current selection.",
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="py-12 px-6 text-center flex flex-col items-center justify-center bg-ivory-50/50 rounded-2xl border border-dashed border-ink-border">
      <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest flex items-center justify-center mb-3">
        {icon || <FolderSearch className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-bold text-ink font-heading">{title}</h3>
      <p className="mt-1 text-sm text-ink-muted max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

