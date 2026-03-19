/** @format */

import type { Metadata } from "next";

import { TaxEfakturExportPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Tax - E Faktur Export - Koperasi Digital",
  description: "Bumdes - Accounting - Tax - E Faktur Export page.",
};

type AccountingTaxEfakturExportRouteProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AccountingTaxEfakturExportRoute({
  searchParams,
}: AccountingTaxEfakturExportRouteProps) {
  const resolved = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(resolved ?? {})) {
    if (typeof value === "string") query.set(key, value);
  }
  return <TaxEfakturExportPage queryString={query.toString()} />;
}
