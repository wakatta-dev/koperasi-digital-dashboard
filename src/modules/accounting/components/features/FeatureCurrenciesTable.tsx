/** @format */

"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Clock3, MoreVertical, Plus, RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  TableShell,
  type TablePagePaginationMeta,
} from "@/components/shared/data-display/TableShell";

import type { CurrencyRow } from "../../types/settings";

type FeatureCurrenciesTableProps = {
  rows?: CurrencyRow[];
  onUpdateRates?: () => void;
  onAddCurrency?: () => void;
  pagination?: TablePagePaginationMeta;
  onPageChange?: (nextPage: number) => void;
};

export function FeatureCurrenciesTable({
  rows = [],
  onUpdateRates,
  onAddCurrency,
  pagination,
  onPageChange,
}: FeatureCurrenciesTableProps) {
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  const allChecked =
    selectedCodes.length > 0 && selectedCodes.length === rows.length;

  const rowsWithSelection = useMemo(
    () =>
      rows.map((row) => ({
        ...row,
        selected: selectedCodes.includes(row.currency_code),
      })),
    [rows, selectedCodes],
  );
  const columns = useMemo<
    ColumnDef<(typeof rowsWithSelection)[number], unknown>[]
  >(
    () => [
      {
        id: "select",
        header: () => (
          <Checkbox
            checked={allChecked}
            onCheckedChange={(next) =>
              setSelectedCodes(
                next ? rows.map((item) => item.currency_code) : [],
              )
            }
            aria-label="Select all currencies"
          />
        ),
        meta: {
          headerClassName: "w-12 px-6 py-4",
          cellClassName: "px-6 py-4",
        },
        cell: ({ row }) => (
          <Checkbox
            checked={row.original.selected}
            onCheckedChange={(next) =>
              setSelectedCodes((prev) =>
                next
                  ? [...prev, row.original.currency_code]
                  : prev.filter((item) => item !== row.original.currency_code),
              )
            }
            aria-label={`Select ${row.original.currency_code}`}
          />
        ),
      },
      {
        id: "currencyCode",
        header: "Currency Code",
        meta: {
          headerClassName: "px-6 py-4",
          cellClassName: "px-6 py-4",
        },
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${row.original.badge_class}`}
            >
              {row.original.currency_code}
            </div>
            <div>
              <span className="font-medium text-gray-900 dark:text-white">
                {row.original.currency_code}
              </span>
              {row.original.is_base ? (
                <Badge className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-600">
                  Base
                </Badge>
              ) : null}
            </div>
          </div>
        ),
      },
      {
        id: "symbol",
        header: "Symbol",
        meta: {
          headerClassName: "px-6 py-4",
          cellClassName: "px-6 py-4 text-gray-600 dark:text-gray-300",
        },
        cell: ({ row }) => row.original.symbol,
      },
      {
        id: "exchangeRate",
        header: "Exchange Rate",
        meta: {
          align: "right",
          headerClassName: "px-6 py-4 text-right",
          cellClassName:
            "px-6 py-4 text-right font-medium text-gray-900 dark:text-white",
        },
        cell: ({ row }) => row.original.exchange_rate,
      },
      {
        id: "lastUpdated",
        header: "Last Updated",
        meta: {
          headerClassName: "px-6 py-4",
          cellClassName: "px-6 py-4 text-gray-500 dark:text-gray-400",
        },
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-gray-400" />
            {row.original.last_updated}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        meta: {
          align: "right",
          headerClassName: "px-6 py-4 text-right",
          cellClassName: "px-6 py-4 text-right",
        },
        cell: () => (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Currency actions</span>
          </Button>
        ),
      },
    ],
    [allChecked, rows],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Currencies
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage currencies and their exchange rates for multi-currency
            transactions.
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
        <TableShell
          className="space-y-0"
          containerClassName="overflow-x-auto"
          tableClassName="text-sm"
          columns={columns}
          data={rowsWithSelection}
          getRowId={(row) => row.currency_code}
          emptyState="Data mata uang belum tersedia."
          headerClassName="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
          rowClassName="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
          surface="bare"
          pagination={pagination}
          paginationInfo={
            pagination
              ? `Showing ${rows.length ? (pagination.page - 1) * pagination.pageSize + 1 : 0} to ${Math.min((pagination.page - 1) * pagination.pageSize + rows.length, pagination.totalItems)} of ${pagination.totalItems} currencies`
              : undefined
          }
          onPrevPage={() =>
            pagination && onPageChange?.(Math.max(1, pagination.page - 1))
          }
          onNextPage={() =>
            pagination &&
            onPageChange?.(Math.min(pagination.totalPages, pagination.page + 1))
          }
          paginationClassName="rounded-none border-x-0 border-b-0 px-6 py-4 dark:border-gray-700"
          previousPageLabel="Previous"
          nextPageLabel="Next"
        />
      </div>
    </div>
  );
}
