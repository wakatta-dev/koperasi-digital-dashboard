/** @format */

"use client";

import type { ReactNode } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Headphones,
  Keyboard,
  Laptop,
  Monitor,
  MoreVertical,
  Mouse,
  Package,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import type { ProductListItem } from "@/modules/marketplace/types";
import { getProductStatusBadgeClass } from "@/modules/marketplace/utils/status";

export type ProductTableAction = Readonly<{
  label: string;
  onSelect: (product: ProductListItem) => void;
  tone?: "default" | "destructive";
  disabled?: boolean;
}>;

export type ProductTableProps = Readonly<{
  products: ProductListItem[];
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
  onToggleAll?: (checked: boolean) => void;
  onRowClick?: (product: ProductListItem) => void;
  getActions?: (product: ProductListItem) => ProductTableAction[];
  pagination?: TablePagePaginationMeta;
  paginationInfo?: ReactNode;
  onPageChange?: (nextPage: number) => void;
}>;

const resolveCategoryIcon = (category: string) => {
  const normalized = category.toLowerCase();
  if (normalized.includes("laptop")) return Laptop;
  if (normalized.includes("monitor")) return Monitor;
  if (normalized.includes("keyboard")) return Keyboard;
  if (normalized.includes("audio") || normalized.includes("headphone"))
    return Headphones;
  if (normalized.includes("aksesoris") || normalized.includes("mouse"))
    return Mouse;
  return Package;
};

export function ProductTable({
  products,
  selectedIds = [],
  onToggleSelect,
  onToggleAll,
  onRowClick,
  getActions,
  pagination,
  paginationInfo,
  onPageChange,
}: ProductTableProps) {
  const allSelected =
    products.length > 0 && selectedIds.length === products.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  const columns: ColumnDef<ProductListItem, unknown>[] = [
    {
      id: "select",
      header: () => (
        <Checkbox
          checked={allSelected}
          data-testid="marketplace-admin-inventory-select-all-checkbox"
          data-state={
            allSelected
              ? "checked"
              : someSelected
                ? "indeterminate"
                : "unchecked"
          }
          onCheckedChange={(value) => onToggleAll?.(Boolean(value))}
          className="rounded border-gray-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 focus-visible:ring-indigo-600/20"
        />
      ),
      meta: {
        headerClassName:
          "px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-10",
        cellClassName: "px-6 py-4",
      },
      cell: ({ row }) => (
        <div onClick={(event) => event.stopPropagation()}>
          <Checkbox
            checked={selectedIds.includes(row.original.id)}
            data-testid={`marketplace-admin-inventory-select-${row.original.id}`}
            onCheckedChange={() => onToggleSelect?.(row.original.id)}
            className="rounded border-gray-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 focus-visible:ring-indigo-600/20"
          />
        </div>
      ),
    },
    {
      id: "name",
      header: "Nama Produk",
      meta: {
        headerClassName:
          "px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider",
        cellClassName: "px-6 py-4",
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
            {row.original.thumbnailUrl ? (
              <img
                src={row.original.thumbnailUrl}
                alt={row.original.name}
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (() => {
              const Icon = resolveCategoryIcon(row.original.category);
              return <Icon className="h-5 w-5 text-gray-400" />;
            })()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {row.original.name}
            </p>
            <p className="text-xs text-gray-500">SKU: {row.original.sku}</p>
            {row.original.marketplaceLabel ? (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {row.original.marketplaceLabel}
              </p>
            ) : null}
            {row.original.sellerLabel ? (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {row.original.sellerLabel}
              </p>
            ) : null}
          </div>
        </div>
      ),
    },
    {
      id: "category",
      header: "Kategori",
      meta: {
        headerClassName:
          "px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider",
        cellClassName: "px-6 py-4 text-sm text-gray-600 dark:text-gray-300",
      },
      cell: ({ row }) => row.original.category,
    },
    {
      id: "stock",
      header: "Stok",
      meta: {
        align: "right",
        headerClassName:
          "px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right",
        cellClassName:
          "px-6 py-4 text-sm text-gray-600 dark:text-gray-300 text-right font-medium",
      },
      cell: ({ row }) => row.original.stockCount,
    },
    {
      id: "price",
      header: "Harga",
      meta: {
        align: "right",
        headerClassName:
          "px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right",
        cellClassName:
          "px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white text-right",
      },
      cell: ({ row }) => formatCurrency(row.original.price),
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
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProductStatusBadgeClass(
            row.original.status,
          )}`}
        >
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
      cell: ({ row }) => (
        <div onClick={(event) => event.stopPropagation()}>
          {getActions ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
                  type="button"
                  data-testid={`marketplace-admin-inventory-actions-${row.original.id}`}
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {getActions(row.original).map((action) => (
                  <DropdownMenuItem
                    key={action.label}
                    onClick={() => action.onSelect(row.original)}
                    disabled={action.disabled}
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
              data-testid={`marketplace-admin-inventory-actions-${row.original.id}`}
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="surface-table" data-testid="marketplace-admin-inventory-table">
      <div className="overflow-x-auto">
        <TableShell
          tableClassName="w-full text-left border-collapse"
          columns={columns}
          data={products}
          getRowId={(row) => row.id}
          rowProps={(row) => ({
            "data-testid": `marketplace-admin-inventory-row-${row.id}`,
          })}
          emptyState="Belum ada produk."
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
