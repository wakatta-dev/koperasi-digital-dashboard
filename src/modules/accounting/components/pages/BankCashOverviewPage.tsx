/** @format */

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Landmark } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  useAccountingBankCashAccounts,
  useAccountingBankCashMutations,
  useAccountingBankCashOverview,
  useAccountingBankCashUnreconciledTransactions,
} from "@/hooks/queries";
import { toAccountingBankCashApiError } from "@/services/api/accounting-bank-cash";

import { BANK_CASH_ROUTES } from "../../constants/bank-cash-routes";
import {
  EMPTY_ADD_BANK_ACCOUNT_DRAFT,
  EMPTY_IMPORT_STATEMENT_DRAFT,
} from "../../constants/bank-cash-initial-state";
import type {
  AddBankAccountDraft,
  BankAccountCardItem,
  BankCashSummaryCard,
  CashRegisterItem,
  ImportStatementDraft,
  UnreconciledTransactionItem,
} from "../../types/bank-cash";
import {
  formatBankCashCurrency,
  formatBankCashDateLabel,
  formatBankCashSignedAmount,
} from "../../utils/bank-cash-formatters";
import { FeatureAddBankAccountModal } from "../features/FeatureAddBankAccountModal";
import { FeatureBankAccountsGrid } from "../features/FeatureBankAccountsGrid";
import { FeatureBankCashSummaryCards } from "../features/FeatureBankCashSummaryCards";
import { FeatureCashRegistersGrid } from "../features/FeatureCashRegistersGrid";
import { FeatureImportBankStatementModal } from "../features/FeatureImportBankStatementModal";
import { FeatureUnreconciledTransactionsTable } from "../features/FeatureUnreconciledTransactionsTable";

function mapBankBadgeClass(accountName: string): string {
  const normalized = accountName.toLowerCase();
  if (normalized.includes("bca")) return "bg-blue-600";
  if (normalized.includes("mandiri")) return "bg-slate-700";
  if (normalized.includes("bri")) return "bg-emerald-600";
  return "bg-indigo-600";
}

export function BankCashOverviewPage() {
  const router = useRouter();
  const [addAccountOpen, setAddAccountOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [addAccountDraft, setAddAccountDraft] = useState(EMPTY_ADD_BANK_ACCOUNT_DRAFT);
  const [importDraft, setImportDraft] = useState(EMPTY_IMPORT_STATEMENT_DRAFT);

  const overviewQuery = useAccountingBankCashOverview();
  const accountsQuery = useAccountingBankCashAccounts({ page: 1, per_page: 24 });
  const unreconciledQuery = useAccountingBankCashUnreconciledTransactions({
    page: 1,
    per_page: 20,
  });
  const mutations = useAccountingBankCashMutations();

  const summaryCards = useMemo<BankCashSummaryCard[]>(
    () =>
      (overviewQuery.data?.cards ?? []).map((card) => ({
        key: card.key,
        label: card.label,
        value: card.value,
        helper_text: card.helper_text,
        tone: card.tone,
      })),
    [overviewQuery.data?.cards]
  );

  const accountCards = useMemo<BankAccountCardItem[]>(
    () =>
      (accountsQuery.data?.items ?? []).map((account) => ({
        account_id: account.account_id,
        bank_badge: account.account_name.slice(0, 3).toUpperCase(),
        bank_badge_class_name: mapBankBadgeClass(account.account_name),
        bank_name: account.bank_name,
        account_name: account.account_name,
        masked_account_number: account.masked_account_number,
        available_balance: formatBankCashCurrency(account.available_balance),
        last_sync_label: account.last_sync_at
          ? `Last sync: ${formatBankCashDateLabel(account.last_sync_at)}`
          : "Last sync: -",
        unreconciled_count: account.unreconciled_count,
        status: account.status,
      })),
    [accountsQuery.data?.items]
  );

  const unreconciledRows = useMemo<UnreconciledTransactionItem[]>(
    () =>
      (unreconciledQuery.data?.items ?? []).map((row, index) => ({
        id: `ur-${index}`,
        date: formatBankCashDateLabel(row.date),
        description: row.description,
        source: row.source,
        amount: formatBankCashSignedAmount(row.amount, row.direction),
        direction: row.direction,
        can_match: row.can_match,
      })),
    [unreconciledQuery.data?.items]
  );

  const cashRegisters = useMemo<CashRegisterItem[]>(
    () =>
      (overviewQuery.data?.cash_register_summary ?? []).map((item) => ({
        id: item.register_id,
        register_name: item.register_name,
        register_type: item.register_type,
        balance_label: formatBankCashCurrency(item.balance_amount),
        status_label: item.status,
      })),
    [overviewQuery.data?.cash_register_summary]
  );

  const handleCreateAccount = async () => {
    try {
      await mutations.createAccount.mutateAsync({
        payload: {
          bank_name: addAccountDraft.bank_name,
          account_name: addAccountDraft.account_name,
          account_number: addAccountDraft.account_number,
          currency_code: addAccountDraft.currency_code,
          initial_balance_amount: Number(addAccountDraft.initial_balance_amount || "0"),
        },
        idempotencyKey: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
      });
      toast.success("Bank account added");
      setAddAccountOpen(false);
      setAddAccountDraft(EMPTY_ADD_BANK_ACCOUNT_DRAFT);
    } catch (error) {
      const parsed = toAccountingBankCashApiError(error);
      if (parsed.statusCode === 409 || parsed.statusCode === 422) {
        toast.error(parsed.message);
        return;
      }
      toast.error(parsed.message);
    }
  };

  const handleImportStatement = async () => {
    if (!importDraft.account_id || !importDraft.file_type) {
      toast.error("Target Bank Account and file format are required");
      return;
    }

    try {
      await mutations.importStatement.mutateAsync({
        payload: {
          account_id: importDraft.account_id,
          file_name: importDraft.file_name || "statement-upload.csv",
          file_type: importDraft.file_type,
          file_size_bytes: importDraft.file_size_bytes || 1024,
          storage_key: `bank-cash/${importDraft.file_name || "statement-upload.csv"}`,
        },
        idempotencyKey: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
      });
      toast.success("Statement imported");
      setImportOpen(false);
      setImportDraft(EMPTY_IMPORT_STATEMENT_DRAFT);
    } catch (error) {
      const parsed = toAccountingBankCashApiError(error);
      if (parsed.statusCode === 413 || parsed.statusCode === 415 || parsed.statusCode === 422) {
        toast.error(parsed.message);
        return;
      }
      toast.error(parsed.message);
    }
  };

  const combinedErrorMessage =
    overviewQuery.error || accountsQuery.error || unreconciledQuery.error
      ? toAccountingBankCashApiError(
          overviewQuery.error ?? accountsQuery.error ?? unreconciledQuery.error
        ).message
      : null;

  return (
    <div className="space-y-8 overflow-y-auto">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bank & Cash</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitor liquidity, reconcile accounts, and manage cash flow.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            onClick={() => setImportOpen(true)}
          >
            <FileUp className="mr-2 h-4 w-4" />
            Import Statement
          </Button>
          <Button
            type="button"
            className="bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={() => setAddAccountOpen(true)}
          >
            <Landmark className="mr-2 h-4 w-4" />
            Add Bank Account
          </Button>
        </div>
      </section>

      {combinedErrorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {combinedErrorMessage}
        </div>
      ) : null}

      <FeatureBankCashSummaryCards cards={summaryCards} />

      <FeatureBankAccountsGrid
        accounts={accountCards}
        onReconcileNow={(account) => {
          router.push(`${BANK_CASH_ROUTES.index}?accountId=${encodeURIComponent(account.account_id)}`);
        }}
        onDetails={(account) => router.push(BANK_CASH_ROUTES.accountTransactions(account.account_id))}
      />

      <FeatureUnreconciledTransactionsTable rows={unreconciledRows} />
      <FeatureCashRegistersGrid items={cashRegisters} />

      <FeatureAddBankAccountModal
        open={addAccountOpen}
        onOpenChange={setAddAccountOpen}
        draft={addAccountDraft}
        onDraftChange={(nextDraft: AddBankAccountDraft) => setAddAccountDraft(nextDraft)}
        onSubmit={handleCreateAccount}
      />

      <FeatureImportBankStatementModal
        open={importOpen}
        onOpenChange={setImportOpen}
        draft={importDraft}
        onDraftChange={(nextDraft: ImportStatementDraft) => setImportDraft(nextDraft)}
        accountOptions={accountCards?.map((item) => ({
          account_id: item.account_id,
          label: `${item.account_name} - ${item.masked_account_number}`,
        }))}
        onSubmit={handleImportStatement}
      />
    </div>
  );
}
