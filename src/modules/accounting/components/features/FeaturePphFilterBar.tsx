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

import type { TaxPphFilterValue } from "../../types/tax";

type FeaturePphFilterBarProps = {
  value: TaxPphFilterValue;
  onChange?: (next: TaxPphFilterValue) => void;
};

const PPH_TYPE_OPTIONS = [
  { label: "All Types", value: "All Types" },
  { label: "PPh 21", value: "PPh21" },
  { label: "PPh 23", value: "PPh23" },
  { label: "PPh 4(2)", value: "PPh4_2" },
  { label: "PPh Final", value: "PPhFinal" },
] as const;

export function FeaturePphFilterBar({ value, onChange }: FeaturePphFilterBarProps) {
  const patch = (next: Partial<TaxPphFilterValue>) => {
    onChange?.({ ...value, ...next });
  };

  return (
    <FilterToolbar
      query={value.q}
      onQueryChange={(query) => patch({ q: query })}
      queryPlaceholder="Search reference, partner..."
      className="bg-gray-50/50 p-5 dark:bg-gray-800/20"
      endSlot={
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Type:</span>
            <Select
              value={value.type}
              onValueChange={(next) => patch({ type: next as TaxPphFilterValue["type"] })}
            >
              <SelectTrigger className="w-[180px] border-gray-300 bg-white text-sm focus:ring-1 focus:ring-indigo-600 dark:border-gray-600 dark:bg-gray-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PPH_TYPE_OPTIONS.map((option) => (
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
      }
    />
  );
}
