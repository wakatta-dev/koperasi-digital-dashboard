/** @format */

import type { Metadata } from "next";

import { VendorTicketsPage } from "@/modules/vendor";

export const metadata: Metadata = {
  title: "Vendor - Tickets - Koperasi Digital",
  description: "Vendor - Tickets page.",
};

export default function VendorTicketsRoute() {
  return <VendorTicketsPage />;
}
