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
import { cn } from "@/lib/utils";
import { useCashFlow } from "@/modules/finance/hooks/useFinanceReport";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/modules/finance/components/state-placeholders";

export default function ArusKasReportPage() {
  const { value, setPreset, setCustomRange } = useDateRange("month");
  const params = useMemo(
    () => ({
      preset: value.preset,
      start: value.start,
      end: value.end,
    }),
    [value.end, value.preset, value.start]
  );

  const cashFlowQuery = useCashFlow(params);
  const sections = cashFlowQuery.data?.sections ?? [];
  const netCash =
    sections.flatMap((s) => s.items).reduce((acc, cur) => acc + cur.value, 0) ||
    0;

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
              <BreadcrumbPage>Arus Kas</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="text-xs text-muted-foreground">
          Periode: {value.label ?? "Pilih rentang"} ({params.start} -{" "}
          {params.end})
        </div>
      </div>

      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Filter Periode
          </CardTitle>
          <Button size="sm" variant="outline">
            Ekspor PDF
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <DateRangeControls
            value={{ ...value, label: value.label }}
            onPresetChange={setPreset}
            onCustomApply={setCustomRange}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border border-border/60 shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Arus Kas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cashFlowQuery.isLoading ? (
              <LoadingState lines={6} />
            ) : cashFlowQuery.isError ? (
              <ErrorState onRetry={() => cashFlowQuery.refetch()} />
            ) : !sections.length ? (
              <EmptyState onRetry={() => cashFlowQuery.refetch()} />
            ) : (
              sections.map((section) => (
                <div
                  key={section.title}
                  className="rounded-lg border border-border/60"
                >
                  <div className="px-4 py-3 border-b border-border/60 text-sm font-semibold text-foreground">
                    {section.title}
                  </div>
                  <div className="divide-y divide-border">
                    {section.items.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between px-4 py-3 text-sm"
                      >
                        <span
                          className={cn(
                            item.value < 0 && "text-muted-foreground"
                          )}
                        >
                          {item.label}
                        </span>
                        <span
                          className={cn(
                            "font-semibold",
                            item.value >= 0
                              ? "text-emerald-600"
                              : "text-red-500"
                          )}
                        >
                          {item.value < 0 ? "-" : "+"} Rp{" "}
                          {Math.abs(item.value).toLocaleString("id-ID")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Ringkasan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {cashFlowQuery.isLoading ? (
              <LoadingState lines={3} />
            ) : cashFlowQuery.isError ? (
              <ErrorState onRetry={() => cashFlowQuery.refetch()} />
            ) : !sections.length ? (
              <EmptyState onRetry={() => cashFlowQuery.refetch()} />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Kas Bersih</span>
                  <span
                    className={cn(
                      "font-semibold",
                      netCash >= 0 ? "text-emerald-600" : "text-red-500"
                    )}
                  >
                    {netCash >= 0 ? "+" : "-"} Rp{" "}
                    {Math.abs(netCash).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
                  Perubahan kas mencakup operasi, investasi, dan pendanaan.
                  Catat peningkatan biaya operasional untuk mitigasi bulan
                  depan.
                </div>
                <Button size="sm" className="w-full">
                  Download Arus Kas
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
