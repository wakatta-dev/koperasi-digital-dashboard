/** @format */

"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Filter, MoreHorizontal, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/shared/inputs/input";
import {
  TableShell,
  type TablePagePaginationMeta,
} from "@/components/shared/data-display/TableShell";

import { VENDOR_BILL_STATUS_BADGE_CLASS } from "../../constants/stitch";
import type { VendorBillListItem } from "../../types/vendor-bills-ap";

type FeatureVendorBillsTableProps = {
  rows?: VendorBillListItem[];
  selectedBillNumbers?: string[];
  onSelectionChange?: (selectedBillNumbers: string[]) => void;
  onRowOpen?: (row: VendorBillListItem) => void;
  pagination?: TablePagePaginationMeta;
  onPageChange?: (nextPage: number) => void;
};

export function FeatureVendorBillsTable({
  rows = [],
  selectedBillNumbers,
  onSelectionChange,
  onRowOpen,
  pagination,
  onPageChange,
}: FeatureVendorBillsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [internalSelectedBillNumbers, setInternalSelectedBillNumbers] =
    useState<string[]>([]);

  const currentSelection = selectedBillNumbers ?? internalSelectedBillNumbers;

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (normalizedSearch.length === 0) {
      return rows;
    }

    return rows.filter((row) =>
      `${row.bill_number} ${row.vendor_name}`
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [rows, searchTerm]);

  const allVisibleSelectableNumbers = filteredRows
    .filter((row) => row.is_selectable)
    .map((row) => row.bill_number);

  const allVisibleSelected =
    allVisibleSelectableNumbers.length > 0 &&
    allVisibleSelectableNumbers.every((billNumber) =>
      currentSelection.includes(billNumber),
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
          (billNumber) => !allVisibleSelectableNumbers.includes(billNumber),
        ),
      );
      return;
    }

    updateSelection(
      Array.from(
        new Set([...currentSelection, ...allVisibleSelectableNumbers]),
      ),
    );
  };

  const columns: ColumnDef<VendorBillListItem, unknown>[] = [
    {
      id: "select",
      header: () => (
        <Checkbox
          checked={allVisibleSelected}
          onCheckedChange={(checked) => toggleAllVisible(Boolean(checked))}
          aria-label="Select all bills"
        />
      ),
      meta: {
        headerClassName: "w-10 px-6 py-4",
        cellClassName: "px-6 py-4",
      },
      cell: ({ row }) => {
        const isDisabled = !row.original.is_selectable;
        const isSelected = currentSelection.includes(row.original.bill_number);
        return (
          <div onClick={(event) => event.stopPropagation()}>
            <Checkbox
              checked={isSelected}
              disabled={isDisabled}
              aria-label={`Select ${row.original.bill_number}`}
              onCheckedChange={(checked) =>
                toggleBillSelection(row.original.bill_number, Boolean(checked))
              }
            />
          </div>
        );
      },
    },
    {
      id: "billNumber",
      header: "Bill Number",
      meta: {
        headerClassName: "px-6 py-4 font-semibold",
      },
      cell: ({ row }) => (
        <div
          className={`px-6 py-4 font-medium ${
            row.original.is_selectable
              ? "text-gray-900 dark:text-white"
              : "text-gray-500 line-through"
          }`}
        >
          {row.original.bill_number}
        </div>
      ),
    },
    {
      id: "vendor",
      header: "Vendor",
      meta: {
        headerClassName: "px-6 py-4 font-semibold",
        cellClassName: "px-6 py-4",
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${row.original.vendor_initial_class_name}`}
          >
            {row.original.vendor_initial}
          </div>
          <span
            className={
              row.original.is_selectable
                ? "text-gray-700 dark:text-gray-300"
                : "text-gray-500"
            }
          >
            {row.original.vendor_name}
          </span>
        </div>
      ),
    },
    {
      id: "date",
      header: "Date",
      meta: {
        headerClassName: "px-6 py-4 font-semibold",
      },
      cell: ({ row }) => (
        <div
          className={
            row.original.is_selectable
              ? "px-6 py-4 text-gray-500"
              : "px-6 py-4 text-gray-400"
          }
        >
          {row.original.bill_date}
        </div>
      ),
    },
    {
      id: "dueDate",
      header: "Due Date",
      meta: {
        headerClassName: "px-6 py-4 font-semibold",
      },
      cell: ({ row }) => (
        <div
          className={`px-6 py-4 ${
            row.original.status === "Overdue"
              ? "font-medium text-red-500"
              : row.original.is_selectable
                ? "text-gray-500"
                : "text-gray-400"
          }`}
        >
          {row.original.due_date}
        </div>
      ),
    },
    {
      id: "amount",
      header: "Amount",
      meta: {
        align: "right",
        headerClassName: "px-6 py-4 text-right font-semibold",
      },
      cell: ({ row }) => (
        <div
          className={`px-6 py-4 text-right font-medium ${
            row.original.is_selectable
              ? "text-gray-900 dark:text-white"
              : "text-gray-500"
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
        align: "center",
        headerClassName: "px-6 py-4 text-center font-semibold",
        cellClassName: "px-6 py-4 text-center",
      },
      cell: ({ row }) => (
        <Badge
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${VENDOR_BILL_STATUS_BADGE_CLASS[row.original.status]}`}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      meta: {
        align: "right",
        headerClassName: "px-6 py-4 text-right font-semibold",
        cellClassName: "px-6 py-4 text-right",
      },
      cell: ({ row }) => {
        const isDisabled = !row.original.is_selectable;
        return (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            disabled={isDisabled}
            onClick={(event) => {
              event.stopPropagation();
              if (!isDisabled) {
                onRowOpen?.(row.original);
              }
            }}
            className="h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open bill action</span>
          </Button>
        );
      },
    },
  ];

  return (
    <Card className="rounded-xl border border-gray-200 shadow-sm dark:border-gray-700 py-0 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-200 p-4 dark:border-gray-700 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 dark:text-white">
              Daftar Bill
            </h3>
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

        <TableShell
          className="space-y-0"
          containerClassName="overflow-x-auto"
          columns={columns}
          data={filteredRows}
          getRowId={(row) => row.bill_number}
          emptyState="No bill rows found."
          headerRowClassName="border-b border-gray-200 bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-800/50"
          rowClassName={(row) =>
            row.is_selectable
              ? "group border-b border-gray-100 transition-colors dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
              : "group border-b border-gray-100 transition-colors dark:border-gray-700 cursor-not-allowed opacity-75"
          }
          onRowClick={(row) => {
            if (row.is_selectable) {
              onRowOpen?.(row);
            }
          }}
          surface="bare"
          pagination={pagination}
          paginationInfo={
            pagination
              ? `Showing ${filteredRows.length > 0 ? (pagination.page - 1) * pagination.pageSize + 1 : 0} to ${Math.min((pagination.page - 1) * pagination.pageSize + filteredRows.length, pagination.totalItems)} of ${pagination.totalItems} results`
              : undefined
          }
          onPrevPage={
            pagination && onPageChange
              ? () => onPageChange(Math.max(1, pagination.page - 1))
              : undefined
          }
          onNextPage={
            pagination && onPageChange
              ? () =>
                  onPageChange(
                    Math.min(pagination.totalPages, pagination.page + 1),
                  )
              : undefined
          }
          paginationClassName="rounded-none border-x-0 border-b-0 px-6 py-4 dark:border-gray-700"
          previousPageLabel="Previous"
          nextPageLabel="Next"
        />
      </CardContent>
    </Card>
  );
}
