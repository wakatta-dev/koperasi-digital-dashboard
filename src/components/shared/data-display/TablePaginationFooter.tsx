/** @format */

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type TablePaginationFooterProps = {
  page: number;
  totalPages: number;
  canPrevious: boolean;
  canNext: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  summary: ReactNode;
  previousLabel?: string;
  nextLabel?: string;
  className?: string;
};

export function TablePaginationFooter({
  page,
  totalPages,
  canPrevious,
  canNext,
  onPrevious,
  onNext,
  summary,
  previousLabel = "Previous",
  nextLabel = "Next",
  className,
}: TablePaginationFooterProps) {
  return (
    <div className={className}>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {summary}
        <span className="sr-only">
          {` Page ${page} of ${Math.max(1, totalPages)}.`}
        </span>
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={!canPrevious}
          className="h-8 border-gray-200 px-3 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          onClick={onPrevious}
        >
          {previousLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!canNext}
          className="h-8 border-gray-200 px-3 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          onClick={onNext}
        >
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}
