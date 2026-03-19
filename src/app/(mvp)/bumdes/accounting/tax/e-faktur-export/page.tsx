/** @format */

import type { Metadata } from "next";

import { TaxEfakturExportPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Tax - E Faktur Export - Koperasi Digital",
  description: "Bumdes - Accounting - Tax - E Faktur Export page.",
};

export default function AccountingTaxEfakturExportRoute() {
  return <TaxEfakturExportPage />;
}
