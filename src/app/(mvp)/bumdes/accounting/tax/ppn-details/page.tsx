/** @format */

import type { Metadata } from "next";

import { TaxPpnDetailsPage } from "@/modules/accounting";

type AccountingTaxPpnDetailsRouteProps = {
  searchParams?: Promise<{
    period?: string;
    from?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Tax - Ppn Details - Koperasi Digital",
  description: "Bumdes - Accounting - Tax - Ppn Details page.",
};

export default async function AccountingTaxPpnDetailsRoute({
  searchParams,
}: AccountingTaxPpnDetailsRouteProps) {
  const resolvedSearchParams = (await searchParams) ?? {};

  return (
    <TaxPpnDetailsPage
      period={resolvedSearchParams.period}
      returnToQuery={resolvedSearchParams.from}
    />
  );
}
