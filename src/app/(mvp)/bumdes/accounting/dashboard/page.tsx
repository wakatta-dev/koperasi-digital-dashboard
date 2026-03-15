/** @format */

"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  CalendarDays,
  CircleAlert,
  CircleCheck,
  Clock3,
  FileText,
  Landmark,
  ReceiptText,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import {
  SummaryMetricsGrid,
  type SummaryMetricItem,
} from "@/components/shared/data-display/SummaryMetricsGrid";
import { TableShell } from "@/components/shared/data-display/TableShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAccountingReportingOverview } from "@/hooks/queries";
import { FeatureOperationalTraceWorkbench } from "@/modules/accounting/components/features/FeatureOperationalTraceWorkbench";
import { toAccountingReportingApiError } from "@/services/api/accounting-reporting";
import type {
  AccountingReportingOverviewRecentTransaction,
  AccountingReportingReportContext,
} from "@/types/api/accounting-reporting";

const DASHBOARD_PRESET = "today";

type MetricVisual = {
  Icon: LucideIcon;
  tone: SummaryMetricItem["tone"];
  iconContainerClassName: string;
  showAccent: boolean;
};

type DashboardHighlight = {
  label: string;
  value: string;
  hint: string;
  Icon: LucideIcon;
  className: string;
};

const KPI_VISUALS: Record<string, MetricVisual> = {
  total_pendapatan: {
    Icon: Wallet,
    tone: "success",
    iconContainerClassName:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300",
    showAccent: true,
  },
  total_pengeluaran: {
    Icon: ReceiptText,
    tone: "danger",
    iconContainerClassName:
      "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-300",
    showAccent: true,
  },
  laba_bersih: {
    Icon: TrendingUp,
    tone: "primary",
    iconContainerClassName:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300",
    showAccent: true,
  },
  saldo_kas: {
    Icon: Landmark,
    tone: "info",
    iconContainerClassName:
      "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300",
    showAccent: true,
  },
  total_revenue: {
    Icon: Wallet,
    tone: "success",
    iconContainerClassName:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300",
    showAccent: true,
  },
  total_expense: {
    Icon: ReceiptText,
    tone: "danger",
    iconContainerClassName:
      "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-300",
    showAccent: true,
  },
  net_profit: {
    Icon: TrendingUp,
    tone: "primary",
    iconContainerClassName:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300",
    showAccent: true,
  },
  cash_balance: {
    Icon: Landmark,
    tone: "info",
    iconContainerClassName:
      "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300",
    showAccent: true,
  },
};

const DEFAULT_KPI_VISUAL: MetricVisual = {
  Icon: FileText,
  tone: "neutral",
  iconContainerClassName:
    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  showAccent: false,
};

const SEGMENT_BAR_CLASS_NAMES = [
  "bg-indigo-600",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
];

function normalizeVisualKey(value?: string): string {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function resolveKpiVisual(
  iconKey: string | undefined,
  title: string,
): MetricVisual {
  const iconKeyNormalized = normalizeVisualKey(iconKey);
  if (iconKeyNormalized && KPI_VISUALS[iconKeyNormalized]) {
    return KPI_VISUALS[iconKeyNormalized];
  }

  const titleKeyNormalized = normalizeVisualKey(title);
  if (titleKeyNormalized && KPI_VISUALS[titleKeyNormalized]) {
    return KPI_VISUALS[titleKeyNormalized];
  }

  return DEFAULT_KPI_VISUAL;
}

function toBadgeClassName(category: string): string {
  const normalized = category.trim().toLowerCase();
  if (normalized.includes("expense") || normalized.includes("biaya")) {
    return "border-red-200 bg-red-50 text-red-700 dark:border-red-900/80 dark:bg-red-950/40 dark:text-red-300";
  }
  if (normalized.includes("income") || normalized.includes("pendapatan")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/80 dark:bg-emerald-950/40 dark:text-emerald-300";
  }
  return "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

function toAmountClassName(category: string): string {
  const normalized = category.trim().toLowerCase();
  if (normalized.includes("expense") || normalized.includes("biaya")) {
    return "text-red-700 dark:text-red-300";
  }
  if (normalized.includes("income") || normalized.includes("pendapatan")) {
    return "text-emerald-700 dark:text-emerald-300";
  }
  return "text-slate-900 dark:text-slate-100";
}

function toContextBadgeClassName(reportContext?: AccountingReportingReportContext): string {
  if (reportContext?.auto_fallback_applied) {
    return "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-300";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300";
}

function toSentenceCase(value?: string | null): string {
  const normalized = String(value ?? "")
    .trim()
    .replaceAll("_", " ");

  if (!normalized) {
    return "-";
  }

  return normalized.replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatTimestamp(value?: string): string {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}

function isIncomeCategory(transaction: AccountingReportingOverviewRecentTransaction): boolean {
  const normalized = transaction.category.trim().toLowerCase();
  return normalized.includes("income") || normalized.includes("pendapatan");
}

function isExpenseCategory(transaction: AccountingReportingOverviewRecentTransaction): boolean {
  const normalized = transaction.category.trim().toLowerCase();
  return normalized.includes("expense") || normalized.includes("biaya");
}

function clampPercentage(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, value));
}

function DashboardMetaCard({
  Icon,
  label,
  value,
  hint,
}: {
  Icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex items-start gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            {value}
          </p>
          <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
            {hint}
          </p>
        </div>
      </div>
    </div>
  );
}

function DashboardHighlightCard({
  highlight,
}: {
  highlight: DashboardHighlight;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${highlight.className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.18em]">
            {highlight.label}
          </p>
          <p className="text-xl font-semibold">{highlight.value}</p>
          <p className="text-xs leading-5 opacity-80">{highlight.hint}</p>
        </div>
        <highlight.Icon className="mt-0.5 h-4 w-4 opacity-80" />
      </div>
    </div>
  );
}

function InsightCardEmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400">
      {message}
    </div>
  );
}

export default function AccountingDashboardPage() {
  const overviewQuery = useAccountingReportingOverview({
    preset: DASHBOARD_PRESET,
  });

  const metrics = useMemo<SummaryMetricItem[]>(() => {
    return (overviewQuery.data?.kpis ?? []).map((kpi, index) => {
      const visual = resolveKpiVisual(kpi.icon_key, kpi.title);
      const Icon = visual.Icon;

      return {
        id: `${kpi.title}-${index}`,
        label: kpi.title,
        displayValue: kpi.value_display,
        icon: <Icon className="h-5 w-5" />,
        tone: visual.tone,
        showAccent: visual.showAccent,
        iconContainerClassName: visual.iconContainerClassName,
        trend: kpi.delta_display
          ? {
              direction: kpi.is_positive ? "up" : "down",
              text: kpi.delta_display,
            }
          : undefined,
      };
    });
  }, [overviewQuery.data?.kpis]);

  const overview = overviewQuery.data;
  const reportContext = overview?.report_context;
  const transactions = useMemo(
    () => overview?.recent_transactions ?? [],
    [overview?.recent_transactions],
  );
  const monthlyPerformance = overview?.monthly_performance ?? [];
  const revenueSegments = overview?.revenue_segments ?? [];

  const dashboardHighlights = useMemo<DashboardHighlight[]>(() => {
    const incomeTransactions = transactions.filter(isIncomeCategory).length;
    const expenseTransactions = transactions.filter(isExpenseCategory).length;

    return [
      {
        label: "Transaksi",
        value: `${transactions.length}`,
        hint: "Aktivitas terbaru yang sudah masuk ke ringkasan hari ini.",
        Icon: FileText,
        className:
          "border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200",
      },
      {
        label: "Pendapatan",
        value: `${incomeTransactions}`,
        hint: "Transaksi pemasukan yang terdeteksi pada periode aktif.",
        Icon: Wallet,
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300",
      },
      {
        label: "Pengeluaran",
        value: `${expenseTransactions}`,
        hint: "Transaksi biaya yang perlu dipantau dampaknya ke kas.",
        Icon: ReceiptText,
        className:
          "border-red-200 bg-red-50 text-red-800 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300",
      },
    ];
  }, [transactions]);

  return (
    <div className="space-y-6" data-testid="accounting-dashboard-page-root">
      <section
        className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
        data-testid="accounting-dashboard-page-main"
      >
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.9fr)]">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="border border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/70 dark:bg-indigo-950/40 dark:text-indigo-300">
                Accounting overview
              </Badge>
              <Badge className={toContextBadgeClassName(reportContext)}>
                {reportContext?.auto_fallback_applied
                  ? "Fallback data aktif"
                  : "Data utama aktif"}
              </Badge>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                Accounting Dashboard
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                Ringkasan kas, laba, dan aktivitas transaksi untuk memudahkan tim
                BUMDes membaca posisi keuangan harian tanpa harus masuk ke setiap
                modul pelaporan.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <DashboardMetaCard
                Icon={CalendarDays}
                label="Periode"
                value={overview?.period_label || "Hari ini"}
                hint={
                  reportContext?.effective_preset
                    ? `Preset ${toSentenceCase(reportContext.effective_preset)}`
                    : "Mengikuti preset dashboard aktif"
                }
              />
              <DashboardMetaCard
                Icon={Clock3}
                label="Terakhir diperbarui"
                value={formatTimestamp(overview?.updated_at)}
                hint="Gunakan waktu ini untuk memastikan data yang dibaca masih relevan."
              />
              <DashboardMetaCard
                Icon={
                  reportContext?.auto_fallback_applied ? CircleAlert : CircleCheck
                }
                label="Sumber data"
                value={toSentenceCase(reportContext?.source_of_truth)}
                hint={
                  reportContext?.fallback_reason
                    ? "Ada fallback yang diterapkan pada periode ini."
                    : "Data laporan memakai sumber utama yang tersedia."
                }
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link
                  href="/bumdes/accounting/reporting"
                  data-testid="accounting-dashboard-reporting-link"
                >
                  Buka Reporting
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link
                  href="/bumdes/accounting/journal"
                  data-testid="accounting-dashboard-journal-link"
                >
                  Lihat Jurnal
                </Link>
              </Button>
            </div>
          </div>

          <Card className="rounded-[24px] border-slate-200 bg-slate-50/80 py-0 shadow-none dark:border-slate-800 dark:bg-slate-900/70">
            <CardHeader className="px-5 py-5">
              <CardTitle className="text-base text-slate-900 dark:text-slate-50">
                Status laporan
              </CardTitle>
              <CardDescription className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                Panel ini merangkum konteks data yang sedang dipakai dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-5 pb-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    Tier laporan
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {toSentenceCase(reportContext?.report_tier)}
                  </span>
                </div>
                <div className="mt-3 h-px bg-slate-200 dark:bg-slate-800" />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    Preset efektif
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {toSentenceCase(reportContext?.effective_preset)}
                  </span>
                </div>
              </div>

              {reportContext?.fallback_reason ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-300">
                  <span className="font-medium">Catatan fallback:</span>{" "}
                  {reportContext.fallback_reason}
                </div>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                {dashboardHighlights.map((highlight) => (
                  <DashboardHighlightCard
                    key={highlight.label}
                    highlight={highlight}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {overviewQuery.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">
          {toAccountingReportingApiError(overviewQuery.error).message}
        </div>
      ) : null}

      <section className="space-y-4" data-testid="accounting-dashboard-kpi-grid">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Ringkasan utama
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              KPI harian yang paling sering dipakai untuk membaca performa accounting.
            </p>
          </div>
          <Badge className="border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            {metrics.length || 0} indikator
          </Badge>
        </div>

        <SummaryMetricsGrid
          metrics={metrics}
          isLoading={overviewQuery.isPending && !overview}
          isError={Boolean(overviewQuery.error)}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Card
          className="flex max-h-[34rem] flex-col rounded-[28px] border-slate-200 py-0 shadow-sm dark:border-slate-800"
          data-testid="accounting-dashboard-monthly-performance"
        >
          <CardHeader className="px-6 py-5">
            <CardTitle className="text-base text-slate-900 dark:text-slate-50">
              Performa bulanan
            </CardTitle>
            <CardDescription className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Perbandingan cepat antara pendapatan dan pengeluaran pada periode
              performa terakhir.
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-0 flex-1 px-6 pb-6">
            {overviewQuery.isPending && !overview ? (
              <div className="max-h-[24rem] space-y-3 overflow-y-auto pr-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={`performance-skeleton-${index}`}
                    className="animate-pulse rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70"
                  >
                    <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="mt-4 h-2 w-full rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="mt-3 h-2 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                  </div>
                ))}
              </div>
            ) : monthlyPerformance.length ? (
              <div className="max-h-[24rem] space-y-3 overflow-y-auto pr-2">
                {monthlyPerformance.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/70"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        {item.label}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-indigo-600" />
                          Pendapatan {clampPercentage(item.revenue_pct)}%
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                          Pengeluaran {clampPercentage(item.expense_pct)}%
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>Pendapatan</span>
                          <span>{clampPercentage(item.revenue_pct)}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                          <div
                            className="h-2 rounded-full bg-indigo-600"
                            style={{ width: `${clampPercentage(item.revenue_pct)}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>Pengeluaran</span>
                          <span>{clampPercentage(item.expense_pct)}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                          <div
                            className="h-2 rounded-full bg-slate-400 dark:bg-slate-500"
                            style={{ width: `${clampPercentage(item.expense_pct)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <InsightCardEmptyState message="Belum ada data performa bulanan untuk ditampilkan." />
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-slate-200 py-0 shadow-sm dark:border-slate-800">
          <CardHeader className="px-6 py-5">
            <CardTitle className="text-base text-slate-900 dark:text-slate-50">
              Komposisi pendapatan
            </CardTitle>
            <CardDescription className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              Membantu melihat kontribusi kanal pendapatan yang sedang dominan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6">
            {overviewQuery.isPending && !overview ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`segment-skeleton-${index}`}
                  className="animate-pulse space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70"
                >
                  <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-2 w-full rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              ))
            ) : revenueSegments.length ? (
              <>
                {revenueSegments.map((segment, index) => (
                  <div
                    key={`${segment.label_display}-${index}`}
                    className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/70"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        {segment.label_display}
                      </p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {clampPercentage(segment.pct)}%
                      </p>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                      <div
                        className={`h-2 rounded-full ${SEGMENT_BAR_CLASS_NAMES[index % SEGMENT_BAR_CLASS_NAMES.length]}`}
                        style={{ width: `${clampPercentage(segment.pct)}%` }}
                      />
                    </div>
                  </div>
                ))}

                <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Insight cepat
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Fokuskan review pada segmen dengan porsi tertinggi untuk
                    memastikan pencatatan revenue dan pengakuan beban pendukungnya
                    tetap seimbang.
                  </p>
                </div>
              </>
            ) : (
              <InsightCardEmptyState message="Belum ada komposisi pendapatan yang tersedia pada periode ini." />
            )}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Trace operasional
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Gunakan workbench ini untuk menelusuri kesiapan posting dan tindak lanjut
            operasional.
          </p>
        </div>
        <FeatureOperationalTraceWorkbench />
      </section>

      <Card
        className="rounded-[28px] border-slate-200 py-0 shadow-sm dark:border-slate-800"
        data-testid="accounting-dashboard-recent-transactions"
      >
        <CardHeader className="px-6 py-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <CardTitle className="text-base text-slate-900 dark:text-slate-50">
                Recent transactions
              </CardTitle>
              <CardDescription className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Aktivitas transaksi terbaru untuk validasi cepat sebelum masuk ke
                jurnal dan laporan.
              </CardDescription>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {dashboardHighlights.map((highlight) => (
                <DashboardHighlightCard
                  key={`transactions-${highlight.label}`}
                  highlight={highlight}
                />
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          <TableShell
            columns={[
              {
                id: "date_display",
                header: <>Date</>,
                cell: ({ row }) => (
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {row.original.date_display}
                  </span>
                ),
              },
              {
                id: "description",
                header: <>Description</>,
                cell: ({ row }) => (
                  <div className="space-y-1">
                    <p className="font-medium text-slate-900 dark:text-slate-50">
                      {row.original.description}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Pencatatan transaksi harian
                    </p>
                  </div>
                ),
              },
              {
                id: "category",
                header: <>Category</>,
                cell: ({ row }) => (
                  <Badge className={toBadgeClassName(row.original.category)}>
                    {row.original.category}
                  </Badge>
                ),
              },
              {
                id: "amount_display",
                header: <>Amount</>,
                cell: ({ row }) => (
                  <span className={toAmountClassName(row.original.category)}>
                    {row.original.amount_display}
                  </span>
                ),
                meta: {
                  headerClassName: "text-right",
                  cellClassName: "text-right font-semibold",
                },
              },
            ]}
            data={transactions}
            getRowId={(row, index) => `${row.date_display}-${index}`}
            loading={overviewQuery.isPending && !overview}
            loadingState="Loading transactions..."
            emptyState="No transaction data available."
          />
        </CardContent>
      </Card>
    </div>
  );
}
