/** @format */

import type { Metadata } from "next";

import { EmailCommunicationSettingsPage } from "@/modules/tenant-settings";

export const metadata: Metadata = {
  title: "Bumdes - Settings - Komunikasi Email - Koperasi Digital",
  description: "Bumdes - Settings - Komunikasi Email page.",
};

type SettingsKomunikasiEmailPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SettingsKomunikasiEmailPage({
  searchParams,
}: SettingsKomunikasiEmailPageProps) {
  const resolved = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(resolved ?? {})) {
    if (typeof value === "string") query.set(key, value);
  }
  return <EmailCommunicationSettingsPage queryString={query.toString()} />;
}
