/** @format */

"use client";

import { Package } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";
import type { OrderItem } from "@/modules/marketplace/types";
import type { ReactNode } from "react";

export type OrderItemsTableProps = Readonly<{
  items: OrderItem[];
  footer?: ReactNode;
}>;

export function OrderItemsTable({ items, footer }: OrderItemsTableProps) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900 dark:text-white">Rincian Barang</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {items.length} Items
        </span>
      </div>
      <div className="overflow-x-auto">
        <Table className="w-full text-left">
          <TableHeader>
            <TableRow className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
              <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Produk
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                Harga Satuan
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">
                Qty
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                Total
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
            {items.map((item) => (
              <TableRow key={`${item.sku}-${item.productName}`} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center flex-shrink-0">
                      <Package className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.productName}
                      </p>
                      <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 text-right">
                  {formatCurrency(item.unitPrice)}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 text-center">
                  {item.qty}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white text-right">
                  {formatCurrency(item.totalPrice)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {footer}
    </div>
  );
}
