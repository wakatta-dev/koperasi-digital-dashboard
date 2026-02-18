/** @format */

import { Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { TaxExportHistoryFilterValue } from "../../types/tax";

type FeatureTaxExportHistoryFilterBarProps = {
  value: TaxExportHistoryFilterValue;
  onChange?: (next: TaxExportHistoryFilterValue) => void;
};

const EXPORT_TYPE_OPTIONS = [
  { label: "All Types", value: "all" },
  { label: "e-Faktur", value: "EFaktur" },
  { label: "PPh Report", value: "PPhReport" },
  { label: "PPN Summary", value: "PPNSummary" },
  { label: "Tax Recapitulation", value: "TaxRecapitulation" },
] as const;

export function FeatureTaxExportHistoryFilterBar({
  value,
  onChange,
}: FeatureTaxExportHistoryFilterBarProps) {
  const patch = (next: Partial<TaxExportHistoryFilterValue>) => {
    onChange?.({ ...value, ...next });
  };

  return (
    <div className="flex flex-col gap-4 bg-gray-50/50 p-5 dark:bg-gray-800/20 xl:flex-row xl:items-center xl:justify-between">
      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          value={value.q}
          onChange={(event) => patch({ q: event.target.value })}
          placeholder="Search file name..."
          className="border-gray-300 bg-white pl-10 text-sm focus-visible:ring-1 focus-visible:ring-indigo-600 dark:border-gray-600 dark:bg-gray-800"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Filter By:</span>
          <Select
            value={value.type}
            onValueChange={(next) => patch({ type: next as TaxExportHistoryFilterValue["type"] })}
          >
            <SelectTrigger className="w-[180px] border-gray-300 bg-white text-sm focus:ring-1 focus:ring-indigo-600 dark:border-gray-600 dark:bg-gray-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EXPORT_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          variant="outline"
          className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>
    </div>
  );
}
