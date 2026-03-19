/** @format */

"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  TableShell,
  type TablePagePaginationMeta,
} from "@/components/shared/data-display/TableShell";

import type { CoaAccountRow } from "../../types/settings";

type FeatureCoaTableProps = {
  rows?: CoaAccountRow[];
  onAddAccount?: () => void;
  onEditAccount?: (account: CoaAccountRow) => void;
  onDeleteAccount?: (account: CoaAccountRow) => void;
  pagination?: TablePagePaginationMeta;
  onPageChange?: (nextPage: number) => void;
};

const PAGE_SIZE = 12;
const EMPTY_COA_ROWS: CoaAccountRow[] = [];

function indentClass(level: number) {
  if (level <= 0) return "";
  if (level === 1) return "pl-6";
  if (level === 2) return "pl-10";
  return "pl-14";
}

export function FeatureCoaTable({
  rows = EMPTY_COA_ROWS,
  onAddAccount,
  onEditAccount,
  onDeleteAccount,
  pagination,
  onPageChange,
}: FeatureCoaTableProps) {
  const pageCount = pagination?.totalPages ?? Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = pagination?.page ?? 1;
  const resolvedPageSize = pagination?.pageSize ?? PAGE_SIZE;
  const columns: ColumnDef<CoaAccountRow, unknown>[] = [
    {
      id: "code",
      header: "Code",
      meta: {
        headerClassName: "w-40 px-6 py-3 text-xs uppercase",
        cellClassName: "px-6 py-3 text-gray-700 dark:text-gray-300",
      },
      cell: ({ row }) => row.original.account_code,
    },
    {
      id: "accountName",
      header: "Account Name",
      meta: {
        headerClassName: "px-6 py-3 text-xs uppercase",
      },
      cell: ({ row }) => (
        <div
          className={`px-6 py-3 ${row.original.is_highlighted ? "font-medium text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}
        >
          <div className={`flex items-center ${indentClass(row.original.level)}`}>
            {row.original.level === 1 && row.original.is_expanded ? (
              <ChevronDown className="mr-2 h-3 w-3 text-gray-400" />
            ) : null}
            {row.original.level === 1 && !row.original.is_expanded ? (
              <ChevronRight className="mr-2 h-3 w-3 text-gray-400" />
            ) : null}
            <span>{row.original.account_name}</span>
          </div>
        </div>
      ),
    },
    {
      id: "type",
      header: "Type",
      meta: {
        headerClassName: "w-40 px-6 py-3 text-xs uppercase",
        cellClassName: "px-6 py-3 text-gray-500 dark:text-gray-400",
      },
      cell: ({ row }) => row.original.account_type,
    },
    {
      id: "balance",
      header: "Balance",
      meta: {
        align: "right",
        headerClassName: "w-48 px-6 py-3 text-right text-xs uppercase",
      },
      cell: ({ row }) => (
        <div
          className={`px-6 py-3 text-right ${row.original.is_group || row.original.is_highlighted ? "font-medium text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}
        >
          {row.original.balance}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      meta: {
        align: "right",
        headerClassName: "w-24 px-6 py-3 text-right text-xs uppercase",
        cellClassName: "px-6 py-3 text-right",
      },
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            onClick={() => onEditAccount?.(row.original)}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit account</span>
          </Button>
          {!row.original.is_group ? (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              onClick={() => onDeleteAccount?.(row.original)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete account</span>
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Chart of Accounts (COA)
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your general ledger accounts structure and balances.
          </p>
        </div>
        <Button
          type="button"
          onClick={onAddAccount}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add New Account
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
        <TableShell
          className="space-y-0"
          containerClassName="overflow-x-auto"
          columns={columns}
      data={rows}
          getRowId={(row) => row.account_code}
          emptyState="Chart of accounts belum memiliki data."
          headerClassName="bg-gray-50 dark:bg-gray-800/50"
          rowClassName={(row) =>
            row.is_highlighted
              ? "border-l-2 border-indigo-500 bg-indigo-50/10 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              : row.is_group
                ? "bg-gray-50/50 font-semibold hover:bg-gray-100 dark:bg-gray-800/30 dark:hover:bg-gray-800"
                : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
          }
          surface="bare"
          pagination={
            pagination ?? {
              page: currentPage,
              pageSize: resolvedPageSize,
              totalItems: rows.length,
              totalPages: pageCount,
            }
          }
          paginationInfo={`Showing ${pagedRows.length === 0 ? 0 : (currentPage - 1) * resolvedPageSize + 1} to ${Math.min((currentPage - 1) * resolvedPageSize + pagedRows.length, pagination?.totalItems ?? rows.length)} of ${pagination?.totalItems ?? rows.length} accounts`}
          onPrevPage={
            onPageChange
              ? () => onPageChange(Math.max(1, currentPage - 1))
              : undefined
          }
          onNextPage={
            onPageChange
              ? () => onPageChange(Math.min(pageCount, currentPage + 1))
              : undefined
          }
          paginationClassName="rounded-none border-x-0 border-b-0 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50"
          previousPageLabel="Previous"
          nextPageLabel="Next"
        />
      </div>
    </div>
  );
}
