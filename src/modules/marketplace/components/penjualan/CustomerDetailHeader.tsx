/** @format */

"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

export type CustomerDetailHeaderProps = Readonly<{
  onEdit?: () => void;
}>;

export function CustomerDetailHeader({ onEdit }: CustomerDetailHeaderProps) {
  return (
    <div className="flex items-center justify-end">
      <Button
        type="button"
        variant="outline"
        onClick={onEdit}
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
      >
        <Pencil className="h-4 w-4" />
        Edit Profil
      </Button>
    </div>
  );
}
