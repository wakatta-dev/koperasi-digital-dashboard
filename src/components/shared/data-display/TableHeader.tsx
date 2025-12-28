/** @format */

import type { ReactNode } from "react";

import { TableHeader as UiTableHeader } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type TableHeaderProps = {
  children: ReactNode;
  className?: string;
  sticky?: boolean;
  top?: number;
};

export function TableHeader({
  children,
  className,
  sticky,
  top = 0,
}: TableHeaderProps) {
  return (
    <UiTableHeader
      className={cn(sticky && "sticky z-10", className)}
      style={sticky ? { top } : undefined}
    >
      {children}
    </UiTableHeader>
  );
}
