/** @format */

"use client";

import { useState } from "react";

import { DUMMY_BANK_ACCOUNT_TRANSACTION_FILTERS } from "../../constants/bank-cash-dummy";
import type { BankCashTransactionFilters } from "../../types/bank-cash";
import { FeatureBankAccountTransactionFilters } from "../features/FeatureBankAccountTransactionFilters";
import { FeatureBankAccountTransactionSummaryCards } from "../features/FeatureBankAccountTransactionSummaryCards";
import { FeatureBankAccountTransactionsTable } from "../features/FeatureBankAccountTransactionsTable";

export function BankAccountTransactionsFeatureDemo() {
  const [filters, setFilters] = useState<BankCashTransactionFilters>(
    DUMMY_BANK_ACCOUNT_TRANSACTION_FILTERS
  );

  return (
    <section className="space-y-6">
      <FeatureBankAccountTransactionSummaryCards />
      <FeatureBankAccountTransactionFilters value={filters} onChange={setFilters} />
      <FeatureBankAccountTransactionsTable filters={filters} />
    </section>
  );
}
