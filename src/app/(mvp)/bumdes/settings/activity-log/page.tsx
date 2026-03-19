/** @format */

import type { Metadata } from "next";

import { ActivityLogSettingsPage } from "@/modules/tenant-settings";

export const metadata: Metadata = {
  title: "Bumdes - Settings - Activity Log - Koperasi Digital",
  description: "Bumdes - Settings - Activity Log page.",
};

type SettingsActivityLogPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SettingsActivityLogPage({
  searchParams,
}: SettingsActivityLogPageProps) {
  const resolved = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(resolved ?? {})) {
    if (typeof value === "string") query.set(key, value);
  }
  return <ActivityLogSettingsPage queryString={query.toString()} />;
}
