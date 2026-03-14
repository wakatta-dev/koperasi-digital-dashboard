/** @format */

"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Image as ImageIcon, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableShell } from "@/components/shared/data-display/TableShell";
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
  const columns: ColumnDef<ProductVariant, unknown>[] = [
    {
      id: "image",
      header: "Gambar",
      meta: {
        align: "center",
        headerClassName:
          "px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-center w-24",
        cellClassName: "px-6 py-3 text-center",
      },
      cell: ({ row }) => (
        <div className="relative inline-flex">
          <label
            htmlFor={`detail-variant-image-${row.original.optionId ?? row.original.sku}`}
            className="w-12 h-12 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-800 cursor-pointer hover:border-indigo-600 transition-colors overflow-hidden"
          >
            {row.original.imageUrl ? (
              <img
                src={row.original.imageUrl}
                alt={row.original.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageIcon className="h-5 w-5 text-gray-400" />
            )}
          </label>
          <input
            id={`detail-variant-image-${row.original.optionId ?? row.original.sku}`}
            type="file"
            className="hidden"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file && onUploadVariantImage) {
                onUploadVariantImage(row.original, file);
              }
              event.currentTarget.value = "";
            }}
            disabled={uploadingVariantId === row.original.optionId}
          />
          {row.original.imageUrl && onDeleteVariantImage ? (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => onDeleteVariantImage(row.original)}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white text-red-500 shadow-sm hover:bg-red-50"
              disabled={uploadingVariantId === row.original.optionId}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          ) : null}
        </div>
      ),
    },
    {
      id: "variant",
      header: "Varian",
      meta: {
        headerClassName:
          "px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase",
        cellClassName:
          "px-6 py-3 text-sm font-medium text-gray-900 dark:text-white",
      },
      cell: ({ row }) => row.original.name,
    },
    {
      id: "sku",
      header: "SKU",
      meta: {
        align: "right",
        headerClassName:
          "px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-right",
        cellClassName:
          "px-6 py-3 text-sm text-gray-500 dark:text-gray-400 text-right",
      },
      cell: ({ row }) => row.original.sku,
    },
    {
      id: "stock",
      header: "Stok",
      meta: {
        align: "right",
        headerClassName:
          "px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-right",
        cellClassName:
          "px-6 py-3 text-sm text-gray-900 dark:text-white text-right",
      },
      cell: ({ row }) => row.original.stock,
    },
    {
      id: "price",
      header: "Harga",
      meta: {
        align: "right",
        headerClassName:
          "px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-right",
        cellClassName:
          "px-6 py-3 text-sm text-gray-900 dark:text-white text-right",
      },
      cell: ({ row }) => formatCurrency(row.original.price),
    },
    {
      id: "actions",
      header: "",
      meta: {
        align: "right",
        headerClassName:
          "px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-right",
        cellClassName: "px-6 py-3 text-right",
      },
      cell: ({ row }) => (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onEditVariant?.(row.original)}
          className="text-gray-400 hover:text-indigo-600 transition-colors"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="surface-table">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Varian & Harga
        </h3>
        <Button
          type="button"
          variant="ghost"
          onClick={onAddVariant}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Tambah Varian
        </Button>
      </div>
      <TableShell
        tableClassName="w-full text-left"
        columns={columns}
        data={variants}
        getRowId={(row) => row.sku}
        emptyState="Belum ada varian."
        headerClassName="bg-gray-50 dark:bg-gray-800/50"
        rowClassName="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      />
    </div>
  );
}
