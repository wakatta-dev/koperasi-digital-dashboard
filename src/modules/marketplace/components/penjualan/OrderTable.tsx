/** @format */

"use client";

import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { OrderListItem } from "@/modules/marketplace/types";
import { getOrderStatusBadgeClass } from "@/modules/marketplace/utils/status";
import { formatCurrency } from "@/lib/format";

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

export function OrderTable({ orders, onRowClick, getActions }: OrderTableProps) {
  return (
    <div className="surface-table">
      <div className="overflow-x-auto">
        <Table className="w-full text-left border-collapse">
          <TableHeader>
            <TableRow className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ID Pesanan
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Pelanggan
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tanggal
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                Total
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">
                Status
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
            {orders.map((order, index) => {
              const initials = getInitials(order.customerName);
              const avatarClass = avatarClasses[index % avatarClasses.length];
              return (
                <TableRow
                  key={order.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                  onClick={() => onRowClick?.(order)}
                >
                  <TableCell className="px-6 py-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {order.orderCode}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${avatarClass}`}
                      >
                        {initials}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {order.customerName}
                        </div>
                        <div className="text-xs text-gray-500">{order.customerEmail}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {order.date}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white text-right">
                    {formatCurrency(order.total)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <Badge
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrderStatusBadgeClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className="px-6 py-4 text-center"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {getActions ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
                            type="button"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          {getActions(order).map((action) => (
                            <DropdownMenuItem
                              key={action.label}
                              disabled={action.disabled}
                              onClick={() => action.onSelect(order)}
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
