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
        "bg-white dark:bg-[#1e293b] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm",
        className
      )}
    >
      <div className={cn(scrollable && "max-h-full overflow-auto")}>{children}</div>
    </div>
  );
}
