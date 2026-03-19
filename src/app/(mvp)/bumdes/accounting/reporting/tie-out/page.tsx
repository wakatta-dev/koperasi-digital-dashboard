/** @format */

import type { Metadata } from "next";

import { ReportingTieOutPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Reporting - Tie Out - Koperasi Digital",
  description: "Bumdes - Accounting - Reporting - Tie Out page.",
};

type AccountingReportingTieOutRouteProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AccountingReportingTieOutRoute({
  searchParams,
}: AccountingReportingTieOutRouteProps) {
  const resolved = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(resolved ?? {})) {
    if (typeof value === "string") query.set(key, value);
  }
  return <ReportingTieOutPage queryString={query.toString()} />;
}
