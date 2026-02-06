/** @format */

"use client";

import { Image as ImageIcon, Pencil, Trash2 } from "lucide-react";
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
  onUploadVariantImage?: (variant: ProductVariant, file: File) => void;
  onDeleteVariantImage?: (variant: ProductVariant) => void;
  uploadingVariantId?: number | null;
}>;

export function ProductVariantsTable({
  variants,
  onAddVariant,
  onEditVariant,
  onUploadVariantImage,
  onDeleteVariantImage,
  uploadingVariantId,
}: ProductVariantsTableProps) {
  return (
    <div className="surface-table">
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
            <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-center w-24">
              Gambar
            </TableHead>
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
              <TableCell className="px-6 py-3 text-center">
                <div className="relative inline-flex">
                  <label
                    htmlFor={`detail-variant-image-${variant.optionId ?? variant.sku}`}
                    className="w-12 h-12 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-800 cursor-pointer hover:border-indigo-600 transition-colors overflow-hidden"
                  >
                    {variant.imageUrl ? (
                      <img
                        src={variant.imageUrl}
                        alt={variant.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </label>
                  <input
                    id={`detail-variant-image-${variant.optionId ?? variant.sku}`}
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file && onUploadVariantImage) {
                        onUploadVariantImage(variant, file);
                      }
                      event.currentTarget.value = "";
                    }}
                    disabled={uploadingVariantId === variant.optionId}
                  />
                  {variant.imageUrl && onDeleteVariantImage ? (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => onDeleteVariantImage(variant)}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white text-red-500 shadow-sm hover:bg-red-50"
                      disabled={uploadingVariantId === variant.optionId}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  ) : null}
                </div>
              </TableCell>
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
