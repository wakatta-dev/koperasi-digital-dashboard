/** @format */

import Link from "next/link";
import { MoreVertical } from "lucide-react";
import type { ReactNode } from "react";
import {
  TableShell,
  type TableColumn,
} from "@/components/shared/data-display/table-shell";
import { Button } from "@/components/ui/button";
import type { InventoryItem } from "../types";

type InventoryTableProps = {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onRowClick?: (item: InventoryItem) => void;
  footer?: ReactNode;
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
      <div className="overflow-x-auto">
        <TableShell<InventoryItem>
          columns={columns}
          rows={items}
          getRowKey={(row) => `${row.sku}-${row.name}`}
          onRowClick={onRowClick}
          emptyState="Belum ada produk."
          rowClassName="hover:bg-muted/40"
          renderCell={(row, column) => {
            if (column.id === "product") {
              return (
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
              );
            }

            if (column.id === "sku") {
              return (
                <span className="text-sm text-muted-foreground">{row.sku}</span>
              );
            }

            if (column.id === "category") {
              return (
                <span
                  className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${row.categoryClassName}`}
                >
                  {row.category}
                </span>
              );
            }

            if (column.id === "stock") {
              return (
                <span className="text-sm text-muted-foreground">
                  {row.stock}
                </span>
              );
            }

            if (column.id === "price") {
              return (
                <span className="text-sm text-foreground">{row.price}</span>
              );
            }

            if (column.id === "actions") {
              return (
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
              );
            }

            return null;
          }}
        />
      </div>
      {footer ? (
        <div className="border-t border-border px-6 py-4">{footer}</div>
      ) : null}
    </div>
  );
}
