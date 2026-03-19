/** @format */

import type { Metadata } from "next";

import { ReportingProfitLossPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Reporting - Profit Loss - Koperasi Digital",
  description: "Bumdes - Accounting - Reporting - Profit Loss page.",
};

export default function AccountingReportingProfitLossRoute() {
  return <ReportingProfitLossPage />;
}
