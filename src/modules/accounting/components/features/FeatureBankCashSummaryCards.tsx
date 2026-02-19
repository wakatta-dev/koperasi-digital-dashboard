/** @format */

import { ArrowLeftRight, Coins, Wallet } from "lucide-react";

import {
  KpiGridBase,
  type KpiItem,
} from "@/components/shared/data-display/KpiGridBase";

import type { BankCashSummaryCard } from "../../types/bank-cash";

type FeatureBankCashSummaryCardsProps = {
  cards?: BankCashSummaryCard[];
};

function toneStyles(tone: BankCashSummaryCard["tone"]) {
  switch (tone) {
    case "warning":
      return {
        tone: "warning" as const,
        iconWrapper:
          "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
        icon: ArrowLeftRight,
      };
    case "success":
      return {
        tone: "success" as const,
        iconWrapper:
          "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
        icon: Coins,
      };
    default:
      return {
        tone: "primary" as const,
        iconWrapper:
          "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
        icon: Wallet,
      };
  }
}

export function FeatureBankCashSummaryCards({
  cards = [],
}: FeatureBankCashSummaryCardsProps) {
  if (cards.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900/20 dark:text-gray-300">
        Ringkasan bank & kas belum tersedia.
      </div>
    );
  }

  const items: KpiItem[] = cards.map((card) => {
    const styles = toneStyles(card.tone);
    const Icon = styles.icon;

    return {
      id: card.key,
      label: card.label,
      value: card.value,
      icon: <Icon className="h-5 w-5" />,
      tone: styles.tone,
      showAccent: true,
      iconContainerClassName: styles.iconWrapper,
      labelClassName: "text-xs font-semibold uppercase tracking-wide",
      valueClassName: "text-lg",
      contentClassName: "min-h-[88px]",
      trend: card.helper_text
        ? {
            direction: "neutral",
            label: card.helper_text,
          }
        : undefined,
    };
  });

  return (
    <KpiGridBase items={items} columns={{ md: 2, xl: 4 }} />
  );
}
