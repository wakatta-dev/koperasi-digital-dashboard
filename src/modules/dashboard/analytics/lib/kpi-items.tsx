/** @format */

import {
  ClipboardList,
  Minus,
  PackageSearch,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Users2,
} from "lucide-react";
import type { ReactElement } from "react";

import type { KpiItem } from "@/components/shared/data-display/KpiCards";
import type { AnalyticsKpi } from "@/types/api";

import { formatKpiValue } from "../hooks/use-analytics";

function TrendIcon({ dir }: { dir?: AnalyticsKpi["trend_direction"] }) {
  if (dir === "up") return <TrendingUp className="h-4 w-4 text-emerald-500" />;
  if (dir === "down") return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

export function toAnalyticsKpiItems(kpis: AnalyticsKpi[]): KpiItem[] {
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

  return kpis.map((kpi) => {
    const trendDirection =
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
  });
}
