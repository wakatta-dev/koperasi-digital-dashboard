/** @format */

import type { Metadata } from "next";

import { BankCashOverviewPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Bank Cash - Overview - Koperasi Digital",
  description: "Bumdes - Accounting - Bank Cash - Overview page.",
};

export default function AccountingBankCashOverviewPage() {
  return <BankCashOverviewPage />;
}
