/** @format */

import { SummaryMetricsGrid } from "@/components/shared/data-display/SummaryMetricsGrid";

export type InvoiceSummaryMetricItem = {
  id: string;
  label: string;
  displayValue: string;
  helperText?: string;
};

type FeatureInvoiceSummaryCardsProps = {
  metrics?: InvoiceSummaryMetricItem[];
  isLoading?: boolean;
  isError?: boolean;
};

export function FeatureInvoiceSummaryCards({
  metrics = [],
  isLoading = false,
  isError = false,
}: FeatureInvoiceSummaryCardsProps) {
  return (
    <SummaryMetricsGrid
      metrics={metrics}
      isLoading={isLoading}
      isError={isError}
      emptyState={
        <div className="rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500">
          Invoice summary belum tersedia.
        </div>
      }
    />
  );
}
