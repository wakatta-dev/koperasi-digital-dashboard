/** @format */

"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type StateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function LoadingState({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, idx) => (
        <Skeleton key={idx} className="h-4 w-full" />
      ))}
    </div>
  );
}

export function EmptyState({
  title = "Belum ada data",
  description = "Tidak ada data untuk ditampilkan.",
  onRetry,
  retryLabel = "Muat ulang",
}: StateProps) {
  return (
    <Alert>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-center gap-3">
        <span>{description}</span>
        {onRetry ? (
          <Button size="sm" variant="outline" onClick={onRetry}>
            {retryLabel}
          </Button>
        ) : null}
      </AlertDescription>
    </Alert>
  );
}

export function ErrorState({
  title = "Gagal memuat data",
  description = "Periksa koneksi atau coba lagi.",
  onRetry,
  retryLabel = "Coba lagi",
}: StateProps) {
  return (
    <Alert variant="destructive">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-center gap-3">
        <span>{description}</span>
        {onRetry ? (
          <Button size="sm" variant="secondary" onClick={onRetry}>
            {retryLabel}
          </Button>
        ) : null}
      </AlertDescription>
    </Alert>
  );
}
