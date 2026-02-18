/** @format */

import { ReportingAccountLedgerPage } from "@/modules/accounting";

type AccountingReportingAccountLedgerRouteProps = {
  searchParams?: Promise<{
    accountId?: string;
    preset?: string;
    start?: string;
    end?: string;
    branch?: string;
    search?: string;
    page?: string;
    page_size?: string;
  }>;
};

export default async function AccountingReportingAccountLedgerRoute({
  searchParams,
}: AccountingReportingAccountLedgerRouteProps) {
  const resolved = (await searchParams) ?? {};
  const parsedPage = Number.parseInt(resolved.page ?? "", 10);
  const parsedPageSize = Number.parseInt(resolved.page_size ?? "", 10);

  return (
    <ReportingAccountLedgerPage
      accountId={resolved.accountId}
      preset={resolved.preset}
      start={resolved.start}
      end={resolved.end}
      branch={resolved.branch}
      search={resolved.search}
      page={Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : undefined}
      pageSize={Number.isFinite(parsedPageSize) && parsedPageSize > 0 ? parsedPageSize : undefined}
    />
  );
}
