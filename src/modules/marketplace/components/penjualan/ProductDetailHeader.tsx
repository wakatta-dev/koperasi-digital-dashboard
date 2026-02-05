/** @format */

"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ProductStatus } from "@/modules/marketplace/types";
import { getProductStatusBadgeClass } from "@/modules/marketplace/utils/status";

export type ProductDetailHeaderProps = Readonly<{
  name: string;
  sku: string;
  status: ProductStatus;
  onDelete?: () => void;
  onEdit?: () => void;
}>;

export function ProductDetailHeader({
  name,
  sku,
  status,
  onDelete,
  onEdit,
}: ProductDetailHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{name}</h2>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-sm text-gray-500 dark:text-gray-400">SKU: {sku}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
          <Badge
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProductStatusBadgeClass(
              status
            )}`}
          >
            {status}
          </Badge>
        </div>
      </div>
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onDelete}
          className="px-4 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
        <Button
          type="button"
          onClick={onEdit}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm text-sm font-medium"
        >
          <Pencil className="h-4 w-4" />
          <span>Edit Produk</span>
        </Button>
      </div>
    </div>
  );
}
