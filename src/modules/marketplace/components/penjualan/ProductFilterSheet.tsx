/** @format */

"use client";

import { Calendar, X } from "lucide-react";
import { InputField } from "@/components/shared/inputs/input-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export type ProductFilterOption = Readonly<{
  label: string;
  checked: boolean;
}>;

export type ProductFilterSheetProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: ProductFilterOption[];
  statuses: ProductFilterOption[];
  minPrice?: string;
  maxPrice?: string;
  dateFrom?: string;
  dateTo?: string;
  onToggleCategory?: (label: string) => void;
  onToggleStatus?: (label: string) => void;
  onMinPriceChange?: (value: string) => void;
  onMaxPriceChange?: (value: string) => void;
  onDateFromChange?: (value: string) => void;
  onDateToChange?: (value: string) => void;
  onReset?: () => void;
  onApply?: () => void;
}>;

export function ProductFilterSheet({
  open,
  onOpenChange,
  categories,
  statuses,
  minPrice,
  maxPrice,
  dateFrom,
  dateTo,
  onToggleCategory,
  onToggleStatus,
  onMinPriceChange,
  onMaxPriceChange,
  onDateFromChange,
  onDateToChange,
  onReset,
  onApply,
}: ProductFilterSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-md sm:max-w-md rounded-none p-0 gap-0 border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark shadow-2xl [&>button]:hidden"
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="px-6 py-6 border-b border-gray-200 dark:border-gray-700 flex flex-row items-start justify-between gap-4">
            <SheetTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Filter Produk
            </SheetTitle>
            <SheetClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="-mt-2 h-8 w-8 text-gray-400 hover:text-gray-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </SheetHeader>

          <div className="relative mt-6 flex-1 px-6 space-y-8 pb-6 overflow-y-auto">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Kategori
              </h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <label key={category.label} className="flex items-center">
                    <Checkbox
                      checked={category.checked}
                      onCheckedChange={() => onToggleCategory?.(category.label)}
                      className="h-4 w-4 rounded border-gray-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 focus-visible:ring-indigo-600/20"
                    />
                    <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                      {category.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Rentang Harga
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Minimum"
                  labelClassName="text-xs text-muted-foreground"
                  size="sm"
                  startIcon={<span className="text-sm">Rp</span>}
                  placeholder="0"
                  value={minPrice ?? ""}
                  onValueChange={onMinPriceChange}
                />
                <InputField
                  label="Maksimum"
                  labelClassName="text-xs text-muted-foreground"
                  size="sm"
                  startIcon={<span className="text-sm">Rp</span>}
                  placeholder="Max"
                  value={maxPrice ?? ""}
                  onValueChange={onMaxPriceChange}
                />
              </div>
              <div className="mt-4 px-1">
                <div className="relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div className="absolute left-0 w-1/3 h-full bg-indigo-600 rounded-full" />
                  <div className="absolute left-1/3 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-full shadow" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Status Stok
              </h3>
              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <label key={status.label} className="cursor-pointer">
                    <input
                      type="checkbox"
                      checked={status.checked}
                      onChange={() => onToggleStatus?.(status.label)}
                      className="peer sr-only"
                    />
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 peer-checked:bg-indigo-600/10 peer-checked:text-indigo-600 peer-checked:border-indigo-600 transition-colors">
                      {status.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Tanggal Ditambahkan
              </h3>
              <div className="space-y-3">
                <InputField
                  label="Dari"
                  labelClassName="text-xs text-muted-foreground"
                  size="sm"
                  startIcon={<Calendar className="h-4 w-4" />}
                  type="date"
                  value={dateFrom ?? ""}
                  onValueChange={onDateFromChange}
                />
                <InputField
                  label="Sampai"
                  labelClassName="text-xs text-muted-foreground"
                  size="sm"
                  startIcon={<Calendar className="h-4 w-4" />}
                  type="date"
                  value={dateTo ?? ""}
                  onValueChange={onDateToChange}
                />
              </div>
            </div>
          </div>

          <SheetFooter className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 mt-auto">
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-dark px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:ring-indigo-600/20"
            >
              Reset
            </Button>
            <Button
              type="button"
              onClick={onApply}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus-visible:ring-indigo-600/20"
            >
              Terapkan
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
