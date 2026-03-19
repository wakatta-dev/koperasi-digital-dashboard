/** @format */

import type { Metadata } from "next";

import { TaxSummaryPeriodPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Tax - Summary - Koperasi Digital",
  description: "Bumdes - Accounting - Tax - Summary page.",
};

type AccountingTaxPageRouteProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AccountingTaxPage({
  searchParams,
}: AccountingTaxPageRouteProps) {
  const resolved = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(resolved ?? {})) {
    if (typeof value === "string") query.set(key, value);
  }
  return <TaxSummaryPeriodPage queryString={query.toString()} />;
}
