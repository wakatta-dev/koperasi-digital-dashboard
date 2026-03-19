/** @format */

import {
  ArrowDown,
  ArrowUp,
  CreditCard,
  ShoppingCart,
  Users,
} from "lucide-react";

import type { KpiItem } from "@/components/shared/data-display/KpiCards";

import { formatInteger, formatRupiah } from "./formatters";
import type { SalesKpi } from "../types";

function renderTrendLabel(direction?: SalesKpi["delta_direction"], label?: string) {
  if (!label) return null;

  const Icon = direction === "down" ? ArrowDown : direction === "up" ? ArrowUp : null;
  const color =
    direction === "down"
      ? "text-red-500 bg-red-50 dark:bg-red-500/10"
      : direction === "up"
      ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10"
      : "text-muted-foreground bg-muted/30";

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${color}`}
    >
      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
      <span>{label}</span>
    </div>
  );
}

export function toSalesKpiItems(kpis: SalesKpi): KpiItem[] {
  const trendDirection =
    kpis.delta_direction === "down"
      ? "down"
      : kpis.delta_direction === "up"
      ? "up"
      : "neutral";

  return [
    {
      id: "total_revenue",
      label: "Omzet Total",
      value: formatRupiah(kpis.total_revenue),
      icon: (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white shadow">
          <CreditCard className="h-5 w-5" />
        </div>
      ),
      trend: {
        direction: trendDirection,
        label: kpis.delta_label,
      },
      footer: (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Periode</span>
          {trendDirection !== "neutral" ? (
            <span>{trendDirection === "down" ? "Menurun" : "Naik"}</span>
          ) : null}
        </div>
      ),
    },
    {
      id: "transaction_count",
      label: "Jumlah Transaksi",
      value: formatInteger(kpis.transaction_count),
      icon: (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white shadow">
          <ShoppingCart className="h-5 w-5" />
        </div>
      ),
      trend: {
        direction: trendDirection,
        label: kpis.delta_label,
      },
      footer: (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Periode</span>
          {trendDirection !== "neutral" ? (
            <span>{trendDirection === "down" ? "Menurun" : "Naik"}</span>
          ) : null}
        </div>
      ),
    },
    {
      id: "average_ticket",
      label: "Rata-rata Transaksi",
      value: formatRupiah(kpis.average_ticket),
      icon: (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white shadow">
          <Users className="h-5 w-5" />
        </div>
      ),
      trend: {
        direction: trendDirection,
        label: kpis.delta_label,
      },
      footer: (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Periode</span>
          {trendDirection !== "neutral" ? (
            <span>{trendDirection === "down" ? "Menurun" : "Naik"}</span>
          ) : null}
        </div>
      ),
    },
  ];
}

export function renderSalesKpiTrend(trend: KpiItem["trend"]) {
  return renderTrendLabel(
    trend?.direction === "down"
      ? "down"
      : trend?.direction === "up"
      ? "up"
      : undefined,
    trend?.label,
  );
}
