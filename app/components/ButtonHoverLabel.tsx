"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type ButtonHoverLabelProps = {
  label: string;
  className?: string;
};

export function ButtonHoverLabel({ label, className }: ButtonHoverLabelProps) {
  return (
    <span className={`inline-flex items-center gap-1 ${className ?? ""}`}>
      <span className="grid w-0 place-items-center overflow-hidden opacity-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-[1.35em] group-hover:opacity-100">
        <ChevronRight
          className="h-[1.35em] w-[1.35em] -rotate-90 scale-90 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-0 group-hover:scale-100"
          strokeWidth={2.75}
          aria-hidden="true"
        />
      </span>
      <span>{label}</span>
      <span className="grid w-0 place-items-center overflow-hidden opacity-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-[1.35em] group-hover:opacity-100">
        <ChevronLeft
          className="h-[1.35em] w-[1.35em] rotate-90 scale-90 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-0 group-hover:scale-100"
          strokeWidth={2.75}
          aria-hidden="true"
        />
      </span>
    </span>
  );
}
