/** @format */

import type { Metadata } from "next";

import { VendorInvoiceCreatePage } from "@/modules/vendor";

export const metadata: Metadata = {
  title: "Vendor - Invoices - Create - Koperasi Digital",
  description: "Vendor - Invoices - Create page.",
};

export default function VendorInvoiceCreateRoute() {
  return <VendorInvoiceCreatePage />;
}
