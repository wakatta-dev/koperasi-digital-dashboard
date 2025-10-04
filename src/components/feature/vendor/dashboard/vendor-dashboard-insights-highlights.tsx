/** @format */

"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { PackageSearch, Target, ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import { useVendorDashboardData } from "./vendor-dashboard-data-provider";

export function VendorDashboardInsightsHighlights() {
  const {
    mostActiveClient,
    productWithMostTickets,
    isLoading,
    isValidating,
  } = useVendorDashboardData();

  const loading = isLoading || isValidating;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <InsightCard
        title="Tenant Paling Aktif"
        icon={<Target className="h-5 w-5 text-muted-foreground" />}
        loading={loading}
        emptyMessage="Belum ada tenant dengan aktivitas tiket menonjol."
        action={
          mostActiveClient
            ? {
                href: `/vendor/clients?tenantId=${mostActiveClient.client_id}`,
                label: "Buka tenant",
              }
            : undefined
        }
      >
        {mostActiveClient ? (
          <div className="space-y-1">
            <p className="text-base font-semibold">{mostActiveClient.name}</p>
            <p className="text-sm text-muted-foreground">
              {mostActiveClient.ticket_count} tiket dalam 30 hari terakhir
            </p>
          </div>
        ) : null}
      </InsightCard>

      <InsightCard
        title="Produk dengan Eskalasi Tertinggi"
        icon={<PackageSearch className="h-5 w-5 text-muted-foreground" />}
        loading={loading}
        emptyMessage="Tidak ada produk dengan tiket tinggi saat ini."
        action={
          productWithMostTickets
            ? {
                href: `/vendor/tickets?productId=${productWithMostTickets.product_id}`,
                label: "Lihat tiket",
              }
            : undefined
        }
      >
        {productWithMostTickets ? (
          <div className="space-y-1">
            <p className="text-base font-semibold">{productWithMostTickets.name}</p>
            <p className="text-sm text-muted-foreground">
              {productWithMostTickets.ticket_count} tiket aktif
            </p>
          </div>
        ) : null}
      </InsightCard>
    </div>
  );
}

function InsightCard({
  title,
  icon,
  loading,
  emptyMessage,
  action,
  children,
}: {
  title: string;
  icon: ReactNode;
  loading?: boolean;
  emptyMessage: string;
  action?: { href: string; label: string };
  children?: ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
        {icon}
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <Skeleton className="h-16 w-full" />
        ) : children ? (
          children
        ) : (
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        )}

        {action ? (
          <Button variant="outline" size="sm" asChild className="gap-1">
            <Link href={action.href}>
              {action.label}
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
