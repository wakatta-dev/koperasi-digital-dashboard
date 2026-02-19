/** @format */

import { CheckCircle2, Landmark, RefreshCw, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { BankAccountTransactionSummary } from "../../types/bank-cash";

type FeatureBankAccountTransactionSummaryCardsProps = {
  summary?: BankAccountTransactionSummary;
};

export function FeatureBankAccountTransactionSummaryCards({
  summary = {
    current_balance: "Rp 0",
    current_balance_delta_label: "No movement",
    last_synced_at: "-",
  },
}: FeatureBankAccountTransactionSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card className="rounded-xl border border-gray-200 shadow-sm dark:border-gray-700">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
              Current Balance
            </p>
            <h3 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
              {summary.current_balance}
            </h3>
            <p className="mt-2 flex items-center gap-1 text-xs text-emerald-500">
              <TrendingUp className="h-3.5 w-3.5" />
              {summary.current_balance_delta_label}
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
            <Landmark className="h-7 w-7" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-gray-200 shadow-sm dark:border-gray-700">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
              Last Synced
            </p>
            <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {summary.last_synced_at}
            </h3>
            <Button
              type="button"
              variant="link"
              className="mt-2 h-auto p-0 text-xs font-medium text-indigo-600 hover:text-indigo-700"
            >
              <RefreshCw className="mr-1 h-3.5 w-3.5" />
              Sync Now
            </Button>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <CheckCircle2 className="h-7 w-7" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
