/** @format */

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type TableCellProps = {
  children: ReactNode;
  as?: "td" | "th";
  align?: "left" | "right" | "center";
  width?: string | number;
  className?: string;
  colSpan?: number;
  scope?: "col" | "row";
};

export function TableCell({
  children,
  as = "td",
  align = "left",
  width,
  className,
  colSpan,
  scope,
}: TableCellProps) {
  const Component = as;
  const alignClass =
    align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";

  return (
    <Component
      className={cn("px-6 py-4 align-middle text-sm text-foreground", alignClass, className)}
      style={width ? { width } : undefined}
      colSpan={colSpan}
      scope={scope}
    >
      {children}
    </Component>
  );
}
