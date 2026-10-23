"use client";

import React from "react";
import { Search, Filter, X } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  filterOptions?: FilterOption[];
  selectedFilter?: string;
  onFilterChange?: (filter: string) => void;
  actions?: React.ReactNode;
}

export default function FilterBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search records...",
  filterOptions,
  selectedFilter,
  onFilterChange,
  actions,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-ink-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-9 py-2 bg-white border border-ink-border rounded-xl text-xs sm:text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {filterOptions && onFilterChange && (
          <div className="relative">
            <select
              value={selectedFilter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="appearance-none bg-white border border-ink-border text-ink text-xs sm:text-sm font-medium py-2 pl-3.5 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest shadow-sm cursor-pointer"
            >
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-ink-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {actions}
        </div>
      )}
    </div>
  );
}

