/** @format */

import type { Metadata } from "next";

import { VendorNotificationsPage } from "@/modules/vendor";

export const metadata: Metadata = {
  title: "Vendor - Notifications - Koperasi Digital",
  description: "Vendor - Notifications page.",
};

export default function VendorNotificationsRoute() {
  return <VendorNotificationsPage />;
}
