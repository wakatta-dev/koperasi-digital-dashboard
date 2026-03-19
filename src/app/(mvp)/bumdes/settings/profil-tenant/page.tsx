/** @format */

import type { Metadata } from "next";

import { TenantProfileSettingsPage } from "@/modules/tenant-settings";

export const metadata: Metadata = {
  title: "Bumdes - Settings - Profil Tenant - Koperasi Digital",
  description: "Bumdes - Settings - Profil Tenant page.",
};

export default function SettingsProfilTenantPage() {
  return <TenantProfileSettingsPage />;
}
