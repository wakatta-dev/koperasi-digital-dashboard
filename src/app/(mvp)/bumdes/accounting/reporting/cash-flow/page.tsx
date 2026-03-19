/** @format */

import type { Metadata } from "next";

import { ReportingCashFlowPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Reporting - Cash Flow - Koperasi Digital",
  description: "Bumdes - Accounting - Reporting - Cash Flow page.",
};

export default function AccountingReportingCashFlowRoute() {
  return <ReportingCashFlowPage />;
}
