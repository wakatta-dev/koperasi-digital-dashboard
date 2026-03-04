/** @format */

"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRoleActions, useRolePermissions, useRoles, useUserActions, useUsers } from "@/hooks/queries";
import { canManageSettings, isProtectedSystemRole } from "../helpers";

export default function SettingsAksesOtorisasiPage() {
  const { data: session } = useSession();
  const canManage = canManageSettings((session?.user as any)?.role);
  const [search, setSearch] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [assignRoleByUser, setAssignRoleByUser] = useState<Record<number, string>>({});
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [editRoleName, setEditRoleName] = useState("");
  const [editRoleDescription, setEditRoleDescription] = useState("");
  const [permissionObject, setPermissionObject] = useState("");
  const [permissionAction, setPermissionAction] = useState("");

  const usersQuery = useUsers({ term: search || undefined, limit: 100 });
  const rolesQuery = useRoles({ limit: 100 });
  const userActions = useUserActions();
  const roleActions = useRoleActions();
  const rolePermissionsQuery = useRolePermissions(selectedRoleId || undefined, { limit: 200 });

  const roles = useMemo(() => rolesQuery.data ?? [], [rolesQuery.data]);
  const users = useMemo(() => usersQuery.data ?? [], [usersQuery.data]);
  const selectedRole = useMemo(
    () => roles.find((role) => String(role.id) === selectedRoleId) ?? null,
    [roles, selectedRoleId]
  );

  const protectedRole = selectedRole ? isProtectedSystemRole(selectedRole.name) : false;

  const onSelectRole = (roleId: string) => {
    setSelectedRoleId(roleId);
    const role = roles.find((item) => String(item.id) === roleId);
    setEditRoleName(role?.name ?? "");
    setEditRoleDescription(role?.description ?? "");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Akses & Otorisasi</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Kelola user tenant, role assignment, dan permission role per modul.
        </p>
      </div>

      {!canManage ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertCircle className="mr-2 inline h-4 w-4" />
          Mode baca saja: hanya admin tenant yang dapat melakukan perubahan akses.
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Manajemen User</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 md:max-w-sm">
            <Label htmlFor="search-user">Cari user</Label>
            <Input
              id="search-user"
              placeholder="nama/email"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const currentRoleId = user.tenant_role?.role_id;
                  const selectedAssignRoleId = assignRoleByUser[user.id] ?? "";
                  const currentRoleName = user.tenant_role?.role?.name ?? "-";
                  return (
                    <TableRow key={user.id}>
                      <TableCell>{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{currentRoleName}</TableCell>
                      <TableCell>{user.status ? "Aktif" : "Nonaktif"}</TableCell>
                      <TableCell className="space-x-2 text-right">
                        <Select
                          value={selectedAssignRoleId}
                          onValueChange={(value) =>
                            setAssignRoleByUser((prev) => ({ ...prev, [user.id]: value }))
                          }
                        >
                          <SelectTrigger className="inline-flex w-44">
                            <SelectValue placeholder="Pilih role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={String(role.id)}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          size="sm"
                          disabled={!canManage || !selectedAssignRoleId || userActions.assign.isPending}
                          onClick={() =>
                            userActions.assign.mutate({
                              userId: user.id,
                              roleId: selectedAssignRoleId,
                            })
                          }
                        >
                          Assign
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={!canManage || !currentRoleId || userActions.removeRole.isPending}
                          onClick={() =>
                            userActions.removeRole.mutate({
                              userId: user.id,
                              roleId: currentRoleId!,
                            })
                          }
                        >
                          Lepas Role
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={!canManage || userActions.patchStatus.isPending}
                          onClick={() =>
                            userActions.patchStatus.mutate({ id: user.id, status: !user.status })
                          }
                        >
                          {user.status ? "Nonaktifkan" : "Aktifkan"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-sm text-gray-500">
                      Tidak ada user ditemukan.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role dan Permission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 rounded-md border p-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="new-role-name">Nama Role Baru</Label>
              <Input
                id="new-role-name"
                value={newRoleName}
                onChange={(event) => setNewRoleName(event.target.value)}
                disabled={!canManage}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-role-description">Deskripsi</Label>
              <Input
                id="new-role-description"
                value={newRoleDescription}
                onChange={(event) => setNewRoleDescription(event.target.value)}
                disabled={!canManage}
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                disabled={!canManage || !newRoleName.trim() || roleActions.create.isPending}
                onClick={() => {
                  roleActions.create.mutate({
                    name: newRoleName.trim(),
                    description: newRoleDescription.trim(),
                  });
                  setNewRoleName("");
                  setNewRoleDescription("");
                }}
              >
                Tambah Role
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label>Pilih Role</Label>
              <Select value={selectedRoleId} onValueChange={onSelectRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role untuk dikelola" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={String(role.id)}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedRole ? (
                <div className="space-y-3 rounded-md border p-4">
                  <div className="space-y-2">
                    <Label>Nama Role</Label>
                    <Input
                      value={editRoleName}
                      onChange={(event) => setEditRoleName(event.target.value)}
                      disabled={!canManage || protectedRole}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Deskripsi</Label>
                    <Input
                      value={editRoleDescription}
                      onChange={(event) => setEditRoleDescription(event.target.value)}
                      disabled={!canManage || protectedRole}
                    />
                  </div>
                  {protectedRole ? (
                    <p className="text-xs text-amber-600">
                      Role sistem terproteksi dan tidak dapat dimodifikasi.
                    </p>
                  ) : null}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      disabled={!canManage || protectedRole || roleActions.update.isPending}
                      onClick={() =>
                        roleActions.update.mutate({
                          id: selectedRole.id,
                          payload: {
                            name: editRoleName,
                            description: editRoleDescription,
                          },
                        })
                      }
                    >
                      Simpan Role
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={!canManage || protectedRole || roleActions.remove.isPending}
                      onClick={() => roleActions.remove.mutate(selectedRole.id)}
                    >
                      Hapus Role
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="space-y-3">
              <Label>Permissions Role</Label>
              <div className="space-y-2 rounded-md border p-4">
                {(rolePermissionsQuery.data ?? []).map((permission) => (
                  <div
                    key={`${permission.id}-${permission.object}-${permission.action}`}
                    className="flex items-center justify-between rounded border px-3 py-2 text-sm"
                  >
                    <span>
                      {permission.object}:{permission.action}
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={!canManage || !selectedRole || protectedRole}
                      onClick={() =>
                        roleActions.removePermission.mutate({
                          roleId: selectedRole!.id,
                          permissionId: permission.id,
                        })
                      }
                    >
                      Hapus
                    </Button>
                  </div>
                ))}
                {(rolePermissionsQuery.data ?? []).length === 0 ? (
                  <p className="text-sm text-gray-500">Belum ada permission untuk role ini.</p>
                ) : null}
              </div>

              <div className="grid gap-2 rounded-md border p-4">
                <Label>Tambah Permission</Label>
                <Input
                  placeholder="object (contoh: /api/marketplace/orders)"
                  value={permissionObject}
                  onChange={(event) => setPermissionObject(event.target.value)}
                  disabled={!canManage || protectedRole}
                />
                <Input
                  placeholder="action (contoh: read)"
                  value={permissionAction}
                  onChange={(event) => setPermissionAction(event.target.value)}
                  disabled={!canManage || protectedRole}
                />
                <Button
                  type="button"
                  disabled={
                    !canManage ||
                    !selectedRole ||
                    protectedRole ||
                    !permissionObject.trim() ||
                    !permissionAction.trim() ||
                    roleActions.addPermission.isPending
                  }
                  onClick={() => {
                    roleActions.addPermission.mutate({
                      id: selectedRole!.id,
                      obj: permissionObject.trim(),
                      act: permissionAction.trim(),
                    });
                    setPermissionObject("");
                    setPermissionAction("");
                  }}
                >
                  Tambah Permission
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
