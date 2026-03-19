/** @format */

import type { Metadata } from "next";

import { TaxPpnDetailsPage } from "@/modules/accounting";

type AccountingTaxPpnDetailsRouteProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Tax - Ppn Details - Koperasi Digital",
  description: "Bumdes - Accounting - Tax - Ppn Details page.",
};

export default async function AccountingTaxPpnDetailsRoute({
  searchParams,
}: AccountingTaxPpnDetailsRouteProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (typeof value === "string") query.set(key, value);
  }

  return (
    <TaxPpnDetailsPage
      period={typeof resolvedSearchParams.period === "string" ? resolvedSearchParams.period : undefined}
      returnToQuery={typeof resolvedSearchParams.from === "string" ? resolvedSearchParams.from : undefined}
      queryString={query.toString()}
    />
  );
}
