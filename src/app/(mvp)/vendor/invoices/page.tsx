/** @format */

import type { Metadata } from "next";

import { VendorInvoicesPage } from "@/modules/vendor";

export const metadata: Metadata = {
  title: "Vendor - Invoices - Koperasi Digital",
  description: "Vendor - Invoices page.",
};

export default function VendorInvoicesRoute() {
  return <VendorInvoicesPage />;
}
