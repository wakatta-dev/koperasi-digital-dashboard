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
        "bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:p-8",
        isSticky && "sticky",
      )}
      style={isSticky ? { top: stickyTop } : undefined}
    >
      {title ? (
        <h2 className="font-bold text-xl text-gray-900 dark:text-white mb-6">
          {title}
        </h2>
      ) : null}

      <div className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-700">
        {headerSlot ? <div className="space-y-4">{headerSlot}</div> : null}
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex justify-between items-center text-sm"
          >
            <span className="text-gray-600 dark:text-gray-400">{row.label}</span>
            <span
              className={cn("font-bold text-gray-900 dark:text-white", row.valueClassName)}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-6">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-lg text-gray-900 dark:text-white">
            {total.label}
          </span>
          <span className="font-extrabold text-2xl text-[#4338ca] dark:text-indigo-400">
            {total.value}
          </span>
        </div>
        {footerSlot ? <div className="mt-3 space-y-3">{footerSlot}</div> : null}
      </div>
    </div>
  );
}
