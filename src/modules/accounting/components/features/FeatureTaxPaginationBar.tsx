/** @format */

import { Button } from "@/components/ui/button";

type FeatureTaxPaginationBarProps = {
  page: number;
  perPage: number;
  totalItems: number;
  onPageChange?: (nextPage: number) => void;
};

export function FeatureTaxPaginationBar({
  page,
  perPage,
  totalItems,
  onPageChange,
}: FeatureTaxPaginationBarProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const hasItems = totalItems > 0;
  const start = hasItems ? (page - 1) * perPage + 1 : 0;
  const end = hasItems ? Math.min(start + perPage - 1, totalItems) : 0;

  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-700">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing <span className="font-medium text-gray-900 dark:text-white">{start}</span> to{" "}
        <span className="font-medium text-gray-900 dark:text-white">{end}</span> of{" "}
        <span className="font-medium text-gray-900 dark:text-white">{totalItems}</span> results
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={page <= 1}
          className="h-8 border-gray-200 px-3 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          onClick={() => onPageChange?.(Math.max(1, page - 1))}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={page >= totalPages}
          className="h-8 border-gray-200 px-3 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
