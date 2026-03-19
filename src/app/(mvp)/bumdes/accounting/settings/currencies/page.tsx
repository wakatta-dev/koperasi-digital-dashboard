/** @format */

import type { Metadata } from "next";

import { AccountingSettingsCurrenciesPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Settings - Currencies - Koperasi Digital",
  description: "Bumdes - Accounting - Settings - Currencies page.",
};

export default function AccountingSettingsCurrenciesRoutePage() {
  return <AccountingSettingsCurrenciesPage />;
}

