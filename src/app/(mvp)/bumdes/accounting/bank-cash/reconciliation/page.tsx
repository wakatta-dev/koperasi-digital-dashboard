/** @format */

import { BankCashReconciliationPage } from "@/modules/accounting";

type AccountingBankCashReconciliationPageProps = {
  searchParams?: Promise<{
    accountId?: string;
  }>;
};

export default async function AccountingBankCashReconciliationPage({
  searchParams,
}: AccountingBankCashReconciliationPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};

  return <BankCashReconciliationPage accountId={resolvedSearchParams.accountId} />;
}
