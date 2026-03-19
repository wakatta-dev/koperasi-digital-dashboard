/** @format */

import type { Metadata } from "next";

import { BusinessOperationsSettingsPage } from "@/modules/tenant-settings";

export const metadata: Metadata = {
  title: "Bumdes - Settings - Operasional Usaha - Koperasi Digital",
  description: "Bumdes - Settings - Operasional Usaha page.",
};

export default function SettingsOperasionalUsahaPage() {
  return <BusinessOperationsSettingsPage />;
}
