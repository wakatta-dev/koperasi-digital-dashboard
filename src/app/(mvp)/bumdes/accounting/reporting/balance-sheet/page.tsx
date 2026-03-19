/** @format */

import type { Metadata } from "next";

import { ReportingBalanceSheetPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Reporting - Balance Sheet - Koperasi Digital",
  description: "Bumdes - Accounting - Reporting - Balance Sheet page.",
};

type AccountingReportingBalanceSheetRouteProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AccountingReportingBalanceSheetRoute({
  searchParams,
}: AccountingReportingBalanceSheetRouteProps) {
  const searchParamsResolved = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParamsResolved ?? {})) {
    if (typeof value === "string") query.set(key, value);
  }
  return <ReportingBalanceSheetPage queryString={query.toString()} />;
}
