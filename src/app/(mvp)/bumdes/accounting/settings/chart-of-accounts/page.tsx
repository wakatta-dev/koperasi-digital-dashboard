/** @format */

import type { Metadata } from "next";

import { AccountingSettingsCoaPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Settings - Chart Of Accounts - Koperasi Digital",
  description: "Bumdes - Accounting - Settings - Chart Of Accounts page.",
};

export default function AccountingSettingsChartOfAccountsPage() {
  return <AccountingSettingsCoaPage />;
}

