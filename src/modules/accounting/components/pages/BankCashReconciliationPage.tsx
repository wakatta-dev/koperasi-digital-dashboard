/** @format */

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  useAccountingBankCashAccounts,
  useAccountingBankCashBankLines,
  useAccountingBankCashMutations,
  useAccountingBankCashReconciliationSession,
  useAccountingBankCashSystemLines,
} from "@/hooks/queries";
import { toAccountingBankCashApiError } from "@/services/api/accounting-bank-cash";

import { BANK_CASH_ROUTES } from "../../constants/bank-cash-routes";
import {
  DUMMY_RECONCILIATION_SESSION,
  DUMMY_BANK_STATEMENT_LINES,
  DUMMY_SYSTEM_LEDGER_LINES,
} from "../../constants/bank-cash-dummy";
import type { BankStatementLineItem, SystemLedgerLineItem } from "../../types/bank-cash";
import {
  formatBankCashCurrency,
  formatBankCashDateLabel,
  formatBankCashSignedAmount,
} from "../../utils/bank-cash-formatters";
import { FeatureBankStatementMatchTable } from "../features/FeatureBankStatementMatchTable";
import { FeatureImportBankStatementModal } from "../features/FeatureImportBankStatementModal";
import { FeatureReconciliationActions } from "../features/FeatureReconciliationActions";
import { FeatureReconciliationBalanceCards } from "../features/FeatureReconciliationBalanceCards";
import { FeatureReconciliationDifferenceBanner } from "../features/FeatureReconciliationDifferenceBanner";
import { FeatureSystemTransactionsMatchTable } from "../features/FeatureSystemTransactionsMatchTable";

type BankCashReconciliationPageProps = {
  accountId?: string;
};

export function BankCashReconciliationPage({
  accountId = DUMMY_RECONCILIATION_SESSION.account_id,
}: BankCashReconciliationPageProps) {
  const router = useRouter();
  const [importOpen, setImportOpen] = useState(false);
  const [confirmedHref, setConfirmedHref] = useState<string | null>(null);

  const sessionQuery = useAccountingBankCashReconciliationSession(accountId);
  const bankLinesQuery = useAccountingBankCashBankLines(accountId, { page: 1, per_page: 24 });
  const systemLinesQuery = useAccountingBankCashSystemLines(accountId, { page: 1, per_page: 24 });
  const accountsQuery = useAccountingBankCashAccounts({ page: 1, per_page: 50 });
  const mutations = useAccountingBankCashMutations();

  const accountDisplay = useMemo(() => {
    const account = accountsQuery.data?.items.find((item) => item.account_id === accountId);
    if (!account) {
      return {
        title: DUMMY_RECONCILIATION_SESSION.account_title,
        meta: DUMMY_RECONCILIATION_SESSION.account_meta,
      };
    }

    return {
      title: `${account.bank_name} (${account.currency_code})`,
      meta: `Acct: ${account.masked_account_number} | Statement Ending: ${formatBankCashDateLabel(new Date().toISOString())}`,
    };
  }, [accountId, accountsQuery.data?.items]);

  const bankRows = useMemo<BankStatementLineItem[]>(() => {
    if (!bankLinesQuery.data?.items) {
      return DUMMY_BANK_STATEMENT_LINES;
    }

    return bankLinesQuery.data.items.map((item) => ({
      line_id: item.line_id,
      date: formatBankCashDateLabel(item.date),
      description: item.description,
      reference_no: item.reference_no,
      amount: formatBankCashSignedAmount(item.amount, item.direction),
      direction: item.direction,
      is_selected: item.is_selected,
      is_matched: item.is_matched,
    }));
  }, [bankLinesQuery.data?.items]);

  const systemRows = useMemo<SystemLedgerLineItem[]>(() => {
    if (!systemLinesQuery.data?.items) {
      return DUMMY_SYSTEM_LEDGER_LINES;
    }

    return systemLinesQuery.data.items.map((item) => ({
      line_id: item.line_id,
      date: formatBankCashDateLabel(item.date),
      partner_or_ref: item.partner_or_ref,
      document_ref: item.document_ref,
      amount: formatBankCashSignedAmount(item.amount, item.direction),
      direction: item.direction,
      is_selected: item.is_selected,
      is_matched: item.is_matched,
    }));
  }, [systemLinesQuery.data?.items]);

  const canConfirm = Boolean(sessionQuery.data?.can_confirm);

  const sessionError = sessionQuery.error
    ? toAccountingBankCashApiError(sessionQuery.error).message
    : null;

  const linesError = bankLinesQuery.error || systemLinesQuery.error
    ? toAccountingBankCashApiError(bankLinesQuery.error ?? systemLinesQuery.error).message
    : null;

  const handleSuggest = async () => {
    if (!sessionQuery.data?.session_reference) {
      return;
    }

    try {
      const result = await mutations.suggestMatches.mutateAsync({
        accountId,
        payload: {
          session_reference: sessionQuery.data.session_reference,
        },
      });
      toast.success(`${result.suggestions.length} suggestion(s) generated`);
    } catch (error) {
      toast.error(toAccountingBankCashApiError(error).message);
    }
  };

  const handleConfirm = async () => {
    if (!sessionQuery.data?.session_reference) {
      return;
    }

    try {
      const result = await mutations.confirmReconciliation.mutateAsync({
        accountId,
        payload: {
          session_reference: sessionQuery.data.session_reference,
        },
        idempotencyKey: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
      });
      setConfirmedHref(result.detail_cta.href);
      toast.success("Reconciliation confirmed");
    } catch (error) {
      const parsed = toAccountingBankCashApiError(error);
      if (parsed.statusCode === 412 || parsed.statusCode === 422) {
        toast.error(parsed.message);
        return;
      }
      toast.error(parsed.message);
    }
  };

  return (
    <div className="space-y-6 overflow-y-auto">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{accountDisplay.title}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{accountDisplay.meta}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <FeatureReconciliationDifferenceBanner
            label={`Unreconciled Difference: ${formatBankCashCurrency(sessionQuery.data?.difference_amount ?? 2500000)}`}
          />
          <Button
            type="button"
            variant="outline"
            className="border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            onClick={() => setImportOpen(true)}
          >
            <FileUp className="mr-2 h-4 w-4" />
            Import Statement
          </Button>
        </div>
      </section>

      {sessionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {sessionError}
        </div>
      ) : null}

      {linesError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {linesError}
        </div>
      ) : null}

      <FeatureReconciliationBalanceCards
        cards={{
          statement_balance_amount: formatBankCashCurrency(
            sessionQuery.data?.statement_balance_amount ?? 145200000
          ),
          system_balance_amount: formatBankCashCurrency(
            sessionQuery.data?.system_balance_amount ?? 142700000
          ),
          difference_amount: formatBankCashCurrency(sessionQuery.data?.difference_amount ?? 2500000),
        }}
      />

      {confirmedHref ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/10 dark:text-emerald-300">
          <p className="font-semibold">Reconciliation confirmed</p>
          <p className="mt-1">Continue to account transaction detail when ready.</p>
          <Button
            type="button"
            variant="link"
            className="mt-2 h-auto p-0 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            onClick={() =>
              router.push(
                `${confirmedHref}?from=reconciliation&accountId=${encodeURIComponent(accountId)}`
              )
            }
          >
            Detail Transactions
          </Button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:[height:calc(100vh-320px)] lg:min-h-[500px]">
        <FeatureBankStatementMatchTable rows={bankRows} />
        <FeatureSystemTransactionsMatchTable rows={systemRows} />
      </div>

      <FeatureReconciliationActions
        canConfirm={canConfirm}
        isConfirming={mutations.confirmReconciliation.isPending}
        onConfirm={handleConfirm}
        onSuggest={handleSuggest}
      />

      <FeatureImportBankStatementModal
        open={importOpen}
        onOpenChange={setImportOpen}
        accountOptions={accountsQuery.data?.items.map((item) => ({
          account_id: item.account_id,
          label: `${item.account_name} - ${item.masked_account_number}`,
        }))}
        onSubmit={() => setImportOpen(false)}
      />

      <Button
        type="button"
        variant="link"
        className="h-auto p-0 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        onClick={() => router.push(BANK_CASH_ROUTES.overview)}
      >
        Open Overview
      </Button>
    </div>
  );
}
