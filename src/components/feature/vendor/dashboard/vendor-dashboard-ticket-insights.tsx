/** @format */

"use client";

import type { ReactNode } from "react";
import { AlertCircle, Ticket, UsersRound, PackageSearch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useVendorDashboardData } from "./vendor-dashboard-data-provider";

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

export function VendorDashboardTicketInsights() {
  const {
    openTickets,
    mostActiveClient,
    productWithMostTickets,
    isLoading,
    data,
  } = useVendorDashboardData();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Insight Dukungan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border px-4 py-3">
          <div className="space-y-1 text-sm">
            <p className="font-medium flex items-center gap-2">
              <Ticket className="h-4 w-4" /> Tiket Terbuka
            </p>
            <p className="text-muted-foreground">
              Total tiket yang menunggu penanganan
            </p>
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <Badge variant="outline" className="text-base font-semibold">
              {formatNumber(openTickets)}
            </Badge>
          )}
        </div>

        <div className="grid gap-3">
          <InsightItem
            icon={<UsersRound className="h-4 w-4" />}
            title="Klien Paling Aktif"
            description={mostActiveClient?.name ?? "Belum ada aktivitas yang menonjol"}
            metric={mostActiveClient?.ticket_count}
            loading={isLoading && !data}
          />
          <InsightItem
            icon={<PackageSearch className="h-4 w-4" />}
            title="Produk dengan Eskalasi Tertinggi"
            description={
              productWithMostTickets?.name ?? "Tidak ada produk yang mendominasi tiket"
            }
            metric={productWithMostTickets?.ticket_count}
            loading={isLoading && !data}
          />
        </div>
      </CardContent>
    </Card>
  );
}

type InsightItemProps = {
  icon: ReactNode;
  title: string;
  description: string;
  metric?: number;
  loading?: boolean;
};

function InsightItem({ icon, title, description, metric, loading }: InsightItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border px-3 py-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
        {icon}
      </span>
      <div className="flex-1 space-y-1 text-sm">
        <p className="font-medium leading-none">{title}</p>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="min-w-[72px] text-right text-sm font-semibold text-muted-foreground">
        {loading ? (
          <Skeleton className="h-5 w-full" />
        ) : typeof metric === "number" ? (
          formatNumber(metric)
        ) : (
          <AlertCircle className="mx-auto h-4 w-4" />
        )}
      </div>
    </div>
  );
}
