/** @format */

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type NavActionsProps = {
  children: ReactNode;
  className?: string;
};

export function NavActions({ children, className }: NavActionsProps) {
  return <div className={cn("flex items-center gap-3", className)}>{children}</div>;
}
