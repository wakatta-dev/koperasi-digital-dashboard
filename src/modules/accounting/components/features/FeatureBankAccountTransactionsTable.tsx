/** @format */

"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableShell } from "@/components/shared/data-display/TableShell";

import type {
  BankAccountTransactionItem,
  BankCashTransactionFilters,
} from "../../types/bank-cash";

type FeatureBankAccountTransactionsTableProps = {
  rows?: BankAccountTransactionItem[];
  filters?: BankCashTransactionFilters;
  onViewDetail?: (row: BankAccountTransactionItem) => void;
};

const PAGE_SIZE = 4;

export function FeatureBankAccountTransactionsTable({
  rows = [],
  filters,
  onViewDetail,
}: FeatureBankAccountTransactionsTableProps) {
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const byStatus =
      filters?.status && filters.status !== "All Status"
        ? rows.filter((row) => row.status === filters.status)
        : rows;

    const byType =
      filters?.transaction_type && filters.transaction_type !== "All Types"
        ? byStatus.filter((row) =>
            filters.transaction_type === "Credit (Incoming)"
              ? row.direction === "Credit"
              : row.direction === "Debit",
          )
        : byStatus;

    const normalizedSearch = filters?.q?.trim().toLowerCase() ?? "";
    if (!normalizedSearch) {
      return byType;
    }

    return byType.filter((row) =>
      `${row.description} ${row.reference_label} ${row.amount}`
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [rows, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filteredRows.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const columns = useMemo<ColumnDef<BankAccountTransactionItem, unknown>[]>(
    () => [
      {
        id: "date",
        header: "Date",
        meta: {
          headerClassName: "px-6 py-4",
          cellClassName:
            "px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300",
        },
        cell: ({ row }) => row.original.date,
      },
      {
        id: "description",
        header: "Description",
        meta: {
          headerClassName: "px-6 py-4",
          cellClassName: "px-6 py-4",
        },
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 dark:text-white">
              {row.original.description}
            </span>
            <span className="text-xs text-gray-400">
              {row.original.reference_label}
            </span>
          </div>
        ),
      },
      {
        id: "amount",
        header: "Amount",
        meta: {
          align: "right",
          headerClassName: "px-6 py-4 text-right",
        },
        cell: ({ row }) => (
          <div
            className={`px-6 py-4 text-right font-semibold ${
              row.original.direction === "Credit"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {row.original.amount}
          </div>
        ),
      },
      {
        id: "status",
        header: "Status",
        meta: {
          headerClassName: "px-6 py-4",
          cellClassName: "px-6 py-4",
        },
        cell: ({ row }) => (
          <Badge
            className={
              row.original.status === "Reconciled"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
            }
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        id: "action",
        header: "Action",
        meta: {
          align: "center",
          headerClassName: "px-6 py-4 text-center",
          cellClassName: "px-6 py-4 text-center",
        },
        cell: ({ row }) => (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white"
            onClick={() => onViewDetail?.(row.original)}
          >
            View Detail
          </Button>
        ),
      },
    ],
    [onViewDetail]
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
      <TableShell
        className="space-y-0"
        containerClassName="overflow-x-auto"
        columns={columns}
        data={pageRows}
        getRowId={(row) => row.transaction_id}
        emptyState="No transaction rows found."
        headerRowClassName="bg-gray-50 text-[10px] font-bold tracking-widest text-gray-500 uppercase dark:bg-gray-800/50"
        rowClassName="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30"
        surface="bare"
        pagination={{
          page: safePage,
          pageSize: PAGE_SIZE,
          totalItems: filteredRows.length,
          totalPages,
        }}
        paginationInfo={`Showing ${pageRows.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1} to ${Math.min(safePage * PAGE_SIZE, filteredRows.length)} of ${filteredRows.length} transactions`}
        onPrevPage={() => setPage((current) => Math.max(1, current - 1))}
        onNextPage={() => setPage((current) => Math.min(totalPages, current + 1))}
        paginationClassName="rounded-none border-x-0 border-b-0 px-6 py-4 dark:border-gray-700"
        previousPageLabel="Previous"
        nextPageLabel="Next"
      />
    </div>
  );
}
