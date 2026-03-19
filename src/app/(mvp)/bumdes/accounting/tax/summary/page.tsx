/** @format */

import type { Metadata } from "next";

import { TaxSummaryPeriodPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Tax - Summary - Koperasi Digital",
  description: "Bumdes - Accounting - Tax - Summary page.",
};

export default function AccountingTaxPage() {
  return <TaxSummaryPeriodPage />;
}
