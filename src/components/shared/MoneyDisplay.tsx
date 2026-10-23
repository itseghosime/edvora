import React from "react";
import { formatNaira } from "@/lib/utils";

interface MoneyDisplayProps {
  amount: number;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  tone?: "default" | "success" | "warning" | "danger" | "muted";
}

export default function MoneyDisplay({
  amount,
  className = "",
  size = "md",
  tone = "default",
}: MoneyDisplayProps) {
  const sizeClasses = {
    sm: "text-sm font-semibold",
    md: "text-base font-semibold",
    lg: "text-xl font-bold",
    xl: "text-3xl font-extrabold tracking-tight",
  };

  const toneClasses = {
    default: "text-ink",
    success: "text-forest-600",
    warning: "text-amber-700",
    danger: "text-rose-600",
    muted: "text-ink-muted",
  };

  return (
    <span className={`inline-flex items-baseline font-heading tabular-nums ${sizeClasses[size]} ${toneClasses[tone]} ${className}`}>
      {formatNaira(amount)}
    </span>
  );
}

