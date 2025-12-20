/** @format */

import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type TableColumn<Row> = {
  id: string;
  header: ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
  width?: string | number;
};

export type TableShellProps<Row> = {
  columns: TableColumn<Row>[];
  rows: Row[];
  renderCell: (row: Row, column: TableColumn<Row>) => ReactNode;
  getRowKey: (row: Row, index: number) => string;
  emptyState?: ReactNode;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: Row) => string | undefined);
  onRowClick?: (row: Row) => void;
};

export function TableShell<Row>({
  columns,
  rows,
  renderCell,
  getRowKey,
  emptyState,
  className,
  bodyClassName,
  headerClassName,
  rowClassName,
  onRowClick,
}: TableShellProps<Row>) {
  const alignClass = (align?: TableColumn<Row>["align"]) => {
    if (align === "right") return "text-right";
    if (align === "center") return "text-center";
    return "text-left";
  };

  return (
    <Table className={cn("min-w-full divide-y divide-border", className)}>
      <TableHeader className={cn("bg-muted/40", headerClassName)}>
        <TableRow className="border-0">
          {columns.map((col) => (
            <TableHead
              key={col.id}
              className={cn(
                "px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground",
                alignClass(col.align),
                col.className
              )}
              style={col.width ? { width: col.width } : undefined}
            >
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className={cn("divide-y divide-border", bodyClassName)}>
        {rows.length === 0 && emptyState ? (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="px-6 py-6 text-sm text-muted-foreground text-center"
            >
              {emptyState}
            </TableCell>
          </TableRow>
        ) : null}
        {rows.map((row, idx) => {
          const key = getRowKey(row, idx);
          const rc =
            typeof rowClassName === "function"
              ? rowClassName(row)
              : rowClassName;
          return (
            <TableRow
              key={key}
              className={cn(
                "transition-colors hover:bg-muted/40",
                rc,
                onRowClick && "cursor-pointer"
              )}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((col) => (
                <TableCell
                  key={`${key}-${col.id}`}
                  className={cn(
                    "px-6 py-4 text-sm text-foreground/80",
                    alignClass(col.align)
                  )}
                >
                  {renderCell(row, col)}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
