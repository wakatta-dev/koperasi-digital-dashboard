/** @format */

"use client";

import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AnalyticsKpi } from "@/types/api";
import { formatKpiValue } from "../hooks/use-analytics";
import { EmptyState, ErrorState, LoadingState } from "./states";

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
    return <EmptyState onRetry={onRetry} />;
  }

  return (
    <div className="space-y-2">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.id} className="border border-border/60 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-semibold leading-tight">
                  {formatKpiValue(kpi)}
                </span>
                {typeof kpi.trend_delta_pct === "number" ? (
                  <span
                    className={
                      kpi.trend_direction === "down"
                        ? "text-xs text-red-500"
                        : "text-xs text-emerald-600"
                    }
                  >
                    {kpi.trend_direction === "down" ? "-" : "+"}
                    {kpi.trend_delta_pct}% dari sebelumnya
                  </span>
                ) : null}
              </div>
              <TrendIcon dir={kpi.trend_direction} />
            </CardContent>
          </Card>
        ))}
      </div>
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
