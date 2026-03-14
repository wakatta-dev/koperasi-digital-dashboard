import type { CellContext, RowData } from "@tanstack/react-table";

type TableCellRenderProps = {
  align?: "left" | "right" | "center";
  width?: string | number;
  className?: string;
  colSpan?: number;
  hidden?: boolean;
};

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: "left" | "right" | "center";
    width?: string | number;
    headerClassName?: string;
    cellClassName?: string;
    cellProps?: (
      context: CellContext<TData, TValue>,
    ) => TableCellRenderProps | undefined;
  }
}
