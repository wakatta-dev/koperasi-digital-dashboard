/** @format */

import type { Metadata } from "next";

import { BusinessOperationsSettingsPage } from "@/modules/tenant-settings";

export const metadata: Metadata = {
  title: "Vendor - Settings - Operations - Koperasi Digital",
  description: "Vendor - Settings - Operations page.",
};

export default function VendorSettingsOperationsPage() {
  return <BusinessOperationsSettingsPage />;
}
