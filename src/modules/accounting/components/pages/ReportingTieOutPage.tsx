/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowRightLeft, FileStack, Link2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableShell } from "@/components/shared/data-display/TableShell";
import { useAccountingReportingTieOut } from "@/hooks/queries";
import { cn } from "@/lib/utils";
import { toAccountingReportingApiError } from "@/services/api/accounting-reporting";
import type {
  AccountingReportingTieOutFixedAssetItem,
  AccountingReportingTieOutMismatch,
  AccountingReportingTieOutSummary,
} from "@/types/api/accounting-reporting";

import {
  buildReportingQueryString,
  parseReportingQueryState,
} from "../../utils/reporting-query-state";
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

function toSummaryTone(summary: AccountingReportingTieOutSummary) {
  const isBalanced = summary.status === "balanced";

  return {
    badge: isBalanced
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
      : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50",
    card: isBalanced
      ? "border-emerald-100 bg-white shadow-[0_18px_40px_-32px_rgba(5,150,105,0.55)]"
      : "border-amber-100 bg-white shadow-[0_18px_40px_-32px_rgba(217,119,6,0.45)]",
    deltaPanel: isBalanced
      ? "border-emerald-100 bg-emerald-50/80 text-emerald-900"
      : "border-amber-100 bg-amber-50/90 text-amber-900",
    accent: isBalanced ? "bg-emerald-500" : "bg-amber-500",
  };
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
    const resolvedPreset =
      start && end ? "custom" : initialState.preset || "month";
    const nextQuery = buildReportingQueryString({
      ...initialState,
      preset: resolvedPreset,
      start: start || undefined,
      end: end || undefined,
    });
    if (nextQuery === searchParams.toString()) return;
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  }, [end, initialState, pathname, router, searchParams, start]);

  const reportQuery = useAccountingReportingTieOut({
    preset: start && end ? "custom" : initialState.preset || "month",
    start: start || undefined,
    end: end || undefined,
  });

  const selectedMismatch = useMemo(() => {
    const mismatches = reportQuery.data?.mismatches ?? [];
    return (
      mismatches.find((item) => item.source_reference === selectedReference) ??
      mismatches[0] ??
      null
    );
  }, [reportQuery.data?.mismatches, selectedReference]);

  useEffect(() => {
    if (!selectedMismatch?.source_reference) return;
    setSelectedReference(selectedMismatch.source_reference);
  }, [selectedMismatch?.source_reference]);

  const summaryOverview = useMemo(() => {
    const summaries = reportQuery.data?.summaries ?? [];
    const fixedAssetSummary = reportQuery.data?.fixed_asset_summary;

    return {
      domainCount: summaries.length,
      balancedCount: summaries.filter((item) => item.status === "balanced").length,
      totalDelta: summaries.reduce((total, item) => total + Math.abs(item.delta || 0), 0),
      totalMismatchCount: summaries.reduce(
        (total, item) => total + (item.mismatch_count || 0),
        0,
      ),
      fixedAssetGapCount:
        (fixedAssetSummary?.missing_register_count ?? 0) +
        (fixedAssetSummary?.missing_profile_count ?? 0),
    };
  }, [reportQuery.data?.fixed_asset_summary, reportQuery.data?.summaries]);

  const mismatchColumns: ColumnDef<
    AccountingReportingTieOutMismatch,
    unknown
  >[] = [
    {
      id: "reference",
      header: "Reference",
      meta: {
        headerClassName: "px-4 py-3 whitespace-normal",
        cellClassName: "px-4 py-3 whitespace-normal",
      },
      cell: ({ row }) => (
        <>
          <button
            type="button"
            className="text-left font-semibold text-indigo-700 hover:text-indigo-800 dark:text-indigo-300"
            onClick={() => setSelectedReference(row.original.source_reference)}
          >
            {row.original.source_reference}
          </button>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {row.original.source_document_reference ||
              "No source doc reference"}
          </div>
        </>
      ),
    },
    {
      id: "domain",
      header: "Domain",
      meta: {
        headerClassName: "px-4 py-3 whitespace-normal",
        cellClassName:
          "px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-normal",
      },
      cell: ({ row }) => toSentenceCase(row.original.domain),
    },
    {
      id: "operational",
      header: "Operational",
      meta: {
        headerClassName: "px-4 py-3 whitespace-normal",
        cellClassName:
          "px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-normal",
      },
      cell: ({ row }) => formatCurrency(row.original.operational_amount),
    },
    {
      id: "gl",
      header: "GL",
      meta: {
        headerClassName: "px-4 py-3 whitespace-normal",
        cellClassName:
          "px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-normal",
      },
      cell: ({ row }) => formatCurrency(row.original.gl_amount),
    },
    {
      id: "status",
      header: "Status",
      meta: {
        headerClassName: "px-4 py-3 whitespace-normal",
        cellClassName: "px-4 py-3 whitespace-normal",
      },
      cell: ({ row }) => (
        <Badge variant="secondary" className="bg-slate-100 text-slate-700">
          {toSentenceCase(row.original.mismatch_status)}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#fff8eb_0%,#ffffff_42%,#f8fafc_100%)] p-6 shadow-sm lg:p-8">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-amber-100/70 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-sky-100/70 blur-3xl" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-4">
            <Badge className="w-fit border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50">
              Control Workspace
            </Badge>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl dark:text-white">
                Operational vs GL Tie-Out
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600 dark:text-gray-300">
                Workspace ini membandingkan operational subledger dengan angka GL
                resmi agar gap readiness, posting lag, dan reference yang tidak
                match terlihat sebelum laporan finansial dipakai sebagai source
                of truth.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Periode
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                  {reportQuery.data?.period_label || "Periode berjalan"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Domain Sehat
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                  {summaryOverview.balancedCount}/{summaryOverview.domainCount || 0}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  domain sudah balanced
                </p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Reference Review
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                  {summaryOverview.totalMismatchCount}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  mismatch siap ditindaklanjuti
                </p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-xl space-y-3 rounded-[24px] border border-white/80 bg-white/85 p-4 shadow-sm backdrop-blur xl:max-w-sm">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Filter Analisis
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Pilih rentang tanggal untuk membaca gap operasional dan GL pada periode yang sama.
              </p>
            </div>
            <FeatureReportingDateRangeControl
              start={start}
              end={end}
              onStartChange={setStart}
              onEndChange={setEnd}
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-300">
                  Total Delta
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {formatCurrency(summaryOverview.totalDelta)}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Gap Aset
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                  {summaryOverview.fixedAssetGapCount}
                </p>
              </div>
            </div>
          </div>
        </div>
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

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
              Snapshot per Domain
            </h2>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              Saldo, delta, dan kepadatan mismatch diringkas agar domain yang perlu perhatian cepat terlihat.
            </p>
          </div>
          <Badge variant="secondary" className="w-fit bg-slate-100 text-slate-700">
            {summaryOverview.domainCount || 0} domain
          </Badge>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {(reportQuery.data?.summaries ?? []).map((summary) => {
            const tone = toSummaryTone(summary);

            return (
              <Card
                key={summary.domain}
                className={cn(
                  "overflow-hidden border-slate-200 transition-all dark:border-gray-700 dark:bg-slate-900",
                  tone.card,
                )}
              >
                <div className={cn("h-1 w-full", tone.accent)} />
                <CardHeader className="gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <Badge className={cn("w-fit", tone.badge)}>
                        {toSentenceCase(summary.status)}
                      </Badge>
                      <div>
                        <CardTitle className="text-xl text-slate-950 dark:text-white">
                          {summary.label}
                        </CardTitle>
                        <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                          Perbandingan saldo operational subledger dan GL untuk domain {summary.label.toLowerCase()}.
                        </p>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "min-w-40 rounded-2xl border px-4 py-3",
                        tone.deltaPanel,
                      )}
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                        Delta
                      </p>
                      <p className="mt-2 text-2xl font-semibold">
                        {formatCurrency(summary.delta)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-6 text-sm">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/80">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Operational
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                        {formatCurrency(summary.operational_total)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        GL
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                        {formatCurrency(summary.gl_total)}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs text-slate-500 dark:text-gray-400">
                    <div className="rounded-2xl border border-slate-200 px-3 py-3 dark:border-slate-700">
                      <div className="text-lg font-semibold text-slate-950 dark:text-white">
                        {summary.operational_count}
                      </div>
                      <div className="mt-1 leading-5">Operational refs</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 px-3 py-3 dark:border-slate-700">
                      <div className="text-lg font-semibold text-slate-950 dark:text-white">
                        {summary.gl_count}
                      </div>
                      <div className="mt-1 leading-5">GL refs</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 px-3 py-3 dark:border-slate-700">
                      <div className="text-lg font-semibold text-slate-950 dark:text-white">
                        {summary.mismatch_count}
                      </div>
                      <div className="mt-1 leading-5">Mismatches</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <Card className="border-gray-200 dark:border-gray-700 dark:bg-slate-900">
          <CardHeader className="gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
                <ArrowRightLeft className="h-5 w-5 text-indigo-600" />
                Mismatch Drill-Down
              </CardTitle>
              <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                {(reportQuery.data?.mismatches ?? []).length} refs
              </Badge>
            </div>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              Pilih reference untuk melihat gap amount, status readiness, dan bukti posting GL.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {(reportQuery.data?.mismatches ?? []).length ? (
              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                <TableShell
                  tableClassName="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700"
                  columns={mismatchColumns}
                  data={reportQuery.data?.mismatches ?? []}
                  getRowId={(row) => `${row.domain}-${row.source_reference}`}
                  emptyState="Semua reference dasar sudah tie-out untuk periode ini."
                  headerClassName="bg-slate-50 dark:bg-slate-800/80"
                  headerRowClassName="text-left text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400"
                  rowClassName={(row) =>
                    row.source_reference === selectedMismatch?.source_reference
                      ? "bg-indigo-50/80 dark:bg-indigo-950/20"
                      : ""
                  }
                />
              </div>
            ) : (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-6 text-sm text-emerald-700">
                Semua reference dasar sudah tie-out untuk periode ini.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-700 dark:bg-slate-900">
          <CardHeader className="gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
              <Link2 className="h-5 w-5 text-indigo-600" />
              Selected Reference
            </CardTitle>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              Detail operasional dan GL untuk reference yang sedang dipilih.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedMismatch ? (
              <>
                <div className="rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 dark:border-gray-700 dark:bg-slate-800/70">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Source Reference
                  </p>
                  <p className="mt-2 font-semibold text-gray-900 dark:text-white">
                    {selectedMismatch.source_reference}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {selectedMismatch.source_document_reference ||
                      "No source document reference"}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-700">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Operational Amount
                    </p>
                    <p className="mt-2 font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(selectedMismatch.operational_amount)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {toSentenceCase(selectedMismatch.readiness_status || "-")}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-700">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      GL Amount
                    </p>
                    <p className="mt-2 font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(selectedMismatch.gl_amount)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {selectedMismatch.journal_number || "Belum ada journal number"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/70">
                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Domain
                    </p>
                    <p className="mt-2 font-semibold text-slate-950 dark:text-white">
                      {toSentenceCase(selectedMismatch.domain)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/70">
                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Status
                    </p>
                    <p className="mt-2 font-semibold text-slate-950 dark:text-white">
                      {toSentenceCase(selectedMismatch.mismatch_status)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/70">
                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-gray-400">
                      Delta
                    </p>
                    <p className="mt-2 font-semibold text-slate-950 dark:text-white">
                      {formatCurrency(selectedMismatch.delta)}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-200">
                  <p className="font-semibold">Mismatch Reason</p>
                  <p className="mt-1">
                    {selectedMismatch.mismatch_reason ||
                      "Perlu investigasi lebih lanjut."}
                  </p>
                </div>

                {selectedMismatch.readiness_reason ? (
                  <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900 dark:border-sky-900/50 dark:bg-sky-950/20 dark:text-sky-200">
                    <p className="font-semibold">Readiness Context</p>
                    <p className="mt-1">{selectedMismatch.readiness_reason}</p>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="rounded-xl border border-gray-200 px-4 py-6 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                Pilih mismatch reference untuk melihat detail gap operasional
                dan GL.
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="border-gray-200 dark:border-gray-700 dark:bg-slate-900">
          <CardHeader className="gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
              <FileStack className="h-5 w-5 text-indigo-600" />
              Fixed Asset Maturity
            </CardTitle>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              Pantau aset rental yang sudah qualified namun belum masuk register atau belum lengkap profil penyusutannya.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/70">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Qualified
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                  {reportQuery.data?.fixed_asset_summary?.qualified_asset_count ?? 0}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/70">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Registered
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                  {reportQuery.data?.fixed_asset_summary?.registered_asset_count ?? 0}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/70">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Profiled
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                  {reportQuery.data?.fixed_asset_summary?.profiled_asset_count ?? 0}
                </p>
              </div>
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/40 dark:bg-red-950/20">
                <p className="text-[11px] uppercase tracking-[0.18em] text-red-600 dark:text-red-300">
                  Missing Register
                </p>
                <p className="mt-2 text-lg font-semibold text-red-900 dark:text-red-100">
                  {reportQuery.data?.fixed_asset_summary?.missing_register_count ?? 0}
                </p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/40 dark:bg-amber-950/20">
                <p className="text-[11px] uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
                  Missing Profile
                </p>
                <p className="mt-2 text-lg font-semibold text-amber-900 dark:text-amber-100">
                  {reportQuery.data?.fixed_asset_summary?.missing_profile_count ?? 0}
                </p>
              </div>
            </div>

            {(reportQuery.data?.fixed_asset_summary?.review_items ?? [])
              .length > 0 ? (
              <div className="space-y-4">
                {(
                  reportQuery.data?.fixed_asset_summary?.review_items ?? []
                ).map((item, index) => (
                  <div
                    key={`${item.asset_reference}-${index}`}
                    className="rounded-xl border border-gray-200 px-4 py-4 dark:border-gray-700"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {item.asset_name}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {item.asset_reference}
                          {item.fixed_asset_reference
                            ? ` • ${item.fixed_asset_reference}`
                            : ""}
                        </p>
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
                          {toSentenceCase(
                            item.maintenance_classification || "-",
                          )}
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
                          {item.useful_life_months
                            ? `${item.useful_life_months} bulan`
                            : "-"}
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
                Semua aset rental yang qualified sudah berada di fixed asset
                register dengan profile dasar yang lengkap.
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
