/** @format */

import { SlidersHorizontal } from "lucide-react";

import { FilterToolbar } from "@/components/shared/filters/FilterToolbar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { TaxSummaryFilterValue } from "../../types/tax";

type FeatureTaxSummaryFilterBarProps = {
  value: TaxSummaryFilterValue;
  yearOptions: string[];
  onChange?: (next: TaxSummaryFilterValue) => void;
};

export function FeatureTaxSummaryFilterBar({
  value,
  yearOptions,
  onChange,
}: FeatureTaxSummaryFilterBarProps) {
  const patch = (next: Partial<TaxSummaryFilterValue>) => {
    onChange?.({ ...value, ...next });
  };

  return (
    <FilterToolbar
      query={value.q}
      onQueryChange={(query) => patch({ q: query })}
      queryPlaceholder="Search tax period..."
      className="bg-gray-50/50 p-5 dark:bg-gray-800/20"
      endSlot={
        <div className="flex flex-wrap items-center gap-3">
          <Select value={value.year} onValueChange={(next) => patch({ year: next })}>
            <SelectTrigger className="w-[140px] border-gray-300 bg-white text-sm focus:ring-1 focus:ring-indigo-600 dark:border-gray-600 dark:bg-gray-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((yearOption) => (
                <SelectItem key={yearOption} value={yearOption}>
                  {yearOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={value.status}
            onValueChange={(next) => patch({ status: next as TaxSummaryFilterValue["status"] })}
          >
            <SelectTrigger className="w-[160px] border-gray-300 bg-white text-sm focus:ring-1 focus:ring-indigo-600 dark:border-gray-600 dark:bg-gray-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Reported">Reported</SelectItem>
              <SelectItem value="Compensated">Compensated</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      }
    />
  );
}
