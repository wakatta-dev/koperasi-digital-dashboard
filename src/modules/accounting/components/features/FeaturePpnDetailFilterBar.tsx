/** @format */

import { Search } from "lucide-react";

import { FilterToolbar } from "@/components/shared/filters/FilterToolbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { TaxPpnFilterValue } from "../../types/tax";

type FeaturePpnDetailFilterBarProps = {
  value: TaxPpnFilterValue;
  periodOptions: ReadonlyArray<{ label: string; value: string }>;
  onChange?: (next: TaxPpnFilterValue) => void;
};

export function FeaturePpnDetailFilterBar({
  value,
  periodOptions,
  onChange,
}: FeaturePpnDetailFilterBarProps) {
  const patch = (next: Partial<TaxPpnFilterValue>) => {
    onChange?.({ ...value, ...next });
  };

  return (
    <FilterToolbar
      query={value.q}
      onQueryChange={(query) => patch({ q: query })}
      queryPlaceholder="Search invoice or customer..."
      startSlot={
        <Search className="pointer-events-none h-4 w-4 text-gray-400" />
      }
      className="bg-gray-50/50 p-5 dark:bg-gray-800/20"
      endSlot={
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Tax Period:</span>
            <Select value={value.period} onValueChange={(next) => patch({ period: next })}>
              <SelectTrigger className="w-[180px] border-gray-300 bg-white text-sm focus:ring-1 focus:ring-indigo-600 dark:border-gray-600 dark:bg-gray-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map((periodOption) => (
                  <SelectItem key={periodOption.value} value={periodOption.value}>
                    {periodOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Transaction:</span>
            <Select
              value={value.transaction_type}
              onValueChange={(next) =>
                patch({ transaction_type: next as TaxPpnFilterValue["transaction_type"] })
              }
            >
              <SelectTrigger className="w-[190px] border-gray-300 bg-white text-sm focus:ring-1 focus:ring-indigo-600 dark:border-gray-600 dark:bg-gray-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Types">All Types</SelectItem>
                <SelectItem value="Sales">Sales (Output PPN)</SelectItem>
                <SelectItem value="Purchase">Purchase (Input PPN)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
    />
  );
}
