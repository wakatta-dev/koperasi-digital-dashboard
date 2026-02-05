/** @format */

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ProductPaginationProps = Readonly<{
  page: number;
  totalPages: number;
  from: number;
  to: number;
  total: number;
  onPageChange: (page: number) => void;
}>;

export function ProductPagination({
  page,
  totalPages,
  from,
  to,
  total,
  onPageChange,
}: ProductPaginationProps) {
  const pages = Array.from(
    { length: Math.min(totalPages, 3) },
    (_, idx) => idx + 1
  );

  return (
    <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Menampilkan{" "}
        <span className="font-semibold text-gray-900 dark:text-white">{from}</span>{" "}
        sampai{" "}
        <span className="font-semibold text-gray-900 dark:text-white">{to}</span>{" "}
        dari{" "}
        <span className="font-semibold text-gray-900 dark:text-white">{total}</span> produk
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {pages.map((value) => (
          <Button
            key={value}
            type="button"
            variant="outline"
            onClick={() => onPageChange(value)}
            className={
              value === page
                ? "px-3 py-1 rounded-lg bg-indigo-600 text-white text-sm font-medium border border-indigo-600"
                : "px-3 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium border border-transparent"
            }
          >
            {value}
          </Button>
        ))}
        {totalPages > 4 && <span className="text-gray-400">...</span>}
        {totalPages > 4 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium border border-transparent"
          >
            {totalPages}
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
