"use client";

import React, { useState } from "react";

export interface AccordionItem {
  id: string;
  question: string;
  answer: React.ReactNode;
}

interface PublicAccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  className?: string;
}

export default function PublicAccordion({
  items,
  defaultOpenId,
  className = "",
}: PublicAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId || null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const buttonId = `faq-btn-${item.id}`;
        const contentId = `faq-content-${item.id}`;

        return (
          <div
            key={item.id}
            className="rounded-2xl border border-ink-border/70 bg-surface-container-lowest transition-colors overflow-hidden"
          >
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={contentId}
                onClick={() => toggle(item.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 font-headline-sm text-base text-on-surface hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary"
              >
                <span className="font-semibold text-on-surface">{item.question}</span>
                <span
                  aria-hidden="true"
                  className={`material-symbols-outlined text-primary text-[22px] shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  expand_more
                </span>
              </button>
            </h3>
            {isOpen && (
              <div
                id={contentId}
                role="region"
                aria-labelledby={buttonId}
                className="px-5 pb-5 pt-1 text-on-surface-variant font-body-md text-sm leading-relaxed border-t border-ink-border/40"
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

