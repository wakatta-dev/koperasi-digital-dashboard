/** @format */

import { listTenants } from "@/actions/tenants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TenantCreateDialog } from "@/components/feature/tenant/tenant-create-dialog";
import { TenantSelfRegisterDialog } from "@/components/feature/vendor/clients/tenant-self-register-dialog";
import { ClientsListClient } from "./clients-list-client";

export const dynamic = "force-dynamic";

// TODO integrate API: extend detail modal with full client details via API
export default async function ClientsPage() {
  const tenants = await listTenants({ limit: 10 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Clients</h2>
        <div className="flex items-center gap-2">
          <TenantSelfRegisterDialog />
          <TenantCreateDialog />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Client List</CardTitle>
        </CardHeader>
        <CardContent>
          {tenants?.data?.length ? (
            <ClientsListClient rows={tenants.data as any[]} />
          ) : (
            <div className="text-muted-foreground text-sm italic py-4">
              No clients found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
