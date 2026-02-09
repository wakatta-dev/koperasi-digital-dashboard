/** @format */

"use client";

import { Filter, Download, Plus, Search } from "lucide-react";
import { InputField } from "@/components/shared/inputs/input-field";
import { Button } from "@/components/ui/button";

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
      <div className="w-full sm:w-96">
        <InputField
          ariaLabel="Cari pelanggan berdasarkan nama atau email"
          size="lg"
          startIcon={<Search className="h-4 w-4" />}
          value={searchValue}
          onValueChange={onSearchChange}
          placeholder="Cari pelanggan berdasarkan nama, email..."
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
