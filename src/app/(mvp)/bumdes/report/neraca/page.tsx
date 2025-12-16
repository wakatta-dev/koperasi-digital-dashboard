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
import { useBalanceSheet } from "@/modules/finance/hooks/useFinanceReport";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/modules/finance/components/state-placeholders";
import type { BalanceRow } from "@/modules/finance/types";

function sum(values: BalanceRow[]) {
  return values.reduce((acc, cur) => acc + cur.value, 0);
}

export default function NeracaReportPage() {
  const { value, setPreset, setCustomRange } = useDateRange("month");
  const params = useMemo(
    () => ({
      preset: value.preset,
      start: value.start,
      end: value.end,
    }),
    [value.end, value.preset, value.start]
  );

  const balanceQuery = useBalanceSheet(params);
  const assets = balanceQuery.data?.assets ?? [];
  const liabilities = balanceQuery.data?.liabilities ?? [];
  const equity = balanceQuery.data?.equity ?? [];
  const totalAssets = sum(assets);
  const totalLiabilities = sum(liabilities);
  const totalEquity = sum(equity);

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
              <BreadcrumbPage>Neraca</BreadcrumbPage>
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
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Aset</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border text-sm">
            {balanceQuery.isLoading ? (
              <LoadingState lines={4} />
            ) : balanceQuery.isError ? (
              <ErrorState onRetry={() => balanceQuery.refetch()} />
            ) : !assets.length ? (
              <EmptyState onRetry={() => balanceQuery.refetch()} />
            ) : (
              <>
                {assets.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-foreground">{item.label}</span>
                    <span className="font-semibold text-foreground">
                      Rp {item.value.toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-3 font-semibold text-foreground">
                  <span>Total Aset</span>
                  <span>Rp {totalAssets.toLocaleString("id-ID")}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Liabilitas
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border text-sm">
            {balanceQuery.isLoading ? (
              <LoadingState lines={4} />
            ) : balanceQuery.isError ? (
              <ErrorState onRetry={() => balanceQuery.refetch()} />
            ) : !liabilities.length ? (
              <EmptyState onRetry={() => balanceQuery.refetch()} />
            ) : (
              <>
                {liabilities.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-foreground">{item.label}</span>
                    <span className="font-semibold text-foreground">
                      Rp {item.value.toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-3 font-semibold text-foreground">
                  <span>Total Liabilitas</span>
                  <span>Rp {totalLiabilities.toLocaleString("id-ID")}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Ekuitas</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border text-sm">
            {balanceQuery.isLoading ? (
              <LoadingState lines={4} />
            ) : balanceQuery.isError ? (
              <ErrorState onRetry={() => balanceQuery.refetch()} />
            ) : !equity.length ? (
              <EmptyState onRetry={() => balanceQuery.refetch()} />
            ) : (
              <>
                {equity.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-foreground">{item.label}</span>
                    <span className="font-semibold text-foreground">
                      Rp {item.value.toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-3 font-semibold text-foreground">
                  <span>Total Ekuitas</span>
                  <span>Rp {totalEquity.toLocaleString("id-ID")}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Keseimbangan
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-foreground space-y-2">
          {balanceQuery.isLoading ? (
            <LoadingState lines={2} />
          ) : balanceQuery.isError ? (
            <ErrorState onRetry={() => balanceQuery.refetch()} />
          ) : !assets.length && !liabilities.length && !equity.length ? (
            <EmptyState onRetry={() => balanceQuery.refetch()} />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span>Aset = Liabilitas + Ekuitas</span>
                <span className="font-semibold">
                  Rp {totalAssets.toLocaleString("id-ID")} = Rp{" "}
                  {(totalLiabilities + totalEquity).toLocaleString("id-ID")}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Pastikan penjumlahan liabilitas dan ekuitas seimbang dengan
                total aset. Angka di atas mencerminkan posisi keuangan saat ini.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
