/** @format */

import type { Metadata } from "next";

import { TaxPphRecordsPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Tax - Pph Records - Koperasi Digital",
  description: "Bumdes - Accounting - Tax - Pph Records page.",
};

type AccountingTaxPphRecordsRouteProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AccountingTaxPphRecordsRoute({
  searchParams,
}: AccountingTaxPphRecordsRouteProps) {
  const resolved = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(resolved ?? {})) {
    if (typeof value === "string") query.set(key, value);
  }
  return <TaxPphRecordsPage queryString={query.toString()} />;
}
