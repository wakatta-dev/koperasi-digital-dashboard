/** @format */

import type { ColumnDef } from "@tanstack/react-table";
import { History } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { TableShell } from "@/components/shared/data-display/TableShell";

import { JOURNAL_INITIAL_INLINE_AUDIT_ROWS } from "../../constants/journal-initial-state";
import type { JournalInlineAuditItem } from "../../types/journal";

type FeatureJournalInlineAuditLogTableProps = {
  rows?: JournalInlineAuditItem[];
  onViewFullHistory?: () => void;
};

function actionBadgeClass(action: JournalInlineAuditItem["action"]) {
  switch (action) {
    case "Edited":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";
    case "Draft Saved":
      return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    default:
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
  }
}

export function FeatureJournalInlineAuditLogTable({
  rows = JOURNAL_INITIAL_INLINE_AUDIT_ROWS,
  onViewFullHistory,
}: FeatureJournalInlineAuditLogTableProps) {
  const columns: ColumnDef<JournalInlineAuditItem, unknown>[] = [
    {
      id: "timestamp",
      header: "Timestamp",
      meta: {
        headerClassName: "px-6 py-3",
        cellClassName:
          "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400",
      },
      cell: ({ row }) => row.original.timestamp,
    },
    {
      id: "user",
      header: "User",
      meta: {
        headerClassName: "px-6 py-3",
        cellClassName: "px-6 py-4 whitespace-nowrap",
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
            {row.original.user_initial}
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {row.original.user_name}
          </span>
        </div>
      ),
    },
    {
      id: "action",
      header: "Action",
      meta: {
        headerClassName: "px-6 py-3",
        cellClassName: "px-6 py-4 whitespace-nowrap",
      },
      cell: ({ row }) => (
        <Badge className={actionBadgeClass(row.original.action)}>
          {row.original.action}
        </Badge>
      ),
    },
    {
      id: "details",
      header: "Details",
      meta: {
        headerClassName: "px-6 py-3",
        cellClassName: "px-6 py-4 text-sm text-gray-600 dark:text-gray-300",
      },
      cell: ({ row }) => row.original.details,
    },
  ];

  return (
    <Card className="rounded-xl border border-gray-200 shadow-sm dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 bg-gray-50/50 px-5 py-4 dark:border-gray-700 dark:bg-gray-800/30">
        <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
          <History className="h-5 w-5 text-indigo-600" />
          Audit Log
        </h3>
        <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
          {rows.length} Changes
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-auto">
          <TableShell
            columns={columns}
            data={rows}
            getRowId={(row) => `${row.timestamp}-${row.user_name}`}
            emptyState="Belum ada audit log."
            headerClassName="bg-gray-50 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:bg-gray-800/50 dark:text-gray-400"
            rowClassName="hover:bg-gray-50 dark:hover:bg-gray-800/50"
          />
        </div>
      </CardContent>
      <CardFooter className="justify-center border-t border-gray-100 p-4 dark:border-gray-700">
        <Button
          type="button"
          variant="link"
          onClick={onViewFullHistory}
          className="h-auto p-0 text-xs font-medium text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
        >
          View Full History
        </Button>
      </CardFooter>
    </Card>
  );
}
