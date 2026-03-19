/** @format */

import type { Metadata } from "next";

import { BankCashReconciliationPage } from "@/modules/accounting";

type AccountingBankCashReconciliationPageProps = {
  searchParams?: Promise<{
    accountId?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Bank Cash - Reconciliation - Koperasi Digital",
  description: "Bumdes - Accounting - Bank Cash - Reconciliation page.",
};

export default async function AccountingBankCashReconciliationPage({
  searchParams,
}: AccountingBankCashReconciliationPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};

  return <BankCashReconciliationPage accountId={resolvedSearchParams.accountId} />;
}
