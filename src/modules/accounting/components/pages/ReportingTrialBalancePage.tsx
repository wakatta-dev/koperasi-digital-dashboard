/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAccountingReportingTrialBalance } from "@/hooks/queries";
import { toAccountingReportingApiError } from "@/services/api/accounting-reporting";

import type { ReportingAccountOption } from "../../types/reporting";
import { buildReportingQueryString, parseReportingQueryState } from "../../utils/reporting-query-state";
import {
  FeatureTrialBalanceFilterPanel,
  FeatureTrialBalancePagination,
  FeatureTrialBalanceTable,
} from "../features/FeatureReportingLedgers";

const TRIAL_BALANCE_PAGE_SIZE = 12;
const TRIAL_BRANCH_OPTIONS: ReadonlyArray<ReportingAccountOption> = [
  { id: "all", label: "All Branches" },
  { id: "headquarters", label: "Headquarters" },
  { id: "north-branch", label: "North Branch" },
  { id: "south-branch", label: "South Branch" },
];

export function ReportingTrialBalancePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialState = useMemo(
    () =>
      parseReportingQueryState(searchParams, {
        preset: "custom",
        start: "2024-01-01",
        end: "2024-12-31",
        branch: "all",
        page: 1,
      }),
    [searchParams],
  );

  const [start, setStart] = useState(initialState.start ?? "2024-01-01");
  const [end, setEnd] = useState(initialState.end ?? "2024-12-31");
  const [branch, setBranch] = useState(initialState.branch ?? "all");
  const [page, setPage] = useState(initialState.page ?? 1);

  useEffect(() => {
    setStart(initialState.start ?? "2024-01-01");
    setEnd(initialState.end ?? "2024-12-31");
    setBranch(initialState.branch ?? "all");
    setPage(initialState.page ?? 1);
  }, [initialState.branch, initialState.end, initialState.page, initialState.start]);

  useEffect(() => {
    const nextQuery = buildReportingQueryString({
      ...initialState,
      preset: "custom",
      start,
      end,
      branch,
      page,
      page_size: undefined,
    });
    if (nextQuery === searchParams.toString()) return;
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [branch, end, initialState, page, pathname, router, searchParams, start]);

  const reportQuery = useAccountingReportingTrialBalance({
    preset: "custom",
    start,
    end,
    branch: branch === "all" ? undefined : branch,
  });

  const allRows = useMemo(() => reportQuery.data?.rows ?? [], [reportQuery.data?.rows]);
  const pagedRows = useMemo(() => {
    const offset = Math.max(page - 1, 0) * TRIAL_BALANCE_PAGE_SIZE;
    return allRows.slice(offset, offset + TRIAL_BALANCE_PAGE_SIZE);
  }, [allRows, page]);

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Detail Trial Balance Report</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Detailed breakdown of account balances for the selected period.
        </p>
      </section>

      <FeatureTrialBalanceFilterPanel
        start={start}
        end={end}
        branch={branch}
        branches={TRIAL_BRANCH_OPTIONS}
        onStartChange={(value) => {
          setStart(value);
          setPage(1);
        }}
        onEndChange={(value) => {
          setEnd(value);
          setPage(1);
        }}
        onBranchChange={(value) => {
          setBranch(value);
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
          Loading trial balance report...
        </div>
      ) : null}

      <FeatureTrialBalanceTable
        rows={pagedRows}
        totals={
          reportQuery.data?.totals ?? {
            initial_balance: 0,
            debit: 0,
            credit: 0,
            ending_balance: 0,
          }
        }
      />
      <FeatureTrialBalancePagination
        page={page}
        pageSize={TRIAL_BALANCE_PAGE_SIZE}
        totalItems={allRows.length}
        onPageChange={setPage}
      />
    </div>
  );
}
