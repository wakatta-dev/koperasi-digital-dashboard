/** @format */

import type { Metadata } from "next";

import { ReportingAccountLedgerPage } from "@/modules/accounting";

type AccountingReportingAccountLedgerRouteProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Reporting - Account Ledger - Koperasi Digital",
  description: "Bumdes - Accounting - Reporting - Account Ledger page.",
};

export default async function AccountingReportingAccountLedgerRoute({
  searchParams,
}: AccountingReportingAccountLedgerRouteProps) {
  const resolved = (await searchParams) ?? {};
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(resolved)) {
    if (typeof value === "string") query.set(key, value);
  }

  return <ReportingAccountLedgerPage queryString={query.toString()} />;
}
