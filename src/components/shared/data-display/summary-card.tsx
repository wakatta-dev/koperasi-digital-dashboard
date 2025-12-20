/** @format */

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type SummaryRow = {
  label: string;
  value: string;
  valueClassName?: string;
};

export type SummaryCardProps = {
  title: string;
  rows: SummaryRow[];
  total: { label: string; value: string };
  avatarGroup?: ReactNode;
  note?: ReactNode;
  cta?: ReactNode;
  stickyTop?: boolean;
  className?: string;
};

export function SummaryCard({
  title,
  rows,
  total,
  avatarGroup,
  note,
  cta,
  stickyTop,
  className,
}: SummaryCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl shadow-sm border border-border bg-card p-6 lg:p-8 space-y-6",
        stickyTop && "sticky top-28",
        className,
      )}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl text-foreground">{title}</h2>
          </div>
        </div>

        {avatarGroup ? <div className="-space-x-3 flex overflow-hidden">{avatarGroup}</div> : null}
      </div>

      <div className="space-y-4 pb-6 border-b border-border/70">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">{row.label}</span>
            <span className={cn("font-bold text-foreground", row.valueClassName)}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg text-foreground">{total.label}</span>
          <span className="font-extrabold text-2xl text-primary">{total.value}</span>
        </div>
        {cta ? <div className="w-full">{cta}</div> : null}
        {note ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 p-3 rounded-lg border border-border/60">
            {note}
          </div>
        ) : null}
      </div>
    </div>
  );
}
