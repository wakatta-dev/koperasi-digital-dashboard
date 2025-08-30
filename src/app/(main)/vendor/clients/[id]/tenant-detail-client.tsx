/** @format */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
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
import type { Tenant, User } from "@/types/api";
import {
  useTenant,
  useTenantActions,
  useTenantUsers,
  useTenantModules,
} from "@/hooks/queries/tenants";
import { useRoles } from "@/hooks/queries/roles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  id: string;
  initialTenant: Tenant;
  initialUsers: User[];
  initialModules: any[];
  initialMessage?: string;
  initialError?: string;
};

export default function TenantDetailClient({
  id,
  initialTenant,
  initialUsers,
  initialModules,
  initialMessage,
  initialError,
}: Props) {
  const router = useRouter();
  const { update, updateStatus, addUser, updateModule } = useTenantActions();
  const { data: tenant } = useTenant(id, initialTenant);
  const { data: users } = useTenantUsers(id, undefined, initialUsers);
  const { data: modules } = useTenantModules(id, undefined, initialModules);
  const { data: roles = [] } = useRoles();

  const [statusMessage, setStatusMessage] = useState<string | undefined>(
    initialMessage,
  );
  const [statusError, setStatusError] = useState<string | undefined>(
    initialError,
  );

  // Form state derived from tenant
  const [formValues, setFormValues] = useState(() => ({
    name: tenant?.name ?? "",
    type: tenant?.type ?? "",
    domain: tenant?.domain ?? "",
  }));
  const [statusChecked, setStatusChecked] = useState(
    tenant?.status === "active",
  );
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");

  const isSaving = useMemo(
    () =>
      update.isPending ||
      updateStatus.isPending ||
      addUser.isPending ||
      updateModule.isPending,
    [update.isPending, updateStatus.isPending, addUser.isPending, updateModule.isPending],
  );

  const onSubmitTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusError(undefined);
    try {
      await update.mutateAsync({ id, payload: formValues });
      setStatusMessage("Tenant updated");
      router.refresh();
    } catch (err: any) {
      setStatusError(err?.message ?? "Failed to update tenant");
    }
  };

  const onSubmitStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusError(undefined);
    try {
      await updateStatus.mutateAsync({
        id,
        status: statusChecked ? "active" : "inactive",
      });
      setStatusMessage("Status updated");
      router.refresh();
    } catch (err: any) {
      setStatusError(err?.message ?? "Failed to update status");
    }
  };

  const onSubmitAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");
    const full_name = String(fd.get("full_name") ?? "");
    if (!selectedRoleId) {
      setStatusError("Role wajib dipilih");
      return;
    }
    const role_id = Number(selectedRoleId);

    setStatusError(undefined);
    try {
      await addUser.mutateAsync({ id, payload: { email, password, full_name, role_id } });
      setStatusMessage("User added");
      e.currentTarget.reset();
      setSelectedRoleId("");
      router.refresh();
    } catch (err: any) {
      setStatusError(err?.message ?? "Failed to add user");
    }
  };

  const onSubmitModule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const module_id = Number(fd.get("module_id") ?? "");
    const status = String(fd.get("status") ?? "");

    setStatusError(undefined);
    try {
      await updateModule.mutateAsync({ id, module_id, status });
      setStatusMessage("Module updated");
      router.refresh();
    } catch (err: any) {
      setStatusError(err?.message ?? "Failed to update module");
    }
  };

  return (
    <div className="p-6 space-y-8">
      <Link href="/vendor/clients" className="text-sm text-muted-foreground">
        ← Back
      </Link>

      {statusMessage && (
        <p className="text-sm text-green-600">{statusMessage}</p>
      )}
      {statusError && <p className="text-sm text-red-600">{statusError}</p>}

      {/* Tenant Form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Tenant</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmitTenant} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formValues.name}
                onChange={(e) =>
                  setFormValues((v) => ({ ...v, name: e.target.value }))
                }
                placeholder="Tenant Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                name="type"
                value={formValues.type}
                onChange={(e) =>
                  setFormValues((v) => ({ ...v, type: e.target.value }))
                }
                placeholder="e.g. SaaS"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                name="domain"
                value={formValues.domain}
                onChange={(e) =>
                  setFormValues((v) => ({ ...v, domain: e.target.value }))
                }
                placeholder="e.g. example.com"
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={isSaving}>
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Status Toggle */}
      <Card>
        <CardContent className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-2">
            <Switch
              name="status"
              checked={statusChecked}
              onCheckedChange={(v) => setStatusChecked(!!v)}
            />
            <span className="text-sm text-muted-foreground">
              Status: {statusChecked ? "active" : "inactive"}
            </span>
          </div>
          <form onSubmit={onSubmitStatus}>
            <Button type="submit" disabled={isSaving}>
              Update Status
            </Button>
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
              {users?.length ? (
                users.map((u) => (
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

          <div>
            <h4 className="text-lg font-medium mb-2">Add New User</h4>
            <form onSubmit={onSubmitAddUser} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" placeholder="Email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" name="full_name" placeholder="Full Name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role_id">Role</Label>
                <input type="hidden" name="role_id" value={selectedRoleId} />
                <Select
                  value={selectedRoleId}
                  onValueChange={(v) => setSelectedRoleId(v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles
                      ?.filter((r: any) => r.tenant_id === tenant?.id)
                      .map((r: any) => (
                        <SelectItem key={r.id} value={String(r.id)}>
                          {r.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Button type="submit" disabled={isSaving}>
                  Add User
                </Button>
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
              {modules?.length ? (
                modules.map((mod: any) => (
                  <TableRow key={mod.id}>
                    <TableCell className="w-full">{mod.name || "-"}</TableCell>
                    <TableCell>
                      <form onSubmit={onSubmitModule} className="flex items-center gap-2">
                        <input type="hidden" name="module_id" value={mod.id} />
                        <select
                          name="status"
                          defaultValue={mod.status}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                        <Button type="submit" size="sm" disabled={isSaving}>
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
        </CardContent>
      </Card>
    </div>
  );
}
