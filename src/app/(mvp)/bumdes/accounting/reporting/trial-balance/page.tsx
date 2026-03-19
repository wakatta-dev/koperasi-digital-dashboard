/** @format */

import type { Metadata } from "next";

import { ReportingTrialBalancePage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Reporting - Trial Balance - Koperasi Digital",
  description: "Bumdes - Accounting - Reporting - Trial Balance page.",
};

export default function AccountingReportingTrialBalanceRoute() {
  return <ReportingTrialBalancePage />;
}
