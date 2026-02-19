/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAccountingReportingProfitLossComparative } from "@/hooks/queries";
import { toAccountingReportingApiError } from "@/services/api/accounting-reporting";

import { buildReportingQueryString, parseReportingQueryState } from "../../utils/reporting-query-state";
import {
  FeatureProfitLossComparativeMetaFooter,
  FeatureProfitLossComparativeTable,
  FeatureProfitLossComparativeToolbar,
} from "../features/FeatureReportingLedgers";

export function ReportingProfitLossComparativePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialState = useMemo(
    () =>
      parseReportingQueryState(searchParams, {
        preset: undefined,
      }),
    [searchParams],
  );

  const [preset, setPreset] = useState(initialState.preset ?? "");

  useEffect(() => {
    setPreset(initialState.preset ?? "");
  }, [initialState.preset]);

  useEffect(() => {
    const nextQuery = buildReportingQueryString({
      ...initialState,
      preset: preset || undefined,
      page: undefined,
      page_size: undefined,
    });
    if (nextQuery === searchParams.toString()) return;
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [initialState, pathname, preset, router, searchParams]);

  const reportQuery = useAccountingReportingProfitLossComparative({
    preset: preset || undefined,
  });
  const reportData = reportQuery.data;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">P&amp;L Comparative</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Compare income and expenses across periods.
          </p>
        </div>
        <FeatureProfitLossComparativeToolbar
          periodLabel={reportData?.compare_label ?? "-"}
        />
      </section>

      {reportQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingReportingApiError(reportQuery.error).message}
        </div>
      ) : null}

      {reportQuery.isPending && !reportData ? (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300">
          Loading comparative report...
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
        <FeatureProfitLossComparativeTable rows={reportData?.rows ?? []} />
        <FeatureProfitLossComparativeMetaFooter
          generatedAt={reportData?.meta.generated_at ?? "-"}
          currency={reportData?.meta.currency ?? "-"}
        />
      </div>
    </div>
  );
}
