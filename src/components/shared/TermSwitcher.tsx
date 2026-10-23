"use client";

import React, { useState } from "react";
import { Calendar, ChevronDown, Check } from "lucide-react";

interface TermSwitcherProps {
  currentSession?: string;
  currentTerm?: string;
}

export default function TermSwitcher({
  currentSession = "2026/2027",
  currentTerm = "First Term",
}: TermSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(`${currentSession} · ${currentTerm}`);

  const terms = [
    "2026/2027 · First Term",
    "2025/2026 · Third Term",
    "2025/2026 · Second Term",
  ];

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-ink-border bg-white text-ink text-xs md:text-sm font-medium hover:bg-ivory-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-forest"
      >
        <Calendar className="w-3.5 h-3.5 text-forest" />
        <span>{selectedTerm}</span>
        <ChevronDown className="w-3.5 h-3.5 text-ink-muted ml-0.5" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1.5 w-56 rounded-xl border border-ink-border bg-white shadow-xl z-50 py-1.5 animate-in fade-in slide-in-from-top-1">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-ink-muted uppercase tracking-wider">
              Academic Term
            </div>
            {terms.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setSelectedTerm(term);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs md:text-sm text-ink hover:bg-forest-50 hover:text-forest flex items-center justify-between transition-colors"
              >
                <span>{term}</span>
                {selectedTerm === term && (
                  <Check className="w-4 h-4 text-forest" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

