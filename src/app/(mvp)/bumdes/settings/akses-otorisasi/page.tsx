/** @format */

import type { Metadata } from "next";

import { AccessAuthorizationSettingsPage } from "@/modules/tenant-settings";

export const metadata: Metadata = {
  title: "Bumdes - Settings - Akses Otorisasi - Koperasi Digital",
  description: "Bumdes - Settings - Akses Otorisasi page.",
};

export default function SettingsAksesOtorisasiPage() {
  return <AccessAuthorizationSettingsPage />;
}
