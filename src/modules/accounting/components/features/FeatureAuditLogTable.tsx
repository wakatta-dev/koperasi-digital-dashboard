/** @format */

import type { ColumnDef } from "@tanstack/react-table";
import { Lock, Pencil, PlusCircle, Send, Trash } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TablePaginationFooter } from "@/components/shared/data-display/TablePaginationFooter";
import { TableShell } from "@/components/shared/data-display/TableShell";

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
        className:
          "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        icon: Send,
      };
    case "Edited":
      return {
        className:
          "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
        icon: Pencil,
      };
    case "Created":
      return {
        className:
          "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
        icon: PlusCircle,
      };
    case "Deleted":
      return {
        className:
          "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300",
        icon: Trash,
      };
    default:
      return {
        className:
          "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
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
  const columns: ColumnDef<JournalAuditLogRow, unknown>[] = [
    {
      id: "timestamp",
      header: "Timestamp",
      meta: {
        headerClassName:
          "w-48 px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase",
        cellClassName: "px-6 py-4 whitespace-nowrap",
      },
      cell: ({ row }) => (
        <>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {row.original.timestamp_date}
          </div>
          <div className="text-xs text-gray-500">{row.original.timestamp_time}</div>
        </>
      ),
    },
    {
      id: "user",
      header: "User",
      meta: {
        headerClassName:
          "w-40 px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase",
        cellClassName: "px-6 py-4",
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600 dark:bg-indigo-900/30">
            {row.original.user_initial}
          </div>
          <span className="text-sm text-gray-900 dark:text-white">
            {row.original.user_name}
          </span>
        </div>
      ),
    },
    {
      id: "module",
      header: "Module",
      meta: {
        headerClassName:
          "w-32 px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase",
        cellClassName: "px-6 py-4",
      },
      cell: ({ row }) => (
        <Badge className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          {row.original.module}
        </Badge>
      ),
    },
    {
      id: "action",
      header: "Action",
      meta: {
        headerClassName:
          "w-32 px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase",
        cellClassName: "px-6 py-4",
      },
      cell: ({ row }) => {
        const action = actionBadge(row.original.action);
        const ActionIcon = action.icon;
        return (
          <Badge
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${action.className}`}
          >
            <ActionIcon className="h-3 w-3" />
            {row.original.action}
          </Badge>
        );
      },
    },
    {
      id: "reference",
      header: "Reference No",
      meta: {
        headerClassName:
          "w-40 px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase",
        cellClassName: "px-6 py-4",
      },
      cell: ({ row }) => (
        <Button
          type="button"
          variant="link"
          onClick={() => onReferenceClick?.(row.original.reference_no)}
          className="h-auto p-0 text-sm font-medium text-indigo-600 hover:underline"
        >
          {row.original.reference_no}
        </Button>
      ),
    },
    {
      id: "details",
      header: "Change Details",
      meta: {
        headerClassName:
          "px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase",
        cellClassName: "px-6 py-4 text-sm text-gray-600 dark:text-gray-400",
      },
      cell: ({ row }) => row.original.change_details,
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <TableShell
          tableClassName="table-fixed text-left"
          columns={columns}
          data={rows}
          getRowId={(row) =>
            `${row.timestamp_date}-${row.timestamp_time}-${row.reference_no}`
          }
          emptyState="No audit log found."
          headerRowClassName="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
          rowClassName="group transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
        />
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
            <span className="font-medium text-gray-900 dark:text-white">
              {start}
            </span>{" "}
            sampai{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {end}
            </span>{" "}
            dari{" "}
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
