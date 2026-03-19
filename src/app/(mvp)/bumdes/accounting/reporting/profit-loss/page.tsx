/** @format */

import type { Metadata } from "next";

import { ReportingProfitLossPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Reporting - Profit Loss - Koperasi Digital",
  description: "Bumdes - Accounting - Reporting - Profit Loss page.",
};

type AccountingReportingProfitLossRouteProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AccountingReportingProfitLossRoute({
  searchParams,
}: AccountingReportingProfitLossRouteProps) {
  const searchParamsResolved = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParamsResolved ?? {})) {
    if (typeof value === "string") query.set(key, value);
  }
  return <ReportingProfitLossPage queryString={query.toString()} />;
}
