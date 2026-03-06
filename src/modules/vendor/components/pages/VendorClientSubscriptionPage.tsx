/** @format */

"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminTenantSubscription } from "@/hooks/queries";
import { VendorPlaceholderState } from "../VendorPlaceholderState";

type VendorClientSubscriptionPageProps = {
  tenantId: string;
};

export function VendorClientSubscriptionPage({
  tenantId,
}: VendorClientSubscriptionPageProps) {
  const subscriptionQuery = useAdminTenantSubscription(tenantId);
  const snapshot = subscriptionQuery.data?.data;
  const configs = snapshot?.raw_configs ?? {};
  const featureFlags = snapshot?.enabled_modules ?? [];
  const primaryPlanId = snapshot?.primary_plan_id ?? null;
  const addonPlanIds = snapshot?.addon_plan_ids ?? [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Snapshot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Tenant
              </div>
              <div className="mt-1 font-medium">{snapshot?.tenant_name || "-"}</div>
            </div>
            <div className="rounded-lg border px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Config Keys
              </div>
              <div className="mt-1 font-medium">{Object.keys(configs).length}</div>
            </div>
            <div className="rounded-lg border px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Primary Plan ID
              </div>
              <div className="mt-1 font-medium">{primaryPlanId ?? "-"}</div>
            </div>
            <div className="rounded-lg border px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Addon Plans
              </div>
              <div className="mt-1 font-medium">{addonPlanIds.length}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Enabled Modules
            </div>
            <div className="flex flex-wrap gap-2">
              {featureFlags.length ? (
                featureFlags.map((item) => (
                  <Badge key={item.key} variant="secondary">
                    {item.label}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  Belum ada feature flag module yang bisa diinfer dari konfigurasi tenant ini.
                </span>
              )}
            </div>
          </div>

          <div className="rounded-lg border px-4 py-3 text-sm text-muted-foreground">
            Snapshot ini dibaca dari endpoint admin subscription khusus. Selama backend plan dan
            subscription belum final, halaman ini tetap diposisikan sebagai observability panel,
            bukan control panel mutasi.
          </div>

          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
            {JSON.stringify(configs, null, 2)}
          </pre>
        </CardContent>
      </Card>

      <VendorPlaceholderState
        title="Advanced subscription control"
        description="Assign plan utama, addon, dan aktivasi modul tenant akan ditambahkan setelah backend admin mengekspose kontrak plan/subscription yang final."
      />
    </div>
  );
}
