/** @format */

"use client";

import { useMemo, useState } from "react";
import { Download, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  useAccountingBankCashAccounts,
  useAccountingBankCashAccountTransactions,
  useAccountingBankCashMutations,
} from "@/hooks/queries";
import { toAccountingBankCashApiError } from "@/services/api/accounting-bank-cash";
import type { AccountingBankCashTransactionsQuery } from "@/types/api/accounting-bank-cash";

import { BANK_CASH_ROUTES } from "../../constants/bank-cash-routes";
import { INITIAL_BANK_CASH_TRANSACTION_FILTERS } from "../../constants/bank-cash-initial-state";
import type {
  BankAccountTransactionItem,
  BankCashTransactionFilters,
} from "../../types/bank-cash";
import {
  formatBankCashCurrency,
  formatBankCashDateLabel,
  resolveBankCashAccountId,
  formatBankCashSignedAmount,
} from "../../utils/bank-cash-formatters";
import { FeatureBankAccountTransactionFilters } from "../features/FeatureBankAccountTransactionFilters";
import { FeatureBankAccountTransactionSummaryCards } from "../features/FeatureBankAccountTransactionSummaryCards";
import { FeatureBankAccountTransactionsTable } from "../features/FeatureBankAccountTransactionsTable";

type BankCashAccountTransactionsPageProps = {
  accountId: string;
};

export function BankCashAccountTransactionsPage({
  accountId,
}: BankCashAccountTransactionsPageProps) {
  const router = useRouter();
  const accountsQuery = useAccountingBankCashAccounts({ page: 1, per_page: 50 });
  const resolvedAccountId = useMemo(
    () => resolveBankCashAccountId(accountId, accountsQuery.data?.items),
    [accountId, accountsQuery.data?.items]
  );
  const [filters, setFilters] = useState<BankCashTransactionFilters>(INITIAL_BANK_CASH_TRANSACTION_FILTERS);

  const queryParams = useMemo<AccountingBankCashTransactionsQuery>(() => {
    const transactionType =
      filters.transaction_type === "All Types"
        ? undefined
        : filters.transaction_type === "Credit (Incoming)"
          ? ("Credit" as const)
          : ("Debit" as const);

    return {
      date_range: filters.date_range,
      transaction_type: transactionType,
      status: filters.status === "All Status" ? undefined : filters.status,
      q: filters.q,
      page: 1,
      per_page: 24,
    };
  }, [filters]);

  const transactionsQuery = useAccountingBankCashAccountTransactions(resolvedAccountId, queryParams);
  const mutations = useAccountingBankCashMutations();

  const accountInfo = useMemo(() => {
    const account = accountsQuery.data?.items.find((item) => item.account_id === resolvedAccountId);
    if (!account) {
      return {
        title: "Detail Transaksi Rekening",
        subtitle: "Acc No: - | Bank: -",
      };
    }
    return {
      title: `Detail Transaksi: ${account.account_name}`,
      subtitle: `Acc No: ${account.masked_account_number} | ${account.bank_name}`,
    };
  }, [accountsQuery.data?.items, resolvedAccountId]);

  const rows = useMemo<BankAccountTransactionItem[]>(() => {
    if (!transactionsQuery.data?.items) {
      return [];
    }

    return transactionsQuery.data.items.map((item) => ({
      transaction_id: item.transaction_id,
      date: formatBankCashDateLabel(item.date),
      description: item.description,
      reference_label: item.reference_label,
      amount: formatBankCashSignedAmount(item.amount, item.direction),
      direction: item.direction,
      status: item.status,
    }));
  }, [transactionsQuery.data?.items]);

  const summary = useMemo(() => {
    if (!transactionsQuery.data?.summary) {
      return undefined;
    }

    return {
      current_balance: formatBankCashCurrency(transactionsQuery.data.summary.current_balance),
      current_balance_delta_label: "+2.4% from last month",
      last_synced_at: formatBankCashDateLabel(transactionsQuery.data.summary.last_synced_at),
    };
  }, [transactionsQuery.data?.summary]);

  const detailsError = transactionsQuery.error
    ? toAccountingBankCashApiError(transactionsQuery.error)
    : null;

  const handleExport = async () => {
    if (!resolvedAccountId) {
      toast.error("Bank account is required");
      return;
    }
    try {
      const payload = await mutations.exportTransactions.mutateAsync({
        accountId: resolvedAccountId,
        params: {
          ...queryParams,
          format: "csv",
        },
      });
      toast.success(`Export ready: ${payload.export_reference}`);
    } catch (error) {
      toast.error(toAccountingBankCashApiError(error).message);
    }
  };

  const handleManualEntry = async () => {
    if (!resolvedAccountId) {
      toast.error("Bank account is required");
      return;
    }
    try {
      await mutations.createManualTransaction.mutateAsync({
        accountId: resolvedAccountId,
        payload: {
          transaction_date: new Date().toISOString().slice(0, 10),
          description: "Manual Adjustment Entry",
          amount: 25000,
          direction: "Debit",
          reference_label: "MANUAL-ENTRY",
        },
        idempotencyKey: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
      });
      toast.success("Manual transaction created");
    } catch (error) {
      const parsed = toAccountingBankCashApiError(error);
      if (parsed.statusCode === 422) {
        toast.error(parsed.message);
        return;
      }
      toast.error(parsed.message);
    }
  };

  if (detailsError?.statusCode === 412) {
    return (
      <div className="space-y-4 rounded-xl border border-orange-200 bg-orange-50 p-6 text-orange-700 dark:border-orange-900/30 dark:bg-orange-900/10 dark:text-orange-300">
        <h1 className="text-lg font-bold">Reconciliation confirmation required</h1>
        <p className="text-sm">
          {detailsError.message}
        </p>
        <Button
          type="button"
          className="w-fit bg-indigo-600 text-white hover:bg-indigo-700"
          onClick={() =>
            router.push(
              `${BANK_CASH_ROUTES.index}?accountId=${encodeURIComponent(resolvedAccountId ?? accountId)}`
            )
          }
        >
          Back to Reconciliation
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-y-auto">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            onClick={() =>
              router.push(
                `${BANK_CASH_ROUTES.index}?accountId=${encodeURIComponent(resolvedAccountId ?? accountId)}`
              )
            }
          >
            <span aria-hidden>{"<-"}</span>
            <span className="sr-only">Back to reconciliation</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{accountInfo.title}</h1>
            <p className="mt-1 font-mono text-sm text-gray-500 dark:text-gray-400">
              {accountInfo.subtitle}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            onClick={handleExport}
            disabled={mutations.exportTransactions.isPending}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            type="button"
            className="bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={handleManualEntry}
            disabled={mutations.createManualTransaction.isPending}
          >
            <Plus className="mr-2 h-4 w-4" />
            Manual Entry
          </Button>
        </div>
      </section>

      {detailsError && detailsError.statusCode !== 412 ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {detailsError.message}
        </div>
      ) : null}

      <FeatureBankAccountTransactionSummaryCards summary={summary} />
      <FeatureBankAccountTransactionFilters value={filters} onChange={setFilters} />
      <FeatureBankAccountTransactionsTable filters={filters} rows={rows} />
    </div>
  );
}
