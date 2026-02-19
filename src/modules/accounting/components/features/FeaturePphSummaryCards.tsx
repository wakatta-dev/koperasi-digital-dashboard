/** @format */

import { SummaryMetricsGrid } from "@/components/shared/data-display/SummaryMetricsGrid";

import type { TaxPphSummaryCard } from "../../types/tax";

type FeaturePphSummaryCardsProps = {
  cards: TaxPphSummaryCard[];
};

export function FeaturePphSummaryCards({ cards }: FeaturePphSummaryCardsProps) {
  return (
    <SummaryMetricsGrid
      metrics={cards.map((card) => ({
        id: card.key,
        label: card.label,
        displayValue: card.value,
        helperText: (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {[card.helper_text, card.note].filter(Boolean).join(" • ")}
          </span>
        ),
      }))}
    />
  );
}
