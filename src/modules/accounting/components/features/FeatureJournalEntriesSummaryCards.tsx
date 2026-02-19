/** @format */

import { CheckCircle2, LockKeyhole, PencilLine } from "lucide-react";

import { KpiCardBase, type KpiItem } from "@/components/shared/data-display/KpiCardBase";
import { cn } from "@/lib/utils";

import { JOURNAL_INITIAL_ENTRIES_SUMMARY_CARDS } from "../../constants/journal-initial-state";
import type { JournalEntriesSummaryCard } from "../../types/journal";

type FeatureJournalEntriesSummaryCardsProps = {
  cards?: JournalEntriesSummaryCard[];
  onLockedPeriodsClick?: () => void;
};

function cardToneStyles(card: JournalEntriesSummaryCard) {
  if (card.key === "posted_entries") {
    return {
      icon: CheckCircle2,
      tone: "success" as const,
      iconWrapper:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
      helperValue: "text-emerald-600 dark:text-emerald-400",
    };
  }

  if (card.key === "locked_periods") {
    return {
      icon: LockKeyhole,
      tone: "danger" as const,
      iconWrapper: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
      helperValue: "text-red-600 dark:text-red-400",
    };
  }

  return {
    icon: PencilLine,
    tone: "warning" as const,
    iconWrapper:
      "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    helperValue: "text-orange-600 dark:text-orange-400",
  };
}

function resolveSummaryGridClass(count: number): string {
  const normalized = Math.max(count, 1);
  const mdClass = normalized >= 2 ? "md:grid-cols-2" : "md:grid-cols-1";
  const xlClass =
    normalized >= 4
      ? "xl:grid-cols-4"
      : normalized === 3
      ? "xl:grid-cols-3"
      : normalized === 2
      ? "xl:grid-cols-2"
      : "xl:grid-cols-1";

  return `grid grid-cols-1 gap-4 ${mdClass} ${xlClass}`;
}

export function FeatureJournalEntriesSummaryCards({
  cards = JOURNAL_INITIAL_ENTRIES_SUMMARY_CARDS,
  onLockedPeriodsClick,
}: FeatureJournalEntriesSummaryCardsProps) {
  const items: KpiItem[] = cards.map((card) => {
    const styles = cardToneStyles(card);
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
      footer: (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {card.helper_value ? (
            <span className={cn("font-semibold", styles.helperValue)}>
              {card.helper_value}
            </span>
          ) : null}
          <span>{card.helper_text}</span>
        </div>
      ),
    };
  });

  return (
    <div className={resolveSummaryGridClass(items.length)}>
      {items.map((item) => {
        const isLockedCard = item.id === "locked_periods";
        const card = (
          <KpiCardBase
            item={item}
            className={cn(
              "h-full",
              isLockedCard
                ? "cursor-pointer border-indigo-400/60 hover:border-indigo-500 dark:hover:border-indigo-400"
                : "hover:border-indigo-300 dark:hover:border-indigo-800",
            )}
          />
        );

        if (!isLockedCard) {
          return <div key={item.id}>{card}</div>;
        }

        return (
          <button
            key={item.id}
            type="button"
            onClick={onLockedPeriodsClick}
            className="w-full text-left"
            aria-label="Open lock accounting period modal"
          >
            {card}
          </button>
        );
      })}
    </div>
  );
}
