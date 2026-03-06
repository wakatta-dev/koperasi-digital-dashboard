/** @format */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVendorDashboard } from "@/hooks/queries";
import { VendorKpiGrid } from "../VendorKpiGrid";
import { VendorPageHeader } from "../VendorPageHeader";
import { formatVendorCurrency, formatVendorDateTime } from "../../utils/format";

export function VendorDashboardPage() {
  const dashboardQuery = useVendorDashboard();
  const data = dashboardQuery.data;

  return (
    <div className="space-y-6">
      <VendorPageHeader
        title="Vendor Dashboard"
        description="Ringkasan cepat kesehatan operasional SaaS dari tenant, billing, activity, dan delivery notifikasi."
      />

      {dashboardQuery.isLoading ? (
        <div className="rounded-xl border bg-card px-4 py-12 text-center text-sm text-muted-foreground">
          Memuat ringkasan vendor...
        </div>
      ) : null}

      {dashboardQuery.error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {(dashboardQuery.error as Error).message}
        </div>
      ) : null}

      {data ? <VendorKpiGrid items={data.kpis} /> : null}

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Breakdown Tenant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.tenant_breakdown.map((item) => (
              <div
                key={item.type}
                className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm"
              >
                <span className="uppercase text-muted-foreground">{item.type}</span>
                <span className="font-medium">{item.total}</span>
              </div>
            ))}
            {!data?.tenant_breakdown.length ? (
              <p className="text-sm text-muted-foreground">Belum ada data breakdown tenant.</p>
            ) : null}
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Activity Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data?.recent_activity.map((item) => (
              <div key={item.id} className="rounded-lg border px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-medium">{item.actor_label}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatVendorDateTime(item.timestamp)}
                  </div>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {item.module} · {item.action}
                </div>
                <div className="mt-2 text-sm">
                  {item.reason || `Entity ${item.entity_type} #${item.entity_id}`}
                </div>
              </div>
            ))}
            {!data?.recent_activity.length ? (
              <p className="text-sm text-muted-foreground">Belum ada activity terbaru.</p>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Alert</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.invoice_alerts.map((item) => (
              <div key={item.invoice_number} className="rounded-lg border px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-medium">{item.invoice_number}</div>
                    <div className="text-sm text-muted-foreground">{item.customer_name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatVendorCurrency(item.total_amount)}</div>
                    <div className="text-xs text-muted-foreground">{item.due_date}</div>
                  </div>
                </div>
              </div>
            ))}
            {!data?.invoice_alerts.length ? (
              <p className="text-sm text-muted-foreground">Tidak ada invoice overdue.</p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Channels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.notification_channels.map((channel) => (
              <div
                key={channel.channel}
                className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm"
              >
                <div className="font-medium">{channel.channel}</div>
                <div className="text-right text-muted-foreground">
                  <div>Delivered: {channel.delivered ?? 0}</div>
                  <div>Failed: {channel.failed ?? 0}</div>
                </div>
              </div>
            ))}
            {!data?.notification_channels.length ? (
              <p className="text-sm text-muted-foreground">Belum ada metrik channel notifikasi.</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
