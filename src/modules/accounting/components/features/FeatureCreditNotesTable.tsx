/** @format */

"use client";

import { useMemo, useState } from "react";
import { Search, Plus } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DUMMY_CREDIT_NOTES } from "../../constants/dummy-data";
import { CREDIT_NOTE_STATUS_BADGE_CLASS } from "../../constants/stitch";
import type { CreditNoteListItem } from "../../types/invoicing-ar";

type FeatureCreditNotesTableProps = {
  rows?: CreditNoteListItem[];
  createHref?: string;
};

export function FeatureCreditNotesTable({
  rows = DUMMY_CREDIT_NOTES,
  createHref,
}: FeatureCreditNotesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRows = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) return rows;
    return rows.filter((row) =>
      `${row.credit_note_number} ${row.invoice_number} ${row.customer}`
        .toLowerCase()
        .includes(normalized)
    );
  }, [rows, searchTerm]);

  return (
    <Card className="border-gray-200 shadow-sm dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">Credit Notes (Customer)</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Recent refunds and returns issued</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search credit note..."
              aria-label="Search credit note..."
              className="w-48 border-gray-200 bg-gray-50 py-2 pr-4 pl-9 text-sm text-gray-900 transition-all focus-visible:w-64 focus-visible:ring-1 focus-visible:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          {createHref ? (
            <Button asChild type="button" variant="outline" className="gap-2 border-gray-200 dark:border-gray-700">
              <Link href={createHref}>
                <Plus className="h-4 w-4" />
                New Credit Note
              </Link>
            </Button>
          ) : (
            <Button type="button" variant="outline" className="gap-2 border-gray-200 dark:border-gray-700">
              <Plus className="h-4 w-4" />
              New Credit Note
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
            <TableRow>
              <TableHead className="px-6 py-3">Date</TableHead>
              <TableHead className="px-6 py-3">Credit Note #</TableHead>
              <TableHead className="px-6 py-3">Invoice #</TableHead>
              <TableHead className="px-6 py-3">Customer</TableHead>
              <TableHead className="px-6 py-3 text-right">Amount</TableHead>
              <TableHead className="px-6 py-3 text-center">Status</TableHead>
              <TableHead className="px-6 py-3 text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow key={row.credit_note_number}>
                <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {row.date}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {row.credit_note_number}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {row.invoice_number}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  {row.customer}
                </TableCell>
                <TableCell className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">
                  {row.amount}
                </TableCell>
                <TableCell className="px-6 py-4 text-center">
                  <Badge
                    className={`rounded-full px-2.5 py-0.5 text-xs ${CREDIT_NOTE_STATUS_BADGE_CLASS[row.status]}`}
                  >
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-center text-sm text-gray-500">Details</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
