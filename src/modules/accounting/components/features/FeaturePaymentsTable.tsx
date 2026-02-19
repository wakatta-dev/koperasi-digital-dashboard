/** @format */

"use client";

import { useMemo, useState } from "react";
import { Search, Plus } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/shared/inputs/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { PAYMENT_STATUS_BADGE_CLASS } from "../../constants/stitch";
import type { PaymentListItem } from "../../types/invoicing-ar";

type FeaturePaymentsTableProps = {
  rows?: PaymentListItem[];
  createHref?: string;
};

export function FeaturePaymentsTable({
  rows = [],
  createHref,
}: FeaturePaymentsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRows = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) return rows;
    return rows.filter((row) =>
      `${row.payment_number} ${row.invoice_number} ${row.customer}`
        .toLowerCase()
        .includes(normalized)
    );
  }, [rows, searchTerm]);

  return (
    <Card className="border-gray-200 shadow-sm dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">Payments Received</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Log of incoming customer payments</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search payment..."
              aria-label="Search payment..."
              className="w-48 border-gray-200 bg-gray-50 py-2 pr-4 pl-9 text-sm text-gray-900 transition-all focus-visible:w-64 focus-visible:ring-1 focus-visible:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          {createHref ? (
            <Button asChild type="button" className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700">
              <Link href={createHref}>
                <Plus className="h-4 w-4" />
                Record Payment
              </Link>
            </Button>
          ) : (
            <Button type="button" className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700">
              <Plus className="h-4 w-4" />
              Record Payment
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
            <TableRow>
              <TableHead className="px-6 py-3">Date</TableHead>
              <TableHead className="px-6 py-3">Payment #</TableHead>
              <TableHead className="px-6 py-3">Customer</TableHead>
              <TableHead className="px-6 py-3">Method</TableHead>
              <TableHead className="px-6 py-3 text-right">Amount</TableHead>
              <TableHead className="px-6 py-3 text-center">Status</TableHead>
              <TableHead className="px-6 py-3 text-center">Reference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.length === 0 ? (
              <TableRow>
                <TableCell className="px-6 py-10 text-center text-sm text-gray-500" colSpan={7}>
                  Tidak ada pembayaran.
                </TableCell>
              </TableRow>
            ) : null}

            {filteredRows.map((row) => (
              <TableRow key={row.payment_number}>
                <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {row.date}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {row.payment_number}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  {row.customer}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {row.method}
                </TableCell>
                <TableCell className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">
                  {row.amount}
                </TableCell>
                <TableCell className="px-6 py-4 text-center">
                  <Badge
                    className={`rounded-full px-2.5 py-0.5 text-xs ${PAYMENT_STATUS_BADGE_CLASS[row.status]}`}
                  >
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-center text-sm text-gray-500">
                  {row.invoice_number}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
