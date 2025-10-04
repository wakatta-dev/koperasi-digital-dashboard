/** @format */

import { listClients } from "@/actions/clients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TenantCreateDialog } from "@/components/feature/tenant/tenant-create-dialog";
import { TenantSelfRegisterDialog } from "@/components/feature/vendor/clients/tenant-self-register-dialog";
import { ClientsListClient } from "./clients-list-client";
import type { Client } from "@/types/api";

export const dynamic = "force-dynamic";

// TODO integrate API: extend detail modal with full client details via API
export default async function ClientsPage({
  searchParams,
}: {
  searchParams?: Promise<{ tenantId?: string | string[] }>;
}) {
  const resolvedSearchParams: { tenantId?: string | string[] } =
    (await searchParams) ?? {};
  const tenantIdParam = Array.isArray(resolvedSearchParams.tenantId)
    ? resolvedSearchParams.tenantId[0]
    : resolvedSearchParams.tenantId;
  const initialSelectedId = tenantIdParam ? Number(tenantIdParam) : null;
  const limit = initialSelectedId ? 200 : 10;
  const clients = await listClients({ limit });

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
          {clients?.data?.length ? (
            <ClientsListClient
              rows={clients.data as Client[]}
              initialSelectedId={initialSelectedId}
            />
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
