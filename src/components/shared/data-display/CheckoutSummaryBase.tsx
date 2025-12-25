/** @format */

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type SummaryRow = {
  label: string;
  value: ReactNode;
  valueClassName?: string;
};

export type CheckoutSummaryBaseProps = {
  title?: string;
  rows: SummaryRow[];
  total: {
    label: string;
    value: ReactNode;
  };
  headerSlot?: ReactNode;
  footerSlot?: ReactNode;
  stickyTop?: number;
};

export function CheckoutSummaryBase({
  title,
  rows,
  total,
  headerSlot,
  footerSlot,
  stickyTop,
}: CheckoutSummaryBaseProps) {
  const isSticky = typeof stickyTop === "number";

  return (
    <div
      className={cn(
        "bg-card rounded-2xl border border-border p-6 shadow-sm lg:p-8",
        isSticky && "sticky",
      )}
      style={isSticky ? { top: stickyTop } : undefined}
    >
      {title ? (
        <h2 className="mb-6 text-xl font-bold text-foreground">{title}</h2>
      ) : null}

      <div className="space-y-4 border-b border-border pb-6">
        {headerSlot ? <div className="space-y-4">{headerSlot}</div> : null}
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex justify-between items-center text-sm"
          >
            <span className="text-muted-foreground">{row.label}</span>
            <span
              className={cn("font-bold text-foreground", row.valueClassName)}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-lg font-bold text-foreground">{total.label}</span>
          <span className="text-2xl font-extrabold text-primary">{total.value}</span>
        </div>
        {footerSlot ? <div className="mt-3 space-y-3">{footerSlot}</div> : null}
      </div>
    </div>
  );
}
