/** @format */

import type { ReactNode } from "react";
import type { ColumnDef, RowData } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { GenericTable } from "@/components/shared/data-display/GenericTable";
import { cn } from "@/lib/utils";

export type TablePaginationMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

type TableShellColumnDefinition<Row> = ColumnDef<Row, unknown> & {
  header?: ColumnDef<Row, unknown>["header"] | ReactNode;
};

export type TableShellColumn<Row> =
  | TableShellColumnDefinition<Row>
  | {
      id: string;
      header: ReactNode;
      meta?: ColumnDef<Row, unknown>["meta"];
    };

type TableShellSharedProps = {
  className?: string;
  tableClassName?: string;
  containerClassName?: string;
  footer?: ReactNode;
  pagination?: TablePaginationMeta;
  onPrevPage?: () => void;
  onNextPage?: () => void;
  paginationInfo?: ReactNode;
  paginationClassName?: string;
};

type TableShellColumnModeProps<Row> = TableShellSharedProps & {
  columns: TableShellColumn<Row>[];
  data: Row[];
  getRowId?: (row: Row, index: number) => string;
  loading?: boolean;
  loadingState?: ReactNode;
  emptyState?: ReactNode;
  onRowClick?: (row: Row) => void;
  rowHoverable?: boolean;
  rowClassName?: string | ((row: Row) => string | undefined);
  headerClassName?: string;
  headerRowClassName?: string;
  bodyClassName?: string;
  surface?: "card" | "bare";
};

export type TableShellProps<Row> = TableShellColumnModeProps<Row>;

function normalizeColumns<Row extends RowData>(
  columns: TableShellColumn<Row>[],
): ColumnDef<Row, unknown>[] {
  const normalizeHeader = (
    header: TableShellColumn<Row>["header"],
  ): ColumnDef<Row, unknown>["header"] => {
    if (
      typeof header === "function" ||
      typeof header === "string" ||
      header == null
    ) {
      return header as ColumnDef<Row, unknown>["header"];
    }

    return () => <>{header}</>;
  };

  return columns.map((column) =>
    "accessorKey" in column ||
    "accessorFn" in column ||
    "cell" in column ||
    "footer" in column
      ? ({
          ...(column as TableShellColumnDefinition<Row>),
          header: normalizeHeader(column.header),
        } as ColumnDef<Row, unknown>)
      : {
          id: column.id,
          header: normalizeHeader(column.header),
          meta: column.meta,
        },
  ) as ColumnDef<Row, unknown>[];
}

export function TableShell<Row>({
  className,
  tableClassName,
  containerClassName,
  footer,
  pagination,
  onPrevPage,
  onNextPage,
  paginationInfo,
  paginationClassName,
  ...restProps
}: TableShellProps<Row>) {
  const hasPrev = pagination ? pagination.page > 1 : false;
  const hasNext = pagination
    ? pagination.page < Math.max(1, pagination.totalPages)
    : false;

  const resolvedPaginationInfo = paginationInfo ?? (
    <>
      Halaman {pagination?.page ?? 1} dari{" "}
      {Math.max(1, pagination?.totalPages ?? 1)} • {pagination?.totalItems ?? 0}{" "}
      item
    </>
  );

  return (
    <div className={cn("space-y-3", className)}>
      <GenericTable
        {...restProps}
        columns={normalizeColumns(restProps.columns)}
        tableClassName={tableClassName}
        containerClassName={containerClassName}
        footer={footer}
      />

      {pagination ? (
        <div
          className={cn(
            "flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3",
            paginationClassName,
          )}
        >
          <p className="text-sm text-muted-foreground">
            {resolvedPaginationInfo}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onPrevPage}
              disabled={!hasPrev}
            >
              Sebelumnya
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onNextPage}
              disabled={!hasNext}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export type LegacyPaginatedTableShellProps<Row> = Omit<
  TableShellProps<Row>,
  "pagination"
> & {
  pagination: TablePaginationMeta;
};

export function PaginatedTableShell<Row>(
  props: LegacyPaginatedTableShellProps<Row>,
) {
  return <TableShell {...props} />;
}
