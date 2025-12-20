/** @format */

import type { ReactNode } from "react";

import { KpiCardBase, type KpiItem } from "./KpiCardBase";

type KpiGridBaseProps = {
  items: KpiItem[];
  isLoading?: boolean;
  isError?: boolean;
  emptyState?: ReactNode;
  errorState?: ReactNode;
  loadingState?: ReactNode;
  columns?: { md?: number; xl?: number };
  trendSlot?: (trend: KpiItem["trend"]) => ReactNode;
  footerSlot?: (item: KpiItem) => ReactNode;
};

export function KpiGridBase({
  items,
  isLoading,
  isError,
  emptyState,
  errorState,
  loadingState,
  columns = { md: 2, xl: 3 },
  trendSlot,
  footerSlot,
}: KpiGridBaseProps) {
  if (isLoading) {
    return loadingState ?? null;
  }

  if (isError) {
    return errorState ?? null;
  }

  if (!items.length) {
    return emptyState ?? null;
  }

  const colClass = getGridClass(columns.md, columns.xl);

  return (
    <div className={`grid gap-4 ${colClass}`}>
      {items.map((item) => (
        <KpiCardBase
          key={item.id}
          item={{ ...item, footer: item.footer ?? footerSlot?.(item) }}
          trendSlot={trendSlot}
        />
      ))}
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
      : "md:grid-cols-2";

  const xlClass =
    xl === 2
      ? "xl:grid-cols-2"
      : xl === 3
      ? "xl:grid-cols-3"
      : xl === 5
      ? "xl:grid-cols-5"
      : "xl:grid-cols-4";

  return `${mdClass} ${xlClass}`;
}
