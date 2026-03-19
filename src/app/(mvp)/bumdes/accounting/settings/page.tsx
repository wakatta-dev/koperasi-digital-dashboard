/** @format */

import type { Metadata } from "next";

import { AccountingSettingsIndexPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Settings - Koperasi Digital",
  description: "Bumdes - Accounting - Settings page.",
};

export default function AccountingSettingsPage() {
  return <AccountingSettingsIndexPage />;
}
