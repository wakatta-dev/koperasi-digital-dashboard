/** @format */

"use client";

import { useMemo, useState } from "react";
import { Calendar, Search, MoreVertical } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DUMMY_INVOICE_ITEMS } from "../../constants/dummy-data";
import { INVOICE_STATUS_BADGE_CLASS } from "../../constants/stitch";
import type { InvoiceListItem, InvoiceStatus } from "../../types/invoicing-ar";

type FeatureInvoiceTableProps = {
  rows?: InvoiceListItem[];
};

const PAGE_SIZE = 4;

export function FeatureInvoiceTable({ rows = DUMMY_INVOICE_ITEMS }: FeatureInvoiceTableProps) {
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
    currentPage * PAGE_SIZE
  );

  return (
    <Card className="border-gray-200 shadow-sm dark:border-gray-700">
      <CardHeader className="flex flex-col gap-4 border-b border-gray-200 p-5 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
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

      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
            <TableRow className="border-b border-gray-200 dark:border-gray-700">
              <TableHead className="px-6 py-3">Invoice Number</TableHead>
              <TableHead className="px-6 py-3">Customer</TableHead>
              <TableHead className="px-6 py-3">Date</TableHead>
              <TableHead className="px-6 py-3">Due Date</TableHead>
              <TableHead className="px-6 py-3 text-right">Total Amount</TableHead>
              <TableHead className="px-6 py-3 text-center">Status</TableHead>
              <TableHead className="px-6 py-3 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedRows.length === 0 ? (
              <TableRow>
                <TableCell className="px-6 py-10 text-center text-sm text-gray-500" colSpan={7}>
                  No invoice rows found.
                </TableCell>
              </TableRow>
            ) : null}

            {pagedRows.map((row) => (
              <TableRow
                key={row.invoice_number}
                className="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50"
              >
                <TableCell className="px-6 py-4 font-medium text-indigo-600 dark:text-indigo-400">
                  {row.invoice_number}
                </TableCell>
                <TableCell className="px-6 py-4 text-gray-900 dark:text-white">
                  {row.customer_name}
                </TableCell>
                <TableCell className="px-6 py-4 text-gray-500">{row.invoice_date}</TableCell>
                <TableCell
                  className={`px-6 py-4 ${
                    row.status === "Overdue" ? "font-medium text-red-500" : "text-gray-500"
                  }`}
                >
                  {row.due_date}
                </TableCell>
                <TableCell className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                  {row.total_amount}
                </TableCell>
                <TableCell className="px-6 py-4 text-center">
                  <Badge
                    className={`rounded-full px-2.5 py-0.5 text-xs ${INVOICE_STATUS_BADGE_CLASS[row.status]}`}
                  >
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-gray-400 hover:text-indigo-600"
                  >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open invoice action</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between border-t border-gray-200 p-4 dark:border-gray-700">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredRows.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} to{" "}
            {Math.min(currentPage * PAGE_SIZE, filteredRows.length)} of {filteredRows.length} entries
          </span>
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
            <Button type="button" size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700">
              {currentPage}
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
      </CardContent>
    </Card>
  );
}
