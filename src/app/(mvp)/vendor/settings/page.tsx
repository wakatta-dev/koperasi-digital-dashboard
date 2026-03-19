/** @format */

import type { Metadata } from "next";

import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Vendor - Settings - Koperasi Digital",
  description: "Vendor - Settings page.",
};

export default function VendorSettingsIndexPage() {
  redirect("/vendor/settings/profile");
}
