/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { KpiCards } from "@/components/shared/data-display/KpiCards";
import {
  useAccountingReportingAccountLedger,
  useAccountingReportingGeneralLedger,
} from "@/hooks/queries";
import { toAccountingReportingApiError } from "@/services/api/accounting-reporting";

import type { ReportingAccountOption } from "../../types/reporting";
import { buildReportingQueryString, parseReportingQueryState } from "../../utils/reporting-query-state";
import {
  FeatureAccountLedgerFilterPanel,
  FeatureAccountLedgerJournalTable,
  FeatureAccountLedgerTopActions,
} from "../features/FeatureReportingLedgers";
import { FeatureReportingSourceOfTruthCallout } from "../features/FeatureReportingShared";

type ReportingAccountLedgerPageProps = {
  queryString?: string;
};

const DEFAULT_PAGE_SIZE = 20;

export function ReportingAccountLedgerPage({
  queryString = "",
}: ReportingAccountLedgerPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useMemo(
    () => new URLSearchParams(queryString),
    [queryString],
  );

  const initialState = useMemo(
    () =>
      parseReportingQueryState(searchParams, {
        preset: "today",
        page: 1,
        page_size: DEFAULT_PAGE_SIZE,
      }),
    [searchParams],
  );

  const [resolvedAccountId, setResolvedAccountId] = useState(initialState.accountId ?? "");
  const [resolvedStart, setResolvedStart] = useState(initialState.start ?? "");
  const [resolvedEnd, setResolvedEnd] = useState(initialState.end ?? "");
  const [resolvedSearch, setResolvedSearch] = useState(initialState.search ?? "");
  const [resolvedPage, setResolvedPage] = useState(initialState.page ?? 1);
  const [resolvedPageSize, setResolvedPageSize] = useState(initialState.page_size ?? DEFAULT_PAGE_SIZE);

  useEffect(() => {
    setResolvedAccountId(initialState.accountId ?? "");
    setResolvedStart(initialState.start ?? "");
    setResolvedEnd(initialState.end ?? "");
    setResolvedSearch(initialState.search ?? "");
    setResolvedPage(initialState.page ?? 1);
    setResolvedPageSize(initialState.page_size ?? DEFAULT_PAGE_SIZE);
  }, [
    initialState.accountId,
    initialState.end,
    initialState.page,
    initialState.page_size,
    initialState.search,
    initialState.start,
  ]);

  const updateQueryState = (
    nextAccountId: string,
    nextStart: string,
    nextEnd: string,
    nextSearch: string,
    nextPage: number,
    nextPageSize: number,
  ) => {
    const resolvedPreset =
      nextStart && nextEnd ? "custom" : initialState.preset || "today";
    const nextQuery = buildReportingQueryString({
      ...initialState,
      preset: resolvedPreset,
      start: nextStart || undefined,
      end: nextEnd || undefined,
      accountId: nextAccountId,
      search: nextSearch,
      page: nextPage,
      page_size: nextPageSize,
    });
    if (nextQuery === searchParams.toString()) return;
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  };

  const effectivePreset =
    resolvedStart && resolvedEnd ? "custom" : initialState.preset || "today";

  const fallbackContextQuery = useAccountingReportingGeneralLedger(
    {
      preset: effectivePreset,
      start: resolvedStart || undefined,
      end: resolvedEnd || undefined,
      branch: initialState.branch,
      page: 1,
      page_size: DEFAULT_PAGE_SIZE,
    },
    {
      enabled: !resolvedAccountId,
    },
  );

  useEffect(() => {
    if (resolvedAccountId) return;
    if (!fallbackContextQuery.data) return;

    const firstAccount = fallbackContextQuery.data.groups[0]?.account_id;
    if (!firstAccount) return;
    setResolvedAccountId(firstAccount);
    setResolvedPage(1);
  }, [
    fallbackContextQuery.data,
    resolvedAccountId,
    setResolvedAccountId,
    setResolvedPage,
  ]);

  const accountLedgerQuery = useAccountingReportingAccountLedger(
    {
      preset: effectivePreset,
      start: resolvedStart || undefined,
      end: resolvedEnd || undefined,
      branch: initialState.branch,
      accountId: resolvedAccountId,
      search: resolvedSearch || undefined,
      page: resolvedPage,
      page_size: resolvedPageSize,
    },
    {
      enabled: Boolean(resolvedAccountId),
    },
  );

  const accountOptions = useMemo<ReportingAccountOption[]>(() => {
    const options: ReportingAccountOption[] =
      fallbackContextQuery.data?.groups.map((group) => ({
        id: group.account_id,
        label: `${group.account_code} - ${group.account_name}`,
      })) ?? [];

    if (accountLedgerQuery.data?.account) {
      const current = {
        id: accountLedgerQuery.data.account.id,
        label: `${accountLedgerQuery.data.account.code} - ${accountLedgerQuery.data.account.name}`,
      };
      if (!options.some((option) => option.id === current.id)) {
        options.unshift(current);
      }
    }

    return options;
  }, [accountLedgerQuery.data?.account, fallbackContextQuery.data?.groups]);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Ledger</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View detailed transactions for a specific account.
          </p>
        </div>
        <FeatureAccountLedgerTopActions />
      </section>

      <FeatureAccountLedgerFilterPanel
        accountId={resolvedAccountId}
        accountOptions={accountOptions}
        start={resolvedStart}
        end={resolvedEnd}
        onAccountChange={(value) => {
          setResolvedAccountId(value);
          setResolvedPage(1);
          updateQueryState(
            value,
            resolvedStart,
            resolvedEnd,
            resolvedSearch,
            1,
            resolvedPageSize,
          );
        }}
        onStartChange={(value) => {
          setResolvedStart(value);
          setResolvedPage(1);
          updateQueryState(
            resolvedAccountId,
            value,
            resolvedEnd,
            resolvedSearch,
            1,
            resolvedPageSize,
          );
        }}
        onEndChange={(value) => {
          setResolvedEnd(value);
          setResolvedPage(1);
          updateQueryState(
            resolvedAccountId,
            resolvedStart,
            value,
            resolvedSearch,
            1,
            resolvedPageSize,
          );
        }}
      />

      {accountLedgerQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingReportingApiError(accountLedgerQuery.error).message}
        </div>
      ) : null}

      <FeatureReportingSourceOfTruthCallout
        sourceOfTruth={accountLedgerQuery.data?.report_context.source_of_truth}
        reportTier={accountLedgerQuery.data?.report_context.report_tier}
      />

      {!resolvedAccountId && fallbackContextQuery.isPending ? (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300">
          Loading account options...
        </div>
      ) : null}

      {!resolvedAccountId && !fallbackContextQuery.isPending && accountOptions.length === 0 ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Account context is not available for this period. Please adjust filters or open General Ledger.
        </div>
      ) : null}

      {accountLedgerQuery.isPending && !accountLedgerQuery.data ? (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300">
          Loading account ledger...
        </div>
      ) : null}

      {accountLedgerQuery.data?.summary ? (
        <KpiCards
          items={[
            {
              id: "total-debit",
              label: "Total Debit",
              value: formatRupiah(accountLedgerQuery.data.summary.total_debit),
              className: "border-gray-200 dark:border-gray-700 dark:bg-slate-900",
              labelClassName: "text-sm font-medium text-gray-500 dark:text-gray-400",
              valueClassName: "mt-1 text-2xl font-bold text-gray-900 dark:text-white",
            },
            {
              id: "total-credit",
              label: "Total Credit",
              value: formatRupiah(accountLedgerQuery.data.summary.total_credit),
              className: "border-gray-200 dark:border-gray-700 dark:bg-slate-900",
              labelClassName: "text-sm font-medium text-gray-500 dark:text-gray-400",
              valueClassName: "mt-1 text-2xl font-bold text-gray-900 dark:text-white",
            },
            {
              id: "current-balance",
              label: "Current Balance",
              value: formatRupiah(accountLedgerQuery.data.summary.current_balance),
              className:
                "border-indigo-100 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-900/20",
              labelClassName: "text-sm font-medium text-indigo-600 dark:text-indigo-300",
              valueClassName: "mt-1 text-2xl font-bold text-indigo-700 dark:text-indigo-300",
            },
          ]}
          columns={{ md: 2, xl: 3 }}
        />
      ) : null}

      <FeatureAccountLedgerJournalTable
        entries={accountLedgerQuery.data?.entries ?? []}
        totals={
          accountLedgerQuery.data?.totals ?? {
            debit: 0,
            credit: 0,
          }
        }
        search={resolvedSearch}
        onSearchChange={(value) => {
          setResolvedSearch(value);
          setResolvedPage(1);
          updateQueryState(
            resolvedAccountId,
            resolvedStart,
            resolvedEnd,
            value,
            1,
            resolvedPageSize,
          );
        }}
        pagination={{
          page: accountLedgerQuery.data?.pagination.page ?? resolvedPage,
          pageSize:
            accountLedgerQuery.data?.pagination.page_size ?? resolvedPageSize,
          totalItems: accountLedgerQuery.data?.pagination.total_entries ?? 0,
          totalPages: Math.max(
            1,
            Math.ceil(
              (accountLedgerQuery.data?.pagination.total_entries ?? 0) /
                (accountLedgerQuery.data?.pagination.page_size ??
                  resolvedPageSize),
            ),
          ),
        }}
        paginationInfo={
          accountLedgerQuery.data
            ? `Showing ${accountLedgerQuery.data.entries.length} of ${accountLedgerQuery.data.pagination.total_entries} entries`
            : undefined
        }
        onPageChange={(nextPage) => {
          setResolvedPage(nextPage);
          updateQueryState(
            resolvedAccountId,
            resolvedStart,
            resolvedEnd,
            resolvedSearch,
            nextPage,
            resolvedPageSize,
          );
        }}
      />
    </div>
  );
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}
