/** @format */

import type { Metadata } from "next";

import { ActivityLogSettingsPage } from "@/modules/tenant-settings";

export const metadata: Metadata = {
  title: "Bumdes - Settings - Activity Log - Koperasi Digital",
  description: "Bumdes - Settings - Activity Log page.",
};

export default function SettingsActivityLogPage() {
  return <ActivityLogSettingsPage />;
}
