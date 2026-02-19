/** @format */

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/shared/inputs/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { JOURNAL_AUDIT_LOG_DEFAULT_FILTERS } from "../../constants/journal-seed";
import type { JournalAuditLogFilterValue } from "../../types/journal";

type FeatureAuditLogFilterBarProps = {
  value?: JournalAuditLogFilterValue;
  onChange?: (next: JournalAuditLogFilterValue) => void;
  onApplyFilter?: () => void;
};

export function FeatureAuditLogFilterBar({
  value = JOURNAL_AUDIT_LOG_DEFAULT_FILTERS,
  onChange,
  onApplyFilter,
}: FeatureAuditLogFilterBarProps) {
  const patch = (next: Partial<JournalAuditLogFilterValue>) => {
    onChange?.({ ...value, ...next });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-slate-900">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              value={value.q}
              onChange={(event) => patch({ q: event.target.value })}
              placeholder="Cari No. Referensi atau aktivitas..."
              className="border-gray-200 bg-gray-50 pl-10 text-sm focus-visible:ring-2 focus-visible:ring-indigo-600 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium tracking-wide text-gray-500 uppercase">User:</label>
            <Select value={value.user} onValueChange={(next) => patch({ user: next as JournalAuditLogFilterValue["user"] })}>
              <SelectTrigger className="min-w-[140px] border-gray-200 bg-white text-sm text-gray-600 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua User</SelectItem>
                <SelectItem value="shadcn">Shadcn (Admin)</SelectItem>
                <SelectItem value="jdoe">John Doe</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium tracking-wide text-gray-500 uppercase">
              Module:
            </label>
            <Select value={value.module} onValueChange={(next) => patch({ module: next as JournalAuditLogFilterValue["module"] })}>
              <SelectTrigger className="min-w-[140px] border-gray-200 bg-white text-sm text-gray-600 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Modul</SelectItem>
                <SelectItem value="journal">Journal</SelectItem>
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="bill">Vendor Bill</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="setting">Setting</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium tracking-wide text-gray-500 uppercase">
              Rentang Waktu:
            </label>
            <div className="flex items-center gap-1">
              <Input
                type="date"
                value={value.date_from}
                onChange={(event) => patch({ date_from: event.target.value })}
                className="h-9 border-gray-200 bg-white px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300"
              />
              <span className="text-gray-400">-</span>
              <Input
                type="date"
                value={value.date_to}
                onChange={(event) => patch({ date_to: event.target.value })}
                className="h-9 border-gray-200 bg-white px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300"
              />
            </div>
          </div>
          <Button
            type="button"
            onClick={onApplyFilter}
            className="bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Filter
          </Button>
        </div>
      </div>
    </div>
  );
}
