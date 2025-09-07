/** @format */

"use client";

import { useEffect, useState } from "react";
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
import {
  assignRole,
  createRole,
  deleteRole,
  listRoles,
  listRolePermissions,
  addRolePermission,
  deleteRolePermission,
} from "@/services/api";
import AsyncCombobox from "@/components/ui/async-combobox";
import type { User } from "@/types/api";
import { listUsers } from "@/services/api";
import { makePaginatedListFetcher } from "@/lib/async-fetchers";
import { toast } from "sonner";

export default function PengaturanClient({
  initialRoles = [],
  initialSelectedRoleId,
  initialPermissions = [],
}: {
  initialRoles?: any[];
  initialSelectedRoleId?: number;
  initialPermissions?: any[];
}) {
  const [roles, setRoles] = useState<any[]>(initialRoles || []);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(
    initialSelectedRoleId ?? null
  );
  const [permissions, setPermissions] = useState<any[]>(
    initialPermissions || []
  );
  const [audit, setAudit] = useState<any[]>([]);
  const [newRole, setNewRole] = useState<{ name: string; description: string }>(
    { name: "", description: "" }
  );
  const [assign, setAssign] = useState<{ user?: string; role?: string }>({});
  const [permObj, setPermObj] = useState<string>("");
  const [permAct, setPermAct] = useState<string>("");

  useEffect(() => {
    setAudit([]);
  }, []);

  useEffect(() => {
    (async () => {
      if (!selectedRoleId) return setPermissions([]);
      try {
        const res = await listRolePermissions(selectedRoleId, { limit: 200 });
        if (res.success) setPermissions(res.data || []);
      } catch {
        setPermissions([]);
      }
    })();
  }, [selectedRoleId]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Pengaturan</h2>
        <p className="text-muted-foreground">Role, permission, dan audit log</p>
      </div>

      {/* role-permission */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Role</CardTitle>
            <CardDescription>Kelola peran pengguna</CardDescription>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input
                  placeholder="Nama role"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole((s) => ({ ...s, name: e.target.value }))
                  }
                />
                <Input
                  placeholder="Deskripsi role"
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole((s) => ({ ...s, description: e.target.value }))
                  }
                />
                <Button
                  onClick={async () => {
                    if (!newRole.name?.trim() || !newRole.description?.trim())
                      return;
                    try {
                      const res = await createRole({
                        name: newRole.name,
                        description: newRole.description,
                      });
                      if (res.success) {
                        toast.success("Role ditambahkan");
                        const list = await listRoles({ limit: 100 });
                        if (list.success) {
                          setRoles(list.data || []);
                          if (!selectedRoleId && list.data?.[0]?.id)
                            setSelectedRoleId(list.data[0].id);
                        }
                      }
                    } finally {
                      setNewRole({ name: "", description: "" });
                    }
                  }}
                >
                  Tambah
                </Button>
              </div>
              <ul className="text-sm space-y-1">
                {roles.map((r: any) => (
                  <li
                    key={String(r.id ?? r.name)}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <button
                      className={`text-left flex-1 ${
                        selectedRoleId === r.id ? "font-semibold" : ""
                      }`}
                      onClick={() => setSelectedRoleId(r.id)}
                    >
                      {r.name}
                    </button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        if (!r.id) return;
                        await deleteRole(r.id);
                        const list = await listRoles({ limit: 100 });
                        if (list.success) setRoles(list.data || []);
                      }}
                    >
                      Hapus
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permission</CardTitle>
            <CardDescription>Atur akses berdasarkan role</CardDescription>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input
                  placeholder="Obj (contoh: transactions)"
                  value={permObj}
                  onChange={(e) => setPermObj(e.target.value)}
                />
                <Input
                  placeholder="Act (contoh: read|write)"
                  value={permAct}
                  onChange={(e) => setPermAct(e.target.value)}
                />
                <Button
                  disabled={!selectedRoleId || !permObj || !permAct}
                  onClick={async () => {
                    if (!selectedRoleId) return;
                    await addRolePermission(selectedRoleId, {
                      obj: permObj,
                      act: permAct,
                    });
                    setPermObj("");
                    setPermAct("");
                    const res = await listRolePermissions(selectedRoleId, {
                      limit: 200,
                    });
                    if (res.success) setPermissions(res.data || []);
                  }}
                >
                  Tambah
                </Button>
              </div>
              <div className="space-y-2">
                {permissions.map((p: any) => (
                  <div
                    key={String(p.id ?? `${p.obj}:${p.act}`)}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div className="text-sm">
                      {p.obj} : {p.act}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        if (!selectedRoleId || !p.id) return;
                        await deleteRolePermission(selectedRoleId, p.id);
                        const res = await listRolePermissions(selectedRoleId, {
                          limit: 200,
                        });
                        if (res.success) setPermissions(res.data || []);
                      }}
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assign Role</CardTitle>
            <CardDescription>Set peran untuk pengguna</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <AsyncCombobox<User, number>
                value={assign.user ? Number(assign.user) : null}
                onChange={(val) =>
                  setAssign((s) => ({ ...s, user: val ? String(val) : "" }))
                }
                getOptionValue={(u) => u.id}
                getOptionLabel={(u) => u.full_name || u.email || String(u.id)}
                queryKey={["users", "search-assign-role"]}
                fetchPage={makePaginatedListFetcher<User>(listUsers, {
                  limit: 10,
                })}
                placeholder="Cari pengguna (nama/email)"
                emptyText="Tidak ada pengguna"
                notReadyText="Ketik untuk mencari"
                minChars={1}
                renderOption={(u) => (
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {u.full_name || "(tanpa nama)"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {u.email}
                    </span>
                  </div>
                )}
                renderValue={(val) => <span>{val ? `User #${val}` : ""}</span>}
              />
              <Select
                onValueChange={(v) => setAssign((s) => ({ ...s, role: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.name} value={r.name}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                disabled={!assign.user || !assign.role}
                onClick={async () => {
                  try {
                    const role = roles.find((r: any) => r.name === assign.role);
                    const userId = Number(assign.user);
                    if (!role?.id || !userId) return;
                    await assignRole(userId, { role_id: role.id });
                    toast.success("Role diassign");
                  } catch (e: any) {
                    toast.error(e?.message || "Gagal assign role");
                  }
                }}
              >
                Simpan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Log</CardTitle>
          <CardDescription>Aktivitas penting pada sistem</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {audit.map((a, i) => (
              <div key={i} className="text-sm p-2 border rounded">
                {a.message}
              </div>
            ))}
            {!audit.length && (
              <div className="text-sm text-muted-foreground italic">
                Belum ada audit log
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
