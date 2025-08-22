/** @format */

import { listTenants } from "@/actions/tenants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TenantCreateDialog } from "@/components/feature/tenant/tenant-create-dialog";

export default async function TenantsPage() {
  const tenants = await listTenants({ limit: 10 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Tenants</h2>
        <TenantCreateDialog />
      </div>

      {/* Tenant Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tenant List</CardTitle>
        </CardHeader>
        <CardContent>
          {tenants?.data?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.data.map((t: any) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.name}</TableCell>
                    <TableCell className="capitalize">{t.type}</TableCell>
                    <TableCell>{t.domain}</TableCell>
                    <TableCell>
                      <Badge variant={t.is_active ? "default" : "secondary"}>
                        {t.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/vendor/clients/${t.id}`}>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-muted-foreground text-sm italic py-4">
              No tenants found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
