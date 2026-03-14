/** @format */

"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableShell } from "@/components/shared/data-display/TableShell";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CustomerOrderSummary } from "@/modules/marketplace/types";

export type CustomerOrdersTableProps = Readonly<{
  orders: CustomerOrderSummary[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  totalOrders: number;
  onViewOrder?: (orderId: string) => void;
}>;

const STATUS_BADGE_CLASS: Record<CustomerOrderSummary["status"], string> = {
  Selesai:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Dibatalkan: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export function CustomerOrdersTable({
  orders,
  searchValue,
  onSearchChange,
  totalOrders,
  onViewOrder,
}: CustomerOrdersTableProps) {
  const columns: ColumnDef<CustomerOrderSummary, unknown>[] = [
    {
      id: "orderId",
      header: "ID Pesanan",
      meta: {
        headerClassName:
          "px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider",
        cellClassName: "px-6 py-4 text-sm font-medium text-indigo-600",
      },
      cell: ({ row }) => row.original.orderId,
    },
    {
      id: "date",
      header: "Tanggal",
      meta: {
        headerClassName:
          "px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider",
        cellClassName: "px-6 py-4 text-sm text-gray-600 dark:text-gray-300",
      },
      cell: ({ row }) => row.original.date,
    },
    {
      id: "status",
      header: "Status",
      meta: {
        headerClassName:
          "px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider",
      },
      cell: ({ row }) => (
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            STATUS_BADGE_CLASS[row.original.status],
          )}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      id: "total",
      header: "Total",
      meta: {
        align: "right",
        headerClassName:
          "px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right",
        cellClassName:
          "px-6 py-4 text-sm font-medium text-gray-900 dark:text-white text-right",
      },
      cell: ({ row }) => formatCurrency(row.original.total),
    },
    {
      id: "action",
      header: "Aksi",
      meta: {
        align: "right",
        headerClassName:
          "px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right",
        cellClassName: "px-6 py-4 text-right",
      },
      cell: ({ row }) => (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onViewOrder?.(row.original.orderId)}
          className="text-gray-400 hover:text-indigo-600 transition-colors"
        >
          <Eye className="h-5 w-5" />
        </Button>
      ),
    },
  ];

  return (
    <div className="surface-table">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Daftar Pesanan Terbaru
        </h3>
        <div className="flex gap-2">
          <Input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Cari pesanan..."
            className="text-sm border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus-visible:ring-indigo-600/50 focus-visible:border-indigo-600 py-1.5 px-3"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <TableShell
          tableClassName="w-full text-left border-collapse"
          columns={columns}
          data={orders}
          getRowId={(row) => row.orderId}
          emptyState="Belum ada pesanan."
          headerRowClassName="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700"
          rowClassName="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        />
      </div>
      <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Menampilkan {orders.length} dari {totalOrders} pesanan
        </span>
        <button
          type="button"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          Lihat Semua Pesanan →
        </button>
      </div>
    </div>
  );
}
