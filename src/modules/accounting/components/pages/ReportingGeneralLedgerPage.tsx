/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAccountingReportingGeneralLedger } from "@/hooks/queries";
import { toAccountingReportingApiError } from "@/services/api/accounting-reporting";

import { ACCOUNTING_REPORTING_ROUTES } from "../../constants/reporting-routes";
import type { ReportingAccountOption } from "../../types/reporting";
import { buildReportingQueryString, parseReportingQueryState } from "../../utils/reporting-query-state";
import {
  FeatureGeneralLedgerFilterPanel,
  FeatureGeneralLedgerGroupedTable,
  FeatureGeneralLedgerPagination,
  FeatureGeneralLedgerTopActions,
} from "../features/FeatureReportingLedgers";

const DEFAULT_PAGE_SIZE = 20;

export function ReportingGeneralLedgerPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialState = useMemo(
    () =>
      parseReportingQueryState(searchParams, {
        preset: "today",
        accountId: "all",
        page: 1,
        page_size: DEFAULT_PAGE_SIZE,
      }),
    [searchParams],
  );

  const [start, setStart] = useState(initialState.start ?? "");
  const [end, setEnd] = useState(initialState.end ?? "");
  const [accountId, setAccountId] = useState(initialState.accountId ?? "all");
  const [page, setPage] = useState(initialState.page ?? 1);
  const [pageSize, setPageSize] = useState(initialState.page_size ?? DEFAULT_PAGE_SIZE);

  useEffect(() => {
    setStart(initialState.start ?? "");
    setEnd(initialState.end ?? "");
    setAccountId(initialState.accountId ?? "all");
    setPage(initialState.page ?? 1);
    setPageSize(initialState.page_size ?? DEFAULT_PAGE_SIZE);
  }, [initialState.accountId, initialState.end, initialState.page, initialState.page_size, initialState.start]);

  useEffect(() => {
    const resolvedPreset = start && end ? "custom" : initialState.preset || "today";
    const nextQuery = buildReportingQueryString({
      ...initialState,
      preset: resolvedPreset,
      start: start || undefined,
      end: end || undefined,
      accountId,
      page,
      page_size: pageSize,
    });
    if (nextQuery === searchParams.toString()) return;
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [accountId, end, initialState, page, pageSize, pathname, router, searchParams, start]);

  const reportQuery = useAccountingReportingGeneralLedger({
    preset: start && end ? "custom" : initialState.preset || "today",
    start: start || undefined,
    end: end || undefined,
    accountId: accountId === "all" ? undefined : accountId,
    page,
    page_size: pageSize,
  });

  const accountOptions = useMemo<ReportingAccountOption[]>(() => {
    return (
      reportQuery.data?.groups.map((group) => ({
        id: group.account_id,
        label: `${group.account_code} - ${group.account_name}`,
      })) ?? []
    );
  }, [reportQuery.data?.groups]);

  const openAccountLedger = (nextAccountId: string) => {
    const resolvedPreset = start && end ? "custom" : initialState.preset || "today";
    const query = buildReportingQueryString({
      preset: resolvedPreset,
      start: start || undefined,
      end: end || undefined,
      accountId: nextAccountId,
      page: 1,
      page_size: pageSize,
    });
    router.push(
      query
        ? `${ACCOUNTING_REPORTING_ROUTES.accountLedger}?${query}`
        : ACCOUNTING_REPORTING_ROUTES.accountLedger,
    );
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">General Ledger</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Detailed transaction history grouped by account.
          </p>
        </div>
        <FeatureGeneralLedgerTopActions />
      </section>

      <FeatureGeneralLedgerFilterPanel
        start={start}
        end={end}
        accountId={accountId}
        accountOptions={accountOptions}
        onStartChange={(value) => {
          setStart(value);
          setPage(1);
        }}
        onEndChange={(value) => {
          setEnd(value);
          setPage(1);
        }}
        onAccountChange={(value) => {
          setAccountId(value);
          setPage(1);
        }}
      />

      {reportQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingReportingApiError(reportQuery.error).message}
        </div>
      ) : null}

      {reportQuery.isPending && !reportQuery.data ? (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300">
          Loading general ledger report...
        </div>
      ) : null}

      <FeatureGeneralLedgerGroupedTable
        groups={reportQuery.data?.groups ?? []}
        onOpenAccountLedger={openAccountLedger}
      />
      <FeatureGeneralLedgerPagination
        page={reportQuery.data?.pagination.page ?? page}
        pageSize={reportQuery.data?.pagination.page_size ?? pageSize}
        totalItems={reportQuery.data?.pagination.total_accounts ?? 0}
        totalLabel={
          reportQuery.data
            ? `Showing ${reportQuery.data.groups.length} of ${reportQuery.data.pagination.total_accounts} accounts`
            : undefined
        }
        onPageChange={setPage}
      />
    </div>
  );
}
