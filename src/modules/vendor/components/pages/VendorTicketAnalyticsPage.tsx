/** @format */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVendorSupportAnalytics } from "@/hooks/queries";
import { VendorKpiGrid } from "../VendorKpiGrid";
import { VendorPageHeader } from "../VendorPageHeader";

const SLA_POLICIES = [
  { category: "billing", response: "4 jam", resolution: "24 jam" },
  { category: "tenant_ops", response: "8 jam", resolution: "48 jam" },
  { category: "audit", response: "24 jam", resolution: "72 jam" },
];

export function VendorTicketAnalyticsPage() {
  const analyticsQuery = useVendorSupportAnalytics();
  const analytics = analyticsQuery.data;

  const kpis = [
    {
      id: "ticket_total_open",
      label: "Open Cases",
      value: analytics?.total_open ?? 0,
      helper: "Case operasional yang sedang aktif",
    },
    {
      id: "ticket_high_priority",
      label: "High Priority",
      value: analytics?.total_high_priority ?? 0,
      helper: "Perlu respons tercepat",
    },
    {
      id: "ticket_sla_breaches",
      label: "SLA Breaches",
      value: analytics?.sla_breaches ?? 0,
      helper: "Melewati target working SLA",
    },
    {
      id: "ticket_billing",
      label: "Billing Cases",
      value: analytics?.billing_cases ?? 0,
      helper: "Kasus yang bersumber dari invoice overdue",
    },
  ];

  return (
    <div className="space-y-6">
      <VendorPageHeader
        title="Ticket Analytics"
        description="Analitik support queue sementara berbasis signal operasional yang sudah tersedia di platform."
      />

      <VendorKpiGrid items={kpis} />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Category Mix</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-lg border px-4 py-3">
              <div className="text-muted-foreground">Billing</div>
              <div className="mt-1 text-2xl font-semibold">{analytics?.billing_cases ?? 0}</div>
            </div>
            <div className="rounded-lg border px-4 py-3">
              <div className="text-muted-foreground">Tenant Ops</div>
              <div className="mt-1 text-2xl font-semibold">{analytics?.tenant_ops_cases ?? 0}</div>
            </div>
            <div className="rounded-lg border px-4 py-3">
              <div className="text-muted-foreground">Audit Signals</div>
              <div className="mt-1 text-2xl font-semibold">{analytics?.audit_cases ?? 0}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Working SLA Targets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {SLA_POLICIES.map((item) => (
              <div key={item.category} className="rounded-lg border px-4 py-3">
                <div className="font-medium">{item.category}</div>
                <div className="mt-1 text-muted-foreground">
                  First response {item.response} · Resolution {item.resolution}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
