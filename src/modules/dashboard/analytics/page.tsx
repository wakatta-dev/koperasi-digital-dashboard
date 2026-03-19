/** @format */

"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/shared/feedback/async-states";
import { KpiCards } from "@/components/shared/data-display/KpiCards";
import { DateRangeSelector } from "@/modules/dashboard/analytics/components/date-range";
import { OverviewChart } from "@/modules/dashboard/analytics/components/overview-chart";
import { TopProductsTable } from "@/modules/dashboard/analytics/components/top-products";
import { NotificationsPanel } from "@/modules/dashboard/analytics/components/notifications";
import { QuickActions } from "@/modules/dashboard/analytics/components/quick-actions";
import { useAnalytics } from "@/modules/dashboard/analytics/hooks/use-analytics";
import { toAnalyticsKpiItems } from "@/modules/dashboard/analytics/lib/kpi-items";
import type { AnalyticsRange } from "@/types/api";
import { trackAnalyticsEvent } from "@/modules/dashboard/analytics/lib/telemetry";

export function AnalyticsDashboardPage() {
  const [range, setRange] = useState<AnalyticsRange>("today");
  const params = useMemo(() => ({ range }), [range]);
  const { data, isLoading, isError, refetch } = useAnalytics(params);

  const kpiItems = useMemo(
    () => (data?.kpis ? toAnalyticsKpiItems(data.kpis) : []),
    [data?.kpis],
  );
  const overview = data?.overview?.series;
  const products = data?.top_products;
  const notifications = data?.notifications;
  const actions = data?.quick_actions;
  const lastUpdated = data?.meta?.last_updated;

  return (
    <div className="flex flex-col gap-6 bg-background-light dark:bg-background-dark">
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
                "id-ID",
              )}`
            : ""}
        </div>
      </div>

      <section>
        <KpiCards
          items={kpiItems}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
          lastUpdated={lastUpdated}
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
          emptyState={
            <EmptyState
              description="Tambahkan transaksi atau ubah rentang tanggal untuk melihat data."
              onRetry={() => refetch()}
            />
          }
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
