/** @format */

import type { Metadata } from "next";

import { TaxExportHistoryPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Tax - Export History - Koperasi Digital",
  description: "Bumdes - Accounting - Tax - Export History page.",
};

export default function AccountingTaxExportHistoryRoute() {
  return <TaxExportHistoryPage />;
}
