/** @format */

"use client";

import { TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/format";

export type CustomerSpendCardProps = Readonly<{
  totalSpend: number;
  totalOrders: number;
}>;

export function CustomerSpendCard({ totalSpend, totalOrders }: CustomerSpendCardProps) {
  return (
    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
      <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-xl">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-indigo-900 dark:text-indigo-200">
            Total Belanja
          </span>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          {formatCurrency(totalSpend)}
        </p>
        <p className="text-xs text-indigo-600/70 dark:text-indigo-300/60 mt-1">
          Dari {totalOrders} pesanan selesai
        </p>
      </div>
    </div>
  );
}
