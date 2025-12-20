/** @format */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/feedback/async-states";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type KpiGridItem = {
  id: string;
  label: string;
  value: string;
  icon?: ReactNode;
  trendLabel?: string;
  trendDirection?: "up" | "down" | "flat";
  subLabel?: string;
};

export type KpiGridProps = {
  items: KpiGridItem[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  footer?: ReactNode;
  skeletonCount?: number;
  className?: string;
};

export function KpiGrid({
  items,
  isLoading,
  isError,
  onRetry,
  footer,
  skeletonCount = 4,
  className,
}: KpiGridProps) {
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

  if (!items?.length) {
    return <EmptyState onRetry={onRetry} />;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((kpi) => (
          <Card
            key={kpi.id}
            className="border border-border/70 shadow-sm bg-card/80 backdrop-blur-sm"
          >
            <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-sm font-semibold text-foreground">
                  {kpi.label}
                </CardTitle>
                <div className="text-2xl font-bold">{kpi.value}</div>
                {kpi.trendLabel ? (
                  <Trend
                    label={kpi.trendLabel}
                    direction={kpi.trendDirection ?? "flat"}
                  />
                ) : null}
                {kpi.subLabel ? (
                  <div className="text-xs text-muted-foreground">{kpi.subLabel}</div>
                ) : null}
              </div>
              {kpi.icon ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow">
                  {kpi.icon}
                </div>
              ) : null}
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Periode</span>
                <TrendDot direction={kpi.trendDirection ?? "flat"} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {footer}
    </div>
  );
}

export function KpiGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, idx) => (
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

function Trend({ label, direction }: { label: string; direction: "up" | "down" | "flat" }) {
  const color =
    direction === "down"
      ? "text-red-500"
      : direction === "up"
        ? "text-emerald-600"
        : "text-muted-foreground";
  return <span className={cn("text-xs font-medium", color)}>{label}</span>;
}

function TrendDot({ direction }: { direction: "up" | "down" | "flat" }) {
  const classes =
    direction === "down"
      ? "bg-red-500"
      : direction === "up"
        ? "bg-emerald-500"
        : "bg-muted-foreground";
  return <span className={cn("inline-block h-2 w-2 rounded-full", classes)} />;
}
