/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAccountingReportingProfitLoss } from "@/hooks/queries";
import { toAccountingReportingApiError } from "@/services/api/accounting-reporting";

import { buildReportingQueryString, parseReportingQueryState } from "../../utils/reporting-query-state";
import {
  FeatureProfitLossDetailTable,
  FeatureProfitLossSummaryHeader,
  FeatureProfitLossToolbar,
} from "../features/FeatureReportingStatements";

const DEFAULT_PRESET = "month";

export function ReportingProfitLossPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialState = useMemo(
    () =>
      parseReportingQueryState(searchParams, {
        preset: DEFAULT_PRESET,
      }),
    [searchParams],
  );

  const [preset, setPreset] = useState(initialState.preset ?? DEFAULT_PRESET);

  useEffect(() => {
    setPreset(initialState.preset ?? DEFAULT_PRESET);
  }, [initialState.preset]);

  useEffect(() => {
    const nextQuery = buildReportingQueryString({ ...initialState, preset, page: undefined, page_size: undefined });
    if (nextQuery === searchParams.toString()) return;
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [initialState, pathname, preset, router, searchParams]);

  const reportQuery = useAccountingReportingProfitLoss({
    preset,
  });

  const reportData = reportQuery.data;
  const netProfit =
    reportData?.rows.find((row) => row.type === "net")?.value_display ??
    reportData?.summary_cards.find((item) => item.title.toLowerCase().includes("laba bersih"))?.value_display ??
    "-";

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profit and Loss</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Detailed statement of income, costs, and expenses.
          </p>
        </div>
        <FeatureProfitLossToolbar preset={preset} onPresetChange={setPreset} />
      </section>

      {reportQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingReportingApiError(reportQuery.error).message}
        </div>
      ) : null}

      {reportQuery.isPending && !reportData ? (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300">
          Loading profit and loss report...
        </div>
      ) : null}

      <FeatureProfitLossSummaryHeader
        periodLabel={reportData?.period_label ? `Period: ${reportData.period_label}` : "Period: -"}
        netProfit={netProfit}
      />
      <FeatureProfitLossDetailTable rows={reportData?.rows ?? []} />
    </div>
  );
}
