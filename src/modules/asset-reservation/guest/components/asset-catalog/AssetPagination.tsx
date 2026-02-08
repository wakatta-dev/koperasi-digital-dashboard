/** @format */

"use client";

import { Button } from "@/components/ui/button";
import type { Pagination } from "@/types/api/common";

type AssetPaginationProps = Readonly<{
  pagination?: Pagination;
  cursor?: number;
  onCursorChange: (cursor: number) => void;
}>;

function parseCursor(raw?: string) {
  if (!raw) return null;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export function AssetPagination({ pagination, cursor = 0, onCursorChange }: AssetPaginationProps) {
  if (!pagination) return null;
  const limit = pagination.limit || 9;
  const currentPage = Math.floor(cursor / limit) + 1;
  const prevCursor = parseCursor(pagination.prev_cursor);
  const nextCursor = parseCursor(pagination.next_cursor);

  return (
    <div className="md:col-span-2 mt-8 flex justify-center w-full">
      <nav
        aria-label="Pagination"
        className="flex items-center gap-2 p-2 bg-white dark:bg-surface-card-dark rounded-full shadow-sm border border-gray-100 dark:border-gray-800"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={!pagination.has_prev || prevCursor === null}
          onClick={() => prevCursor !== null && onCursorChange(prevCursor)}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <span className="material-icons-outlined">chevron_left</span>
        </Button>

        <div className="hidden md:flex items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-brand-primary text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center">
            {currentPage}
          </div>
          {pagination.has_next ? (
            <button
              type="button"
              onClick={() => nextCursor !== null && onCursorChange(nextCursor)}
              className="w-10 h-10 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors font-medium text-sm"
            >
              {currentPage + 1}
            </button>
          ) : null}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={!pagination.has_next || nextCursor === null}
          onClick={() => nextCursor !== null && onCursorChange(nextCursor)}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <span className="material-icons-outlined">chevron_right</span>
        </Button>
      </nav>
    </div>
  );
}

