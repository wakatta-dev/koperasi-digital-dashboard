/** @format */

import type { Metadata } from "next";

import { VendorTicketAnalyticsPage } from "@/modules/vendor";

export const metadata: Metadata = {
  title: "Vendor - Tickets - Analytics - Koperasi Digital",
  description: "Vendor - Tickets - Analytics page.",
};

export default function VendorTicketAnalyticsRoute() {
  return <VendorTicketAnalyticsPage />;
}
