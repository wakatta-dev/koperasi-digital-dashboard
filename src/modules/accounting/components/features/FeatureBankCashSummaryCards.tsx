/** @format */

import { ArrowLeftRight, Coins, Wallet } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { DUMMY_BANK_CASH_SUMMARY_CARDS } from "../../constants/bank-cash-dummy";
import type { BankCashSummaryCard } from "../../types/bank-cash";

type FeatureBankCashSummaryCardsProps = {
  cards?: BankCashSummaryCard[];
};

function toneStyles(tone: BankCashSummaryCard["tone"]) {
  switch (tone) {
    case "warning":
      return {
        iconWrapper: "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
        helper: "text-orange-500",
        icon: ArrowLeftRight,
      };
    case "success":
      return {
        iconWrapper: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
        helper: "text-gray-500 dark:text-gray-400",
        icon: Coins,
      };
    default:
      return {
        iconWrapper: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
        helper: "text-gray-500 dark:text-gray-400",
        icon: Wallet,
      };
  }
}

export function FeatureBankCashSummaryCards({
  cards = DUMMY_BANK_CASH_SUMMARY_CARDS,
}: FeatureBankCashSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {cards.map((card) => {
        const tone = toneStyles(card.tone);
        const Icon = tone.icon;

        return (
          <Card
            key={card.key}
            className="rounded-xl border border-gray-200 shadow-sm transition-colors hover:border-indigo-300 dark:border-gray-700 dark:hover:border-indigo-800"
          >
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.label}</p>
                <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{card.value}</h3>
                {card.helper_text ? (
                  <p className={`mt-1 text-xs font-medium ${tone.helper}`}>{card.helper_text}</p>
                ) : null}
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${tone.iconWrapper}`}>
                <Icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
