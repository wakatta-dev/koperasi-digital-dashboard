/** @format */

"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { BankAccountTransactionItem, BankCashTransactionFilters } from "../../types/bank-cash";

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
    const byStatus = filters?.status && filters.status !== "All Status"
      ? rows.filter((row) => row.status === filters.status)
      : rows;

    const byType = filters?.transaction_type && filters.transaction_type !== "All Types"
      ? byStatus.filter((row) =>
          filters.transaction_type === "Credit (Incoming)"
            ? row.direction === "Credit"
            : row.direction === "Debit"
        )
      : byStatus;

    const normalizedSearch = filters?.q?.trim().toLowerCase() ?? "";
    if (!normalizedSearch) {
      return byType;
    }

    return byType.filter((row) =>
      `${row.description} ${row.reference_label} ${row.amount}`
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [rows, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filteredRows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 text-[10px] font-bold tracking-widest text-gray-500 uppercase dark:bg-gray-800/50">
              <TableHead className="px-6 py-4">Date</TableHead>
              <TableHead className="px-6 py-4">Description</TableHead>
              <TableHead className="px-6 py-4 text-right">Amount</TableHead>
              <TableHead className="px-6 py-4">Status</TableHead>
              <TableHead className="px-6 py-4 text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 text-sm dark:divide-gray-700">
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                  No transaction rows found.
                </TableCell>
              </TableRow>
            ) : null}

            {pageRows.map((row) => (
              <TableRow key={row.transaction_id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30">
                <TableCell className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                  {row.date}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-white">{row.description}</span>
                    <span className="text-xs text-gray-400">{row.reference_label}</span>
                  </div>
                </TableCell>
                <TableCell
                  className={`px-6 py-4 text-right font-semibold ${
                    row.direction === "Credit"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {row.amount}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge
                    className={
                      row.status === "Reconciled"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                    }
                  >
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white"
                    onClick={() => onViewDetail?.(row)}
                  >
                    View Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {pageRows.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1} to {Math.min(safePage * PAGE_SIZE, filteredRows.length)} of {filteredRows.length} transactions
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={safePage === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            aria-label="Previous transaction page"
          >
            <span aria-hidden>{"<"}</span>
          </Button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <Button
              key={pageNumber}
              type="button"
              variant={pageNumber === safePage ? "default" : "ghost"}
              onClick={() => setPage(pageNumber)}
              className={pageNumber === safePage ? "bg-indigo-600 text-white hover:bg-indigo-700" : "text-gray-600 dark:text-gray-400"}
            >
              {pageNumber}
            </Button>
          ))}
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={safePage === totalPages}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            aria-label="Next transaction page"
          >
            <span aria-hidden>{">"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
