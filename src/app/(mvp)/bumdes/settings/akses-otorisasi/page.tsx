/** @format */

import type { Metadata } from "next";

import { AccessAuthorizationSettingsPage } from "@/modules/tenant-settings";

export const metadata: Metadata = {
  title: "Bumdes - Settings - Akses Otorisasi - Koperasi Digital",
  description: "Bumdes - Settings - Akses Otorisasi page.",
};

type SettingsAksesOtorisasiPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SettingsAksesOtorisasiPage({
  searchParams,
}: SettingsAksesOtorisasiPageProps) {
  const resolved = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(resolved ?? {})) {
    if (typeof value === "string") query.set(key, value);
  }
  return <AccessAuthorizationSettingsPage queryString={query.toString()} />;
}
