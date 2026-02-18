/** @format */

import { ReportingAccountLedgerPage } from "@/modules/accounting";

type AccountingReportingAccountLedgerRouteProps = {
  searchParams?: Promise<{
    accountId?: string;
    preset?: string;
    start?: string;
    end?: string;
    branch?: string;
  }>;
};

export default async function AccountingReportingAccountLedgerRoute({
  searchParams,
}: AccountingReportingAccountLedgerRouteProps) {
  const resolved = (await searchParams) ?? {};

  return (
    <ReportingAccountLedgerPage
      accountId={resolved.accountId}
      preset={resolved.preset}
      start={resolved.start}
      end={resolved.end}
      branch={resolved.branch}
    />
  );
}
