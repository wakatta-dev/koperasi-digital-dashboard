/** @format */

"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DUMMY_BANK_STATEMENT_LINES } from "../../constants/bank-cash-dummy";
import type { BankStatementLineItem } from "../../types/bank-cash";

type FeatureBankStatementMatchTableProps = {
  rows?: BankStatementLineItem[];
  onRowsChange?: (rows: BankStatementLineItem[]) => void;
};

export function FeatureBankStatementMatchTable({
  rows = DUMMY_BANK_STATEMENT_LINES,
  onRowsChange,
}: FeatureBankStatementMatchTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [internalRows, setInternalRows] = useState<BankStatementLineItem[]>(rows);

  const currentRows = onRowsChange ? rows : internalRows;

  const filteredRows = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (normalized.length === 0) {
      return currentRows;
    }
    return currentRows.filter((row) =>
      `${row.description} ${row.amount} ${row.reference_no ?? ""}`
        .toLowerCase()
        .includes(normalized)
    );
  }, [currentRows, searchTerm]);

  const selectableLineIds = filteredRows.map((row) => row.line_id);
  const allSelected =
    selectableLineIds.length > 0 &&
    selectableLineIds.every((lineId) =>
      currentRows.some((row) => row.line_id === lineId && row.is_selected)
    );

  const applyRowsUpdate = (nextRows: BankStatementLineItem[]) => {
    if (!onRowsChange) {
      setInternalRows(nextRows);
    }
    onRowsChange?.(nextRows);
  };

  const toggleRow = (lineId: string, checked: boolean) => {
    applyRowsUpdate(
      currentRows.map((row) =>
        row.line_id === lineId ? { ...row, is_selected: checked } : row
      )
    );
  };

  const toggleAllVisible = (checked: boolean) => {
    applyRowsUpdate(
      currentRows.map((row) =>
        selectableLineIds.includes(row.line_id)
          ? { ...row, is_selected: checked }
          : row
      )
    );
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">Bank Statement</h3>
          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            {currentRows.length} lines
          </span>
        </div>
      </div>

      <div className="border-b border-gray-200 p-3 dark:border-gray-700">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search description or amount..."
            className="border-none bg-gray-50 pl-9 text-sm focus-visible:ring-1 focus-visible:ring-indigo-600 dark:bg-gray-800"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:bg-gray-800">
              <TableHead className="w-8 px-4 py-3">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(checked) => toggleAllVisible(Boolean(checked))}
                  aria-label="Select all bank statement rows"
                />
              </TableHead>
              <TableHead className="px-4 py-3">Date</TableHead>
              <TableHead className="px-4 py-3">Description</TableHead>
              <TableHead className="px-4 py-3 text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow
                key={row.line_id}
                className={row.is_selected ? "bg-indigo-50/50 dark:bg-indigo-900/10" : ""}
              >
                <TableCell className="px-4 py-3">
                  <Checkbox
                    checked={row.is_selected}
                    onCheckedChange={(checked) =>
                      toggleRow(row.line_id, Boolean(checked))
                    }
                    aria-label={`Select ${row.line_id}`}
                  />
                </TableCell>
                <TableCell className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-300">
                  {row.date}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <p className="font-medium text-gray-900 dark:text-white">{row.description}</p>
                  {row.reference_no ? (
                    <p className="text-xs text-gray-500">Ref: {row.reference_no}</p>
                  ) : null}
                </TableCell>
                <TableCell
                  className={`px-4 py-3 text-right font-medium ${
                    row.direction === "Credit"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {row.amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
