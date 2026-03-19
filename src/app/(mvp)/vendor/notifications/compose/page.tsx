/** @format */

import type { Metadata } from "next";

import { VendorNotificationComposePage } from "@/modules/vendor";

export const metadata: Metadata = {
  title: "Vendor - Notifications - Compose - Koperasi Digital",
  description: "Vendor - Notifications - Compose page.",
};

export default function VendorNotificationsComposeRoute() {
  return <VendorNotificationComposePage />;
}
