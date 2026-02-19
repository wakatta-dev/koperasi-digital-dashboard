/** @format */

import { SummaryMetricsGrid } from "@/components/shared/data-display/SummaryMetricsGrid";

import type { VendorBillSummaryMetric } from "../../types/vendor-bills-ap";

type FeatureVendorBillsSummaryCardsProps = {
  metrics?: VendorBillSummaryMetric[];
  isLoading?: boolean;
  isError?: boolean;
};

export function FeatureVendorBillsSummaryCards({
  metrics = [],
  isLoading = false,
  isError = false,
}: FeatureVendorBillsSummaryCardsProps) {
  return (
    <SummaryMetricsGrid
      metrics={metrics.map((metric) => ({
        id: metric.key,
        label: metric.label,
        displayValue: metric.value,
        helperText: metric.helper_text,
      }))}
      isLoading={isLoading}
      isError={isError}
      emptyState={
        <div className="rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500">
          Ringkasan vendor bill belum tersedia.
        </div>
      }
    />
  );
}
