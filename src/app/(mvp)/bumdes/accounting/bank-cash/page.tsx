/** @format */

import { BankCashReconciliationPage } from "@/modules/accounting";

type AccountingBankCashPageProps = {
  searchParams?: Promise<{
    accountId?: string;
  }>;
};

export default async function AccountingBankCashPage({
  searchParams,
}: AccountingBankCashPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};

  return <BankCashReconciliationPage accountId={resolvedSearchParams.accountId} />;
}
