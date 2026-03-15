/** @format */

"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Package } from "lucide-react";
import { TableShell } from "@/components/shared/data-display/TableShell";
import { formatCurrency } from "@/lib/format";
import type { OrderItem } from "@/modules/marketplace/types";
import type { ReactNode } from "react";

export type OrderItemsTableProps = Readonly<{
  items: OrderItem[];
  footer?: ReactNode;
}>;

export function OrderItemsTable({ items, footer }: OrderItemsTableProps) {
  const columns: ColumnDef<OrderItem, unknown>[] = [
    {
      id: "product",
      header: "Produk",
      meta: {
        headerClassName:
          "px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider",
        cellClassName: "px-6 py-4",
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center flex-shrink-0">
            <Package className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {row.original.productName}
            </p>
            <p className="text-xs text-gray-500">SKU: {row.original.sku}</p>
          </div>
        </div>
      ),
    },
    {
      id: "unitPrice",
      header: "Harga Satuan",
      meta: {
        align: "right",
        headerClassName:
          "px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right",
        cellClassName:
          "px-6 py-4 text-sm text-gray-600 dark:text-gray-300 text-right",
      },
      cell: ({ row }) => formatCurrency(row.original.unitPrice),
    },
    {
      id: "qty",
      header: "Qty",
      meta: {
        align: "center",
        headerClassName:
          "px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center",
        cellClassName:
          "px-6 py-4 text-sm text-gray-600 dark:text-gray-300 text-center",
      },
      cell: ({ row }) => row.original.qty,
    },
    {
      id: "total",
      header: "Total",
      meta: {
        align: "right",
        headerClassName:
          "px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right",
        cellClassName:
          "px-6 py-4 text-sm font-medium text-gray-900 dark:text-white text-right",
      },
      cell: ({ row }) => formatCurrency(row.original.totalPrice),
    },
  ];

  return (
    <div className="surface-table">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Rincian Barang
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {items.length} Items
        </span>
      </div>
      <div className="overflow-x-auto">
        <TableShell
          tableClassName="w-full text-left"
          columns={columns}
          data={items}
          getRowId={(row) => `${row.sku}-${row.productName}`}
          emptyState="Belum ada item."
          headerRowClassName="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700"
          rowClassName="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        />
      </div>
      {footer}
    </div>
  );
}
