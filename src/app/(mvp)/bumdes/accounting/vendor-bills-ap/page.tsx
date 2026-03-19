/** @format */

import type { Metadata } from "next";

import { VendorBillsApIndexPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Vendor Bills Ap - Koperasi Digital",
  description: "Bumdes - Accounting - Vendor Bills Ap page.",
};

export default function AccountingVendorBillsPage() {
  return <VendorBillsApIndexPage />;
}
