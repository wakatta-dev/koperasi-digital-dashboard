/** @format */

"use client";

import {
  TrendingDown,
  TrendingUp,
  Minus,
  ShoppingBag,
  Users2,
  PackageSearch,
  ClipboardList,
} from "lucide-react";
import type { ReactElement } from "react";
import type { AnalyticsKpi } from "@/types/api";
import { formatKpiValue } from "../hooks/use-analytics";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/shared/feedback/async-states";
import { KpiGridBase } from "@/components/shared/data-display/KpiGridBase";
import type { KpiTrend } from "@/components/shared/data-display/KpiCardBase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type KpiCardsProps = {
  kpis?: AnalyticsKpi[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  lastUpdated?: string;
};

function TrendIcon({ dir }: { dir?: AnalyticsKpi["trend_direction"] }) {
  if (dir === "up") return <TrendingUp className="h-4 w-4 text-emerald-500" />;
  if (dir === "down") return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

export function KpiCards({
  kpis,
  isLoading,
  isError,
  onRetry,
  lastUpdated,
}: KpiCardsProps) {
  if (isLoading) {
    return (
      <div role="status">
        <LoadingState lines={4} />
      </div>
    );
  }

  if (isError) {
    return <ErrorState onRetry={onRetry} />;
  }

  if (!kpis?.length) {
    return (
      <EmptyState
        description="Tambahkan transaksi atau ubah rentang tanggal untuk melihat data."
        onRetry={onRetry}
      />
    );
  }

  const iconMap: Record<AnalyticsKpi["id"], ReactElement> = {
    sales_today: (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white shadow">
        <ShoppingBag className="h-5 w-5" />
      </div>
    ),
    transactions_today: (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-white shadow">
        <Users2 className="h-5 w-5" />
      </div>
    ),
    active_orders: (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500 text-white shadow">
        <ClipboardList className="h-5 w-5" />
      </div>
    ),
    low_stock_count: (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-white shadow">
        <PackageSearch className="h-5 w-5" />
      </div>
    ),
  };

  return (
    <div className="space-y-2">
      <KpiGridBase
        items={kpis.map((kpi) => {
          const trendDirection: KpiTrend["direction"] =
            kpi.trend_direction === "down"
              ? "down"
              : kpi.trend_direction === "up"
              ? "up"
              : "neutral";
          return {
            id: kpi.id,
            label: kpi.label,
            value: formatKpiValue(kpi),
            icon: iconMap[kpi.id],
            trend:
              typeof kpi.trend_delta_pct === "number"
                ? {
                    direction: trendDirection,
                    label: `${trendDirection === "down" ? "-" : "+"}${kpi.trend_delta_pct}% dari sebelumnya`,
                  }
                : undefined,
            footer: (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Periode: {kpi.timeframe}</span>
                <TrendIcon dir={kpi.trend_direction} />
              </div>
            ),
          };
        })}
        columns={{ md: 2, xl: 4 }}
        trendSlot={(trend) =>
          trend?.label ? (
            <span
              className={
                trend.direction === "down"
                  ? "text-xs font-medium text-red-500"
                  : "text-xs font-medium text-emerald-600"
              }
            >
              {trend.label}
            </span>
          ) : null
        }
      />
      {lastUpdated ? (
        <p className="text-xs text-muted-foreground" aria-live="polite">
          Terakhir diperbarui: {new Date(lastUpdated).toLocaleString("id-ID")}
        </p>
      ) : null}
    </div>
  );
}

export function KpiCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <Card key={idx} className="border border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="h-4 w-24" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="mt-2 h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
