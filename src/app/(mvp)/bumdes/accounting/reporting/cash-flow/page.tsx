/** @format */

import type { Metadata } from "next";

import { ReportingCashFlowPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Reporting - Cash Flow - Koperasi Digital",
  description: "Bumdes - Accounting - Reporting - Cash Flow page.",
};

type AccountingReportingCashFlowRouteProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AccountingReportingCashFlowRoute({
  searchParams,
}: AccountingReportingCashFlowRouteProps) {
  const searchParamsResolved = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParamsResolved ?? {})) {
    if (typeof value === "string") query.set(key, value);
  }
  return <ReportingCashFlowPage queryString={query.toString()} />;
}
