/** @format */

"use client";

import { Users, Ticket, Target, PackageSearch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useVendorDashboardData } from "./vendor-dashboard-data-provider";

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

export function VendorDashboardKpiGrid() {
  const {
    totalActiveClients,
    openTickets,
    mostActiveClient,
    productWithMostTickets,
    isLoading,
    data,
  } = useVendorDashboardData();

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Klien Aktif</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <div className="text-2xl font-semibold">
              {formatNumber(totalActiveClients)}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tiket Terbuka</CardTitle>
          <Ticket className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-semibold">{formatNumber(openTickets)}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Klien Paling Aktif</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading ? (
            <Skeleton className="h-5 w-36" />
          ) : mostActiveClient ? (
            <div className="space-y-1">
              <p className="font-medium leading-none">{mostActiveClient.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatNumber(mostActiveClient.ticket_count)} tiket dalam 30 hari terakhir
              </p>
            </div>
          ) : data ? (
            <p className="text-sm text-muted-foreground">
              Belum ada aktivitas tiket yang menonjol.
            </p>
          ) : (
            <Skeleton className="h-5 w-24" />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Produk dengan Tiket Terbanyak</CardTitle>
          <PackageSearch className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading ? (
            <Skeleton className="h-5 w-32" />
          ) : productWithMostTickets ? (
            <div className="space-y-1">
              <p className="font-medium leading-none">
                {productWithMostTickets.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatNumber(productWithMostTickets.ticket_count)} tiket aktif
              </p>
            </div>
          ) : data ? (
            <p className="text-sm text-muted-foreground">
              Tidak ada produk dengan eskalasi tinggi saat ini.
            </p>
          ) : (
            <Skeleton className="h-5 w-24" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
