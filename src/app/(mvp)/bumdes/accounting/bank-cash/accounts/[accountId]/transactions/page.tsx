/** @format */

import { BankCashAccountTransactionsPage } from "@/modules/accounting";

type AccountingBankCashAccountTransactionsPageProps = {
  params: Promise<{
    accountId: string;
  }>;
};

export default async function AccountingBankCashAccountTransactionsPage({
  params,
}: AccountingBankCashAccountTransactionsPageProps) {
  const { accountId } = await params;

  return <BankCashAccountTransactionsPage accountId={accountId} />;
}
