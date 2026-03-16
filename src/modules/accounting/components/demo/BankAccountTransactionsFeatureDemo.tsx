/** @format */

"use client";

import { useState } from "react";

import { KpiCards } from "@/components/shared/data-display/KpiCards";
import { DUMMY_BANK_ACCOUNT_TRANSACTION_FILTERS } from "../../constants/bank-cash-dummy";
import type { BankCashTransactionFilters } from "../../types/bank-cash";
import { FeatureBankAccountTransactionFilters } from "../features/FeatureBankAccountTransactionFilters";
import { FeatureBankAccountTransactionsTable } from "../features/FeatureBankAccountTransactionsTable";

export function BankAccountTransactionsFeatureDemo() {
  const [filters, setFilters] = useState<BankCashTransactionFilters>(
    DUMMY_BANK_ACCOUNT_TRANSACTION_FILTERS
  );

  return (
    <section className="space-y-6">
      <KpiCards
        items={[
          {
            id: "current-balance",
            label: "Current Balance",
            value: "Rp 0",
            tone: "primary",
            footer: <p className="text-xs text-emerald-500">No movement</p>,
          },
          {
            id: "last-synced",
            label: "Last Synced",
            value: "-",
            tone: "success",
          },
        ]}
        columns={{ md: 2, xl: 2 }}
      />
      <FeatureBankAccountTransactionFilters value={filters} onChange={setFilters} />
      <FeatureBankAccountTransactionsTable filters={filters} />
    </section>
  );
}
