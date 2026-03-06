/** @format */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminTenantDetail } from "@/hooks/queries";
import { VendorPlaceholderState } from "../VendorPlaceholderState";

type VendorClientSubscriptionPageProps = {
  tenantId: string;
};

export function VendorClientSubscriptionPage({
  tenantId,
}: VendorClientSubscriptionPageProps) {
  const detailQuery = useAdminTenantDetail(tenantId);
  const tenant = detailQuery.data?.data?.tenant;
  const configs = tenant?.configuration?.configs ?? {};

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
