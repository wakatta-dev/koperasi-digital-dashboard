/** @format */

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FilterPanelProps = {
  children: ReactNode;
  className?: string;
  scrollable?: boolean;
};

export function FilterPanel({ children, className, scrollable }: FilterPanelProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-xl border border-border shadow-sm",
        className
      )}
    >
      <div className={cn(scrollable && "max-h-full overflow-auto")}>{children}</div>
    </div>
  );
}
