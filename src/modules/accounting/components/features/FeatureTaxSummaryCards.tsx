/** @format */

import { SummaryMetricsGrid } from "@/components/shared/data-display/SummaryMetricsGrid";

import type { TaxSummaryMetricCard } from "../../types/tax";

type FeatureTaxSummaryCardsProps = {
  cards: TaxSummaryMetricCard[];
};

export function FeatureTaxSummaryCards({ cards }: FeatureTaxSummaryCardsProps) {
  return (
    <SummaryMetricsGrid
      metrics={cards.map((card) => ({
        id: card.key,
        label: card.label,
        displayValue: card.value,
        helperText: card.helper_text,
      }))}
    />
  );
}
