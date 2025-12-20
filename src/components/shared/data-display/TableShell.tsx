/** @format */

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type TableShellProps = {
  children: ReactNode;
  density?: "default" | "dense";
  className?: string;
  containerClassName?: string;
};

export function TableShell({
  children,
  density = "default",
  className,
  containerClassName,
}: TableShellProps) {
  const densityClass =
    density === "dense" ? "text-xs leading-tight" : "text-sm leading-normal";

  return (
    <div className={cn("overflow-x-auto", containerClassName)}>
      <table
        className={cn(
          "min-w-full border-collapse",
          densityClass,
          className,
        )}
      >
        {children}
      </table>
    </div>
  );
}
