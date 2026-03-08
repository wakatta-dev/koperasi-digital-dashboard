/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRightLeft, FileStack, Link2, ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccountingReportingTieOut } from "@/hooks/queries";
import { toAccountingReportingApiError } from "@/services/api/accounting-reporting";
import type {
  AccountingReportingTieOutFixedAssetItem,
  AccountingReportingTieOutMismatch,
} from "@/types/api/accounting-reporting";

import { buildReportingQueryString, parseReportingQueryState } from "../../utils/reporting-query-state";
import {
  FeatureReportingDateRangeControl,
  FeatureReportingSourceOfTruthCallout,
} from "../features/FeatureReportingShared";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function toSentenceCase(value?: string) {
  if (!value) return "-";
  return value
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function toFixedAssetGapTone(item: AccountingReportingTieOutFixedAssetItem) {
  return item.maturity_status === "missing_register"
    ? "border border-red-200 bg-red-50 text-red-700"
    : "border border-amber-200 bg-amber-50 text-amber-700";
}

export function ReportingTieOutPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialState = useMemo(
    () =>
      parseReportingQueryState(searchParams, {
        preset: "month",
      }),
    [searchParams],
  );

  const [start, setStart] = useState(initialState.start ?? "");
  const [end, setEnd] = useState(initialState.end ?? "");
  const [selectedReference, setSelectedReference] = useState<string>("");

  useEffect(() => {
    setStart(initialState.start ?? "");
    setEnd(initialState.end ?? "");
  }, [initialState.end, initialState.start]);

  useEffect(() => {
    const resolvedPreset = start && end ? "custom" : initialState.preset || "month";
    const nextQuery = buildReportingQueryString({
      ...initialState,
      preset: resolvedPreset,
      start: start || undefined,
      end: end || undefined,
    });
    if (nextQuery === searchParams.toString()) return;
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [end, initialState, pathname, router, searchParams, start]);

  const reportQuery = useAccountingReportingTieOut({
    preset: start && end ? "custom" : initialState.preset || "month",
    start: start || undefined,
    end: end || undefined,
  });

  const selectedMismatch = useMemo(() => {
    const mismatches = reportQuery.data?.mismatches ?? [];
    return (
      mismatches.find((item) => item.source_reference === selectedReference) ?? mismatches[0] ?? null
    );
  }, [reportQuery.data?.mismatches, selectedReference]);

  useEffect(() => {
    if (!selectedMismatch?.source_reference) return;
    setSelectedReference(selectedMismatch.source_reference);
  }, [selectedMismatch?.source_reference]);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <Badge className="w-fit border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50">
            Control Workspace
          </Badge>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Operational vs GL Tie-Out</h1>
            <p className="mt-1 max-w-3xl text-sm text-gray-500 dark:text-gray-400">
              Workspace ini membandingkan operational subledger dengan angka GL resmi agar gap
              readiness, posting lag, dan reference yang tidak match terlihat sebelum laporan
              finansial dipakai sebagai source of truth.
            </p>
          </div>
        </div>

        <FeatureReportingDateRangeControl
          start={start}
          end={end}
          onStartChange={setStart}
          onEndChange={setEnd}
        />
      </section>

      <FeatureReportingSourceOfTruthCallout
        sourceOfTruth={reportQuery.data?.report_context.source_of_truth}
        reportTier={reportQuery.data?.report_context.report_tier}
      />

      {reportQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingReportingApiError(reportQuery.error).message}
        </div>
      ) : null}

      {reportQuery.isPending && !reportQuery.data ? (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300">
          Loading tie-out workspace...
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(reportQuery.data?.summaries ?? []).map((summary) => (
          <Card key={summary.domain} className="border-gray-200 dark:border-gray-700 dark:bg-slate-900">
            <CardHeader className="space-y-1">
              <Badge
                className={
                  summary.status === "balanced"
                    ? "w-fit border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                    : "w-fit border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50"
                }
              >
                {toSentenceCase(summary.status)}
              </Badge>
              <CardTitle className="text-base text-gray-900 dark:text-white">{summary.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Operational</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(summary.operational_total)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">GL</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(summary.gl_total)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/80">
                <span className="text-gray-500 dark:text-gray-400">Delta</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(summary.delta)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
                  <div className="font-semibold text-gray-900 dark:text-white">{summary.operational_count}</div>
                  <div>Operational refs</div>
                </div>
                <div className="rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
                  <div className="font-semibold text-gray-900 dark:text-white">{summary.gl_count}</div>
                  <div>GL refs</div>
                </div>
                <div className="rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
                  <div className="font-semibold text-gray-900 dark:text-white">{summary.mismatch_count}</div>
                  <div>Mismatches</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card className="border-gray-200 dark:border-gray-700 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
              <ShieldAlert className="h-5 w-5 text-indigo-600" />
              Reporting Readiness Boundary
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3 text-sm">
            <div className="rounded-lg border border-gray-200 bg-slate-50 px-4 py-3 dark:border-gray-700 dark:bg-slate-800/80">
              <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Official Reports
              </div>
              <div className="mt-2 font-semibold text-gray-900 dark:text-white">
                General Ledger Driven
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-slate-50 px-4 py-3 dark:border-gray-700 dark:bg-slate-800/80">
              <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Tie-Out Gaps
              </div>
              <div className="mt-2 font-semibold text-gray-900 dark:text-white">
                {(reportQuery.data?.mismatches ?? []).length} blocker
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-slate-50 px-4 py-3 dark:border-gray-700 dark:bg-slate-800/80">
              <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Fixed Asset Gaps
              </div>
              <div className="mt-2 font-semibold text-gray-900 dark:text-white">
                {(reportQuery.data?.fixed_asset_summary?.missing_register_count ?? 0) +
                  (reportQuery.data?.fixed_asset_summary?.missing_profile_count ?? 0)}{" "}
                blocker
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-700 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
              <Link2 className="h-5 w-5 text-indigo-600" />
              Fixed Asset Maturity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-slate-50 px-4 py-3 dark:border-gray-700 dark:bg-slate-800/80">
                <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Qualified Assets
                </div>
                <div className="mt-2 font-semibold text-gray-900 dark:text-white">
                  {reportQuery.data?.fixed_asset_summary?.qualified_asset_count ?? 0}
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-slate-50 px-4 py-3 dark:border-gray-700 dark:bg-slate-800/80">
                <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Registered
                </div>
                <div className="mt-2 font-semibold text-gray-900 dark:text-white">
                  {reportQuery.data?.fixed_asset_summary?.registered_asset_count ?? 0}
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-slate-50 px-4 py-3 dark:border-gray-700 dark:bg-slate-800/80">
                <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Profile Ready
                </div>
                <div className="mt-2 font-semibold text-gray-900 dark:text-white">
                  {reportQuery.data?.fixed_asset_summary?.profiled_asset_count ?? 0}
                </div>
              </div>
            </div>

            {(reportQuery.data?.fixed_asset_summary?.review_items ?? []).length ? (
              <div className="space-y-3">
                {(reportQuery.data?.fixed_asset_summary?.review_items ?? []).map((item) => (
                  <div
                    key={item.asset_reference}
                    className="rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-700"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {item.asset_name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {item.asset_reference}
                          {item.fixed_asset_reference ? ` • ${item.fixed_asset_reference}` : ""}
                        </div>
                      </div>
                      <Badge className={toFixedAssetGapTone(item)}>
                        {toSentenceCase(item.maturity_status)}
                      </Badge>
                    </div>
                    <div className="mt-3 grid gap-2 text-xs text-gray-500 dark:text-gray-400 sm:grid-cols-2">
                      <div>
                        Fixed asset category:{" "}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {item.fixed_asset_category || "-"}
                        </span>
                      </div>
                      <div>
                        Maintenance:{" "}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {toSentenceCase(item.maintenance_classification || "-")}
                        </span>
                      </div>
                      <div>
                        Depreciation:{" "}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {toSentenceCase(item.depreciation_method || "-")}
                        </span>
                      </div>
                      <div>
                        Useful life:{" "}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {item.useful_life_months ? `${item.useful_life_months} bulan` : "-"}
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                      {item.gap_reason}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-6 text-sm text-emerald-700">
                Semua aset rental yang qualified sudah berada di fixed asset register dengan
                profile dasar yang lengkap.
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <Card className="border-gray-200 dark:border-gray-700 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
              <ArrowRightLeft className="h-5 w-5 text-indigo-600" />
              Mismatch Drill-Down
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(reportQuery.data?.mismatches ?? []).length ? (
              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
                  <thead className="bg-slate-50 dark:bg-slate-800/80">
                    <tr className="text-left text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      <th className="px-4 py-3">Reference</th>
                      <th className="px-4 py-3">Domain</th>
                      <th className="px-4 py-3">Operational</th>
                      <th className="px-4 py-3">GL</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {(reportQuery.data?.mismatches ?? []).map((item) => {
                      const selected = item.source_reference === selectedMismatch?.source_reference;
                      return (
                        <tr
                          key={`${item.domain}-${item.source_reference}`}
                          className={selected ? "bg-indigo-50/70 dark:bg-indigo-950/20" : ""}
                        >
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              className="text-left font-semibold text-indigo-700 hover:text-indigo-800 dark:text-indigo-300"
                              onClick={() => setSelectedReference(item.source_reference)}
                            >
                              {item.source_reference}
                            </button>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {item.source_document_reference || "No source doc reference"}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                            {toSentenceCase(item.domain)}
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                            {formatCurrency(item.operational_amount)}
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                            {formatCurrency(item.gl_amount)}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                              {toSentenceCase(item.mismatch_status)}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-6 text-sm text-emerald-700">
                Semua reference dasar sudah tie-out untuk periode ini.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-700 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
              <FileStack className="h-5 w-5 text-indigo-600" />
              Trace Context
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {selectedMismatch ? (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-gray-500 dark:text-gray-400">Mismatch reason</span>
                    <Badge className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50">
                      {toSentenceCase(selectedMismatch.mismatch_status)}
                    </Badge>
                  </div>
                  <p className="rounded-lg bg-slate-50 px-3 py-2 text-gray-700 dark:bg-slate-800/80 dark:text-gray-200">
                    {selectedMismatch.mismatch_reason}
                  </p>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-lg border border-gray-200 px-3 py-3 dark:border-gray-700">
                    <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Trace reference
                    </div>
                    <div className="mt-1 font-semibold text-gray-900 dark:text-white">
                      {selectedMismatch.source_reference}
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {selectedMismatch.source_document_reference || "No source document reference"}
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 px-3 py-3 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      <ShieldAlert className="h-4 w-4" />
                      Readiness
                    </div>
                    <div className="mt-1 font-semibold text-gray-900 dark:text-white">
                      {toSentenceCase(selectedMismatch.readiness_status)}
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {selectedMismatch.readiness_reason || "Operational source sudah berada pada context GL-only."}
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 px-3 py-3 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      <Link2 className="h-4 w-4" />
                      GL Context
                    </div>
                    <div className="mt-1 font-semibold text-gray-900 dark:text-white">
                      {selectedMismatch.journal_number || "Belum ada journal number"}
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Trace available: {selectedMismatch.trace_available ? "Yes" : "No"}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                Pilih mismatch untuk melihat readiness dan reference drill-down.
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
