/** @format */

import type { Metadata } from "next";

import { AccountingSettingsAnalyticBudgetPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Settings - Analytic Budgets - Koperasi Digital",
  description: "Bumdes - Accounting - Settings - Analytic Budgets page.",
};

export default function AccountingSettingsAnalyticBudgetsRoutePage() {
  return <AccountingSettingsAnalyticBudgetPage />;
}

