/** @format */

import type { ReactNode } from "react";

import { KpiGridBase, type KpiItem } from "@/components/shared/data-display/KpiGridBase";

export type SummaryMetricItem = {
  id: string;
  label: string;
  displayValue: string;
  value?: number;
  trend?: { direction: "up" | "down" | "neutral"; text: string };
  helperText?: ReactNode;
  icon?: KpiItem["icon"];
  tone?: KpiItem["tone"];
  showAccent?: KpiItem["showAccent"];
  iconContainerClassName?: KpiItem["iconContainerClassName"];
};

type SummaryMetricsGridProps = {
  metrics: SummaryMetricItem[];
  isLoading?: boolean;
  isError?: boolean;
  emptyState?: ReactNode;
  errorState?: ReactNode;
  loadingState?: ReactNode;
  columns?: { md?: number; xl?: number };
};

export function SummaryMetricsGrid({
  metrics,
  isLoading,
  isError,
  emptyState,
  errorState,
  loadingState,
  columns = { md: 2, xl: 4 },
}: SummaryMetricsGridProps) {
  return (
    <KpiGridBase
      items={metrics.map((metric) => ({
        id: metric.id,
        label: metric.label,
        value: metric.displayValue,
        icon: metric.icon,
        tone: metric.tone,
        showAccent: metric.showAccent,
        iconContainerClassName: metric.iconContainerClassName,
        trend: metric.trend
          ? {
              direction: metric.trend.direction,
              label: metric.trend.text,
            }
          : undefined,
        footer: metric.helperText ? (
          <div className="text-xs text-muted-foreground">{metric.helperText}</div>
        ) : undefined,
      }))}
      isLoading={isLoading}
      isError={isError}
      emptyState={emptyState}
      errorState={errorState}
      loadingState={loadingState}
      columns={columns}
    />
  );
}
