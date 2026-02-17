/** @format */

import { AlertTriangle, Banknote, Monitor } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { DUMMY_RECONCILIATION_SESSION } from "../../constants/bank-cash-dummy";
import type { ReconciliationBalanceCards } from "../../types/bank-cash";

type FeatureReconciliationBalanceCardsProps = {
  cards?: ReconciliationBalanceCards;
};

export function FeatureReconciliationBalanceCards({
  cards = DUMMY_RECONCILIATION_SESSION.cards,
}: FeatureReconciliationBalanceCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className="rounded-xl border border-gray-200 shadow-sm dark:border-gray-700">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
              Statement Balance
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
              {cards.statement_balance_amount}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            <Banknote className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-gray-200 shadow-sm dark:border-gray-700">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
              System Balance
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
              {cards.system_balance_amount}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
            <Monitor className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden rounded-xl border border-orange-200 shadow-sm dark:border-orange-900/50">
        <div className="absolute inset-y-0 left-0 w-1 bg-orange-500" />
        <CardContent className="flex items-center justify-between p-4 pl-5">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
              Difference to Reconcile
            </p>
            <p className="mt-1 text-lg font-bold text-orange-600 dark:text-orange-400">
              {cards.difference_amount}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
