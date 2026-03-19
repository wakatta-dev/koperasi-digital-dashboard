/** @format */

import type { Metadata } from "next";

import { ActivityLogSettingsPage } from "@/modules/tenant-settings";

export const metadata: Metadata = {
  title: "Vendor - Settings - Activity - Koperasi Digital",
  description: "Vendor - Settings - Activity page.",
};

export default function VendorSettingsActivityPage() {
  return <ActivityLogSettingsPage />;
}
