/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAccountingReportingBalanceSheet } from "@/hooks/queries";
import { toAccountingReportingApiError } from "@/services/api/accounting-reporting";

import { buildReportingQueryString, parseReportingQueryState } from "../../utils/reporting-query-state";
import {
  FeatureBalanceSheetToolbar,
  FeatureBalanceSheetTotalFooter,
  FeatureBalanceSheetTreeTable,
} from "../features/FeatureReportingStatements";
import { FeatureReportingSourceOfTruthCallout } from "../features/FeatureReportingShared";

type ReportingBalanceSheetPageProps = {
  queryString?: string;
};

export function ReportingBalanceSheetPage({
  queryString = "",
}: ReportingBalanceSheetPageProps) {
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
      }),
    [searchParams],
  );
  const [asOfDate, setAsOfDate] = useState(initialState.start ?? initialState.end ?? "");

  useEffect(() => {
    setAsOfDate(initialState.start ?? initialState.end ?? "");
  }, [initialState.end, initialState.start]);

  const handleDateChange = (nextAsOfDate: string) => {
    setAsOfDate(nextAsOfDate);
    const resolvedPreset = nextAsOfDate
      ? "custom"
      : initialState.preset || "today";
    const nextQuery = buildReportingQueryString({
      ...initialState,
      preset: resolvedPreset,
      start: nextAsOfDate || undefined,
      end: nextAsOfDate || undefined,
      page: undefined,
      page_size: undefined,
    });
    if (nextQuery === searchParams.toString()) return;
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  };

  const reportQuery = useAccountingReportingBalanceSheet({
    preset: asOfDate ? "custom" : initialState.preset || "today",
    start: asOfDate || undefined,
    end: asOfDate || undefined,
  });

  const reportData = reportQuery.data;
  const reportContext = reportData?.report_context;
  const hasFallbackBanner = Boolean(reportContext?.auto_fallback_applied);
  const hasEmptyDataBanner = Boolean(
    !reportContext?.auto_fallback_applied && reportContext?.fallback_reason && reportData,
  );

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Balance Sheet</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Company financial position summary and details.
          </p>
        </div>
        <FeatureBalanceSheetToolbar
          asOfDate={asOfDate}
          onDateChange={handleDateChange}
        />
      </section>

      {reportQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingReportingApiError(reportQuery.error).message}
        </div>
      ) : null}

      {reportQuery.isPending && !reportData ? (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300">
          Loading balance sheet...
        </div>
      ) : null}

      {hasFallbackBanner ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Data untuk periode yang diminta tidak tersedia. Menampilkan periode terakhir yang memiliki jurnal pada{" "}
          {reportContext?.effective_start}
          {reportContext?.effective_end && reportContext.effective_end !== reportContext.effective_start
            ? ` sampai ${reportContext.effective_end}`
            : ""}{" "}
          agar laporan tidak kosong.
        </div>
      ) : null}

      {hasEmptyDataBanner ? (
        <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
          {reportContext?.fallback_reason}. Nilai nol tetap ditampilkan agar struktur neraca tetap terbaca.
        </div>
      ) : null}

      <FeatureReportingSourceOfTruthCallout
        sourceOfTruth={reportContext?.source_of_truth}
        reportTier={reportContext?.report_tier}
      />

      <FeatureBalanceSheetTreeTable
        assets={reportData?.assets ?? []}
        liabilities={reportData?.liabilities ?? []}
        equity={reportData?.equity ?? []}
      />
      <FeatureBalanceSheetTotalFooter
        label="Total Liabilities & Equity"
        value={reportData?.liab_equity_total_display ?? "-"}
      />
    </div>
  );
}
