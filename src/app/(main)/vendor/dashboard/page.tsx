/** @format */
"use client";

import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  VendorDashboardDataProvider,
  useVendorDashboardData,
} from "@/components/feature/vendor/dashboard/vendor-dashboard-data-provider";
import { VendorDashboardGlobalFilters } from "@/components/feature/vendor/dashboard/vendor-dashboard-filters";
import { VendorDashboardKpiGrid } from "@/components/feature/vendor/dashboard/vendor-dashboard-kpi-grid";
import { VendorDashboardTierBreakdown } from "@/components/feature/vendor/dashboard/vendor-dashboard-tier-breakdown";
import { VendorDashboardTicketInsights } from "@/components/feature/vendor/dashboard/vendor-dashboard-ticket-insights";
import { VendorDashboardBillingOverview } from "@/components/feature/vendor/dashboard/vendor-dashboard-billing-overview";
import { VendorDashboardRecurringRevenue } from "@/components/feature/vendor/dashboard/vendor-dashboard-recurring-revenue";
import { VendorDashboardInsightsHighlights } from "@/components/feature/vendor/dashboard/vendor-dashboard-insights-highlights";
import { VendorDashboardLoginLeaderboard } from "@/components/feature/vendor/dashboard/vendor-dashboard-login-leaderboard";
import { VendorDashboardModuleAdoption } from "@/components/feature/vendor/dashboard/vendor-dashboard-module-adoption";
import { VendorDashboardAlertCenter } from "@/components/feature/vendor/dashboard/vendor-dashboard-alert-center";
import { VendorDashboardInvoiceWatchlist } from "@/components/feature/vendor/dashboard/vendor-dashboard-invoice-watchlist";

export default function VendorDashboardPage() {
  return (
    <VendorDashboardDataProvider>
      <VendorDashboardPageShell />
    </VendorDashboardDataProvider>
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
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Ringkasan aktivitas tenant vendor dan status dukungan pelanggan.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-1 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Telusuri detail:</span>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/vendor/dashboard/tenant-activity"
              className="rounded-md border px-3 py-1 font-medium text-foreground transition-colors hover:bg-muted"
            >
              Aktivitas Tenant
            </Link>
            <Link
              href="/vendor/dashboard/revenue-trend"
              className="rounded-md border px-3 py-1 font-medium text-foreground transition-colors hover:bg-muted"
            >
              Tren Pendapatan
            </Link>
            <Link
              href="/vendor/dashboard/support-health"
              className="rounded-md border px-3 py-1 font-medium text-foreground transition-colors hover:bg-muted"
            >
              Kesehatan Dukungan
            </Link>
          </div>
        </div>
      </header>

      {isError ? (
        <Alert variant="destructive">
          <AlertTitle>Data dashboard tidak dapat dimuat</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>
              {error?.message ??
                "Terjadi kesalahan saat mengambil data dashboard."}
            </p>
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
            Sistem belum menerima data dashboard vendor. Widget akan diperbarui
            secara otomatis setelah data tersedia.
          </AlertDescription>
        </Alert>
      ) : null}

      <VendorDashboardGlobalFilters />

      <div className="grid gap-6">
        <section>
          <VendorDashboardKpiGrid />
        </section>

        <section className="grid gap-6 lg:grid-cols-1">
          <VendorDashboardTierBreakdown />
          <VendorDashboardTicketInsights />
        </section>

        <section className="grid gap-6 xl:grid-cols-1">
          <VendorDashboardRecurringRevenue />
          <VendorDashboardBillingOverview />
        </section>

        <section className="grid gap-6 2xl:grid-cols-[2fr_1fr]">
          <VendorDashboardLoginLeaderboard />
          <div className="space-y-6">
            <VendorDashboardInsightsHighlights />
            <VendorDashboardModuleAdoption />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-1">
          <VendorDashboardInvoiceWatchlist />
          <VendorDashboardAlertCenter />
        </section>
      </div>
    </div>
  );
}
