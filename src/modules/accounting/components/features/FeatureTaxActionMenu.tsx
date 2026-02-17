/** @format */

"use client";

import { Copy, Eye, MoreVertical, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { TaxRow } from "../../types/settings";

type FeatureTaxActionMenuProps = {
  tax: TaxRow;
  onEdit?: (tax: TaxRow) => void;
  onViewDetail?: (tax: TaxRow) => void;
  onDuplicate?: (tax: TaxRow) => void;
  onDelete?: (tax: TaxRow) => void;
};

export function FeatureTaxActionMenu({
  tax,
  onEdit,
  onViewDetail,
  onDuplicate,
  onDelete,
}: FeatureTaxActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open tax actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onEdit?.(tax)}>
          <Pencil className="h-4 w-4" />
          Edit Pajak
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onViewDetail?.(tax)}>
          <Eye className="h-4 w-4" />
          Lihat Detail
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDuplicate?.(tax)}>
          <Copy className="h-4 w-4" />
          Duplikasi
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => onDelete?.(tax)}>
          <Trash2 className="h-4 w-4" />
          Hapus
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

