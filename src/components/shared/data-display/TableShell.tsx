/** @format */

import type { ComponentProps, ReactNode } from "react";
import type { ColumnDef, RowData } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { GenericTable } from "@/components/shared/data-display/GenericTable";
import { cn } from "@/lib/utils";

export type TablePagePaginationMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type TableCursorPaginationMeta = {
  mode: "cursor";
  hasPrev: boolean;
  hasNext: boolean;
  prevCursor?: string | number | null;
  nextCursor?: string | number | null;
  pageSize?: number;
  itemCount?: number;
  totalItems?: number;
};

export type TablePaginationMeta =
  | TablePagePaginationMeta
  | TableCursorPaginationMeta;

type CursorPaginationSource = {
  next_cursor?: string | number | null;
  prev_cursor?: string | number | null;
  has_next?: boolean;
  has_prev?: boolean;
  limit?: number;
};

export function createCursorPaginationMeta(
  pagination?: CursorPaginationSource,
  options?: {
    hasPrev?: boolean;
    hasNext?: boolean;
    itemCount?: number;
    totalItems?: number;
  },
): TableCursorPaginationMeta | undefined {
  if (
    !pagination &&
    typeof options?.hasPrev === "undefined" &&
    typeof options?.hasNext === "undefined" &&
    typeof options?.itemCount === "undefined" &&
    typeof options?.totalItems === "undefined"
  ) {
    return undefined;
  }

  return {
    mode: "cursor",
    hasPrev:
      options?.hasPrev ??
      Boolean(pagination?.has_prev ?? pagination?.prev_cursor),
    hasNext:
      options?.hasNext ??
      Boolean(pagination?.has_next ?? pagination?.next_cursor),
    prevCursor: pagination?.prev_cursor ?? null,
    nextCursor: pagination?.next_cursor ?? null,
    pageSize: pagination?.limit,
    itemCount: options?.itemCount,
    totalItems: options?.totalItems,
  };
}

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
  paginationInfoClassName?: string;
  previousPageLabel?: ReactNode;
  nextPageLabel?: ReactNode;
  paginationButtonSize?: ComponentProps<typeof Button>["size"];
  paginationButtonVariant?: ComponentProps<typeof Button>["variant"];
  previousPageButtonVariant?: ComponentProps<typeof Button>["variant"];
  nextPageButtonVariant?: ComponentProps<typeof Button>["variant"];
  previousPageButtonClassName?: string;
  nextPageButtonClassName?: string;
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

function isCursorPagination(
  pagination: TablePaginationMeta,
): pagination is TableCursorPaginationMeta {
  return "mode" in pagination && pagination.mode === "cursor";
}

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

    // eslint-disable-next-line react/display-name
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
  paginationInfoClassName,
  previousPageLabel = "Sebelumnya",
  nextPageLabel = "Berikutnya",
  paginationButtonSize = "sm",
  paginationButtonVariant,
  previousPageButtonVariant,
  nextPageButtonVariant,
  previousPageButtonClassName,
  nextPageButtonClassName,
  ...restProps
}: TableShellProps<Row>) {
  const hasPrev = pagination
    ? isCursorPagination(pagination)
      ? pagination.hasPrev
      : pagination.page > 1
    : false;
  const hasNext = pagination
    ? isCursorPagination(pagination)
      ? pagination.hasNext
      : pagination.page < Math.max(1, pagination.totalPages)
    : false;
  const canInvokePrev = hasPrev && Boolean(onPrevPage);
  const canInvokeNext = hasNext && Boolean(onNextPage);
  let defaultPaginationInfo: ReactNode = null;

  if (pagination) {
    if (isCursorPagination(pagination)) {
      const itemCount = pagination.itemCount ?? pagination.pageSize ?? 0;

      defaultPaginationInfo = pagination.totalItems ? (
        <>
          Menampilkan {itemCount} dari {pagination.totalItems} item
        </>
      ) : (
        <>Menampilkan {itemCount} item</>
      );
    } else {
      defaultPaginationInfo = (
        <>
          Halaman {pagination.page} dari {Math.max(1, pagination.totalPages)} •{" "}
          {pagination.totalItems} item
        </>
      );
    }
  }

  const resolvedPaginationInfo = paginationInfo ?? defaultPaginationInfo;
  const showPaginationInfo =
    resolvedPaginationInfo !== false && resolvedPaginationInfo != null;

  return (
    <div className={cn("", className)}>
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
            "flex items-center gap-3 rounded-lg bg-card px-4 py-3",
            showPaginationInfo ? "justify-between" : "justify-end",
            paginationClassName,
          )}
        >
          {showPaginationInfo ? (
            <p
              className={cn(
                "text-sm text-muted-foreground",
                paginationInfoClassName,
              )}
            >
              {resolvedPaginationInfo}
            </p>
          ) : null}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={
                previousPageButtonVariant ??
                paginationButtonVariant ??
                "outline"
              }
              size={paginationButtonSize}
              onClick={onPrevPage}
              disabled={!canInvokePrev}
              className={previousPageButtonClassName}
            >
              {previousPageLabel}
            </Button>
            <Button
              type="button"
              variant={
                nextPageButtonVariant ?? paginationButtonVariant ?? "outline"
              }
              size={paginationButtonSize}
              onClick={onNextPage}
              disabled={!canInvokeNext}
              className={nextPageButtonClassName}
            >
              {nextPageLabel}
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
