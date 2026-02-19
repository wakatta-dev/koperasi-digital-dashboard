/** @format */

import { TaxPpnDetailsPage } from "@/modules/accounting";

type AccountingTaxPpnDetailsRouteProps = {
  searchParams?: Promise<{
    period?: string;
    from?: string;
  }>;
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
