/** @format */

import type { Metadata } from "next";

import { ReportingTieOutPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Reporting - Tie Out - Koperasi Digital",
  description: "Bumdes - Accounting - Reporting - Tie Out page.",
};

export default function AccountingReportingTieOutRoute() {
  return <ReportingTieOutPage />;
}
