/** @format */

"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { CoaAccountRow } from "../../types/settings";

type FeatureCoaTableProps = {
  rows?: CoaAccountRow[];
  onAddAccount?: () => void;
  onEditAccount?: (account: CoaAccountRow) => void;
  onDeleteAccount?: (account: CoaAccountRow) => void;
};

const PAGE_SIZE = 12;

function indentClass(level: number) {
  if (level <= 0) return "";
  if (level === 1) return "pl-6";
  if (level === 2) return "pl-10";
  return "pl-14";
}

export function FeatureCoaTable({
  rows = [],
  onAddAccount,
  onEditAccount,
  onDeleteAccount,
}: FeatureCoaTableProps) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);

  const pagedRows = useMemo(
    () => rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [rows, currentPage]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Chart of Accounts (COA)</h2>
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
              <TableRow>
                <TableHead className="w-40 px-6 py-3 text-xs uppercase">Code</TableHead>
                <TableHead className="px-6 py-3 text-xs uppercase">Account Name</TableHead>
                <TableHead className="w-40 px-6 py-3 text-xs uppercase">Type</TableHead>
                <TableHead className="w-48 px-6 py-3 text-right text-xs uppercase">Balance</TableHead>
                <TableHead className="w-24 px-6 py-3 text-right text-xs uppercase">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                    Chart of accounts belum memiliki data.
                  </TableCell>
                </TableRow>
              ) : null}
              {pagedRows.map((row) => (
                <TableRow
                  key={row.account_code}
                  className={
                    row.is_highlighted
                      ? "border-l-2 border-indigo-500 bg-indigo-50/10 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      : row.is_group
                        ? "bg-gray-50/50 font-semibold hover:bg-gray-100 dark:bg-gray-800/30 dark:hover:bg-gray-800"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }
                >
                  <TableCell className="px-6 py-3 text-gray-700 dark:text-gray-300">
                    {row.account_code}
                  </TableCell>
                  <TableCell
                    className={`px-6 py-3 ${row.is_highlighted ? "font-medium text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}
                  >
                    <div className={`flex items-center ${indentClass(row.level)}`}>
                      {row.level === 1 && row.is_expanded ? (
                        <ChevronDown className="mr-2 h-3 w-3 text-gray-400" />
                      ) : null}
                      {row.level === 1 && !row.is_expanded ? (
                        <ChevronRight className="mr-2 h-3 w-3 text-gray-400" />
                      ) : null}
                      <span>{row.account_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-3 text-gray-500 dark:text-gray-400">
                    {row.account_type}
                  </TableCell>
                  <TableCell
                    className={`px-6 py-3 text-right ${row.is_group || row.is_highlighted ? "font-medium text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}
                  >
                    {row.balance}
                  </TableCell>
                  <TableCell className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                        onClick={() => onEditAccount?.(row)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit account</span>
                      </Button>
                      {!row.is_group ? (
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => onDeleteAccount?.(row)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete account</span>
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {pagedRows.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {Math.min(currentPage * PAGE_SIZE, rows.length)}
            </span>{" "}
            of <span className="font-medium text-gray-900 dark:text-white">{rows.length}</span> accounts
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage >= pageCount}
              onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
