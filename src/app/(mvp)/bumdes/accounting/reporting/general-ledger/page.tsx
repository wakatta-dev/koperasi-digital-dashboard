/** @format */

import type { Metadata } from "next";

import { ReportingGeneralLedgerPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Reporting - General Ledger - Koperasi Digital",
  description: "Bumdes - Accounting - Reporting - General Ledger page.",
};

type AccountingReportingGeneralLedgerRouteProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AccountingReportingGeneralLedgerRoute({
  searchParams,
}: AccountingReportingGeneralLedgerRouteProps) {
  const resolved = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(resolved ?? {})) {
    if (typeof value === "string") query.set(key, value);
  }
  return <ReportingGeneralLedgerPage queryString={query.toString()} />;
}
