/** @format */

"use client";

import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ensureSuccess } from "@/lib/api";
import { formatCurrency, formatNumber } from "@/lib/format";
import type {
  AnalyticsKpi,
  AnalyticsQuery,
  AnalyticsResponseData,
  ProductPerformance,
} from "@/types/api";
import { getAnalytics } from "@/services/api";
import { QK } from "@/hooks/queries/queryKeys";
import { trackAnalyticsEvent } from "../lib/telemetry";

type MappedProduct = ProductPerformance & {
  threshold: number | null;
  low_stock: boolean;
};

export type AnalyticsViewModel = Omit<AnalyticsResponseData, "top_products" | "kpis"> & {
  top_products: MappedProduct[];
  kpis: AnalyticsKpi[];
};

function mapProducts(products: ProductPerformance[]): MappedProduct[] {
  return products.map((p) => {
    const threshold =
      typeof p.reorder_point === "number"
        ? p.reorder_point
        : typeof p.tenant_default_reorder_point === "number"
        ? p.tenant_default_reorder_point
        : null;
    const low_stock =
      threshold !== null && typeof p.stock_available === "number"
        ? p.stock_available <= threshold
        : false;
    return { ...p, threshold, low_stock };
  });
}

function fillLowStockKpi(
  kpis: AnalyticsKpi[],
  lowStockCount: number
): AnalyticsKpi[] {
  return kpis.map((kpi) =>
    kpi.id === "low_stock_count" ? { ...kpi, value: lowStockCount } : kpi
  );
}

export function mapAnalyticsDataForView(
  data: AnalyticsResponseData
): AnalyticsViewModel {
  const products = mapProducts(data.top_products);
  const lowStockCount = products.filter((p) => p.low_stock).length;
  return {
    ...data,
    top_products: products,
    kpis: fillLowStockKpi(data.kpis, lowStockCount),
  };
}

export function useAnalytics(
  params?: AnalyticsQuery,
  options?: { enabled?: boolean }
) {
  const queryKey = useMemo(
    () => QK.analytics.dashboard(params ?? {}),
    [params]
  );

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const response = mapAnalyticsDataForView(
        ensureSuccess(await getAnalytics(params))
      );

      return response;
    },
    enabled: options?.enabled ?? true,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      trackAnalyticsEvent("analytics_load_success", {
        range: params?.range ?? "today",
        last_updated: query.data.meta?.last_updated,
      });
    }
  }, [query.isSuccess, query.data, params?.range]);

  useEffect(() => {
    if (query.isError) {
      const err = query.error as any;
      trackAnalyticsEvent("analytics_load_error", {
        range: params?.range ?? "today",
        message: err?.message ?? "unknown",
      });
    }
  }, [query.isError, query.error, params?.range]);

  return query;
}

export function formatKpiValue(kpi: AnalyticsKpi): string {
  if (typeof kpi.value !== "number") return "-";
  if (kpi.currency) {
    return formatCurrency(kpi.value, {
      currency: kpi.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
  return formatNumber(kpi.value);
}
