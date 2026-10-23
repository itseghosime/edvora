import React from "react";
import { formatNaira } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  isCurrency?: boolean;
  subtext?: string;
  trend?: {
    value: string;
    positive?: boolean;
  };
  icon?: React.ReactNode;
  badge?: string;
}

export default function StatCard({
  label,
  value,
  isCurrency = false,
  subtext,
  trend,
  icon,
  badge,
}: StatCardProps) {
  const displayVal =
    typeof value === "number"
      ? isCurrency
        ? formatNaira(value)
        : value.toLocaleString()
      : value;

  return (
    <div className="bg-white rounded-2xl p-5 border border-ink-border/70 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-1">
            {label}
          </span>
          <div className="text-2xl lg:text-3xl font-heading font-extrabold text-ink tabular-nums">
            {displayVal}
          </div>
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            {icon}
          </div>
        )}
      </div>

      {(subtext || trend || badge) && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-2 text-xs">
          {subtext && <span className="text-ink-muted truncate">{subtext}</span>}
          {trend && (
            <span
              className={`font-semibold inline-flex items-center gap-1 ${
                trend.positive ? "text-forest-600" : "text-amber-700"
              }`}
            >
              {trend.value}
            </span>
          )}
          {badge && (
            <span className="px-2 py-0.5 rounded-full bg-mint text-forest-700 font-semibold text-[11px]">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

