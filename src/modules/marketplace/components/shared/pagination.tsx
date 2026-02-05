/** @format */

import { Button } from "@/components/ui/button";

type Props = {
  total: number;
  limit: number;
  offset: number;
  hasNext: boolean;
  hasPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
  isLoading?: boolean;
};

export function Pagination({ total, limit, offset, hasNext, hasPrev, onNext, onPrev, isLoading }: Props) {
  if (total <= limit) return null;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="mt-12 flex justify-center items-center gap-4 text-sm text-muted-foreground">
      <Button
        type="button"
        variant="outline"
        className="px-3 py-2 rounded-lg border-border hover:bg-muted disabled:opacity-50"
        onClick={onPrev}
        disabled={!hasPrev || isLoading}
      >
        <span className="material-icons-outlined text-sm align-middle mr-1">chevron_left</span>
        Sebelumnya
      </Button>
      <span>
        Halaman {currentPage} / {totalPages}
      </span>
      <Button
        type="button"
        variant="outline"
        className="px-3 py-2 rounded-lg border-border hover:bg-muted disabled:opacity-50"
        onClick={onNext}
        disabled={!hasNext || isLoading}
      >
        Berikutnya
        <span className="material-icons-outlined text-sm align-middle ml-1">chevron_right</span>
      </Button>
    </div>
  );
}
