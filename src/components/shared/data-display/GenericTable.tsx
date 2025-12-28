/** @format */

import type { ReactNode } from "react";

import { TableCell } from "@/components/shared/data-display/TableCell";
import { TableHeader } from "@/components/shared/data-display/TableHeader";
import { TableRow } from "@/components/shared/data-display/TableRow";
import { TableShell } from "@/components/shared/data-display/TableShell";
import { cn } from "@/lib/utils";

export type GenericTableColumn<Row> = {
  id: string;
  header: ReactNode;
  align?: "left" | "right" | "center";
  width?: string | number;
  headerClassName?: string;
  cellClassName?: string;
  render: (row: Row) => ReactNode;
};

export type GenericTableProps<Row> = {
  columns: GenericTableColumn<Row>[];
  rows: Row[];
  getRowKey: (row: Row, index: number) => string;
  loading?: boolean;
  loadingState?: ReactNode;
  emptyState?: ReactNode;
  onRowClick?: (row: Row) => void;
  rowHoverable?: boolean;
  rowClassName?: string | ((row: Row) => string | undefined);
  footer?: ReactNode;
  wrapperClassName?: string;
  tableClassName?: string;
  containerClassName?: string;
  headerClassName?: string;
  headerRowClassName?: string;
  bodyClassName?: string;
};

export function GenericTable<Row>({
  columns,
  rows,
  getRowKey,
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
}: GenericTableProps<Row>) {
  const getRowClassName = (row: Row) =>
    typeof rowClassName === "function" ? rowClassName(row) : rowClassName;

  return (
    <div
      className={cn(
        "w-full min-w-0 overflow-hidden rounded-lg border border-border bg-card shadow-sm",
        wrapperClassName
      )}
    >
      <TableShell
        className={cn("min-w-full divide-y divide-border", tableClassName)}
        containerClassName={cn("w-full overflow-x-auto", containerClassName)}
      >
        <TableHeader className={cn("bg-muted/40", headerClassName)}>
          <TableRow className={cn("border-0", headerRowClassName)}>
            {columns.map((col) => (
              <TableCell
                key={col.id}
                as="th"
                scope="col"
                align={col.align ?? "left"}
                width={col.width}
                className={cn(
                  "px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground",
                  col.headerClassName
                )}
              >
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <tbody className={cn("divide-y divide-border", bodyClassName)}>
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="px-6 py-6 text-sm text-muted-foreground text-center"
              >
                {loadingState}
              </TableCell>
            </TableRow>
          ) : null}
          {!loading && rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="px-6 py-6 text-sm text-muted-foreground text-center"
              >
                {emptyState}
              </TableCell>
            </TableRow>
          ) : null}
          {rows.map((row, index) => {
            const key = getRowKey(row, index);
            return (
              <TableRow
                key={key}
                hoverable={rowHoverable}
                className={getRowClassName(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => (
                  <TableCell
                    key={`${key}-${col.id}`}
                    align={col.align ?? "left"}
                    width={col.width}
                    className={col.cellClassName}
                  >
                    {col.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </tbody>
      </TableShell>
      {footer ? (
        <div className="border-t border-border px-6 py-4">{footer}</div>
      ) : null}
    </div>
  );
}
