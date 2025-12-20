/** @format */

import Link from "next/link";
import { MoreVertical } from "lucide-react";
import type { ReactNode } from "react";
import { TableCell } from "@/components/shared/data-display/TableCell";
import { TableHeader } from "@/components/shared/data-display/TableHeader";
import { TableRow } from "@/components/shared/data-display/TableRow";
import { TableShell } from "@/components/shared/data-display/TableShell";
import { Button } from "@/components/ui/button";
import type { InventoryItem } from "../types";

type InventoryTableProps = {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onRowClick?: (item: InventoryItem) => void;
  footer?: ReactNode;
};

type TableColumn<Row> = {
  id: string;
  header: ReactNode;
  align?: "left" | "right" | "center";
  width?: string | number;
};

const columns: TableColumn<InventoryItem>[] = [
  { id: "product", header: "Produk" },
  { id: "sku", header: "SKU" },
  { id: "category", header: "Kategori" },
  { id: "stock", header: "Stok" },
  { id: "price", header: "Harga Jual" },
  { id: "actions", header: "", align: "right", width: 80 },
];

export function InventoryTable({
  items,
  onEdit,
  onRowClick,
  footer,
}: InventoryTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <TableShell className="min-w-full divide-y divide-border" containerClassName="overflow-x-auto">
        <TableHeader className="bg-muted/40">
          <TableRow className="border-0">
            {columns.map((col) => (
              <TableCell
                key={col.id}
                as="th"
                scope="col"
                align={col.align ?? "left"}
                width={col.width}
                className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <tbody className="divide-y divide-border">
          {items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="px-6 py-6 text-sm text-muted-foreground text-center"
              >
                Belum ada produk.
              </TableCell>
            </TableRow>
          ) : null}
          {items.map((row) => (
            <TableRow
              key={`${row.sku}-${row.name}`}
              hoverable
              className="hover:bg-muted/40"
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              <TableCell className="px-6 py-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <img
                      src={row.image}
                      alt={row.name}
                      className="h-10 w-10 rounded object-cover bg-muted"
                    />
                  </div>
                  <div className="ml-4">
                    <Link
                      href={`/bumdes/inventory/${row.sku}`}
                      className="text-sm font-medium text-foreground transition-colors hover:underline"
                    >
                      {row.name}
                    </Link>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {row.sku}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${row.categoryClassName}`}
                >
                  {row.category}
                </span>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {row.stock}
              </TableCell>
              <TableCell className="text-sm text-foreground">
                {row.price}
              </TableCell>
              <TableCell align="right" width={80}>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Edit produk"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(row);
                  }}
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </TableShell>
      {footer ? (
        <div className="border-t border-border px-6 py-4">{footer}</div>
      ) : null}
    </div>
  );
}
