/** @format */

"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InventoryEvent } from "@/modules/marketplace/types";

export type ProductInventoryHistoryProps = Readonly<{
  entries: InventoryEvent[];
  range?: string;
  onRangeChange?: (range: string) => void;
  onViewAll?: () => void;
}>;

export function ProductInventoryHistory({
  entries,
  range,
  onRangeChange,
  onViewAll,
}: ProductInventoryHistoryProps) {
  return (
    <div className="surface-table">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900 dark:text-white">Riwayat Inventaris</h3>
        <div className="flex gap-2 items-center">
          <select
            value={range}
            onChange={(event) => onRangeChange?.(event.target.value)}
            className="text-xs border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 focus:ring-indigo-600/20 focus:border-indigo-600"
          >
            <option value="7d">7 Hari Terakhir</option>
            <option value="30d">30 Hari Terakhir</option>
          </select>
          {onViewAll ? (
            <Button
              type="button"
              variant="ghost"
              onClick={onViewAll}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 h-auto px-0"
            >
              Lihat Semua
            </Button>
          ) : null}
        </div>
      </div>
      <div className="p-0">
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {entries.map((entry) => {
            const isIncrease = entry.type === "increase";
            return (
              <li
                key={entry.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isIncrease
                        ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                    }`}
                  >
                    {isIncrease ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {entry.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {entry.timestamp}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-bold ${
                      isIncrease
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {entry.delta > 0 ? `+${entry.delta}` : entry.delta}
                  </p>
                  <p className="text-xs text-gray-500">Stok sisa: {entry.remainingStock}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
