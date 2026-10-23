"use client";

import React, { useState } from "react";
import { User, ChevronDown, Check, Sparkles } from "lucide-react";
import { usePupilsQuery } from "@/lib/query/hooks";

interface ChildSwitcherProps {
  activeChildId?: string;
  onChildChange?: (childId: string) => void;
}

export default function ChildSwitcher({
  activeChildId = "osasere-ehigiator",
  onChildChange,
}: ChildSwitcherProps) {
  const { data: pupils = [] } = usePupilsQuery();
  const [selectedId, setSelectedId] = useState(activeChildId);
  const [isOpen, setIsOpen] = useState(false);

  // Available linked children for parent access
  const linkedChildren = pupils.filter(
    (p) => p.id === "osasere-ehigiator" || p.id === "tamara-ehigiator"
  );

  const currentChild =
    linkedChildren.find((c) => c.id === selectedId) || linkedChildren[0];

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onChildChange?.(id);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-forest-200 bg-mint-light/60 hover:bg-mint-light text-ink text-xs md:text-sm font-semibold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-forest"
      >
        <div className="w-5 h-5 rounded-full bg-forest text-white flex items-center justify-center text-[10px] font-bold">
          {currentChild?.fullName?.charAt(0) || "O"}
        </div>
        <div className="text-left flex flex-col sm:flex-row sm:items-center sm:gap-1.5">
          <span className="font-semibold text-ink leading-tight">
            {currentChild?.fullName}
          </span>
          <span className="text-[11px] text-ink-muted font-normal">
            ({currentChild?.classGrade})
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-ink-muted ml-0.5" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 mt-1.5 w-64 rounded-xl border border-ink-border bg-white shadow-xl z-50 py-1.5 animate-in fade-in slide-in-from-top-1">
            <div className="px-3.5 py-1.5 text-[11px] font-semibold text-ink-muted uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-forest" />
              Authorised Ward / Sibling
            </div>
            {linkedChildren.map((child) => (
              <button
                key={child.id}
                type="button"
                onClick={() => handleSelect(child.id)}
                className="w-full text-left px-3.5 py-2.5 hover:bg-forest-50 flex items-center justify-between transition-colors border-t border-gray-50 first:border-none"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-forest-100 text-forest font-bold flex items-center justify-center text-xs">
                    {child.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs md:text-sm font-semibold text-ink">
                      {child.fullName}
                    </div>
                    <div className="text-[11px] text-ink-muted">
                      {child.classGrade} · ID: {child.admissionNo}
                    </div>
                  </div>
                </div>
                {selectedId === child.id && (
                  <Check className="w-4 h-4 text-forest flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

