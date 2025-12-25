/** @format */

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FilterActionsProps = {
  children: ReactNode;
  className?: string;
};

export function FilterActions({ children, className }: FilterActionsProps) {
  return (
    <div className={cn("flex items-center justify-between gap-3 pt-4 border-t border-border", className)}>
      {children}
    </div>
  );
}
