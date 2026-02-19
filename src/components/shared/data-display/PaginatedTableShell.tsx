/** @format */

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  GenericTable,
  type GenericTableColumn,
} from "@/components/shared/data-display/GenericTable";
import { cn } from "@/lib/utils";

type PaginationMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

type PaginatedTableShellProps<Row> = {
  columns: GenericTableColumn<Row>[];
  rows: Row[];
  getRowKey: (row: Row, index: number) => string;
  loading?: boolean;
  emptyState?: ReactNode;
  loadingState?: ReactNode;
  pagination: PaginationMeta;
  onPrevPage?: () => void;
  onNextPage?: () => void;
  className?: string;
};

export function PaginatedTableShell<Row>({
  columns,
  rows,
  getRowKey,
  loading,
  emptyState,
  loadingState,
  pagination,
  onPrevPage,
  onNextPage,
  className,
}: PaginatedTableShellProps<Row>) {
  const hasPrev = pagination.page > 1;
  const hasNext = pagination.page < Math.max(1, pagination.totalPages);

  return (
    <div className={cn("space-y-3", className)}>
      <GenericTable
        columns={columns}
        rows={rows}
        getRowKey={getRowKey}
        loading={loading}
        emptyState={emptyState}
        loadingState={loadingState}
      />

      <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3">
        <p className="text-sm text-muted-foreground">
          Halaman {pagination.page} dari {Math.max(1, pagination.totalPages)} • {pagination.totalItems} item
        </p>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onPrevPage} disabled={!hasPrev}>
            Sebelumnya
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onNextPage} disabled={!hasNext}>
            Berikutnya
          </Button>
        </div>
      </div>
    </div>
  );
}
