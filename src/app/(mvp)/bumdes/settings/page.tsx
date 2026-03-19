/** @format */

import type { Metadata } from "next";

import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Bumdes - Settings - Koperasi Digital",
  description: "Bumdes - Settings page.",
};

export default function SettingsIndexPage() {
  redirect("/bumdes/settings/profil-tenant");
}

