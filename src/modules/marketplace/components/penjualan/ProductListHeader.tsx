/** @format */

"use client";

import { Search, Filter, Plus } from "lucide-react";
import { InputField } from "@/components/shared/inputs/input-field";
import { Button } from "@/components/ui/button";

export type ProductListHeaderProps = Readonly<{
  searchValue: string;
  onSearchChange: (value: string) => void;
  onOpenFilter: () => void;
  onAddProduct: () => void;
}>;

export function ProductListHeader({
  searchValue,
  onSearchChange,
  onOpenFilter,
  onAddProduct,
}: ProductListHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex gap-3 flex-1 w-full sm:w-auto">
        <div className="w-full max-w-sm">
          <InputField
            ariaLabel="Cari produk"
            size="lg"
            startIcon={<Search className="h-4 w-4" />}
            value={searchValue}
            onValueChange={onSearchChange}
            placeholder="Cari nama produk, SKU..."
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={onOpenFilter}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium"
        >
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </div>
      <Button
        type="button"
        onClick={onAddProduct}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm text-sm font-medium"
      >
        <Plus className="h-4 w-4" />
        <span>Tambah Produk</span>
      </Button>
    </div>
  );
}
