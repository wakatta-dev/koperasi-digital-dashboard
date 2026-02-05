/** @format */

"use client";

import { Filter, Download, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type CustomerListHeaderProps = Readonly<{
  searchValue: string;
  onSearchChange: (value: string) => void;
  onOpenFilter: () => void;
  onExport: () => void;
  onAddCustomer: () => void;
}>;

export function CustomerListHeader({
  searchValue,
  onSearchChange,
  onOpenFilter,
  onExport,
  onAddCustomer,
}: CustomerListHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cari pelanggan berdasarkan nama, email..."
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm text-gray-900 dark:text-white focus-visible:ring-2 focus-visible:ring-indigo-600/50 placeholder-gray-500"
        />
      </div>
      <div className="flex gap-3 w-full sm:w-auto">
        <Button
          type="button"
          variant="outline"
          onClick={onOpenFilter}
          className="px-4 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onExport}
          className="px-4 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button
          type="button"
          onClick={onAddCustomer}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/30"
        >
          <Plus className="h-4 w-4" />
          Tambah Pelanggan
        </Button>
      </div>
    </div>
  );
}
