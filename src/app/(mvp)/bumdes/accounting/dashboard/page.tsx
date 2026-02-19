/** @format */

"use client";

import { useMemo } from "react";
import {
  FileText,
  Landmark,
  ReceiptText,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { SummaryMetricsGrid, type SummaryMetricItem } from "@/components/shared/data-display/SummaryMetricsGrid";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAccountingReportingOverview } from "@/hooks/queries";
import { toAccountingReportingApiError } from "@/services/api/accounting-reporting";

const DASHBOARD_PRESET = "today";

type MetricVisual = {
  Icon: LucideIcon;
  tone: SummaryMetricItem["tone"];
  iconContainerClassName: string;
  showAccent: boolean;
};

const KPI_VISUALS: Record<string, MetricVisual> = {
  total_pendapatan: {
    Icon: Wallet,
    tone: "success",
    iconContainerClassName:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    showAccent: true,
  },
  total_pengeluaran: {
    Icon: ReceiptText,
    tone: "danger",
    iconContainerClassName:
      "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
    showAccent: true,
  },
  laba_bersih: {
    Icon: TrendingUp,
    tone: "primary",
    iconContainerClassName:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
    showAccent: true,
  },
  saldo_kas: {
    Icon: Landmark,
    tone: "info",
    iconContainerClassName:
      "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    showAccent: true,
  },
  total_revenue: {
    Icon: Wallet,
    tone: "success",
    iconContainerClassName:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    showAccent: true,
  },
  total_expense: {
    Icon: ReceiptText,
    tone: "danger",
    iconContainerClassName:
      "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
    showAccent: true,
  },
  net_profit: {
    Icon: TrendingUp,
    tone: "primary",
    iconContainerClassName:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
    showAccent: true,
  },
  cash_balance: {
    Icon: Landmark,
    tone: "info",
    iconContainerClassName:
      "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    showAccent: true,
  },
};

const DEFAULT_KPI_VISUAL: MetricVisual = {
  Icon: FileText,
  tone: "neutral",
  iconContainerClassName: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  showAccent: false,
};

function normalizeVisualKey(value?: string): string {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function resolveKpiVisual(iconKey: string | undefined, title: string): MetricVisual {
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
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
  }
  if (normalized.includes("income") || normalized.includes("pendapatan")) {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
  }
  return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
}

export default function AccountingDashboardPage() {
  const overviewQuery = useAccountingReportingOverview({ preset: DASHBOARD_PRESET });

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

  const transactions = overviewQuery.data?.recent_transactions ?? [];

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold">Accounting Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          {overviewQuery.data?.period_label || "Period not available"}
        </p>
      </section>

      {overviewQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {toAccountingReportingApiError(overviewQuery.error).message}
        </div>
      ) : null}

      <SummaryMetricsGrid
        metrics={metrics}
        isLoading={overviewQuery.isPending && !overviewQuery.data}
        isError={Boolean(overviewQuery.error)}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overviewQuery.isPending && !overviewQuery.data ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-sm text-gray-500">
                    Loading transactions...
                  </TableCell>
                </TableRow>
              ) : null}
              {!overviewQuery.isPending && transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-sm text-gray-500">
                    No transaction data available.
                  </TableCell>
                </TableRow>
              ) : null}
              {transactions.map((transaction, index) => (
                <TableRow key={`${transaction.date_display}-${index}`}>
                  <TableCell>{transaction.date_display}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <Badge className={toBadgeClassName(transaction.category)}>
                      {transaction.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">{transaction.amount_display}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
