/** @format */

import { CheckCircle2, LockKeyhole, PencilLine } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { JOURNAL_ENTRIES_SUMMARY_CARDS } from "../../constants/journal-seed";
import type { JournalEntriesSummaryCard } from "../../types/journal";

type FeatureJournalEntriesSummaryCardsProps = {
  cards?: JournalEntriesSummaryCard[];
  onLockedPeriodsClick?: () => void;
};

function cardToneStyles(card: JournalEntriesSummaryCard) {
  if (card.key === "posted_entries") {
    return {
      icon: CheckCircle2,
      iconWrapper:
        "bg-gray-100 text-gray-500 group-hover:bg-emerald-50 group-hover:text-emerald-500 dark:bg-gray-800 dark:group-hover:bg-emerald-900/30",
      helperValue: "text-emerald-500",
    };
  }

  if (card.key === "locked_periods") {
    return {
      icon: LockKeyhole,
      iconWrapper:
        "bg-gray-100 text-gray-500 group-hover:bg-red-50 group-hover:text-red-500 dark:bg-gray-800 dark:group-hover:bg-red-900/30",
      helperValue: "text-gray-500",
    };
  }

  return {
    icon: PencilLine,
    iconWrapper:
      "bg-gray-100 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:bg-gray-800 dark:group-hover:bg-indigo-900/30",
    helperValue: "text-amber-500",
  };
}

export function FeatureJournalEntriesSummaryCards({
  cards = JOURNAL_ENTRIES_SUMMARY_CARDS,
  onLockedPeriodsClick,
}: FeatureJournalEntriesSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card) => {
        const styles = cardToneStyles(card);
        const Icon = styles.icon;
        const isLockedCard = card.key === "locked_periods";

        return (
          <Card
            key={card.key}
            className={[
              "group h-28 rounded-xl border border-gray-200 shadow-sm transition-colors dark:border-gray-700",
              isLockedCard
                ? "cursor-pointer border-indigo-500/50 hover:border-indigo-500"
                : "hover:border-indigo-300 dark:hover:border-indigo-800",
            ].join(" ")}
            onClick={isLockedCard ? onLockedPeriodsClick : undefined}
            onKeyDown={
              isLockedCard
                ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onLockedPeriodsClick?.();
                    }
                  }
                : undefined
            }
            role={isLockedCard ? "button" : undefined}
            tabIndex={isLockedCard ? 0 : undefined}
          >
            <CardContent className="flex h-full flex-col justify-between p-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                    {card.label}
                  </span>
                  <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{card.value}</h3>
                </div>
                <div className={`rounded-lg p-2 transition-colors ${styles.iconWrapper}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                {card.helper_value ? (
                  <span className={`font-medium ${styles.helperValue}`}>{card.helper_value}</span>
                ) : null}
                <span>{card.helper_text}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
