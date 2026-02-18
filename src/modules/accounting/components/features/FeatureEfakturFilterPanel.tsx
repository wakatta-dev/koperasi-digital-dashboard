/** @format */

import { CalendarDays } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { TaxEfakturFilterValue } from "../../types/tax";

type FeatureEfakturFilterPanelProps = {
  value: TaxEfakturFilterValue;
  onChange?: (next: TaxEfakturFilterValue) => void;
};

const TAX_TYPE_OPTIONS = ["All Types", "PPN Masukan", "PPN Keluaran"] as const;
const STATUS_OPTIONS = ["Ready to Export", "Draft", "Exported"] as const;

export function FeatureEfakturFilterPanel({
  value,
  onChange,
}: FeatureEfakturFilterPanelProps) {
  const patch = (next: Partial<TaxEfakturFilterValue>) => {
    onChange?.({ ...value, ...next });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-slate-900">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <Label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
            Date Range
          </Label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              value={value.date_range}
              onChange={(event) => patch({ date_range: event.target.value })}
              placeholder="Last 30 days"
              className="border-gray-200 bg-gray-50 pl-10 text-sm focus-visible:ring-1 focus-visible:ring-indigo-600 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
        </div>

        <div>
          <Label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
            Tax Type
          </Label>
          <Select value={value.tax_type} onValueChange={(next) => patch({ tax_type: next })}>
            <SelectTrigger className="border-gray-200 bg-gray-50 text-sm focus:ring-1 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TAX_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
            Status
          </Label>
          <Select value={value.status} onValueChange={(next) => patch({ status: next })}>
            <SelectTrigger className="border-gray-200 bg-gray-50 text-sm focus:ring-1 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
