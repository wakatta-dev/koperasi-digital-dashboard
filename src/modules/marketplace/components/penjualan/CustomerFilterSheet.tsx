/** @format */

"use client";

import { CheckCircle2, Circle, X } from "lucide-react";
import { InputField } from "@/components/shared/inputs/input-field";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type CustomerFilterSheetProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  statusValue: string;
  onStatusChange: (value: string) => void;
  minOrders: string;
  maxOrders: string;
  onMinOrdersChange: (value: string) => void;
  onMaxOrdersChange: (value: string) => void;
  onReset: () => void;
  onApply: () => void;
}>;

export function CustomerFilterSheet({
  open,
  onOpenChange,
  statusValue,
  onStatusChange,
  minOrders,
  maxOrders,
  onMinOrdersChange,
  onMaxOrdersChange,
  onReset,
  onApply,
}: CustomerFilterSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-[400px] sm:max-w-[400px] rounded-none p-0 gap-0 border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark shadow-2xl [&>button]:hidden"
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex flex-row items-center justify-between bg-white dark:bg-surface-dark z-10">
            <div>
              <SheetTitle className="text-lg font-bold text-gray-900 dark:text-white">
                Filter Pelanggan
              </SheetTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tampilkan data spesifik sesuai kebutuhan
              </p>
            </div>
            <SheetClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="p-2 -mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/50 dark:bg-gray-900/20">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                Status Pelanggan
              </label>
              <RadioGroup
                value={statusValue}
                onValueChange={onStatusChange}
                className="grid grid-cols-2 gap-3"
              >
                {["Active", "Inactive"].map((status) => (
                  <label key={status} className="cursor-pointer group">
                    <RadioGroupItem value={status} className="peer sr-only" />
                    <div
                      className={cn(
                        "border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-gray-600 dark:text-gray-400 rounded-lg px-4 py-2.5 text-sm font-medium text-center flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all",
                        "peer-data-[state=checked]:border-indigo-600 peer-data-[state=checked]:text-indigo-600 dark:peer-data-[state=checked]:text-indigo-400 peer-data-[state=checked]:bg-indigo-50/50 dark:peer-data-[state=checked]:bg-indigo-900/20 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-indigo-600/20"
                      )}
                    >
                      {status === "Active" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                      {status}
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                  Total Belanja
                </label>
                <button
                  type="button"
                  onClick={onReset}
                  className="text-xs text-indigo-600 font-medium cursor-pointer hover:underline"
                >
                  Reset
                </button>
              </div>
              <div className="pt-2 px-1">
                <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div className="absolute left-0 right-1/4 h-full bg-indigo-600 rounded-full" />
                  <div className="absolute top-1/2 -translate-y-1/2 -ml-2 left-0 w-5 h-5 bg-white border-2 border-indigo-600 rounded-full cursor-grab shadow-sm range-thumb z-10" />
                  <div className="absolute top-1/2 -translate-y-1/2 -ml-2 left-3/4 w-5 h-5 bg-white border-2 border-indigo-600 rounded-full cursor-grab shadow-sm range-thumb z-10" />
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="relative group">
                    <span className="absolute -top-2 left-2 px-1 bg-white dark:bg-surface-dark text-[10px] font-medium text-gray-500">
                      Min (Rp)
                    </span>
                    <div className="w-32 px-3 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white font-medium shadow-sm">
                      0
                    </div>
                  </div>
                  <span className="text-gray-400">-</span>
                  <div className="relative group">
                    <span className="absolute -top-2 left-2 px-1 bg-white dark:bg-surface-dark text-[10px] font-medium text-gray-500">
                      Max (Rp)
                    </span>
                    <div className="w-32 px-3 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white font-medium shadow-sm">
                      85.000.000
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700 border-dashed" />

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                Total Pesanan
              </label>
              <div className="flex items-center gap-3">
                <InputField
                  className="flex-1"
                  ariaLabel="Total pesanan minimum"
                  startIcon={<span className="text-xs font-medium">Min</span>}
                  value={minOrders}
                  onValueChange={onMinOrdersChange}
                  placeholder="0"
                  type="number"
                />
                <span className="text-gray-400 font-medium">-</span>
                <InputField
                  className="flex-1"
                  ariaLabel="Total pesanan maksimum"
                  startIcon={<span className="text-xs font-medium">Max</span>}
                  value={maxOrders}
                  onValueChange={onMaxOrdersChange}
                  placeholder="100+"
                  type="number"
                />
              </div>
            </div>
          </div>

          <SheetFooter className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 mt-auto">
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-dark px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Reset
            </Button>
            <Button
              type="button"
              onClick={onApply}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Terapkan
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
