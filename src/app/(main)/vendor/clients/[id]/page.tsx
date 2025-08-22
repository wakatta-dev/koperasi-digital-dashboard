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
// import { Separator } from "@/components/ui/separator";

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
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ message?: string; error?: string }>;
}

export default async function TenantDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const searchParam = await searchParams;
  const { data: tenant, success } = await getTenant(id);
  if (!success || !tenant) redirect("/tenant-not-found");

  const usersRes = await listTenantUsers(id);
  const modulesRes = await listTenantModules(id);

  return (
    <div className="p-6 space-y-8">
      <Link href="/vendor/clients" className="text-sm text-muted-foreground">
        ← Back
      </Link>

      {searchParam?.message && (
        <p className="text-sm text-green-600">{searchParam.message}</p>
      )}
      {searchParam?.error && (
        <p className="text-sm text-red-600">{searchParam.error}</p>
      )}

      {/* Tenant Form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Tenant</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={updateTenantAction.bind(null, id)}
            className="grid gap-4 md:grid-cols-2"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={tenant.name}
                placeholder="Tenant Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                name="type"
                defaultValue={tenant.type}
                placeholder="e.g. SaaS"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                name="domain"
                defaultValue={tenant.domain}
                placeholder="e.g. example.com"
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Status Toggle */}
      <Card>
        <CardContent className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-2">
            <Switch name="status" defaultChecked={tenant.status === "active"} />
            <span className="text-sm text-muted-foreground">
              Status: {tenant.status}
            </span>
          </div>
          <form action={updateStatusAction.bind(null, id)}>
            <Button type="submit">Update Status</Button>
          </form>
        </CardContent>
      </Card>

      {/* Users Section */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
                  <TableCell
                    colSpan={2}
                    className="text-muted-foreground italic"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div>
            <h4 className="text-lg font-medium mb-2">Add New User</h4>
            <form
              action={addUserAction.bind(null, id)}
              className="grid gap-4 md:grid-cols-2"
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
                <Input
                  id="full_name"
                  name="full_name"
                  placeholder="Full Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role_id">Role ID</Label>
                <Input id="role_id" name="role_id" placeholder="Role ID" />
              </div>
              <div className="md:col-span-2">
                <Button type="submit">Add User</Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Modules Section */}
      <Card>
        <CardHeader>
          <CardTitle>Modules</CardTitle>
        </CardHeader>
        <CardContent>
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
                          className="border rounded px-2 py-1 text-sm"
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
                  <TableCell
                    colSpan={2}
                    className="text-muted-foreground italic"
                  >
                    No modules found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
