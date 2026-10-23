import React from "react";
import Link from "next/link";

interface BrandMarkProps {
  variant?: "dark" | "light" | "white";
  size?: "sm" | "md" | "lg";
  href?: string;
  showSubtitle?: boolean;
}

export default function BrandMark({
  variant = "dark",
  size = "md",
  href = "/",
  showSubtitle = false,
}: BrandMarkProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const textColor = variant === "light" || variant === "white" ? "text-white" : "text-[#14695D]";

  const content = (
    <div className="inline-flex flex-col select-none">
      <div className="flex items-baseline tracking-tight">
        <span className={`font-display font-bold ${sizeClasses[size]} ${textColor}`}>
          edvora
        </span>
        <span className={`font-display font-bold ${sizeClasses[size]} text-[#E5AA58]`}>
          .
        </span>
      </div>
      {showSubtitle && (
        <span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant/80 -mt-1">
          Nursery &amp; Primary School
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="focus:outline-none rounded-lg inline-block">
        {content}
      </Link>
    );
  }

  return content;
}
