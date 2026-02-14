/** @format */

"use client";

import { Calendar, Search } from "lucide-react";
import { InputField } from "@/components/shared/inputs/input-field";

export type OrderListHeaderProps = Readonly<{
  searchValue: string;
  dateValue: string;
  statusValue: string;
  statusOptions: ReadonlyArray<{ value: string; label: string }>;
  onSearchChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}>;

export function OrderListHeader({
  searchValue,
  dateValue,
  statusValue,
  statusOptions,
  onSearchChange,
  onDateChange,
  onStatusChange,
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
        <div className="w-full sm:w-64">
          <InputField
            ariaLabel="Cari pesanan"
            size="lg"
            startIcon={<Search className="h-4 w-4" />}
            value={searchValue}
            onValueChange={onSearchChange}
            placeholder="Cari ID atau nama pelanggan..."
          />
        </div>
        <InputField
          ariaLabel="Filter tanggal"
          size="lg"
          startIcon={<Calendar className="h-4 w-4" />}
          type="date"
          value={dateValue}
          onValueChange={onDateChange}
        />
        <label className="sr-only" htmlFor="order-status-filter">
          Filter status
        </label>
        <select
          id="order-status-filter"
          aria-label="Filter status"
          value={statusValue}
          onChange={(event) => onStatusChange(event.target.value)}
          className="h-11 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
