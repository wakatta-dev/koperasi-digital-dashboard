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
    <div className="flex flex-col gap-4 bg-gray-50/50 p-5 dark:bg-gray-800/20 xl:flex-row xl:items-center xl:justify-between">
      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          value={value.q}
          onChange={(event) => patch({ q: event.target.value })}
          placeholder="Search tax period..."
          className="border-gray-300 bg-white pl-10 text-sm focus-visible:ring-1 focus-visible:ring-indigo-600 dark:border-gray-600 dark:bg-gray-800"
        />
      </div>
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
    </div>
  );
}
