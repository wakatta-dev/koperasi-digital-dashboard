/** @format */

import { ArrowDownToLine, ArrowUpToLine, Landmark, ReceiptText } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import type { TaxSummaryMetricCard } from "../../types/tax";

function formatCurrency(amountLabel: string) {
  return amountLabel;
}

function toneClass(tone?: TaxSummaryMetricCard["tone"]) {
  switch (tone) {
    case "warning":
      return "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300";
    case "success":
      return "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300";
    case "danger":
      return "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300";
    default:
      return "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300";
  }
}

function cardIcon(key: string) {
  if (key.includes("keluaran")) return ArrowUpToLine;
  if (key.includes("masukan")) return ArrowDownToLine;
  if (key.includes("pph")) return ReceiptText;
  return Landmark;
}

type FeatureTaxSummaryCardsProps = {
  cards: TaxSummaryMetricCard[];
};

export function FeatureTaxSummaryCards({ cards }: FeatureTaxSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = cardIcon(card.key);
        return (
          <Card
            key={card.key}
            className="border-gray-200 shadow-sm transition-colors hover:border-indigo-300 dark:border-gray-700 dark:bg-slate-900 dark:hover:border-indigo-800"
          >
            <CardContent className="p-5">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                    {card.label}
                  </span>
                  {card.helper_text ? (
                    <span className="mt-0.5 block text-[10px] text-gray-400">{card.helper_text}</span>
                  ) : null}
                </div>
                <div className={`rounded-lg p-2 ${toneClass(card.tone)}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <span className="block text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(card.value)}
              </span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
