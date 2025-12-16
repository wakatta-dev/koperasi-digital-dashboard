/** @format */

"use client";

import { useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangeControls } from "@/modules/finance/components/DateRangeControls";
import { useDateRange } from "@/modules/finance/hooks/useDateRange";
import { useFinanceOverview } from "@/modules/finance/hooks/useFinanceReport";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/modules/finance/components/state-placeholders";
import { cn } from "@/lib/utils";

export default function RingkasanReportPage() {
  const { value, setPreset, setCustomRange } = useDateRange("month");
  const params = useMemo(
    () => ({
      preset: value.preset,
      start: value.start,
      end: value.end,
    }),
    [value.end, value.preset, value.start]
  );
  const overviewQuery = useFinanceOverview(params);

  return (
    <div className="flex flex-col gap-6 bg-background p-4 sm:p-6 rounded-xl border border-border/60 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Breadcrumb>
          <BreadcrumbList className="text-sm text-muted-foreground">
            <BreadcrumbItem>
              <BreadcrumbLink href="/bumdes/dashboard">BUMDes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/bumdes/report">
                Laporan Keuangan
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Ringkasan</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="text-xs text-muted-foreground">
          Periode: {value.label ?? "Pilih rentang"} ({params.start} -{" "}
          {params.end})
        </div>
      </div>

      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Filter Periode
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <DateRangeControls
            value={{ ...value, label: value.label }}
            onPresetChange={setPreset}
            onCustomApply={setCustomRange}
          />
          <div className="flex flex-wrap gap-2">
            <Button size="sm">Terapkan</Button>
            <Button size="sm" variant="outline">
              Ekspor PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {overviewQuery.isLoading ? (
        <LoadingState lines={6} />
      ) : overviewQuery.isError ? (
        <ErrorState onRetry={() => overviewQuery.refetch()} />
      ) : !overviewQuery.data ? (
        <EmptyState onRetry={() => overviewQuery.refetch()} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {overviewQuery.data.kpis.map((kpi) => {
              const isPositive = kpi.positive ?? true;
              return (
                <Card
                  key={kpi.title}
                  className="border border-border/60 shadow-sm"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">
                      {kpi.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-2xl font-bold text-foreground">
                      {kpi.value}
                    </div>
                    {kpi.delta ? (
                      <span
                        className={cn(
                          "text-xs font-medium px-2 py-1 rounded-full inline-flex",
                          isPositive
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
                            : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300"
                        )}
                      >
                        {kpi.delta}
                      </span>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                  Pendapatan per Produk
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {overviewQuery.data.revenue_breakdown.map((row) => (
                  <div key={row.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {row.label}
                      </span>
                      <span className="font-semibold text-foreground">
                        Rp {row.value.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-foreground font-medium">
                        {row.pct}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-border/60 shadow-sm">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  Pendapatan per Channel
                </CardTitle>
                <Button size="sm" variant="outline">
                  Ekspor
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {overviewQuery.data.channel_breakdown.map((ch) => (
                    <div
                      key={ch.id}
                      className="rounded-lg border border-border/60 p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">
                          {ch.name}
                        </span>
                        <span className="text-foreground font-semibold">
                          {ch.pct}%
                        </span>
                      </div>
                      <div
                        className="h-2 rounded-full bg-primary/20"
                        style={{ width: `${ch.pct}%` }}
                      />
                      <div className="text-xs text-muted-foreground">
                        Rp {ch.value.toLocaleString("id-ID")}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border border-border/60 p-3">
                  <div className="flex items-center justify-between text-sm font-medium text-foreground mb-2">
                    <span>Arus Kas</span>
                    <span>
                      Rp{" "}
                      {(
                        overviewQuery.data.channel_breakdown?.[0]?.value ?? 0
                      ).toLocaleString("id-ID")}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Ringkasan channel berdasarkan data periode terpilih.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
