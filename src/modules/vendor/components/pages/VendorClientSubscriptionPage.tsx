/** @format */

"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminTenantDetail } from "@/hooks/queries";
import { VendorPlaceholderState } from "../VendorPlaceholderState";

type VendorClientSubscriptionPageProps = {
  tenantId: string;
};

const FEATURE_FLAG_LABELS: Record<string, string> = {
  pos_enabled: "POS",
  inventory_enabled: "Inventory",
  marketplace_enabled: "Marketplace",
  asset_rental_enabled: "Asset Rental",
  reports_enabled: "Reports",
};

export function VendorClientSubscriptionPage({
  tenantId,
}: VendorClientSubscriptionPageProps) {
  const detailQuery = useAdminTenantDetail(tenantId);
  const tenant = detailQuery.data?.data?.tenant;
  const configs = useMemo(
    () => tenant?.configuration?.configs ?? {},
    [tenant?.configuration?.configs]
  );
  const featureFlags = useMemo(() => {
    const nested =
      typeof configs.feature_flags === "object" && configs.feature_flags
        ? (configs.feature_flags as Record<string, unknown>)
        : {};

    return Object.entries(FEATURE_FLAG_LABELS)
      .filter(([key]) => {
        if (typeof nested[key] === "boolean") return nested[key] === true;
        if (typeof configs[key] === "boolean") return configs[key] === true;
        return false;
      })
      .map(([, label]) => label);
  }, [configs]);

  const primaryPlanId =
    typeof configs.primary_plan_id === "number" ? configs.primary_plan_id : null;
  const addonPlanIds = Array.isArray(configs.addon_plan_ids)
    ? configs.addon_plan_ids
    : [];

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
              <div className="mt-1 font-medium">{tenant?.display_name || tenant?.name || "-"}</div>
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
                  <Badge key={item} variant="secondary">
                    {item}
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
            Snapshot ini dibaca dari admin tenant detail pada field configuration.configs. Selama
            backend plan dan subscription belum final, halaman ini diposisikan sebagai observability
            panel, bukan control panel mutasi.
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
