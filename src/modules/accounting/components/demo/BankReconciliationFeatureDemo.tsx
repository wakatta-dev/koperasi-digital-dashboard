/** @format */

"use client";

import { useState } from "react";

import { KpiCards } from "@/components/shared/data-display/KpiCards";
import {
  DUMMY_BANK_STATEMENT_LINES,
  DUMMY_SYSTEM_LEDGER_LINES,
} from "../../constants/bank-cash-dummy";
import type { BankStatementLineItem, SystemLedgerLineItem } from "../../types/bank-cash";
import { FeatureBankStatementMatchTable } from "../features/FeatureBankStatementMatchTable";
import { FeatureReconciliationActions } from "../features/FeatureReconciliationActions";
import { FeatureReconciliationDifferenceBanner } from "../features/FeatureReconciliationDifferenceBanner";
import { FeatureSystemTransactionsMatchTable } from "../features/FeatureSystemTransactionsMatchTable";

export function BankReconciliationFeatureDemo() {
  const [bankRows, setBankRows] = useState<BankStatementLineItem[]>(DUMMY_BANK_STATEMENT_LINES);
  const [systemRows, setSystemRows] = useState<SystemLedgerLineItem[]>(DUMMY_SYSTEM_LEDGER_LINES);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <section className="space-y-6">
      <FeatureReconciliationDifferenceBanner />
      <KpiCards
        items={[
          {
            id: "statement-balance",
            label: "Statement Balance",
            value: "Rp 0",
            tone: "info",
            labelClassName: "text-xs font-medium uppercase",
            valueClassName: "text-lg",
            contentClassName: "min-h-[88px]",
          },
          {
            id: "system-balance",
            label: "System Balance",
            value: "Rp 0",
            tone: "primary",
            labelClassName: "text-xs font-medium uppercase",
            valueClassName: "text-lg",
            contentClassName: "min-h-[88px]",
          },
          {
            id: "difference-balance",
            label: "Difference to Reconcile",
            value: "Rp 0",
            tone: "warning",
            showAccent: true,
            labelClassName: "text-xs font-medium uppercase",
            valueClassName: "text-lg text-orange-600 dark:text-orange-400",
            contentClassName: "min-h-[88px]",
          },
        ]}
      />

      {confirmed ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Reconciliation confirmed
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:[height:calc(100vh-320px)] lg:min-h-[500px]">
        <FeatureBankStatementMatchTable rows={bankRows} onRowsChange={setBankRows} />
        <FeatureSystemTransactionsMatchTable rows={systemRows} onRowsChange={setSystemRows} />
      </div>

      <FeatureReconciliationActions
        canConfirm
        onConfirm={() => setConfirmed(true)}
        onSuggest={() => setConfirmed(false)}
      />
    </section>
  );
}
