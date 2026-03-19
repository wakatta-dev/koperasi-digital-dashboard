/** @format */

import type { Metadata } from "next";

import { ReportingBalanceSheetPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Reporting - Balance Sheet - Koperasi Digital",
  description: "Bumdes - Accounting - Reporting - Balance Sheet page.",
};

export default function AccountingReportingBalanceSheetRoute() {
  return <ReportingBalanceSheetPage />;
}
