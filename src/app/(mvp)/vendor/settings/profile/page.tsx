/** @format */

import type { Metadata } from "next";

import { TenantProfileSettingsPage } from "@/modules/tenant-settings";

export const metadata: Metadata = {
  title: "Vendor - Settings - Profile - Koperasi Digital",
  description: "Vendor - Settings - Profile page.",
};

export default function VendorSettingsProfilePage() {
  return <TenantProfileSettingsPage />;
}
