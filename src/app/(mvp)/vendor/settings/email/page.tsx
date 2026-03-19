/** @format */

import type { Metadata } from "next";

import { EmailCommunicationSettingsPage } from "@/modules/tenant-settings";

export const metadata: Metadata = {
  title: "Vendor - Settings - Email - Koperasi Digital",
  description: "Vendor - Settings - Email page.",
};

export default function VendorSettingsEmailPage() {
  return <EmailCommunicationSettingsPage />;
}
