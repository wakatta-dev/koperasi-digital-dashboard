/** @format */

"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Mail, MoreVertical, Phone, ChevronsUpDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableShell } from "@/components/shared/data-display/TableShell";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CustomerListItem } from "@/modules/marketplace/types";
import {
  getCustomerStatusBadgeClass,
  getCustomerStatusDotClass,
} from "@/modules/marketplace/utils/status";

export type CustomerAction = Readonly<{
  label: string;
  tone?: "destructive";
  disabled?: boolean;
  onSelect: () => void;
}>;

export type CustomerTableProps = Readonly<{
  customers: CustomerListItem[];
  onRowClick?: (customer: CustomerListItem) => void;
  getActions?: (customer: CustomerListItem) => CustomerAction[];
}>;

const AVATAR_STYLES = [
  "bg-blue-100 text-blue-600",
  "bg-purple-100 text-purple-600",
  "bg-orange-100 text-orange-600",
  "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  "bg-teal-100 text-teal-600",
];

const formatAverageSpend = (value: number) => {
  if (!Number.isFinite(value)) return "Rp 0";
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    const label = millions.toFixed(1).replace(/\.0$/, "");
    return `Rp ${label}jt`;
  }
  if (value >= 1_000) {
    const thousands = Math.round(value / 1_000);
    return `Rp ${thousands}rb`;
  }
  return `Rp ${Math.round(value)}`;
};

const formatOrderCountLabel = (count: number) => {
  if (count === 1) return "1 Order";
  return `${count} Orders`;
};

export function CustomerTable({
  customers,
  onRowClick,
  getActions,
}: CustomerTableProps) {
  const columns: ColumnDef<CustomerListItem, unknown>[] = [
    {
      id: "name",
      header: () => (
        <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
          Nama Pelanggan
          <ChevronsUpDown className="h-3.5 w-3.5 text-gray-400" />
        </div>
      ),
      meta: {
        headerClassName:
          "px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider",
        cellClassName: "px-6 py-4",
      },
      cell: ({ row, table }) => {
        const index = table.getRowModel().rows.findIndex((item) => item.id === row.id);
        return (
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm",
                AVATAR_STYLES[index % AVATAR_STYLES.length],
              )}
            >
              {row.original.initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {row.original.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Member sejak: {row.original.memberSince}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      id: "contact",
      header: "Kontak Info",
      meta: {
        headerClassName:
          "px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider",
        cellClassName: "px-6 py-4",
      },
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Mail className="h-4 w-4 text-gray-400" />
            <span>{row.original.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Phone className="h-4 w-4 text-gray-400" />
            <span>{row.original.phone}</span>
          </div>
        </div>
      ),
    },
    {
      id: "totalOrders",
      header: "Total Pesanan",
      meta: {
        align: "center",
        headerClassName:
          "px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center",
        cellClassName: "px-6 py-4 text-center",
      },
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
        >
          {formatOrderCountLabel(row.original.totalOrders)}
        </Badge>
      ),
    },
    {
      id: "totalSpend",
      header: () => (
        <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
          Total Belanja
          <ChevronsUpDown className="h-3.5 w-3.5 text-gray-400" />
        </div>
      ),
      meta: {
        align: "right",
        headerClassName:
          "px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right",
        cellClassName: "px-6 py-4 text-right",
      },
      cell: ({ row }) => (
        <>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {formatCurrency(row.original.totalSpend)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Avg: {formatAverageSpend(row.original.avgSpend)}
          </p>
        </>
      ),
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
          variant="outline"
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
            getCustomerStatusBadgeClass(row.original.status),
          )}
        >
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              getCustomerStatusDotClass(row.original.status),
            )}
          />
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      meta: {
        align: "right",
        headerClassName:
          "px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right",
        cellClassName: "px-6 py-4 text-right",
      },
      cell: ({ row }) => {
        const actions = getActions?.(row.original) ?? [];
        return (
          <div onClick={(event) => event.stopPropagation()}>
            {actions.length > 0 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-indigo-600 transition-colors p-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {actions.map((action) => (
                    <DropdownMenuItem
                      key={action.label}
                      onClick={() => action.onSelect()}
                      disabled={action.disabled}
                      variant={
                        action.tone === "destructive" ? "destructive" : "default"
                      }
                    >
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-300"
                disabled
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="surface-table">
      <div className="overflow-x-auto">
        <TableShell
          tableClassName="w-full text-left border-collapse"
          columns={columns}
          data={customers}
          getRowId={(row) => row.id}
          emptyState="Belum ada pelanggan."
          headerRowClassName="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700"
          rowClassName={cn(
            "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group",
            onRowClick ? "cursor-pointer" : "",
          )}
          onRowClick={onRowClick}
        />
      </div>
    </div>
  );
}
