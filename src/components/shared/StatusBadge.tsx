import React from "react";

export type StatusType =
  | "Verified"
  | "Pending"
  | "Failed"
  | "Published"
  | "Draft"
  | "Under Correction"
  | "Under Review"
  | "Active"
  | "Inactive"
  | "Delivered"
  | "Accepted"
  | "Suppressed (₦0 Balance)";

interface StatusBadgeProps {
  status: StatusType | string;
  size?: "sm" | "md";
  className?: string;
}

export default function StatusBadge({
  status,
  size = "md",
  className = "",
}: StatusBadgeProps) {
  let style = "bg-gray-100 text-gray-700 border-gray-200";

  switch (status) {
    case "Verified":
    case "Published":
    case "Active":
    case "Delivered":
      style = "bg-mint-light text-forest-700 border-forest-200";
      break;
    case "Pending":
    case "Accepted":
    case "Under Review":
      style = "bg-amber-50 text-amber-800 border-amber-200";
      break;
    case "Draft":
    case "Suppressed (₦0 Balance)":
      style = "bg-ivory-200 text-ink-muted border-ink-border";
      break;
    case "Under Correction":
      style = "bg-orange-50 text-orange-800 border-orange-200";
      break;
    case "Failed":
    case "Inactive":
      style = "bg-rose-50 text-rose-700 border-rose-200";
      break;
  }

  const sizeClasses =
    size === "sm"
      ? "text-xs px-2 py-0.5 font-medium"
      : "text-xs px-2.5 py-1 font-semibold";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClasses} ${style} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      {status}
    </span>
  );
}

