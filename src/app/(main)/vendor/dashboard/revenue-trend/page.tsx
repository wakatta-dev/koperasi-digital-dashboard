/** @format */

"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { FileDown, LineChart } from "lucide-react";
import { toast } from "sonner";

import { ensureSuccess } from "@/lib/api";
import { buildReactQueryRetry } from "@/lib/rate-limit";
import { exportVendorReportRaw, getVendorFinancialReport } from "@/services/api";
import type {
  BillingReportResponse,
  OverdueInvoiceResponse,
  VendorFinancialReport,
} from "@/types/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import { VendorDashboardGlobalFilters } from "@/components/feature/vendor/dashboard/vendor-dashboard-filters";
import { useVendorDashboardDateParams } from "@/components/feature/vendor/dashboard/vendor-dashboard-hooks";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const groupByOptions = [
  { value: "month", label: "Bulanan" },
  { value: "quarter", label: "Kuartal" },
  { value: "year", label: "Tahunan" },
] as const;

const formatOptions = [
  { value: "xlsx", label: "Spreadsheet (.xlsx)" },
  { value: "pdf", label: "PDF" },
] as const;

type GroupByValue = (typeof groupByOptions)[number]["value"];
type ExportFormatValue = (typeof formatOptions)[number]["value"];

const revenueChartConfig = {
  mrr: {
    label: "MRR",
    color: "hsl(var(--chart-1))",
  },
  arr: {
    label: "ARR",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const statusChartConfig = {
  paid: {
    label: "Terbayar",
    color: "hsl(var(--chart-2))",
  },
  pending: {
    label: "Menunggu",
    color: "hsl(var(--chart-3))",
  },
  overdue: {
    label: "Terlambat",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export default function VendorRevenueTrendPage() {
  const { start, end } = useVendorDashboardDateParams();
  const [groupBy, setGroupBy] = useState<GroupByValue>("month");
  const [exportFormat, setExportFormat] = useState<ExportFormatValue>("xlsx");
  const [exporting, setExporting] = useState(false);

  const financialParams = useMemo(
    () => ({ start, end, groupBy }),
    [start, end, groupBy],
  );

  const {
    data: financialData,
    error: financialError,
    isLoading: financialLoading,
    isFetching: financialFetching,
    refetch: refetchFinancial,
  } = useQuery({
    queryKey: [
      "vendor-dashboard",
      "revenue-trend",
      "financial",
      financialParams,
    ],
    queryFn: async ({ queryKey }) => {
      const [, , , params] = queryKey as [
        string,
        string,
        string,
        { start?: string; end?: string; groupBy: GroupByValue },
      ];
      return ensureSuccess<VendorFinancialReport>(
        await getVendorFinancialReport({
          start_date: params.start,
          end_date: params.end,
          group_by: params.groupBy,
        }),
      );
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    retry: buildReactQueryRetry(),
  });

  const {
    data: billingData,
    error: billingError,
    isLoading: billingLoading,
    isFetching: billingFetching,
    refetch: refetchBilling,
  } = useVendorBillingReport();

  const financialSeries = financialData?.series ?? [];
  const revenueTotals = financialData?.totals ?? { mrr: 0, arr: 0 };
  const billingStatus = billingData?.status_detail ?? {
    paid: 0,
    pending: 0,
    overdue: 0,
  };
  const billingRevenue = billingData?.revenue ?? {
    subscription: 0,
    outstanding: 0,
  };
  const overdueInvoices = useMemo(
    () => billingData?.overdue_invoices ?? [],
    [billingData?.overdue_invoices]
  );
  const limitedOverdueInvoices = useMemo(
    () => overdueInvoices.slice(0, 15),
    [overdueInvoices]
  );
  const showOverdueNote = overdueInvoices.length > limitedOverdueInvoices.length;
  const totalInvoices = billingData?.total_invoices ?? 0;

  const statusData = buildStatusChartData(billingStatus);
  const statusTotal = statusData.reduce((sum, item) => sum + item.value, 0);

  const loadingRevenueChart = financialLoading && !financialData;
  const loadingBillingCards = billingLoading && !billingData;

  async function handleExport() {
    if (exporting) return;
    setExporting(true);
    try {
      const blob = await exportVendorReportRaw({
        report_type: "financial",
        format: exportFormat,
        params: {
          start_date: start,
          end_date: end,
          group_by: groupBy,
        },
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      const rangeLabel = [start, end].filter(Boolean).join("-" ) || "all";
      anchor.download = `vendor-financial-report-${rangeLabel}.${exportFormat}`;
      anchor.click();
      window.URL.revokeObjectURL(url);
      toast.success("Laporan finansial vendor berhasil diekspor");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal mengekspor laporan finansial";
      toast.error(message);
    } finally {
      setExporting(false);
    }
  }

  const hasError = Boolean(financialError || billingError);

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>Vendor</li>
            <li>/</li>
            <li>Dashboard</li>
            <li>/</li>
            <li className="font-medium text-foreground">Tren Pendapatan</li>
          </ol>
        </nav>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            Tren Pendapatan & Billing
          </h1>
          <p className="text-sm text-muted-foreground">
            Visualisasi mendalam laporan finansial vendor, status tagihan, dan proyeksi arus kas.
          </p>
        </div>
      </header>

      <VendorDashboardGlobalFilters />

      <Card>
        <CardHeader className="flex flex-col gap-4 pb-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <LineChart className="h-4 w-4" /> Rentang Analisis
            </CardTitle>
            <CardDescription>
              Sesuaikan agregasi periode dan format ekspor untuk laporan finansial.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select value={groupBy} onValueChange={(value) => setGroupBy(value as GroupByValue)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Kelompokkan" />
              </SelectTrigger>
              <SelectContent>
                {groupByOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={exportFormat}
              onValueChange={(value) => setExportFormat(value as ExportFormatValue)}
            >
              <SelectTrigger className="w-[210px]">
                <SelectValue placeholder="Format ekspor" />
              </SelectTrigger>
              <SelectContent>
                {formatOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              disabled={exporting}
              onClick={handleExport}
            >
              <FileDown className="h-4 w-4" />
              {exporting ? "Memproses…" : "Ekspor laporan"}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {hasError ? (
        <Alert variant="destructive">
          <AlertTitle>Data laporan tidak dapat dimuat</AlertTitle>
          <AlertDescription className="flex flex-col gap-3">
            <span>
              {financialError instanceof Error
                ? financialError.message
                : billingError instanceof Error
                  ? billingError.message
                  : "Terjadi kesalahan saat mengambil data finansial."}
            </span>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => void refetchFinancial()}>
                Segarkan data finansial
              </Button>
              <Button size="sm" variant="outline" onClick={() => void refetchBilling()}>
                Segarkan data billing
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card className="h-full">
          <CardHeader className="flex flex-col gap-2 pb-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">Pendapatan Berulang (MRR & ARR)</CardTitle>
              <CardDescription>
                Lacak pertumbuhan pendapatan berdasarkan periode {groupByLabel(groupBy)}.
              </CardDescription>
            </div>
            {financialFetching ? (
              <span className="text-xs text-muted-foreground">Memperbarui data…</span>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-6">
            {loadingRevenueChart ? (
              <Skeleton className="h-[280px] w-full" />
            ) : financialSeries.length ? (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <SummaryTile label="Total MRR" value={currencyFormatter.format(revenueTotals.mrr ?? 0)} />
                  <SummaryTile label="Total ARR" value={currencyFormatter.format(revenueTotals.arr ?? 0)} />
                </div>
                <ChartContainer config={revenueChartConfig} className="h-[300px] w-full">
                  <AreaChart data={financialSeries} margin={{ left: 12, right: 12, top: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" tickLine={false} axisLine={false} />
                    <YAxis tickFormatter={(value) => currencyFormatter.format(value).replace(/,00$/, "")} width={90} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value, name) => [
                            currencyFormatter.format(Number(value)),
                            name,
                          ]}
                        />
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="mrr"
                      stroke="var(--color-mrr)"
                      fill="var(--color-mrr)"
                      fillOpacity={0.18}
                    />
                    <Area
                      type="monotone"
                      dataKey="arr"
                      stroke="var(--color-arr)"
                      fill="var(--color-arr)"
                      fillOpacity={0.18}
                    />
                  </AreaChart>
                </ChartContainer>
              </>
            ) : (
              <div className="flex h-[280px] items-center justify-center rounded-lg border text-sm text-muted-foreground">
                Tidak ada data pendapatan berulang untuk filter saat ini.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Kinerja Billing</CardTitle>
            <CardDescription>
              Ringkasan status tagihan dan komposisi pendapatan berdasarkan laporan billing API.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {billingFetching ? (
              <span className="text-xs text-muted-foreground">Memperbarui data billing…</span>
            ) : null}
            {loadingBillingCards ? (
              <Skeleton className="h-[220px] w-full" />
            ) : (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <SummaryTile label="Total invoice" value={totalInvoices.toLocaleString("id-ID")} />
                  <SummaryTile
                    label="Pendapatan langganan"
                    value={currencyFormatter.format(billingRevenue.subscription ?? 0)}
                  />
                  <SummaryTile
                    label="Tagihan outstanding"
                    value={currencyFormatter.format(billingRevenue.outstanding ?? 0)}
                  />
                  <SummaryTile
                    label="Nilai overdue"
                    value={currencyFormatter.format(calculateOverdueValue(overdueInvoices))}
                  />
                </div>
                <ChartContainer config={statusChartConfig} className="h-[220px] w-full">
                  <BarChart data={statusData} margin={{ top: 16, left: 12, right: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value, name) => [
                            `${Number(value).toLocaleString("id-ID")} invoice`,
                            name,
                          ]}
                        />
                      }
                    />
                    <Bar dataKey="value" radius={6} />
                  </BarChart>
                </ChartContainer>
                <div className="grid gap-2 text-xs text-muted-foreground">
                  {statusData.map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded-sm" style={{ background: `var(--color-${item.key})` }} />
                        {item.label}
                      </span>
                      <span className="font-medium text-foreground">
                        {item.value.toLocaleString("id-ID")} invoice
                        {statusTotal
                          ? ` (${Math.round((item.value / statusTotal) * 100)}%)`
                          : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Invoice Overdue Prioritas</CardTitle>
          <CardDescription>
            Data langsung dari endpoint <code>GET /api/reports/billing</code> untuk memantau risiko kas.
          </CardDescription>
        </CardHeader>
        <CardContent>
        {limitedOverdueInvoices.length ? (
          <>
            <div className="max-h-80 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nomor Invoice</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead className="text-right">Nilai</TableHead>
                    <TableHead>Jatuh Tempo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {limitedOverdueInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.number}</TableCell>
                      <TableCell>#{invoice.tenant_id}</TableCell>
                      <TableCell className="text-right">
                        {currencyFormatter.format(invoice.total ?? 0)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">{formatInvoiceDueDate(invoice)}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {showOverdueNote ? (
              <p className="mt-3 text-xs text-muted-foreground">
                {`Menampilkan ${limitedOverdueInvoices.length} dari ${overdueInvoices.length} invoice overdue.`}
              </p>
            ) : null}
          </>
        ) : (
            <div className="rounded-lg border bg-muted/30 p-6 text-sm text-muted-foreground">
              Seluruh invoice dalam kondisi sehat. Tidak ada keterlambatan teridentifikasi.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function buildStatusChartData(status: BillingReportResponse["status_detail"]) {
  return [
    { key: "paid", label: "Terbayar", value: status?.paid ?? 0 },
    { key: "pending", label: "Menunggu", value: status?.pending ?? 0 },
    { key: "overdue", label: "Terlambat", value: status?.overdue ?? 0 },
  ];
}

function groupByLabel(value: string) {
  const option = groupByOptions.find((item) => item.value === value);
  return option?.label.toLowerCase() ?? "periode";
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

function calculateOverdueValue(invoices: OverdueInvoiceResponse[]) {
  return invoices.reduce((sum, invoice) => sum + (invoice.total ?? 0), 0);
}

function formatInvoiceDueDate(invoice: OverdueInvoiceResponse) {
  try {
    const parsed = parseISO(invoice.due_date);
    return format(parsed, "d MMM yyyy", { locale: localeId });
  } catch (_error) {
    return invoice.due_date;
  }
}
