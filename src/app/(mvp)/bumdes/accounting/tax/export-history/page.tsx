/** @format */

import type { Metadata } from "next";

import { TaxExportHistoryPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Tax - Export History - Koperasi Digital",
  description: "Bumdes - Accounting - Tax - Export History page.",
};

type AccountingTaxExportHistoryRouteProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AccountingTaxExportHistoryRoute({
  searchParams,
}: AccountingTaxExportHistoryRouteProps) {
  const resolved = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(resolved ?? {})) {
    if (typeof value === "string") query.set(key, value);
  }
  return <TaxExportHistoryPage queryString={query.toString()} />;
}
