/** @format */

"use client";

import { useMemo, useState } from "react";
import { Clock3, MoreVertical, Plus, RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CURRENCY_ROWS } from "../../constants/settings-dummy";
import type { CurrencyRow } from "../../types/settings";

type FeatureCurrenciesTableProps = {
  rows?: CurrencyRow[];
  onUpdateRates?: () => void;
  onAddCurrency?: () => void;
};

export function FeatureCurrenciesTable({
  rows = CURRENCY_ROWS,
  onUpdateRates,
  onAddCurrency,
}: FeatureCurrenciesTableProps) {
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  const allChecked = selectedCodes.length > 0 && selectedCodes.length === rows.length;

  const rowsWithSelection = useMemo(
    () =>
      rows.map((row) => ({
        ...row,
        selected: selectedCodes.includes(row.currency_code),
      })),
    [rows, selectedCodes]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Currencies</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage currencies and their exchange rates for multi-currency transactions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            onClick={onUpdateRates}
          >
            <RefreshCw className="h-4 w-4" />
            Update Rates
          </Button>
          <Button
            type="button"
            className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={onAddCurrency}
          >
            <Plus className="h-4 w-4" />
            Add Currency
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <Table className="text-sm">
            <TableHeader className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
              <TableRow>
                <TableHead className="w-12 px-6 py-4">
                  <Checkbox
                    checked={allChecked}
                    onCheckedChange={(next) =>
                      setSelectedCodes(next ? rows.map((item) => item.currency_code) : [])
                    }
                    aria-label="Select all currencies"
                  />
                </TableHead>
                <TableHead className="px-6 py-4">Currency Code</TableHead>
                <TableHead className="px-6 py-4">Symbol</TableHead>
                <TableHead className="px-6 py-4 text-right">Exchange Rate</TableHead>
                <TableHead className="px-6 py-4">Last Updated</TableHead>
                <TableHead className="px-6 py-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rowsWithSelection.map((row) => (
                <TableRow
                  key={row.currency_code}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <TableCell className="px-6 py-4">
                    <Checkbox
                      checked={row.selected}
                      onCheckedChange={(next) =>
                        setSelectedCodes((prev) =>
                          next
                            ? [...prev, row.currency_code]
                            : prev.filter((item) => item !== row.currency_code)
                        )
                      }
                      aria-label={`Select ${row.currency_code}`}
                    />
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${row.badge_class}`}
                      >
                        {row.currency_code}
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {row.currency_code}
                        </span>
                        {row.is_base ? (
                          <Badge className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-600">
                            Base
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">{row.symbol}</TableCell>
                  <TableCell className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                    {row.exchange_rate}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-gray-400" />
                      {row.last_updated}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Currency actions</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium text-gray-900 dark:text-white">1</span> to{" "}
            <span className="font-medium text-gray-900 dark:text-white">5</span> of{" "}
            <span className="font-medium text-gray-900 dark:text-white">12</span> currencies
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button type="button" variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

