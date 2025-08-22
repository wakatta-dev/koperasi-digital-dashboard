/** @format */

import Link from "next/link";
import { listTenants } from "@/actions/tenants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default async function TenantsPage() {
  const tenants = (await listTenants({ limit: 10 })) as any;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tenants</h2>
        <Link href="/vendor/clients/create">
          <Button>Create</Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants?.data?.map((t: any) => (
            <TableRow key={t.id}>
              <TableCell>{t.name}</TableCell>
              <TableCell>{t.type}</TableCell>
              <TableCell>{t.domain}</TableCell>
              <TableCell>{t.status}</TableCell>
              <TableCell>
                <Link href={`/vendor/clients/${t.id}`}>View</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
