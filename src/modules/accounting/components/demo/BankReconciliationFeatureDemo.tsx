/** @format */

"use client";

import { useState } from "react";

import {
  DUMMY_BANK_STATEMENT_LINES,
  DUMMY_SYSTEM_LEDGER_LINES,
} from "../../constants/bank-cash-dummy";
import type { BankStatementLineItem, SystemLedgerLineItem } from "../../types/bank-cash";
import { FeatureBankStatementMatchTable } from "../features/FeatureBankStatementMatchTable";
import { FeatureReconciliationActions } from "../features/FeatureReconciliationActions";
import { FeatureReconciliationBalanceCards } from "../features/FeatureReconciliationBalanceCards";
import { FeatureReconciliationDifferenceBanner } from "../features/FeatureReconciliationDifferenceBanner";
import { FeatureSystemTransactionsMatchTable } from "../features/FeatureSystemTransactionsMatchTable";

export function BankReconciliationFeatureDemo() {
  const [bankRows, setBankRows] = useState<BankStatementLineItem[]>(DUMMY_BANK_STATEMENT_LINES);
  const [systemRows, setSystemRows] = useState<SystemLedgerLineItem[]>(DUMMY_SYSTEM_LEDGER_LINES);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <section className="space-y-6">
      <FeatureReconciliationDifferenceBanner />
      <FeatureReconciliationBalanceCards />

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
