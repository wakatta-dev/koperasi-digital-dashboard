/** @format */

import type { ReactNode } from "react";

import { KpiGridBase } from "@/components/shared/data-display/KpiGridBase";

export type SummaryMetricItem = {
  id: string;
  label: string;
  displayValue: string;
  value?: number;
  trend?: { direction: "up" | "down" | "neutral"; text: string };
  helperText?: ReactNode;
};

type SummaryMetricsGridProps = {
  metrics: SummaryMetricItem[];
  isLoading?: boolean;
  isError?: boolean;
  emptyState?: ReactNode;
  errorState?: ReactNode;
  loadingState?: ReactNode;
};

export function SummaryMetricsGrid({
  metrics,
  isLoading,
  isError,
  emptyState,
  errorState,
  loadingState,
}: SummaryMetricsGridProps) {
  return (
    <KpiGridBase
      items={metrics.map((metric) => ({
        id: metric.id,
        label: metric.label,
        value: metric.displayValue,
        caption: metric.helperText,
        trend: metric.trend,
      }))}
      isLoading={isLoading}
      isError={isError}
      emptyState={emptyState}
      errorState={errorState}
      loadingState={loadingState}
    />
  );
}
