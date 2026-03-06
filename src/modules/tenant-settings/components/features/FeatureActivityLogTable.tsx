/** @format */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { SupportActivityLogItem } from "@/types/api";
import { settingsSurfaceClassName } from "../../lib/settings";

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
                <TableHead className="bg-gray-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                  Waktu
                </TableHead>
                <TableHead className="bg-gray-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                  Actor
                </TableHead>
                <TableHead className="bg-gray-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                  Module
                </TableHead>
                <TableHead className="bg-gray-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                  Action
                </TableHead>
                <TableHead className="bg-gray-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                  Target
                </TableHead>
                <TableHead className="bg-gray-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                  Request ID
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <TableCell className="whitespace-nowrap border-b border-gray-200 px-4 py-3 font-mono text-xs text-gray-900 dark:border-gray-800 dark:text-gray-300">
                    {row.timestamp}
                  </TableCell>
                  <TableCell className="whitespace-nowrap border-b border-gray-200 px-4 py-3 text-sm text-gray-900 dark:border-gray-800 dark:text-gray-300">
                    {row.actor_label || `user:${row.actor_id}`}
                  </TableCell>
                  <TableCell className="whitespace-nowrap border-b border-gray-200 px-4 py-3 text-sm text-gray-900 dark:border-gray-800 dark:text-gray-300">
                    <Badge className="border-transparent bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                      {row.module}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap border-b border-gray-200 px-4 py-3 text-sm text-gray-900 dark:border-gray-800 dark:text-gray-300">
                    {row.action}
                  </TableCell>
                  <TableCell className="whitespace-nowrap border-b border-gray-200 px-4 py-3 text-sm text-gray-900 dark:border-gray-800 dark:text-gray-300">
                    {`${row.entity_type}:${row.entity_id}`}
                  </TableCell>
                  <TableCell className="whitespace-nowrap border-b border-gray-200 px-4 py-3 font-mono text-xs text-gray-500 dark:border-gray-800">
                    {row.request_id || "-"}
                  </TableCell>
                </TableRow>
              ))}

              {!loading && rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-gray-500">
                    Tidak ada data activity log.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
          <Button
            type="button"
            className="bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-600"
            disabled={!nextCursor || loading}
            onClick={onLoadMore}
          >
            {loading ? "Memuat..." : "Muat Berikutnya"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

