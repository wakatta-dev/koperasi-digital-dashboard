/** @format */

import type { Metadata } from "next";

import { JournalEntriesManagementPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Journal - Koperasi Digital",
  description: "Bumdes - Accounting - Journal page.",
};

type AccountingJournalPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AccountingJournalPage({
  searchParams,
}: AccountingJournalPageProps) {
  const resolved = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(resolved ?? {})) {
    if (typeof value === "string") query.set(key, value);
  }
  return <JournalEntriesManagementPage queryString={query.toString()} />;
}
