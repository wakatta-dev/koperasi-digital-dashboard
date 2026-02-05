/** @format */

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export type OrderPaginationProps = Readonly<{
  page: number;
  totalPages: number;
  from: number;
  to: number;
  total: number;
  onPageChange: (page: number) => void;
}>;

export function OrderPagination({
  page,
  totalPages,
  from,
  to,
  total,
  onPageChange,
}: OrderPaginationProps) {
  const pages = Array.from({ length: Math.min(totalPages, 3) }, (_, idx) => idx + 1);

  return (
    <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Menampilkan{" "}
        <span className="font-semibold text-gray-900 dark:text-white">{from}</span> sampai{" "}
        <span className="font-semibold text-gray-900 dark:text-white">{to}</span> dari{" "}
        <span className="font-semibold text-gray-900 dark:text-white">{total}</span> hasil
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-500 dark:text-gray-400"
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
                ? "px-3 py-1.5 border border-indigo-600 bg-indigo-600 text-white rounded-lg text-sm font-medium"
                : "px-3 py-1.5 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-sm font-medium transition-colors"
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
            className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-sm font-medium transition-colors"
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
          className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
