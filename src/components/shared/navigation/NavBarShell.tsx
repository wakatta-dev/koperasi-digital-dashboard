/** @format */

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type NavBarShellProps = {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  mobile?: ReactNode;
  className?: string;
  containerClassName?: string;
  innerClassName?: string;
  sticky?: boolean;
  top?: number;
};

export function NavBarShell({
  left,
  center,
  right,
  mobile,
  className,
  containerClassName,
  innerClassName,
  sticky = true,
  top = 0,
}: NavBarShellProps) {
  return (
    <nav
      className={cn(
        "w-full z-50",
        sticky ? "fixed" : "relative",
        className,
      )}
      style={sticky ? { top } : undefined}
    >
      <div
        className={cn(
          "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
          containerClassName,
        )}
      >
        <div
          className={cn(
            "flex justify-between h-20 items-center",
            innerClassName,
          )}
        >
          {left}
          {center}
          {right}
        </div>
        {mobile}
      </div>
    </nav>
  );
}
