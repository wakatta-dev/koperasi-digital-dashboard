/** @format */

"use client";

import { useMemo, useState } from "react";
import { DateRangeSelector } from "@/modules/dashboard/analytics/components/date-range";
import { KpiCards } from "@/modules/dashboard/analytics/components/kpi-cards";
import { OverviewChart } from "@/modules/dashboard/analytics/components/overview-chart";
import { TopProductsTable } from "@/modules/dashboard/analytics/components/top-products";
import { NotificationsPanel } from "@/modules/dashboard/analytics/components/notifications";
import { QuickActions } from "@/modules/dashboard/analytics/components/quick-actions";
import { useAnalytics } from "@/modules/dashboard/analytics/hooks/use-analytics";
import type { AnalyticsRange } from "@/types/api";
import { Skeleton } from "@/components/ui/skeleton";
import { trackAnalyticsEvent } from "@/modules/dashboard/analytics/lib/telemetry";

export function AnalyticsDashboardPage() {
  const [range, setRange] = useState<AnalyticsRange>("today");
  const params = useMemo(() => ({ range }), [range]);
  const { data, isLoading, isError, refetch, isFetching } =
    useAnalytics(params);

  const kpis = data?.kpis;
  const overview = data?.overview?.series;
  const products = data?.top_products;
  const notifications = data?.notifications;
  const actions = data?.quick_actions;
  const lastUpdated = data?.meta?.last_updated;

  return (
    <div className="flex flex-col gap-6 bg-background-light dark:bg-background-dark p-4 sm:p-6 rounded-xl border border-border/50 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Dashboard BUMDes</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">Analytics</span>
        </div>
        <div className="flex items-center gap-2">
          {isFetching ? <Skeleton className="h-4 w-24" /> : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <DateRangeSelector
          value={range}
          onChange={(val) => {
            setRange(val);
            trackAnalyticsEvent("analytics_range_change", { range: val });
          }}
          onRefresh={() => {
            trackAnalyticsEvent("analytics_range_change", {
              range,
              refresh: true,
            });
            refetch();
          }}
        />
        <div className="text-xs text-muted-foreground">
          {lastUpdated
            ? `Pembaruan terakhir: ${new Date(lastUpdated).toLocaleString(
                "id-ID"
              )}`
            : ""}
        </div>
      </div>

      <section>
        <KpiCards
          kpis={kpis}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
          lastUpdated={lastUpdated}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <OverviewChart
            series={overview}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
          />
        </section>
        <section className="lg:col-span-1">
          <NotificationsPanel
            notifications={notifications}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
          />
          <div className="mt-4">
            <QuickActions actions={actions} />
          </div>
        </section>
      </div>

      <section>
        <TopProductsTable
          products={products}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
        />
      </section>
    </div>
  );
}
