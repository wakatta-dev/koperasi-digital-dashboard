/** @format */

"use client";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ProductListItem } from "@/modules/marketplace/types";
import { getProductStatusBadgeClass } from "@/modules/marketplace/utils/status";
import { formatCurrency } from "@/lib/format";

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
}>;

const resolveCategoryIcon = (category: string) => {
  const normalized = category.toLowerCase();
  if (normalized.includes("laptop")) return Laptop;
  if (normalized.includes("monitor")) return Monitor;
  if (normalized.includes("keyboard")) return Keyboard;
  if (normalized.includes("audio") || normalized.includes("headphone")) return Headphones;
  if (normalized.includes("aksesoris") || normalized.includes("mouse")) return Mouse;
  return Package;
};

export function ProductTable({
  products,
  selectedIds = [],
  onToggleSelect,
  onToggleAll,
  onRowClick,
  getActions,
}: ProductTableProps) {
  const allSelected = products.length > 0 && selectedIds.length === products.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  return (
    <div className="surface-table">
      <div className="overflow-x-auto">
        <Table className="w-full text-left border-collapse">
          <TableHeader>
            <TableRow className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-10">
                <Checkbox
                  checked={allSelected}
                  data-state={allSelected ? "checked" : someSelected ? "indeterminate" : "unchecked"}
                  onCheckedChange={(value) => onToggleAll?.(Boolean(value))}
                  className="rounded border-gray-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 focus-visible:ring-indigo-600/20"
                />
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Nama Produk
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Kategori
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                Stok
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                Harga
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">
                Status
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
            {products.map((product) => (
              <TableRow
                key={product.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                onClick={() => onRowClick?.(product)}
              >
                <TableCell
                  className="px-6 py-4"
                  onClick={(event) => event.stopPropagation()}
                >
                  <Checkbox
                    checked={selectedIds.includes(product.id)}
                    onCheckedChange={() => onToggleSelect?.(product.id)}
                    className="rounded border-gray-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 focus-visible:ring-indigo-600/20"
                  />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                      {product.thumbnailUrl ? (
                        <img
                          src={product.thumbnailUrl}
                          alt={product.name}
                          className="h-full w-full rounded-lg object-cover"
                        />
                      ) : (
                        (() => {
                          const Icon = resolveCategoryIcon(product.category);
                          return <Icon className="h-5 w-5 text-gray-400" />;
                        })()
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {product.category}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 text-right font-medium">
                  {product.stockCount}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white text-right">
                  {formatCurrency(product.price)}
                </TableCell>
                <TableCell className="px-6 py-4 text-center">
                  <Badge
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProductStatusBadgeClass(
                      product.status
                    )}`}
                  >
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell
                  className="px-6 py-4 text-right"
                  onClick={(event) => event.stopPropagation()}
                >
                  {getActions ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
                          type="button"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        {getActions(product).map((action) => (
                          <DropdownMenuItem
                            key={action.label}
                            onClick={(event) => {
                              event.stopPropagation();
                              action.onSelect(product);
                            }}
                            disabled={action.disabled}
                            className={
                              action.tone === "destructive" ? "text-red-600 focus:text-red-600" : ""
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
                      onClick={(event) => event.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
