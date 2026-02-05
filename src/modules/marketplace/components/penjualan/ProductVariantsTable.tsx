/** @format */

"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";
import type { ProductVariant } from "@/modules/marketplace/types";

export type ProductVariantsTableProps = Readonly<{
  variants: ProductVariant[];
  onAddVariant?: () => void;
  onEditVariant?: (variant: ProductVariant) => void;
}>;

export function ProductVariantsTable({
  variants,
  onAddVariant,
  onEditVariant,
}: ProductVariantsTableProps) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900 dark:text-white">Varian & Harga</h3>
        <Button
          type="button"
          variant="ghost"
          onClick={onAddVariant}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Tambah Varian
        </Button>
      </div>
      <Table className="w-full text-left">
        <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
          <TableRow>
            <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Varian
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-right">
              SKU
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-right">
              Stok
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-right">
              Harga
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
          {variants.map((variant) => (
            <TableRow key={variant.sku} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <TableCell className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-white">
                {variant.name}
              </TableCell>
              <TableCell className="px-6 py-3 text-sm text-gray-500 dark:text-gray-400 text-right">
                {variant.sku}
              </TableCell>
              <TableCell className="px-6 py-3 text-sm text-gray-900 dark:text-white text-right">
                {variant.stock}
              </TableCell>
              <TableCell className="px-6 py-3 text-sm text-gray-900 dark:text-white text-right">
                {formatCurrency(variant.price)}
              </TableCell>
              <TableCell className="px-6 py-3 text-right">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onEditVariant?.(variant)}
                  className="text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
