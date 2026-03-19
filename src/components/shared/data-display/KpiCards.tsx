/** @format */

import type { ReactNode } from "react";

import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/shared/feedback/async-states";
import { cn } from "@/lib/utils";

import { KpiCardBase, type KpiItem } from "./KpiCardBase";

type KpiCardsProps = {
  items: KpiItem[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  emptyState?: ReactNode;
  errorState?: ReactNode;
  loadingState?: ReactNode;
  columns?: { md?: number; xl?: number };
  trendSlot?: (trend: KpiItem["trend"]) => ReactNode;
  lastUpdated?: string;
  className?: string;
  gridClassName?: string;
};

export function KpiCards({
  items,
  isLoading,
  isError,
  onRetry,
  emptyState,
  errorState,
  loadingState,
  columns = { md: 2, xl: 4 },
  trendSlot,
  lastUpdated,
  className,
  gridClassName,
}: KpiCardsProps) {
  if (isLoading) {
    return (
      loadingState ?? (
        <div role="status">
          <LoadingState lines={4} />
        </div>
      )
    );
  }

  if (isError) {
    return errorState ?? <ErrorState onRetry={onRetry} />;
  }

  if (!items.length) {
    return (
      emptyState ?? (
        <EmptyState
          description="Belum ada data untuk ditampilkan."
          onRetry={onRetry}
        />
      )
    );
  }

  const itemCount = Math.max(items.length, 1);
  const mdCols = Math.min(Math.max(columns.md ?? 2, 1), 5);
  const xlCols = Math.min(Math.max(columns.xl ?? 4, 1), 5);
  const colClass = getGridClass(
    Math.min(mdCols, itemCount),
    Math.min(xlCols, itemCount),
  );

  return (
    <div className={cn("space-y-2", className)}>
      <div className={cn("grid gap-4", colClass, gridClassName)}>
        {items.map((item) => {
          const card = (
            <KpiCardBase
              item={item}
              className={item.interactive ? "h-full" : undefined}
              trendSlot={trendSlot}
            />
          );

          if (!item.onClick && !item.interactive) {
            return <div key={item.id}>{card}</div>;
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              aria-label={item.ariaLabel ?? item.label}
            >
              {card}
            </button>
          );
        })}
      </div>

      {lastUpdated ? (
        <p className="text-xs text-muted-foreground" aria-live="polite">
          Terakhir diperbarui: {formatLastUpdated(lastUpdated)}
        </p>
      ) : null}
    </div>
  );
}

function getGridClass(md?: number, xl?: number) {
  const mdClass =
    md === 1
      ? "md:grid-cols-1"
      : md === 3
      ? "md:grid-cols-3"
      : md === 4
      ? "md:grid-cols-4"
      : md === 5
      ? "md:grid-cols-5"
      : "md:grid-cols-2";

  const xlClass =
    xl === 1
      ? "xl:grid-cols-1"
      : xl === 2
      ? "xl:grid-cols-2"
      : xl === 3
      ? "xl:grid-cols-3"
      : xl === 5
      ? "xl:grid-cols-5"
      : "xl:grid-cols-4";

  return `${mdClass} ${xlClass}`;
}

function formatLastUpdated(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("id-ID");
}

export type { KpiItem };
