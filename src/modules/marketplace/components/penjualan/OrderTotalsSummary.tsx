/** @format */

"use client";

import { formatCurrency } from "@/lib/format";

export type OrderTotalsSummaryProps = Readonly<{
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}>;

export function OrderTotalsSummary({
  subtotal,
  tax,
  shipping,
  total,
}: OrderTotalsSummaryProps) {
  return (
    <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
      <div className="flex flex-col gap-2 items-end">
        <div className="flex justify-between w-full sm:w-64">
          <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {formatCurrency(subtotal)}
          </span>
        </div>
        <div className="flex justify-between w-full sm:w-64">
          <span className="text-sm text-gray-600 dark:text-gray-400">Pajak (11%)</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {formatCurrency(tax)}
          </span>
        </div>
        <div className="flex justify-between w-full sm:w-64">
          <span className="text-sm text-gray-600 dark:text-gray-400">Pengiriman</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {shipping === 0 ? "Gratis" : formatCurrency(shipping)}
          </span>
        </div>
        <div className="h-px bg-gray-200 dark:bg-gray-700 w-full sm:w-64 my-2"></div>
        <div className="flex justify-between w-full sm:w-64">
          <span className="text-base font-bold text-gray-900 dark:text-white">Total</span>
          <span className="text-base font-bold text-indigo-600">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
