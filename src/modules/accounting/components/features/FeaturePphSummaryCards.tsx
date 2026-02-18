/** @format */

import type { ComponentType } from "react";
import { BriefcaseBusiness, Building2, Receipt, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import type { TaxPphSummaryCard, TaxPphSummaryTone } from "../../types/tax";

const TONE_STYLES: Record<
  TaxPphSummaryTone,
  {
    iconContainer: string;
    icon: ComponentType<{ className?: string }>;
  }
> = {
  neutral: {
    iconContainer: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    icon: Receipt,
  },
  purple: {
    iconContainer: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    icon: Users,
  },
  teal: {
    iconContainer: "bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400",
    icon: BriefcaseBusiness,
  },
  orange: {
    iconContainer: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    icon: Building2,
  },
};

type FeaturePphSummaryCardsProps = {
  cards: TaxPphSummaryCard[];
};

export function FeaturePphSummaryCards({ cards }: FeaturePphSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const styles = TONE_STYLES[card.tone];
        const Icon = styles.icon;

        return (
          <Card
            key={card.key}
            className="border-gray-200 bg-white shadow-sm transition-colors hover:border-indigo-300 dark:border-gray-700 dark:bg-slate-900 dark:hover:border-indigo-800"
          >
            <CardContent className="p-5">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <span className="block text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                    {card.label}
                  </span>
                  <span className="mt-0.5 block text-[10px] text-gray-400">
                    {card.helper_text}
                  </span>
                </div>
                <div className={`rounded-lg p-2 ${styles.iconContainer}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <span className="block text-2xl font-bold text-gray-900 dark:text-white">{card.value}</span>
              <span className="mt-2 block text-xs text-gray-500">{card.note}</span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
