/** @format */
"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { VendorDashboardFilterProvider } from "@/components/feature/vendor/dashboard/vendor-dashboard-filter-context";
import { VendorDashboardDataProvider, useVendorDashboardData } from "@/components/feature/vendor/dashboard/vendor-dashboard-data-provider";
import { VendorDashboardGlobalFilters } from "@/components/feature/vendor/dashboard/vendor-dashboard-filters";
import { VendorDashboardKpiGrid } from "@/components/feature/vendor/dashboard/vendor-dashboard-kpi-grid";
import { VendorDashboardTierBreakdown } from "@/components/feature/vendor/dashboard/vendor-dashboard-tier-breakdown";
import { VendorDashboardTicketInsights } from "@/components/feature/vendor/dashboard/vendor-dashboard-ticket-insights";
import { VendorDashboardUpcomingWidgets } from "@/components/feature/vendor/dashboard/vendor-dashboard-upcoming-widgets";

export default function VendorDashboardPage() {
  return (
    <VendorDashboardFilterProvider>
      <VendorDashboardDataProvider>
        <VendorDashboardPageShell />
      </VendorDashboardDataProvider>
    </VendorDashboardFilterProvider>
  );
}

function VendorDashboardPageShell() {
  const { isError, error, data, refresh } = useVendorDashboardData();
  const hasData = Boolean(data);

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>Vendor</li>
            <li>/</li>
            <li className="font-medium text-foreground">Dashboard</li>
          </ol>
        </nav>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Vendor / Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Ringkasan aktivitas tenant vendor dan status dukungan pelanggan.
          </p>
        </div>
      </header>

      {isError ? (
        <Alert variant="destructive">
          <AlertTitle>Data dashboard tidak dapat dimuat</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{error?.message ?? "Terjadi kesalahan saat mengambil data dashboard."}</p>
            <Button size="sm" variant="outline" onClick={() => refresh()}>
              Coba lagi
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {!hasData && !isError ? (
        <Alert>
          <AlertTitle>Ringkasan belum tersedia</AlertTitle>
          <AlertDescription>
            Sistem belum menerima data dashboard vendor. Widget akan diperbarui secara otomatis
            setelah data tersedia.
          </AlertDescription>
        </Alert>
      ) : null}

      <VendorDashboardGlobalFilters />

      <div className="grid gap-6">
        <section>
          <VendorDashboardKpiGrid />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <VendorDashboardTierBreakdown />
          <VendorDashboardTicketInsights />
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <VendorDashboardUpcomingWidgets />
          <VendorDashboardPlaceholderCard title="Integrasi Billing" />
          <VendorDashboardPlaceholderCard title="Aktivitas Produk" />
        </section>
      </div>
    </div>
  );
}

type PlaceholderCardProps = {
  title: string;
};

function VendorDashboardPlaceholderCard({ title }: PlaceholderCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>Widget akan ditempatkan di sini setelah integrasi backend tersedia.</p>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </CardContent>
    </Card>
  );
}
