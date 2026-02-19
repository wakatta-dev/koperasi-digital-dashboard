/** @format */

"use client";

import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/shared/inputs/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DUMMY_UNRECONCILED_TRANSACTIONS } from "../../constants/bank-cash-dummy";
import type { UnreconciledTransactionItem } from "../../types/bank-cash";

type FeatureUnreconciledTransactionsTableProps = {
  rows?: UnreconciledTransactionItem[];
};

export function FeatureUnreconciledTransactionsTable({
  rows = DUMMY_UNRECONCILED_TRANSACTIONS,
}: FeatureUnreconciledTransactionsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRows = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (normalized.length === 0) {
      return rows;
    }

    return rows.filter((row) =>
      `${row.description} ${row.source} ${row.amount}`
        .toLowerCase()
        .includes(normalized)
    );
  }, [rows, searchTerm]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
      <div className="flex flex-col gap-3 border-b border-gray-200 p-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Unreconciled Transactions</h3>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search transactions..."
              className="border-none bg-gray-50 pl-9 text-sm focus-visible:ring-1 focus-visible:ring-indigo-600 dark:bg-gray-800"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="border-gray-200 text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <Filter className="h-4 w-4" />
            <span className="sr-only">Open unreconciled transaction filters</span>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 text-[10px] font-bold tracking-widest text-gray-500 uppercase dark:bg-gray-800/50">
              <TableHead className="px-6 py-4">Date</TableHead>
              <TableHead className="px-6 py-4">Description</TableHead>
              <TableHead className="px-6 py-4">Source</TableHead>
              <TableHead className="px-6 py-4 text-right">Amount</TableHead>
              <TableHead className="px-6 py-4 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 text-sm dark:divide-gray-700">
            {filteredRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                  {row.date}
                </TableCell>
                <TableCell className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {row.description}
                </TableCell>
                <TableCell className="px-6 py-4 text-gray-500">{row.source}</TableCell>
                <TableCell
                  className={`px-6 py-4 text-right font-semibold ${
                    row.direction === "Credit"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {row.amount}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white"
                  >
                    Match
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end border-t border-gray-100 px-6 py-4 dark:border-gray-700">
        <Button
          type="button"
          variant="link"
          className="h-auto p-0 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          View All Transactions
        </Button>
      </div>
    </div>
  );
}
