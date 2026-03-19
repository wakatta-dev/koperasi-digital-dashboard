/** @format */

import type { Metadata } from "next";

import { ReportingProfitLossComparativePage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Reporting - P And L Comparative - Koperasi Digital",
  description: "Bumdes - Accounting - Reporting - P And L Comparative page.",
};

type AccountingReportingProfitLossComparativeRouteProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AccountingReportingProfitLossComparativeRoute({
  searchParams,
}: AccountingReportingProfitLossComparativeRouteProps) {
  const searchParamsResolved = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParamsResolved ?? {})) {
    if (typeof value === "string") query.set(key, value);
  }
  return <ReportingProfitLossComparativePage queryString={query.toString()} />;
}
