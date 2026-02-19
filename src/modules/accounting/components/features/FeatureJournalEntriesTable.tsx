/** @format */

import { MoreVertical } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TablePaginationFooter } from "@/components/shared/data-display/TablePaginationFooter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  JOURNAL_INITIAL_ENTRIES_PAGINATION,
  JOURNAL_INITIAL_ENTRIES_ROWS,
} from "../../constants/journal-initial-state";
import type { JournalEntriesPagination, JournalEntriesTableRow } from "../../types/journal";

type FeatureJournalEntriesTableProps = {
  rows?: JournalEntriesTableRow[];
  pagination?: JournalEntriesPagination;
  onPageChange?: (nextPage: number) => void;
  onReferenceClick?: (journalNumber: string) => void;
};

function statusBadgeClassName(status: JournalEntriesTableRow["status"]) {
  switch (status) {
    case "Locked":
      return "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400";
    case "Posted":
      return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300";
    case "Reversed":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
}

export function FeatureJournalEntriesTable({
  rows = JOURNAL_INITIAL_ENTRIES_ROWS,
  pagination = JOURNAL_INITIAL_ENTRIES_PAGINATION,
  onPageChange,
  onReferenceClick,
}: FeatureJournalEntriesTableProps) {
  const totalPages = Math.max(1, Math.ceil(pagination.total_items / pagination.per_page));
  const canGoPrevious = pagination.page > 1;
  const canGoNext = pagination.page < totalPages;
  const hasItems = pagination.total_items > 0;
  const start = hasItems ? (pagination.page - 1) * pagination.per_page + 1 : 0;
  const end = hasItems ? Math.min(start + pagination.per_page - 1, pagination.total_items) : 0;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <Table className="text-left">
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
              <TableHead className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">Date</TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">Reference</TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">Journal Name</TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">Partner</TableHead>
              <TableHead className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">Debit</TableHead>
              <TableHead className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">Credit</TableHead>
              <TableHead className="px-6 py-4 text-center text-xs font-semibold tracking-wider text-gray-500 uppercase">Status</TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase" />
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                  No journal entries found.
                </TableCell>
              </TableRow>
            ) : null}
            {rows.map((row) => (
              <TableRow key={row.journal_number} className="group transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {row.journal_date}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    onClick={() => onReferenceClick?.(row.journal_number)}
                  >
                    {row.journal_number}
                  </Button>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {row.journal_name}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {row.partner === "Internal" || row.partner === "System" ? (
                    <span className="italic text-gray-400">{row.partner}</span>
                  ) : (
                    row.partner
                  )}
                </TableCell>
                <TableCell className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                  {row.debit_amount}
                </TableCell>
                <TableCell className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                  {row.credit_amount}
                </TableCell>
                <TableCell className="px-6 py-4 text-center">
                  <Badge className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClassName(row.status)}`}>
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label={`Open actions for ${row.journal_number}`}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <TablePaginationFooter
        page={pagination.page}
        totalPages={totalPages}
        canPrevious={canGoPrevious}
        canNext={canGoNext}
        onPrevious={() => onPageChange?.(Math.max(1, pagination.page - 1))}
        onNext={() => onPageChange?.(Math.min(totalPages, pagination.page + 1))}
        summary={
          <>
            Showing <span className="font-medium text-gray-900 dark:text-white">{start}</span> to{" "}
            <span className="font-medium text-gray-900 dark:text-white">{end}</span> of{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {pagination.total_items.toLocaleString("en-US")}
            </span>{" "}
            entries
          </>
        }
        className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-700"
      />
    </div>
  );
}
