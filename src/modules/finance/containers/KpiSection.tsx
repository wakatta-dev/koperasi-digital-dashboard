/** @format */

"use client";

import { useEffect, useMemo, useRef } from "react";
import { KpiCards } from "@/components/shared/data-display/KpiCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinanceSummary } from "../hooks/useFinanceSummary";
import { renderSalesKpiTrend, toSalesKpiItems } from "../lib/kpi-items";
import type { FinanceQuery } from "../types";

type Props = {
  params: FinanceQuery;
  rangeLabel?: string;
};

export function KpiSection({ params, rangeLabel }: Props) {
  const timerRef = useRef<number | null>(null);
  const query = useFinanceSummary(params, { enabled: true });

  // Observability: measure load duration
  useEffect(() => {
    if (query.isFetching) {
      timerRef.current = performance.now();
    }
  }, [query.isFetching]);

  useEffect(() => {
    if (
      !query.isFetching &&
      (query.isSuccess || query.isError) &&
      timerRef.current !== null
    ) {
      const durationMs = performance.now() - timerRef.current;
      console.info("telemetry:finance_summary_load", {
        success: query.isSuccess,
        durationMs: Math.round(durationMs),
        preset: params.preset,
        start: params.start,
        end: params.end,
      });
      timerRef.current = null;
    }
  }, [
    query.isFetching,
    query.isSuccess,
    query.isError,
    params.end,
    params.preset,
    params.start,
  ]);

  const lastUpdated = useMemo(
    () => query.data?.kpis?.last_updated ?? query.data?.range?.display_label,
    [query.data]
  );
  const items = useMemo(
    () => (query.data?.kpis ? toSalesKpiItems(query.data.kpis) : []),
    [query.data?.kpis],
  );

  return (
    <Card className="border border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Ringkasan Penjualan
          </CardTitle>
          {rangeLabel ? (
            <span className="text-xs text-muted-foreground">
              Periode: {rangeLabel}
            </span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        <KpiCards
          items={items}
          isLoading={query.isLoading || query.isFetching}
          isError={query.isError}
          onRetry={() => query.refetch()}
          columns={{ md: 2, xl: 3 }}
          trendSlot={renderSalesKpiTrend}
          emptyState={
            <div className="rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500">
              Sesuaikan rentang tanggal atau ekspor setelah data tersedia.
            </div>
          }
          lastUpdated={lastUpdated}
        />
      </CardContent>
    </Card>
  );
}
