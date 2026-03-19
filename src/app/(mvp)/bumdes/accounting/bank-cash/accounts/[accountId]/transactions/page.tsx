/** @format */

import type { Metadata } from "next";

import { BankCashAccountTransactionsPage } from "@/modules/accounting";

type AccountingBankCashAccountTransactionsPageProps = {
  params: Promise<{
    accountId: string;
  }>;
};

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Bank Cash - Accounts - Detail - Transactions - Koperasi Digital",
  description: "Bumdes - Accounting - Bank Cash - Accounts - Detail - Transactions page.",
};

export default async function AccountingBankCashAccountTransactionsPage({
  params,
}: AccountingBankCashAccountTransactionsPageProps) {
  const { accountId } = await params;

  return <BankCashAccountTransactionsPage accountId={accountId} />;
}
