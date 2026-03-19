/** @format */

import type { Metadata } from "next";

import { VendorClientsPage } from "@/modules/vendor";

export const metadata: Metadata = {
  title: "Vendor - Clients - Koperasi Digital",
  description: "Vendor - Clients page.",
};

export default function VendorClientsRoute() {
  return <VendorClientsPage />;
}
