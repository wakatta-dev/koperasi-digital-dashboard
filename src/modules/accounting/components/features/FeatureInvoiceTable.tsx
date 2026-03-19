/** @format */

"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Calendar, Search, MoreVertical } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/shared/inputs/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableShell } from "@/components/shared/data-display/TableShell";

import { INVOICE_STATUS_BADGE_CLASS } from "../../constants/stitch";
import type { InvoiceListItem, InvoiceStatus } from "../../types/invoicing-ar";

type FeatureInvoiceTableProps = {
  rows?: InvoiceListItem[];
  getInvoiceHref?: (row: InvoiceListItem) => string;
};

const EMPTY_INVOICE_ROWS: InvoiceListItem[] = [];
const PAGE_SIZE = 4;

export function FeatureInvoiceTable({
  rows = EMPTY_INVOICE_ROWS,
  getInvoiceHref,
}: FeatureInvoiceTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<"all" | InvoiceStatus>("all");
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesStatus = status === "all" ? true : row.status === status;
      const matchesText =
        normalized.length === 0
          ? true
          : `${row.invoice_number} ${row.customer_name}`
              .toLowerCase()
              .includes(normalized);
      return matchesStatus && matchesText;
    });
  }, [rows, searchTerm, status]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pagedRows = filteredRows.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const columns = useMemo<ColumnDef<InvoiceListItem, unknown>[]>(
    () => [
      {
        id: "invoiceNumber",
        header: "Invoice Number",
        meta: {
          headerClassName: "px-6 py-3",
          cellClassName:
            "px-6 py-4 font-medium text-indigo-600 dark:text-indigo-400",
        },
        cell: ({ row }) =>
          getInvoiceHref ? (
            <Link
              className="hover:underline"
              href={getInvoiceHref(row.original)}
            >
              {row.original.invoice_number}
            </Link>
          ) : (
            row.original.invoice_number
          ),
      },
      {
        id: "customer",
        header: "Customer",
        meta: {
          headerClassName: "px-6 py-3",
          cellClassName: "px-6 py-4 text-gray-900 dark:text-white",
        },
        cell: ({ row }) => row.original.customer_name,
      },
      {
        id: "date",
        header: "Date",
        meta: {
          headerClassName: "px-6 py-3",
          cellClassName: "px-6 py-4 text-gray-500",
        },
        cell: ({ row }) => row.original.invoice_date,
      },
      {
        id: "dueDate",
        header: "Due Date",
        meta: { headerClassName: "px-6 py-3" },
        cell: ({ row }) => (
          <div
            className={`px-6 py-4 ${
              row.original.status === "Overdue"
                ? "font-medium text-red-500"
                : "text-gray-500"
            }`}
          >
            {row.original.due_date}
          </div>
        ),
      },
      {
        id: "totalAmount",
        header: "Total Amount",
        meta: {
          align: "right",
          headerClassName: "px-6 py-3 text-right",
          cellClassName:
            "px-6 py-4 text-right font-medium text-gray-900 dark:text-white",
        },
        cell: ({ row }) => row.original.total_amount,
      },
      {
        id: "status",
        header: "Status",
        meta: {
          align: "center",
          headerClassName: "px-6 py-3 text-center",
          cellClassName: "px-6 py-4 text-center",
        },
        cell: ({ row }) => (
          <Badge
            className={`rounded-full px-2.5 py-0.5 text-xs ${INVOICE_STATUS_BADGE_CLASS[row.original.status]}`}
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        id: "action",
        header: "Action",
        meta: {
          align: "right",
          headerClassName: "px-6 py-3 text-right",
          cellClassName: "px-6 py-4 text-right",
        },
        cell: () => (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-gray-400 hover:text-indigo-600"
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open invoice action</span>
          </Button>
        ),
      },
    ],
    [getInvoiceHref],
  );

  return (
    <Card className="border-gray-200 shadow-sm dark:border-gray-700">
      <CardHeader className="flex flex-col gap-4 border-b border-gray-200 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="whitespace-nowrap text-lg font-bold text-gray-900 dark:text-white">
          Daftar Invoice
        </h3>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(1);
              }}
              placeholder="Search invoice number or customer..."
              className="w-full border-none bg-gray-50 py-2 pr-4 pl-9 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:bg-gray-800 dark:text-white"
              aria-label="Search invoice number or customer..."
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={status}
              onValueChange={(next) => {
                setStatus(next as "all" | InvoiceStatus);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[140px] border-gray-200 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
                <SelectValue placeholder="Status: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Status: All</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Sent">Sent</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              className="gap-2 border-gray-200 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300"
            >
              <Calendar className="h-4 w-4" />
              <span>Date Range</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6">
        <TableShell
          className="border border-border rounded-xl overflow-hidden space-y-0"
          columns={columns}
          data={pagedRows}
          getRowId={(row) => row.invoice_number}
          emptyState="No invoice rows found."
          headerClassName="bg-gray-50 dark:bg-gray-800/50"
          headerRowClassName="border-b border-gray-200 dark:border-gray-700"
          rowClassName="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50"
          pagination={{
            page: currentPage,
            pageSize: PAGE_SIZE,
            totalItems: filteredRows.length,
            totalPages: pageCount,
          }}
          paginationInfo={`Showing ${filteredRows.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} to ${Math.min(currentPage * PAGE_SIZE, filteredRows.length)} of ${filteredRows.length} entries`}
          onPrevPage={() => setPage((value) => Math.max(1, value - 1))}
          onNextPage={() => setPage((value) => Math.min(pageCount, value + 1))}
          paginationClassName="rounded-none border-x-0 border-b-0 p-4 dark:border-gray-700"
          previousPageLabel="Previous"
          nextPageLabel="Next"
        />
      </CardContent>
    </Card>
  );
}
