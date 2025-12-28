/** @format */

import type { ReactNode } from "react";

import { TableCell as UiTableCell, TableHead } from "@/components/ui/table";
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
  const alignClass =
    align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";

  const cellClassName = cn(
    "px-6 py-4 align-middle text-sm text-foreground",
    alignClass,
    className
  );

  if (as === "th") {
    return (
      <TableHead
        className={cellClassName}
        style={width ? { width } : undefined}
        colSpan={colSpan}
        scope={scope}
      >
        {children}
      </TableHead>
    );
  }

  return (
    <UiTableCell
      className={cellClassName}
      style={width ? { width } : undefined}
      colSpan={colSpan}
      scope={scope}
    >
      {children}
    </UiTableCell>
  );
}
