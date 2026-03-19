/** @format */

import type { Metadata } from "next";

import { EmailCommunicationSettingsPage } from "@/modules/tenant-settings";

export const metadata: Metadata = {
  title: "Bumdes - Settings - Komunikasi Email - Koperasi Digital",
  description: "Bumdes - Settings - Komunikasi Email page.",
};

export default function SettingsKomunikasiEmailPage() {
  return <EmailCommunicationSettingsPage />;
}
