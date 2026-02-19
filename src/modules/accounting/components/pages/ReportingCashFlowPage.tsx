/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAccountingReportingCashFlow } from "@/hooks/queries";
import { toAccountingReportingApiError } from "@/services/api/accounting-reporting";

import { buildReportingQueryString, parseReportingQueryState } from "../../utils/reporting-query-state";
import {
  FeatureCashFlowStatementHeader,
  FeatureCashFlowTable,
  FeatureCashFlowToolbar,
} from "../features/FeatureReportingStatements";

export function ReportingCashFlowPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialState = useMemo(
    () =>
      parseReportingQueryState(searchParams, {
        preset: "today",
      }),
    [searchParams],
  );

  const [start, setStart] = useState(initialState.start ?? "");
  const [end, setEnd] = useState(initialState.end ?? "");

  useEffect(() => {
    setStart(initialState.start ?? "");
    setEnd(initialState.end ?? "");
  }, [initialState.end, initialState.start]);

  useEffect(() => {
    const resolvedPreset = start && end ? "custom" : initialState.preset || "today";
    const nextQuery = buildReportingQueryString({
      ...initialState,
      preset: resolvedPreset,
      start: start || undefined,
      end: end || undefined,
      page: undefined,
      page_size: undefined,
    });
    if (nextQuery === searchParams.toString()) return;
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [end, initialState, pathname, router, searchParams, start]);

  const reportQuery = useAccountingReportingCashFlow({
    preset: start && end ? "custom" : initialState.preset || "today",
    start: start || undefined,
    end: end || undefined,
  });

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cash Flow Statement</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Detailed view of cash inflows and outflows.
          </p>
        </div>
        <FeatureCashFlowToolbar start={start} end={end} onStartChange={setStart} onEndChange={setEnd} />
      </section>

      {reportQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingReportingApiError(reportQuery.error).message}
        </div>
      ) : null}

      {reportQuery.isPending && !reportQuery.data ? (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300">
          Loading cash flow statement...
        </div>
      ) : null}

      <FeatureCashFlowStatementHeader />
      <FeatureCashFlowTable rows={reportQuery.data?.rows ?? []} />
    </div>
  );
}
