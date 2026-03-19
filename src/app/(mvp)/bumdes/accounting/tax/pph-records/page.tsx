/** @format */

import type { Metadata } from "next";

import { TaxPphRecordsPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Tax - Pph Records - Koperasi Digital",
  description: "Bumdes - Accounting - Tax - Pph Records page.",
};

export default function AccountingTaxPphRecordsRoute() {
  return <TaxPphRecordsPage />;
}
