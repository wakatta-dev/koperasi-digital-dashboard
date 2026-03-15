/** @format */

"use client";

import type { ReactNode } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TableShell,
  type TablePagePaginationMeta,
} from "@/components/shared/data-display/TableShell";
import { formatCurrency } from "@/lib/format";
import type { OrderListItem } from "@/modules/marketplace/types";
import {
  getOrderStatusBadgeClass,
  getOrderStatusLabel,
} from "@/modules/marketplace/utils/status";

export type OrderTableAction = Readonly<{
  label: string;
  onSelect: (order: OrderListItem) => void;
  tone?: "default" | "destructive";
  disabled?: boolean;
}>;

export type OrderTableProps = Readonly<{
  orders: OrderListItem[];
  onRowClick?: (order: OrderListItem) => void;
  getActions?: (order: OrderListItem) => OrderTableAction[];
  pagination?: TablePagePaginationMeta;
  paginationInfo?: ReactNode;
  onPageChange?: (nextPage: number) => void;
}>;

const getInitials = (name: string) => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "-";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "-";
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
};

const avatarClasses = [
  "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700",
  "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 border-pink-200 dark:border-pink-800",
];

export function OrderTable({
  orders,
  onRowClick,
  getActions,
  pagination,
  paginationInfo,
  onPageChange,
}: OrderTableProps) {
  const columns: ColumnDef<OrderListItem, unknown>[] = [
    {
      id: "orderId",
      header: "ID Pesanan",
      meta: {
        headerClassName:
          "px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider",
        cellClassName:
          "px-6 py-4 text-sm font-medium text-indigo-600 dark:text-indigo-400",
      },
      cell: ({ row }) => row.original.orderCode,
    },
    {
      id: "customer",
      header: "Pelanggan",
      meta: {
        headerClassName:
          "px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider",
        cellClassName: "px-6 py-4",
      },
      cell: ({ row, table }) => {
        const index = table.getRowModel().rows.findIndex((item) => item.id === row.id);
        const initials = getInitials(row.original.customerName);
        const avatarClass = avatarClasses[index % avatarClasses.length];
        return (
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${avatarClass}`}
            >
              {initials}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {row.original.customerName}
              </div>
              <div className="text-xs text-gray-500">
                {row.original.customerEmail}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: "date",
      header: "Tanggal",
      meta: {
        headerClassName:
          "px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider",
        cellClassName: "px-6 py-4 text-sm text-gray-500 dark:text-gray-400",
      },
      cell: ({ row }) => row.original.date,
    },
    {
      id: "total",
      header: "Total",
      meta: {
        align: "right",
        headerClassName:
          "px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right",
        cellClassName:
          "px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white text-right",
      },
      cell: ({ row }) => formatCurrency(row.original.total),
    },
    {
      id: "status",
      header: "Status",
      meta: {
        align: "center",
        headerClassName:
          "px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center",
        cellClassName: "px-6 py-4 text-center",
      },
      cell: ({ row }) => (
        <Badge
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrderStatusBadgeClass(
            row.original.status,
          )}`}
        >
          {getOrderStatusLabel(row.original.status)}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      meta: {
        align: "center",
        headerClassName:
          "px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center",
        cellClassName: "px-6 py-4 text-center",
      },
      cell: ({ row }) => (
        <div onClick={(event) => event.stopPropagation()}>
          {getActions ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label={`Aksi pesanan ${row.original.orderCode}`}
                  className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
                  type="button"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {getActions(row.original).map((action) => (
                  <DropdownMenuItem
                    key={action.label}
                    disabled={action.disabled}
                    onClick={() => action.onSelect(row.original)}
                    className={
                      action.tone === "destructive"
                        ? "text-red-600 focus:text-red-600"
                        : ""
                    }
                  >
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
              type="button"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="surface-table" data-testid="marketplace-admin-order-table">
      <div className="overflow-x-auto">
        <TableShell
          tableClassName="w-full text-left border-collapse"
          columns={columns}
          data={orders}
          getRowId={(row) => row.id}
          rowProps={(row) => ({
            "data-testid": `marketplace-admin-order-row-${row.id}`,
          })}
          emptyState="Belum ada pesanan."
          headerRowClassName="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700"
          rowClassName="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
          onRowClick={onRowClick}
          pagination={pagination}
          paginationInfo={paginationInfo}
          onPrevPage={() =>
            pagination && onPageChange?.(Math.max(1, pagination.page - 1))
          }
          onNextPage={() =>
            pagination &&
            onPageChange?.(Math.min(pagination.totalPages, pagination.page + 1))
          }
          paginationClassName="rounded-none border-x-0 border-b-0 px-6 py-4"
          previousPageLabel="Sebelumnya"
          nextPageLabel="Berikutnya"
        />
      </div>
    </div>
  );
}
