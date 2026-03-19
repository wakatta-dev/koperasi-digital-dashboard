/** @format */

import type { Metadata } from "next";

import { ReportingCatalogPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Reporting - Koperasi Digital",
  description: "Bumdes - Accounting - Reporting page.",
};

export default function AccountingReportingPage() {
  return <ReportingCatalogPage />;
}
