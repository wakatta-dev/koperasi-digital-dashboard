/** @format */

import type { ColumnDef } from "@tanstack/react-table";
import { TableShell } from "@/components/shared/data-display/TableShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { SupportActivityLogItem } from "@/types/api";
import {
  formatSettingsDateTime,
  settingsSurfaceClassName,
} from "../../lib/settings";

type FeatureActivityLogTableProps = {
  rows: SupportActivityLogItem[];
  loading: boolean;
  nextCursor?: string | number;
  onLoadMore: () => void;
};

const columns: ColumnDef<SupportActivityLogItem, unknown>[] = [
  {
    id: "time",
    header: "Waktu",
    meta: {
      headerClassName:
        "bg-slate-50/80 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:bg-slate-900/70 dark:text-slate-400",
      cellClassName:
        "whitespace-nowrap border-b border-slate-200 px-4 py-3 text-xs text-slate-900 dark:border-slate-800 dark:text-slate-200",
    },
    cell: ({ row }) => (
      <time
        dateTime={row.original.timestamp}
        className="font-mono [font-variant-numeric:tabular-nums]"
      >
        {formatSettingsDateTime(row.original.timestamp)}
      </time>
    ),
  },
  {
    id: "actor",
    header: "Actor",
    meta: {
      headerClassName:
        "bg-slate-50/80 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:bg-slate-900/70 dark:text-slate-400",
      cellClassName:
        "whitespace-nowrap border-b border-slate-200 px-4 py-3 text-sm text-slate-900 dark:border-slate-800 dark:text-slate-200",
    },
    cell: ({ row }) => row.original.actor_label || `user:${row.original.actor_id}`,
  },
  {
    id: "module",
    header: "Module",
    meta: {
      headerClassName:
        "bg-slate-50/80 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:bg-slate-900/70 dark:text-slate-400",
      cellClassName:
        "whitespace-nowrap border-b border-slate-200 px-4 py-3 text-sm text-slate-900 dark:border-slate-800 dark:text-slate-200",
    },
    cell: ({ row }) => (
      <Badge className="border-transparent bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
        {row.original.module}
      </Badge>
    ),
  },
  {
    id: "action",
    header: "Action",
    meta: {
      headerClassName:
        "bg-slate-50/80 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:bg-slate-900/70 dark:text-slate-400",
      cellClassName:
        "whitespace-nowrap border-b border-slate-200 px-4 py-3 text-sm text-slate-900 dark:border-slate-800 dark:text-slate-200",
    },
    cell: ({ row }) => (
      <span className="block max-w-[220px] truncate">{row.original.action}</span>
    ),
  },
  {
    id: "target",
    header: "Target",
    meta: {
      headerClassName:
        "bg-slate-50/80 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:bg-slate-900/70 dark:text-slate-400",
      cellClassName:
        "whitespace-nowrap border-b border-slate-200 px-4 py-3 text-sm text-slate-900 dark:border-slate-800 dark:text-slate-200",
    },
    cell: ({ row }) => (
      <span className="block max-w-[200px] truncate font-mono text-xs [font-variant-numeric:tabular-nums]">
        {`${row.original.entity_type}:${row.original.entity_id}`}
      </span>
    ),
  },
  {
    id: "requestId",
    header: "Request ID",
    meta: {
      headerClassName:
        "bg-slate-50/80 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:bg-slate-900/70 dark:text-slate-400",
      cellClassName:
        "whitespace-nowrap border-b border-slate-200 px-4 py-3 font-mono text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400",
    },
    cell: ({ row }) => (
      <span className="block max-w-[160px] truncate [font-variant-numeric:tabular-nums]">
        {row.original.request_id || "-"}
      </span>
    ),
  },
];

export function FeatureActivityLogTable({
  rows,
  loading,
  nextCursor,
  onLoadMore,
}: FeatureActivityLogTableProps) {
  return (
    <Card className={`${settingsSurfaceClassName} flex flex-col overflow-hidden`}>
      <CardContent className="p-0">
        <TableShell
          columns={columns}
          data={rows}
          getRowId={(row, index) => `${row.id}-${index}`}
          loading={loading && rows.length === 0}
          loadingState="Memuat…"
          emptyState="Tidak ada data activity log untuk kombinasi filter saat ini."
          surface="bare"
          rowClassName="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-900/60"
          footer={
            <div className="flex justify-end border-t border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/70">
              <Button
                type="button"
                className="bg-slate-950 text-white hover:bg-slate-800 focus-visible:ring-slate-900 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 dark:focus-visible:ring-slate-100"
                disabled={!nextCursor || loading}
                onClick={onLoadMore}
              >
                {loading ? "Memuat…" : "Muat Berikutnya"}
              </Button>
            </div>
          }
        />
      </CardContent>
    </Card>
  );
}
