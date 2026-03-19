/** @format */

import type { Metadata } from "next";

import { ReportingTrialBalancePage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Reporting - Trial Balance - Koperasi Digital",
  description: "Bumdes - Accounting - Reporting - Trial Balance page.",
};

type AccountingReportingTrialBalanceRouteProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AccountingReportingTrialBalanceRoute({
  searchParams,
}: AccountingReportingTrialBalanceRouteProps) {
  const resolved = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(resolved ?? {})) {
    if (typeof value === "string") query.set(key, value);
  }
  return <ReportingTrialBalancePage queryString={query.toString()} />;
}
