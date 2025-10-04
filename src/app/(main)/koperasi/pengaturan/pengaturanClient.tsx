/** @format */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AsyncCombobox from "@/components/ui/async-combobox";
import {
  assignRole,
  createRole,
  deleteRole,
  listRoles,
  listRolePermissions,
  addRolePermission,
  deleteRolePermission,
} from "@/services/api";
import { makePaginatedListFetcher } from "@/lib/async-fetchers";
import type {
  Role,
  Permission,
  ListRolesResponse,
  ListPermissionsResponse,
  PermissionRequest,
} from "@/types/api";
import type { User } from "@/types/api";
import { listUsers } from "@/services/api";
import { toast } from "sonner";

type Props = {
  initialRoles: Role[];
  initialSelectedRoleId?: number;
  initialPermissions: Permission[];
  initialError?: string;
};

type RoleFormState = {
  name: string;
  description: string;
};

type AssignState = {
  userId?: number;
  roleId?: number;
};

export default function PengaturanClient({
  initialRoles,
  initialSelectedRoleId,
  initialPermissions,
  initialError,
}: Props) {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(
    initialSelectedRoleId ?? null
  );
  const [permissions, setPermissions] = useState<Permission[]>(
    initialPermissions
  );
  const [roleForm, setRoleForm] = useState<RoleFormState>({
    name: "",
    description: "",
  });
  const [assignState, setAssignState] = useState<AssignState>({});
  const [permDraft, setPermDraft] = useState<PermissionRequest>({
    obj: "",
    act: "",
  });
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(false);

  useEffect(() => {
    if (initialError) {
      toast.error(initialError);
    }
  }, [initialError]);

  const refreshRoles = useCallback(async () => {
    setLoadingRoles(true);
    try {
      const res: ListRolesResponse | null = await listRoles({ limit: 100 }).catch(
        () => null
      );
      if (!res || !res.success || !Array.isArray(res.data)) {
        throw new Error(res?.message || "Gagal memuat daftar role");
      }
      setRoles(res.data as Role[]);
      if (!res.data.length) {
        setSelectedRoleId(null);
        setPermissions([]);
        return;
      }
      if (!res.data.some((role) => role.id === selectedRoleId)) {
        setSelectedRoleId(res.data[0].id);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal memuat daftar role"
      );
    } finally {
      setLoadingRoles(false);
    }
  }, [selectedRoleId]);

  const refreshPermissions = useCallback(
    async (roleId: number) => {
      setLoadingPermissions(true);
      try {
        const res: ListPermissionsResponse | null = await listRolePermissions(
          roleId,
          { limit: 200 }
        ).catch(() => null);
        if (!res || !res.success || !Array.isArray(res.data)) {
          throw new Error(res?.message || "Gagal memuat permission role");
        }
        setPermissions(res.data as Permission[]);
      } catch (error) {
        setPermissions([]);
        toast.error(
          error instanceof Error
            ? error.message
            : "Gagal memuat permission role"
        );
      } finally {
        setLoadingPermissions(false);
      }
    },
    []
  );

  useEffect(() => {
    if (selectedRoleId) {
      void refreshPermissions(selectedRoleId);
    } else {
      setPermissions([]);
    }
  }, [selectedRoleId, refreshPermissions]);

  const handleCreateRole = useCallback(async () => {
    const name = roleForm.name.trim();
    const description = roleForm.description.trim();
    if (!name || !description) {
      toast.error("Nama dan deskripsi role wajib diisi");
      return;
    }
    setLoadingRoles(true);
    try {
      const res = await createRole({ name, description });
      if (!res.success) {
        throw new Error(res.message || "Gagal menambahkan role");
      }
      toast.success("Role ditambahkan");
      setRoleForm({ name: "", description: "" });
      await refreshRoles();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menambahkan role"
      );
    } finally {
      setLoadingRoles(false);
    }
  }, [refreshRoles, roleForm.description, roleForm.name]);

  const handleDeleteRole = useCallback(
    async (roleId: number) => {
      setLoadingRoles(true);
      try {
        const res = await deleteRole(roleId);
        if (!res.success) {
          throw new Error(res.message || "Gagal menghapus role");
        }
        toast.success("Role dihapus");
        await refreshRoles();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Gagal menghapus role"
        );
      } finally {
        setLoadingRoles(false);
      }
    },
    [refreshRoles]
  );

  const handleAddPermission = useCallback(async () => {
    if (!selectedRoleId) {
      toast.error("Pilih role terlebih dahulu");
      return;
    }
    const obj = permDraft.obj.trim();
    const act = permDraft.act.trim();
    if (!obj || !act) {
      toast.error("Objek dan aksi permission wajib diisi");
      return;
    }
    try {
      const res = await addRolePermission(selectedRoleId, { obj, act });
      if (!res.success) {
        throw new Error(res.message || "Gagal menambahkan permission");
      }
      toast.success("Permission ditambahkan");
      setPermDraft({ obj: "", act: "" });
      await refreshPermissions(selectedRoleId);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menambahkan permission"
      );
    }
  }, [permDraft.act, permDraft.obj, refreshPermissions, selectedRoleId]);

  const handleDeletePermission = useCallback(
    async (permission: Permission) => {
      if (!selectedRoleId || !permission.id) return;
      try {
        const res = await deleteRolePermission(selectedRoleId, permission.id);
        if (!res.success) {
          throw new Error(res.message || "Gagal menghapus permission");
        }
        toast.success("Permission dihapus");
        await refreshPermissions(selectedRoleId);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Gagal menghapus permission"
        );
      }
    },
    [refreshPermissions, selectedRoleId]
  );

  const handleAssignRole = useCallback(async () => {
    if (!assignState.userId || !assignState.roleId) {
      toast.error("Pilih pengguna dan role terlebih dahulu");
      return;
    }
    try {
      const res = await assignRole(assignState.userId, {
        role_id: assignState.roleId,
      });
      if (!res.success) {
        throw new Error(res.message || "Gagal mengatur role pengguna");
      }
      toast.success("Role diassign ke pengguna");
      setAssignState({});
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mengatur role pengguna"
      );
    }
  }, [assignState.roleId, assignState.userId]);

  const userFetcher = useMemo(
    () => makePaginatedListFetcher<User>(listUsers, { limit: 10 }),
    []
  );

  const roleOptions = useMemo(
    () => roles.map((role) => ({ id: role.id, name: role.name })),
    [roles]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Pengaturan</h2>
        <p className="text-muted-foreground">Role, permission, dan audit log</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Role</CardTitle>
            <CardDescription>Kelola peran pengguna</CardDescription>
          </CardHeader>
          <CardContent className="max-h-96 space-y-3 overflow-y-auto">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              <Input
                placeholder="Nama role"
                value={roleForm.name}
                onChange={(event) =>
                  setRoleForm((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
                disabled={loadingRoles}
              />
              <Input
                placeholder="Deskripsi role"
                value={roleForm.description}
                onChange={(event) =>
                  setRoleForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                disabled={loadingRoles}
              />
              <Button onClick={handleCreateRole} disabled={loadingRoles}>
                {loadingRoles ? "Memproses..." : "Tambah"}
              </Button>
            </div>

            <ul className="space-y-1 text-sm">
              {roles.map((role) => (
                <li
                  key={role.id}
                  className="flex items-center justify-between rounded border p-2"
                >
                  <button
                    type="button"
                    className={`flex-1 text-left ${
                      selectedRoleId === role.id ? "font-semibold" : ""
                    }`}
                    onClick={() => setSelectedRoleId(role.id)}
                  >
                    {role.name}
                  </button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteRole(role.id)}
                    disabled={loadingRoles}
                  >
                    Hapus
                  </Button>
                </li>
              ))}
              {!roles.length && (
                <li className="text-sm text-muted-foreground italic">
                  Belum ada role terdaftar
                </li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permission</CardTitle>
            <CardDescription>Atur akses berdasarkan role</CardDescription>
          </CardHeader>
          <CardContent className="max-h-96 space-y-3 overflow-y-auto">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              <Input
                placeholder="Obj (contoh: transactions)"
                value={permDraft.obj}
                onChange={(event) =>
                  setPermDraft((prev) => ({ ...prev, obj: event.target.value }))
                }
                disabled={!selectedRoleId || loadingPermissions}
              />
              <Input
                placeholder="Act (contoh: read|write)"
                value={permDraft.act}
                onChange={(event) =>
                  setPermDraft((prev) => ({ ...prev, act: event.target.value }))
                }
                disabled={!selectedRoleId || loadingPermissions}
              />
              <Button
                onClick={handleAddPermission}
                disabled={!selectedRoleId || loadingPermissions}
              >
                {loadingPermissions ? "Memproses..." : "Tambah"}
              </Button>
            </div>

            <div className="space-y-2">
              {permissions.map((permission) => (
                <div
                  key={permission.id || `${permission.object}:${permission.action}`}
                  className="flex items-center justify-between rounded border p-2"
                >
                  <div className="text-sm">
                    {permission.object || permission.obj || "-"} : {permission.action || permission.act || "-"}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeletePermission(permission)}
                    disabled={loadingPermissions}
                  >
                    Hapus
                  </Button>
                </div>
              ))}
              {!permissions.length && (
                <div className="text-sm text-muted-foreground italic">
                  Belum ada permission
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assign Role</CardTitle>
            <CardDescription>Set peran untuk pengguna</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <AsyncCombobox<User, number>
              value={assignState.userId ?? null}
              onChange={(value) =>
                setAssignState((prev) => ({
                  ...prev,
                  userId: value ?? undefined,
                }))
              }
              getOptionValue={(user) => user.id}
              getOptionLabel={(user) =>
                user.full_name || user.email || `User #${user.id}`
              }
              queryKey={["users", "assign-role"]}
              fetchPage={userFetcher}
              placeholder="Cari pengguna (nama/email)"
              emptyText="Tidak ada pengguna"
              notReadyText="Ketik untuk mencari"
              minChars={1}
              renderOption={(user) => (
                <div className="flex flex-col">
                  <span className="font-medium">
                    {user.full_name || "(tanpa nama)"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              )}
              renderValue={(value) =>
                value ? <span>User #{value}</span> : <span />
              }
            />
            <Select
              value={assignState.roleId ? String(assignState.roleId) : ""}
              onValueChange={(value) =>
                setAssignState((prev) => ({
                  ...prev,
                  roleId: value ? Number(value) : undefined,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((role) => (
                  <SelectItem key={role.id} value={String(role.id)}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAssignRole} disabled={!assignState.userId || !assignState.roleId}>
              Simpan
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Log</CardTitle>
          <CardDescription>Aktivitas penting pada sistem</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground italic">
            Audit log tersedia melalui modul keamanan terpisah.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
