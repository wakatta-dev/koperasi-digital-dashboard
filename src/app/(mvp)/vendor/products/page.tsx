/** @format */

import type { Metadata } from "next";

import { VendorProductsPage } from "@/modules/vendor";

export const metadata: Metadata = {
  title: "Vendor - Products - Koperasi Digital",
  description: "Vendor - Products page.",
};

export default function VendorProductsRoute() {
  return <VendorProductsPage />;
}
