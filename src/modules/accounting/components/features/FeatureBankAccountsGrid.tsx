/** @format */

import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { DUMMY_BANK_ACCOUNTS } from "../../constants/bank-cash-dummy";
import type { BankAccountCardItem } from "../../types/bank-cash";

type FeatureBankAccountsGridProps = {
  accounts?: BankAccountCardItem[];
  onReconcileNow?: (account: BankAccountCardItem) => void;
  onDetails?: (account: BankAccountCardItem) => void;
};

export function FeatureBankAccountsGrid({
  accounts = DUMMY_BANK_ACCOUNTS,
  onReconcileNow,
  onDetails,
}: FeatureBankAccountsGridProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Rekening Bank</h3>
        <Button
          type="button"
          variant="link"
          className="h-auto p-0 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          View All Accounts
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <Card
            key={account.account_id}
            className="overflow-hidden rounded-xl border border-gray-200 shadow-sm dark:border-gray-700"
          >
            <CardContent className="p-0">
              <div className="space-y-4 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold text-white shadow-md ${account.bank_badge_class_name}`}
                    >
                      {account.bank_badge}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{account.account_name}</h4>
                      <p className="font-mono text-xs text-gray-500 dark:text-gray-400">
                        {account.masked_account_number}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    {account.status}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Available Balance</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{account.available_balance}</p>
                  <p className="text-xs text-gray-400">{account.last_sync_label}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                {account.unreconciled_count > 0 ? (
                  <span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                    {account.unreconciled_count} Items Unreconciled
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Up to date
                  </span>
                )}

                {account.unreconciled_count > 0 ? (
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    onClick={() => onReconcileNow?.(account)}
                  >
                    {"Reconcile Now ->"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => onDetails?.(account)}
                  >
                    {"Details ->"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
