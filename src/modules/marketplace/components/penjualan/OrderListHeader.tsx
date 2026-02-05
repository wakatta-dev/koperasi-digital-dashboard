/** @format */

"use client";

import { Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export type OrderListHeaderProps = Readonly<{
  searchValue: string;
  dateValue: string;
  onSearchChange: (value: string) => void;
  onDateChange: (value: string) => void;
}>;

export function OrderListHeader({
  searchValue,
  dateValue,
  onSearchChange,
  onDateChange,
}: OrderListHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daftar Pesanan</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Kelola dan pantau semua transaksi penjualan Anda.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
          <Input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Cari ID atau nama pelanggan..."
            className="pl-10 pr-4 py-2.5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 w-full sm:w-64 focus-visible:ring-2 focus-visible:ring-indigo-600/50 focus-visible:border-indigo-600 transition-all shadow-sm"
          />
        </div>
        <div className="relative group">
          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
          <Input
            type="date"
            value={dateValue}
            onChange={(event) => onDateChange(event.target.value)}
            className="pl-10 pr-4 py-2.5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus-visible:ring-2 focus-visible:ring-indigo-600/50 focus-visible:border-indigo-600 transition-all shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}
