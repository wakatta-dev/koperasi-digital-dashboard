/** @format */

import type { Metadata } from "next";

import { AccountingSettingsTaxesPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Settings - Taxes - Koperasi Digital",
  description: "Bumdes - Accounting - Settings - Taxes page.",
};

export default function AccountingSettingsTaxesRoutePage() {
  return <AccountingSettingsTaxesPage />;
}

