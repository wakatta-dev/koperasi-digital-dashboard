/** @format */

import type { Metadata } from "next";

import { ReportingProfitLossComparativePage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Reporting - P And L Comparative - Koperasi Digital",
  description: "Bumdes - Accounting - Reporting - P And L Comparative page.",
};

export default function AccountingReportingProfitLossComparativeRoute() {
  return <ReportingProfitLossComparativePage />;
}
