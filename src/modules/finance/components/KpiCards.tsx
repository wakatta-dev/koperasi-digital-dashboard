/** @format */

"use client";

import {
  ArrowDown,
  ArrowUp,
  CreditCard,
  ShoppingCart,
  Users,
} from "lucide-react";
import type { SalesKpi } from "../types";
import { formatInteger, formatRupiah } from "../lib/formatters";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/shared/feedback/async-states";
import {
  KpiGridBase,
  type KpiItem,
} from "@/components/shared/data-display/KpiGridBase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  kpis?: SalesKpi;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
};

function Trend({
  direction,
  label,
}: {
  direction?: SalesKpi["delta_direction"];
  label?: string;
}) {
  if (!label) return null;
  const Icon =
    direction === "down" ? ArrowDown : direction === "up" ? ArrowUp : null;
  const color =
    direction === "down"
      ? "text-red-500 bg-red-50 dark:bg-red-500/10"
      : direction === "up"
      ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10"
      : "text-muted-foreground bg-muted/30";
  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${color}`}
    >
      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
      <span>{label}</span>
    </div>
  );
}

export function KpiCards({ kpis, isLoading, isError, onRetry }: Props) {
  if (isLoading) return <LoadingState lines={4} />;
  if (isError) return <ErrorState onRetry={onRetry} />;
  if (!kpis)
    return (
      <EmptyState
        description="Sesuaikan rentang tanggal atau ekspor setelah data tersedia."
        onRetry={onRetry}
      />
    );

  const cards: KpiItem[] = [
    {
      id: "total_revenue",
      label: "Omzet Total",
      value: formatRupiah(kpis.total_revenue),
      icon: (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white shadow">
          <CreditCard className="h-5 w-5" />
        </div>
      ),
      trend: {
        direction: kpis.delta_direction === "down" ? "down" : kpis.delta_direction === "up" ? "up" : "neutral",
        label: kpis.delta_label,
      },
    },
    {
      id: "transaction_count",
      label: "Jumlah Transaksi",
      value: formatInteger(kpis.transaction_count),
      icon: (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white shadow">
          <ShoppingCart className="h-5 w-5" />
        </div>
      ),
      trend: {
        direction: kpis.delta_direction === "down" ? "down" : kpis.delta_direction === "up" ? "up" : "neutral",
        label: kpis.delta_label,
      },
    },
    {
      id: "average_ticket",
      label: "Rata-rata Transaksi",
      value: formatRupiah(kpis.average_ticket),
      icon: (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white shadow">
          <Users className="h-5 w-5" />
        </div>
      ),
      trend: {
        direction: kpis.delta_direction === "down" ? "down" : kpis.delta_direction === "up" ? "up" : "neutral",
        label: kpis.delta_label,
      },
    },
  ];

  return (
    <KpiGridBase
      items={cards.map((card) => ({
        ...card,
        footer: (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Periode</span>
            {card.trend?.direction && card.trend.direction !== "neutral" ? (
              <span className="flex items-center gap-1">
                {card.trend.direction === "down" ? "Menurun" : "Naik"}
              </span>
            ) : null}
          </div>
        ),
      }))}
      columns={{ md: 2, xl: 3 }}
      trendSlot={(trend) => (
        <Trend
          direction={
            trend?.direction === "down"
              ? "down"
              : trend?.direction === "up"
              ? "up"
              : undefined
          }
          label={trend?.label}
        />
      )}
    />
  );
}

export function KpiCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, idx) => (
        <Card key={idx} className="border border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="h-4 w-24" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="mt-2 h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
