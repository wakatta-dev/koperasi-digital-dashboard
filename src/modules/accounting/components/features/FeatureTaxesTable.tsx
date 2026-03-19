/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { MoreVertical, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  TableShell,
  type TablePagePaginationMeta,
} from "@/components/shared/data-display/TableShell";

import type { TaxRow } from "../../types/settings";

type FeatureTaxesTableProps = {
  rows?: TaxRow[];
  onCreateTax?: () => void;
  onOpenActions?: (tax: TaxRow) => void;
  renderActions?: (tax: TaxRow) => ReactNode;
  onToggleStatus?: (tax: TaxRow, next: boolean) => void;
  pagination?: TablePagePaginationMeta;
  onPageChange?: (nextPage: number) => void;
};

const EMPTY_TAX_ROWS: TaxRow[] = [];

const TAX_TYPE_CLASS: Record<TaxRow["tax_type"], string> = {
  Sales:
    "bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800",
  Purchase:
    "bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  Both: "bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  None: "bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-700/40 dark:text-gray-400 dark:border-gray-700",
};

export function FeatureTaxesTable({
  rows = EMPTY_TAX_ROWS,
  onCreateTax,
  onOpenActions,
  renderActions,
  onToggleStatus,
  pagination,
  onPageChange,
}: FeatureTaxesTableProps) {
  const [statusByTaxId, setStatusByTaxId] = useState<Record<string, boolean>>(
    () =>
      rows.reduce<Record<string, boolean>>((acc, row) => {
        acc[row.tax_id] = row.is_active;
        return acc;
      }, {}),
  );

  useEffect(() => {
    setStatusByTaxId(
      rows.reduce<Record<string, boolean>>((acc, row) => {
        acc[row.tax_id] = row.is_active;
        return acc;
      }, {}),
    );
  }, [rows]);

  const normalizedRows = useMemo(
    () =>
      rows.map((row) => ({
        ...row,
        is_active: statusByTaxId[row.tax_id] ?? row.is_active,
      })),
    [rows, statusByTaxId],
  );
  const columns: ColumnDef<(typeof normalizedRows)[number], unknown>[] = [
    {
      id: "taxName",
      header: "Tax Name",
      meta: {
        headerClassName:
          "w-1/4 px-6 py-4 font-semibold border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800",
        cellClassName: "px-6 py-4",
      },
      cell: ({ row }) => (
        <>
          <div className="font-medium text-gray-900 dark:text-white">
            {row.original.tax_name}
          </div>
          <div className="mt-0.5 text-xs text-gray-500">
            {row.original.description}
          </div>
        </>
      ),
    },
    {
      id: "type",
      header: "",
      meta: {
        headerClassName: "w-12 px-6 py-4 font-semibold",
        cellClassName: "px-6 py-4",
      },
      cell: ({ row }) => (
        <Badge
          className={`px-2.5 py-1 text-xs font-medium ${TAX_TYPE_CLASS[row.original.tax_type]}`}
        >
          {row.original.tax_type}
        </Badge>
      ),
    },
    {
      id: "rate",
      header: "Rate",
      meta: {
        headerClassName: "px-6 py-4",
        cellClassName: "px-6 py-4 text-gray-900 dark:text-gray-200",
      },
      cell: ({ row }) => row.original.rate_percent,
    },
    {
      id: "account",
      header: "Account",
      meta: {
        headerClassName: "px-6 py-4",
        cellClassName: "px-6 py-4",
      },
      cell: ({ row }) => (
        <>
          <div className="text-gray-900 dark:text-white">
            {row.original.tax_account}
          </div>
          <div className="mt-0.5 text-xs text-gray-500">
            {row.original.tax_account_description}
          </div>
        </>
      ),
    },
    {
      id: "status",
      header: "Status",
      meta: {
        align: "center",
        headerClassName: "px-6 py-4",
        cellClassName: "px-6 py-4 text-center",
      },
      cell: ({ row }) => (
        <Switch
          checked={row.original.is_active}
          onCheckedChange={(next) => {
            setStatusByTaxId((prev) => ({
              ...prev,
              [row.original.tax_id]: next,
            }));
            onToggleStatus?.(row.original, next);
          }}
          className="data-[state=checked]:bg-indigo-600"
          aria-label={`Toggle status for ${row.original.tax_name}`}
        />
      ),
    },
    {
      id: "actions",
      header: "",
      meta: {
        align: "right",
        headerClassName: "px-6 py-4",
        cellClassName: "px-6 py-4 text-right",
      },
      cell: ({ row }) =>
        renderActions ? (
          <>{renderActions(row.original)}</>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
            onClick={() => onOpenActions?.(row.original)}
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open tax actions</span>
          </Button>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Taxes
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Configure and manage tax rates, types, and accounts.
          </p>
        </div>
        <Button
          type="button"
          onClick={onCreateTax}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Create Tax
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
        <TableShell
          className="space-y-0"
          containerClassName="overflow-x-auto"
          tableClassName="text-sm"
          columns={columns}
          data={normalizedRows}
          getRowId={(row) => row.tax_id}
          emptyState="Data pajak belum tersedia."
          headerClassName="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
          rowClassName="group transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
          surface="bare"
          pagination={pagination}
          paginationInfo={
            pagination
              ? `Showing ${rows.length ? (pagination.page - 1) * pagination.pageSize + 1 : 0} to ${Math.min((pagination.page - 1) * pagination.pageSize + rows.length, pagination.totalItems)} of ${pagination.totalItems} taxes`
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
