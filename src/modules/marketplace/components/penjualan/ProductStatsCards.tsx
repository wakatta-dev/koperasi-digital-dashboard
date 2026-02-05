/** @format */

"use client";

import { DollarSign, Package, ShoppingBag, TrendingDown, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/format";

export type ProductStatsCardsProps = Readonly<{
  price: number;
  stockCount: number;
  minStockAlert: number;
  totalSold: number;
  soldLast30Days?: number;
  salesChangePercent?: number;
}>;

export function ProductStatsCards({
  price,
  stockCount,
  minStockAlert,
  totalSold,
  soldLast30Days,
  salesChangePercent,
}: ProductStatsCardsProps) {
  const changeValue =
    typeof salesChangePercent === "number" && Number.isFinite(salesChangePercent)
      ? salesChangePercent
      : null;
  const changeLabel =
    changeValue === null
      ? "Belum ada data perubahan"
      : `${changeValue > 0 ? "+" : ""}${changeValue}% dari 30 hari lalu`;
  const changeClass =
    changeValue === null
      ? "text-gray-500 dark:text-gray-400"
      : changeValue >= 0
        ? "text-green-600 dark:text-green-400"
        : "text-red-600 dark:text-red-400";
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
            <DollarSign className="h-4 w-4" />
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Harga Jual</p>
        </div>
        <p className="text-xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(price)}
        </p>
        <p className={`text-xs mt-1 flex items-center gap-1 ${changeClass}`}>
          {changeValue !== null && changeValue < 0 ? (
            <TrendingDown className="h-3 w-3" />
          ) : (
            <TrendingUp className="h-3 w-3" />
          )}
          {changeLabel}
        </p>
      </div>
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
            <Package className="h-4 w-4" />
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Stok Fisik</p>
        </div>
        <p className="text-xl font-bold text-gray-900 dark:text-white">{stockCount} Unit</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Min. stok alert: <span className="font-medium text-gray-900 dark:text-white">{minStockAlert}</span>
        </p>
      </div>
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
            <ShoppingBag className="h-4 w-4" />
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Terjual</p>
        </div>
        <p className="text-xl font-bold text-gray-900 dark:text-white">{totalSold} Unit</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {typeof soldLast30Days === "number"
            ? `30 hari terakhir: ${soldLast30Days} unit`
            : "Sejak Jan 2023"}
        </p>
      </div>
    </div>
  );
}
