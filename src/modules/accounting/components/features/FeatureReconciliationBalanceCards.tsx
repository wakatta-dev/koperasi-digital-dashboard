/** @format */

import { AlertTriangle, Banknote, Monitor } from "lucide-react";

import {
  KpiGridBase,
  type KpiItem,
} from "@/components/shared/data-display/KpiGridBase";

import { EMPTY_RECONCILIATION_BALANCE_CARDS } from "../../constants/bank-cash-initial-state";
import type { ReconciliationBalanceCards } from "../../types/bank-cash";

type FeatureReconciliationBalanceCardsProps = {
  cards?: ReconciliationBalanceCards;
};

export function FeatureReconciliationBalanceCards({
  cards = EMPTY_RECONCILIATION_BALANCE_CARDS,
}: FeatureReconciliationBalanceCardsProps) {
  const items: KpiItem[] = [
    {
      id: "statement-balance",
      label: "Statement Balance",
      value: cards.statement_balance_amount,
      icon: <Banknote className="h-5 w-5" />,
      tone: "info",
      labelClassName: "text-xs font-medium uppercase",
      valueClassName: "text-lg",
      contentClassName: "min-h-[88px]",
      iconContainerClassName:
        "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    },
    {
      id: "system-balance",
      label: "System Balance",
      value: cards.system_balance_amount,
      icon: <Monitor className="h-5 w-5" />,
      tone: "primary",
      labelClassName: "text-xs font-medium uppercase",
      valueClassName: "text-lg",
      contentClassName: "min-h-[88px]",
      iconContainerClassName:
        "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
    },
    {
      id: "difference-balance",
      label: "Difference to Reconcile",
      value: cards.difference_amount,
      icon: <AlertTriangle className="h-5 w-5" />,
      tone: "warning",
      showAccent: true,
      labelClassName: "text-xs font-medium uppercase",
      valueClassName: "text-lg text-orange-600 dark:text-orange-400",
      contentClassName: "min-h-[88px]",
      iconContainerClassName:
        "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    },
  ];

  return <KpiGridBase items={items} columns={{ md: 2, xl: 4 }} />;
}
