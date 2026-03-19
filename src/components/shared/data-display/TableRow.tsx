/** @format */

import type { ComponentProps, ReactNode } from "react";

import { TableRow as UiTableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type TableRowProps = {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
} & Omit<ComponentProps<"tr">, "children" | "className" | "onClick">;

export function TableRow({
  children,
  className,
  hoverable,
  onClick,
  ...props
}: TableRowProps) {
  return (
    <UiTableRow
      className={cn(
        hoverable && "transition-colors hover:bg-muted/40",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </UiTableRow>
  );
}
