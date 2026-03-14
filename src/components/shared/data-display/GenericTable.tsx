/** @format */

"use client";

import type { ReactNode } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import { TableCell } from "@/components/shared/data-display/TableCell";
import { TableHeader } from "@/components/shared/data-display/TableHeader";
import { TableRow } from "@/components/shared/data-display/TableRow";
import { TableViewport } from "@/components/shared/data-display/TableViewport";
import { cn } from "@/lib/utils";

export type GenericTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  getRowId?: (row: TData, index: number) => string;
  loading?: boolean;
  loadingState?: ReactNode;
  emptyState?: ReactNode;
  onRowClick?: (row: TData) => void;
  rowHoverable?: boolean;
  rowClassName?: string | ((row: TData) => string | undefined);
  footer?: ReactNode;
  wrapperClassName?: string;
  tableClassName?: string;
  containerClassName?: string;
  headerClassName?: string;
  headerRowClassName?: string;
  bodyClassName?: string;
  surface?: "card" | "bare";
};

export function GenericTable<TData>({
  columns,
  data,
  getRowId,
  loading = false,
  loadingState = "Memuat data...",
  emptyState = "Belum ada data.",
  onRowClick,
  rowHoverable = true,
  rowClassName,
  footer,
  wrapperClassName,
  tableClassName,
  containerClassName,
  headerClassName,
  headerRowClassName,
  bodyClassName,
  surface = "card",
}: GenericTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: getRowId ? (row, index) => getRowId(row, index) : undefined,
  });

  const getRowClassName = (row: TData) =>
    typeof rowClassName === "function" ? rowClassName(row) : rowClassName;

  const columnCount = Math.max(1, table.getAllLeafColumns().length);

  return (
    <div
      className={cn(
        "w-full min-w-0 rounded-xl",
        surface === "card" && "overflow-hidden border border-border bg-card",
        wrapperClassName,
      )}
    >
      <TableViewport
        className={cn("min-w-full divide-y divide-border", tableClassName)}
        containerClassName={cn("w-full overflow-x-auto", containerClassName)}
      >
        <TableHeader className={cn("bg-muted/40", headerClassName)}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className={cn("border-0", headerRowClassName)}
            >
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta;

                return (
                  <TableCell
                    key={header.id}
                    as="th"
                    scope="col"
                    align={meta?.align ?? "left"}
                    width={meta?.width}
                    className={cn(
                      "px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground",
                      meta?.headerClassName,
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <tbody className={cn("divide-y divide-border", bodyClassName)}>
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={columnCount}
                className="px-6 py-6 text-center text-sm text-muted-foreground"
              >
                {loadingState}
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columnCount}
                className="px-6 py-6 text-center text-sm text-muted-foreground"
              >
                {emptyState}
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                hoverable={rowHoverable}
                className={getRowClassName(row.original)}
                onClick={
                  onRowClick ? () => onRowClick(row.original) : undefined
                }
              >
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta;
                  const resolvedCellProps = meta?.cellProps?.(
                    cell.getContext(),
                  );

                  if (resolvedCellProps?.hidden) {
                    return null;
                  }

                  return (
                    <TableCell
                      key={cell.id}
                      align={resolvedCellProps?.align ?? meta?.align ?? "left"}
                      width={resolvedCellProps?.width ?? meta?.width}
                      colSpan={resolvedCellProps?.colSpan}
                      className={cn(
                        meta?.cellClassName,
                        resolvedCellProps?.className,
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </tbody>
      </TableViewport>

      {footer ? (
        <div
          className={cn(
            surface === "card" ? "border-t border-border px-6 py-4" : "pt-4",
          )}
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
}
