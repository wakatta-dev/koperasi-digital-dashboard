/** @format */

"use client";

import { useMemo, useState } from "react";
import { Filter, MoreHorizontal, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/shared/inputs/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { VENDOR_BILL_STATUS_BADGE_CLASS } from "../../constants/stitch";
import type { VendorBillListItem } from "../../types/vendor-bills-ap";

type FeatureVendorBillsTableProps = {
  rows?: VendorBillListItem[];
  selectedBillNumbers?: string[];
  onSelectionChange?: (selectedBillNumbers: string[]) => void;
  onRowOpen?: (row: VendorBillListItem) => void;
  totalResults?: number;
};

const PAGE_SIZE = 5;

export function FeatureVendorBillsTable({
  rows = [],
  selectedBillNumbers,
  onSelectionChange,
  onRowOpen,
  totalResults,
}: FeatureVendorBillsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [internalSelectedBillNumbers, setInternalSelectedBillNumbers] = useState<
    string[]
  >([]);

  const currentSelection = selectedBillNumbers ?? internalSelectedBillNumbers;

  const selectableRows = useMemo(
    () => rows.filter((row) => row.is_selectable),
    [rows]
  );

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (normalizedSearch.length === 0) {
      return rows.slice(0, PAGE_SIZE);
    }

    return rows
      .filter((row) =>
        `${row.bill_number} ${row.vendor_name}`.toLowerCase().includes(normalizedSearch)
      )
      .slice(0, PAGE_SIZE);
  }, [rows, searchTerm]);

  const allVisibleSelectableNumbers = filteredRows
    .filter((row) => row.is_selectable)
    .map((row) => row.bill_number);

  const allVisibleSelected =
    allVisibleSelectableNumbers.length > 0 &&
    allVisibleSelectableNumbers.every((billNumber) =>
      currentSelection.includes(billNumber)
    );

  const updateSelection = (nextSelection: string[]) => {
    if (selectedBillNumbers === undefined) {
      setInternalSelectedBillNumbers(nextSelection);
    }

    onSelectionChange?.(nextSelection);
  };

  const toggleBillSelection = (billNumber: string, checked: boolean) => {
    if (checked) {
      updateSelection(Array.from(new Set([...currentSelection, billNumber])));
      return;
    }

    updateSelection(currentSelection.filter((item) => item !== billNumber));
  };

  const toggleAllVisible = (checked: boolean) => {
    if (!checked) {
      updateSelection(
        currentSelection.filter(
          (billNumber) => !allVisibleSelectableNumbers.includes(billNumber)
        )
      );
      return;
    }

    updateSelection(
      Array.from(new Set([...currentSelection, ...allVisibleSelectableNumbers]))
    );
  };

  return (
    <Card className="rounded-xl border border-gray-200 shadow-sm dark:border-gray-700">
      <CardContent className="p-0">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-200 p-4 dark:border-gray-700 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 dark:text-white">Daftar Bill</h3>
            <Badge className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              All
            </Badge>
          </div>

          <div className="flex w-full items-center gap-3 sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                value={searchTerm}
                placeholder="Search bill #, vendor..."
                aria-label="Search bill #, vendor..."
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full border-none bg-gray-50 py-2 pr-4 pl-9 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="border-gray-200 text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <Filter className="h-4 w-4" />
              <span className="sr-only">Open bill filters</span>
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-800/50">
                <TableHead className="w-10 px-6 py-4">
                  <Checkbox
                    checked={allVisibleSelected}
                    onCheckedChange={(checked) => toggleAllVisible(Boolean(checked))}
                    aria-label="Select all bills"
                  />
                </TableHead>
                <TableHead className="px-6 py-4 font-semibold">Bill Number</TableHead>
                <TableHead className="px-6 py-4 font-semibold">Vendor</TableHead>
                <TableHead className="px-6 py-4 font-semibold">Date</TableHead>
                <TableHead className="px-6 py-4 font-semibold">Due Date</TableHead>
                <TableHead className="px-6 py-4 text-right font-semibold">Amount</TableHead>
                <TableHead className="px-6 py-4 text-center font-semibold">Status</TableHead>
                <TableHead className="px-6 py-4 text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-sm">
              {filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="px-6 py-10 text-center text-sm text-gray-500">
                    No bill rows found.
                  </TableCell>
                </TableRow>
              ) : null}

              {filteredRows.map((row) => {
                const isSelected = currentSelection.includes(row.bill_number);
                const isDisabled = !row.is_selectable;

                return (
                  <TableRow
                    key={row.bill_number}
                    data-testid={`vendor-bill-row-${row.bill_number}`}
                    onClick={() => {
                      if (!isDisabled) {
                        onRowOpen?.(row);
                      }
                    }}
                    className={`group border-b border-gray-100 transition-colors dark:border-gray-700 ${
                      isDisabled
                        ? "cursor-not-allowed opacity-75"
                        : "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    <TableCell className="px-6 py-4">
                      <Checkbox
                        checked={isSelected}
                        disabled={isDisabled}
                        aria-label={`Select ${row.bill_number}`}
                        onClick={(event) => event.stopPropagation()}
                        onCheckedChange={(checked) =>
                          toggleBillSelection(row.bill_number, Boolean(checked))
                        }
                      />
                    </TableCell>
                    <TableCell
                      className={`px-6 py-4 font-medium ${
                        isDisabled
                          ? "text-gray-500 line-through"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {row.bill_number}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${row.vendor_initial_class_name}`}
                        >
                          {row.vendor_initial}
                        </div>
                        <span
                          className={
                            isDisabled
                              ? "text-gray-500"
                              : "text-gray-700 dark:text-gray-300"
                          }
                        >
                          {row.vendor_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell
                      className={isDisabled ? "px-6 py-4 text-gray-400" : "px-6 py-4 text-gray-500"}
                    >
                      {row.bill_date}
                    </TableCell>
                    <TableCell
                      className={`px-6 py-4 ${
                        row.status === "Overdue"
                          ? "font-medium text-red-500"
                          : isDisabled
                            ? "text-gray-400"
                            : "text-gray-500"
                      }`}
                    >
                      {row.due_date}
                    </TableCell>
                    <TableCell
                      className={`px-6 py-4 text-right font-medium ${
                        isDisabled ? "text-gray-500" : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {row.amount}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <Badge
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${VENDOR_BILL_STATUS_BADGE_CLASS[row.status]}`}
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        disabled={isDisabled}
                        onClick={(event) => {
                          event.stopPropagation();
                          if (!isDisabled) {
                            onRowOpen?.(row);
                          }
                        }}
                        className="h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open bill action</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {filteredRows.length > 0 ? 1 : 0}
            </span>{" "}
            to{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {filteredRows.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {Math.max(totalResults ?? rows.length, selectableRows.length)}
            </span>{" "}
            results
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="icon"
              variant="outline"
              disabled
              className="h-8 w-8 border-gray-200 text-gray-500 dark:border-gray-700"
            >
              <span aria-hidden>‹</span>
              <span className="sr-only">Previous page</span>
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-8 w-8 border-gray-200 text-gray-500 dark:border-gray-700"
            >
              <span aria-hidden>›</span>
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
