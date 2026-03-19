/** @format */

import type { Metadata } from "next";

import { BankCashReconciliationPage } from "@/modules/accounting";

type AccountingBankCashPageProps = {
  searchParams?: Promise<{
    accountId?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Bank Cash - Koperasi Digital",
  description: "Bumdes - Accounting - Bank Cash page.",
};

export default async function AccountingBankCashPage({
  searchParams,
}: AccountingBankCashPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};

  return <BankCashReconciliationPage accountId={resolvedSearchParams.accountId} />;
}
