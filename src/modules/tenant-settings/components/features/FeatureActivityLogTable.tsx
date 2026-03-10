/** @format */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

export function FeatureActivityLogTable({
  rows,
  loading,
  nextCursor,
  onLoadMore,
}: FeatureActivityLogTableProps) {
  return (
    <Card className={`${settingsSurfaceClassName} flex flex-col overflow-hidden`}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-slate-50/80 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:bg-slate-900/70 dark:text-slate-400">
                  Waktu
                </TableHead>
                <TableHead className="bg-slate-50/80 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:bg-slate-900/70 dark:text-slate-400">
                  Actor
                </TableHead>
                <TableHead className="bg-slate-50/80 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:bg-slate-900/70 dark:text-slate-400">
                  Module
                </TableHead>
                <TableHead className="bg-slate-50/80 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:bg-slate-900/70 dark:text-slate-400">
                  Action
                </TableHead>
                <TableHead className="bg-slate-50/80 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:bg-slate-900/70 dark:text-slate-400">
                  Target
                </TableHead>
                <TableHead className="bg-slate-50/80 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:bg-slate-900/70 dark:text-slate-400">
                  Request ID
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  key={`${row.id}-${index}`}
                  className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-900/60"
                >
                  <TableCell className="whitespace-nowrap border-b border-slate-200 px-4 py-3 text-xs text-slate-900 dark:border-slate-800 dark:text-slate-200">
                    <time
                      dateTime={row.timestamp}
                      className="font-mono [font-variant-numeric:tabular-nums]"
                    >
                      {formatSettingsDateTime(row.timestamp)}
                    </time>
                  </TableCell>
                  <TableCell className="whitespace-nowrap border-b border-slate-200 px-4 py-3 text-sm text-slate-900 dark:border-slate-800 dark:text-slate-200">
                    {row.actor_label || `user:${row.actor_id}`}
                  </TableCell>
                  <TableCell className="whitespace-nowrap border-b border-slate-200 px-4 py-3 text-sm text-slate-900 dark:border-slate-800 dark:text-slate-200">
                    <Badge className="border-transparent bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                      {row.module}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap border-b border-slate-200 px-4 py-3 text-sm text-slate-900 dark:border-slate-800 dark:text-slate-200">
                    <span className="block max-w-[220px] truncate">{row.action}</span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap border-b border-slate-200 px-4 py-3 text-sm text-slate-900 dark:border-slate-800 dark:text-slate-200">
                    <span className="block max-w-[200px] truncate font-mono text-xs [font-variant-numeric:tabular-nums]">
                      {`${row.entity_type}:${row.entity_id}`}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap border-b border-slate-200 px-4 py-3 font-mono text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    <span className="block max-w-[160px] truncate [font-variant-numeric:tabular-nums]">
                      {row.request_id || "-"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}

              {!loading && rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                    Tidak ada data activity log untuk kombinasi filter saat ini.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
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
      </CardContent>
    </Card>
  );
}
