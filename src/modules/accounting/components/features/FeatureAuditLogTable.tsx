/** @format */

import { Lock, Pencil, PlusCircle, Send, Trash } from "lucide-react";

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

import { JOURNAL_INITIAL_AUDIT_LOG_ROWS } from "../../constants/journal-initial-state";
import type { JournalAuditLogRow } from "../../types/journal";

type FeatureAuditLogTableProps = {
  rows?: JournalAuditLogRow[];
  page?: number;
  perPage?: number;
  totalItems?: number;
  onPageChange?: (nextPage: number) => void;
  onReferenceClick?: (referenceNo: string) => void;
};

function actionBadge(action: JournalAuditLogRow["action"]) {
  switch (action) {
    case "Posted":
      return {
        className: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        icon: Send,
      };
    case "Edited":
      return {
        className: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
        icon: Pencil,
      };
    case "Created":
      return {
        className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
        icon: PlusCircle,
      };
    case "Deleted":
      return {
        className: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300",
        icon: Trash,
      };
    default:
      return {
        className: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
        icon: Lock,
      };
  }
}

export function FeatureAuditLogTable({
  rows = JOURNAL_INITIAL_AUDIT_LOG_ROWS,
  page = 1,
  perPage = 5,
  totalItems = 0,
  onPageChange,
  onReferenceClick,
}: FeatureAuditLogTableProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const start = totalItems > 0 ? (page - 1) * perPage + 1 : 0;
  const end = totalItems > 0 ? Math.min(start + perPage - 1, totalItems) : 0;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <Table className="table-fixed text-left">
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
              <TableHead className="w-48 px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">Timestamp</TableHead>
              <TableHead className="w-40 px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">User</TableHead>
              <TableHead className="w-32 px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">Module</TableHead>
              <TableHead className="w-32 px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">Action</TableHead>
              <TableHead className="w-40 px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">Reference No</TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">Change Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
            {rows.map((row) => {
              const action = actionBadge(row.action);
              const ActionIcon = action.icon;

              return (
                <TableRow key={`${row.timestamp_date}-${row.timestamp_time}-${row.reference_no}`} className="group transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {row.timestamp_date}
                    </div>
                    <div className="text-xs text-gray-500">{row.timestamp_time}</div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600 dark:bg-indigo-900/30">
                        {row.user_initial}
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white">{row.user_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      {row.module}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${action.className}`}>
                      <ActionIcon className="h-3 w-3" />
                      {row.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => onReferenceClick?.(row.reference_no)}
                      className="h-auto p-0 text-sm font-medium text-indigo-600 hover:underline"
                    >
                      {row.reference_no}
                    </Button>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {row.change_details}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <TablePaginationFooter
        page={page}
        totalPages={totalPages}
        canPrevious={page > 1}
        canNext={page < totalPages}
        onPrevious={() => onPageChange?.(Math.max(1, page - 1))}
        onNext={() => onPageChange?.(Math.min(totalPages, page + 1))}
        summary={
          <>
            Menampilkan{" "}
            <span className="font-medium text-gray-900 dark:text-white">{start}</span> sampai{" "}
            <span className="font-medium text-gray-900 dark:text-white">{end}</span> dari{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {totalItems.toLocaleString("en-US")}
            </span>{" "}
            log
          </>
        }
        previousLabel="Sebelumnya"
        nextLabel="Selanjutnya"
        className="flex items-center justify-between border-t border-gray-200 bg-gray-50/50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/30"
      />
    </div>
  );
}
