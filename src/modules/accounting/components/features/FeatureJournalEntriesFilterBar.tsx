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

import { JOURNAL_INITIAL_ENTRIES_FILTERS } from "../../constants/journal-initial-state";
import type { JournalEntriesFilterValue } from "../../types/journal";

type FeatureJournalEntriesFilterBarProps = {
  value?: JournalEntriesFilterValue;
  onChange?: (next: JournalEntriesFilterValue) => void;
};

export function FeatureJournalEntriesFilterBar({
  value = JOURNAL_INITIAL_ENTRIES_FILTERS,
  onChange,
}: FeatureJournalEntriesFilterBarProps) {
  const patch = (next: Partial<JournalEntriesFilterValue>) => {
    onChange?.({ ...value, ...next });
  };

  return (
    <FilterToolbar
      query={value.q}
      onQueryChange={(nextQuery) => patch({ q: nextQuery })}
      queryPlaceholder="Search reference, partner, or amount..."
      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-slate-900"
      endSlot={
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <Select
            value={value.date}
            onValueChange={(next) => patch({ date: next as JournalEntriesFilterValue["date"] })}
          >
            <SelectTrigger className="w-[140px] border-gray-200 bg-white text-sm text-gray-600 focus:ring-1 focus:ring-indigo-600 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_dates">All Dates</SelectItem>
              <SelectItem value="this_month">This Month</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="this_year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={value.type}
            onValueChange={(next) => patch({ type: next as JournalEntriesFilterValue["type"] })}
          >
            <SelectTrigger className="w-[140px] border-gray-200 bg-white text-sm text-gray-600 focus:ring-1 focus:ring-indigo-600 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_types">Journal Type</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="purchase">Purchase</SelectItem>
              <SelectItem value="cash">Cash/Bank</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={value.status}
            onValueChange={(next) =>
              patch({ status: next as JournalEntriesFilterValue["status"] })
            }
          >
            <SelectTrigger className="w-[130px] border-gray-200 bg-white text-sm text-gray-600 focus:ring-1 focus:ring-indigo-600 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_status">Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="posted">Posted</SelectItem>
              <SelectItem value="locked">Locked</SelectItem>
              <SelectItem value="reversed">Reversed</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            aria-label="Open advanced filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      }
    />
  );
}
