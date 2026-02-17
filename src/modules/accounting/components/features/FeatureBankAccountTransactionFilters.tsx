/** @format */

"use client";

import { Calendar, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DUMMY_BANK_ACCOUNT_TRANSACTION_FILTERS } from "../../constants/bank-cash-dummy";
import type { BankCashTransactionFilters } from "../../types/bank-cash";

type FeatureBankAccountTransactionFiltersProps = {
  value?: BankCashTransactionFilters;
  onChange?: (next: BankCashTransactionFilters) => void;
};

export function FeatureBankAccountTransactionFilters({
  value = DUMMY_BANK_ACCOUNT_TRANSACTION_FILTERS,
  onChange,
}: FeatureBankAccountTransactionFiltersProps) {
  const current = value;

  const patch = (next: Partial<BankCashTransactionFilters>) => {
    onChange?.({ ...current, ...next });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-slate-900">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <label className="mb-1.5 ml-1 block text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
            Date Range
          </label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Select
              value={current.date_range}
              onValueChange={(next) => patch({ date_range: next })}
            >
              <SelectTrigger className="border-none bg-gray-50 pl-10 text-sm focus:ring-2 focus:ring-indigo-600/20 dark:bg-gray-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Last 30 Days">Last 30 Days</SelectItem>
                <SelectItem value="This Month">This Month</SelectItem>
                <SelectItem value="Last Quarter">Last Quarter</SelectItem>
                <SelectItem value="Custom Range">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 ml-1 block text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
            Transaction Type
          </label>
          <Select
            value={current.transaction_type}
            onValueChange={(next) =>
              patch({
                transaction_type: next as BankCashTransactionFilters["transaction_type"],
              })
            }
          >
            <SelectTrigger className="border-none bg-gray-50 text-sm focus:ring-2 focus:ring-indigo-600/20 dark:bg-gray-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Types">All Types</SelectItem>
              <SelectItem value="Debit (Outgoing)">Debit (Outgoing)</SelectItem>
              <SelectItem value="Credit (Incoming)">Credit (Incoming)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-1.5 ml-1 block text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
            Status
          </label>
          <Select
            value={current.status}
            onValueChange={(next) =>
              patch({ status: next as BankCashTransactionFilters["status"] })
            }
          >
            <SelectTrigger className="border-none bg-gray-50 text-sm focus:ring-2 focus:ring-indigo-600/20 dark:bg-gray-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Status">All Status</SelectItem>
              <SelectItem value="Reconciled">Reconciled</SelectItem>
              <SelectItem value="Unreconciled">Unreconciled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              value={current.q}
              onChange={(event) => patch({ q: event.target.value })}
              placeholder="Search transactions..."
              className="border-none bg-gray-50 pl-10 text-sm focus-visible:ring-2 focus-visible:ring-indigo-600/20 dark:bg-gray-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
