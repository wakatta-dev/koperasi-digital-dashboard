/** @format */

import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  getTenant,
  listTenantModules,
  listTenantUsers,
} from "@/actions/tenants";
import {
  updateTenantAction,
  updateStatusAction,
  addUserAction,
  toggleModuleAction,
} from "./_actions";

interface PageProps {
  params: { id: string };
  searchParams?: { message?: string; error?: string };
}

export default async function TenantDetailPage({
  params,
  searchParams,
}: PageProps) {
  const id = params.id;
  const { data: tenant, success } = await getTenant(id);
  if (!success || !tenant) redirect("/tenant-not-found");

  const usersRes = await listTenantUsers(id);
  const modulesRes = await listTenantModules(id);

  return (
    <div className="p-6 space-y-10">
      <Link href="/vendor/clients" className="text-sm text-muted-foreground">
        ← Back
      </Link>

      {searchParams?.message && (
        <p className="text-sm text-green-600">{searchParams.message}</p>
      )}
      {searchParams?.error && (
        <p className="text-sm text-red-600">{searchParams.error}</p>
      )}

      {/* Tenant Form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Tenant</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={updateTenantAction.bind(null, id)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={tenant.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Input id="type" name="type" defaultValue={tenant.type} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <Input id="domain" name="domain" defaultValue={tenant.domain} />
            </div>
            <Button type="submit">Save</Button>
          </form>
        </CardContent>
      </Card>

      {/* Status Toggle */}
      <form
        action={updateStatusAction.bind(null, id)}
        className="flex items-center gap-2"
      >
        <Switch name="status" defaultChecked={tenant.status === "active"} />
        <Button type="submit">Update Status</Button>
      </form>

      <Separator />

      {/* Users Section */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Users</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersRes.data?.length ? (
              usersRes.data.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.full_name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-muted-foreground italic">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="mt-4">
          <h4 className="text-lg font-medium">Add New User</h4>
          <form
            action={addUserAction.bind(null, id)}
            className="space-y-3 mt-2"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" placeholder="Email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input id="full_name" name="full_name" placeholder="Full Name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role_id">Role ID</Label>
              <Input id="role_id" name="role_id" placeholder="Role ID" />
            </div>
            <Button type="submit">Add User</Button>
          </form>
        </div>
      </section>

      <Separator />

      {/* Modules Section */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Modules</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modulesRes.data?.length ? (
              modulesRes.data.map((mod) => (
                <TableRow key={mod.id}>
                  <TableCell className="w-full">{mod.name || "-"}</TableCell>
                  <TableCell>
                    <form
                      action={toggleModuleAction.bind(null, id)}
                      className="flex items-center gap-2"
                    >
                      <input type="hidden" name="module_id" value={mod.id} />
                      <select
                        name="status"
                        defaultValue={mod.status}
                        className="border rounded px-2 py-1"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <Button type="submit" size="sm">
                        Save
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-muted-foreground italic">
                  No modules found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
