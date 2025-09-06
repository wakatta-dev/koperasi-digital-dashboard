/** @format */

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { assignRole, createRole, deleteRole, listRoles, listRolePermissions, addRolePermission, deleteRolePermission } from "@/services/api";
import { toast } from "sonner";

export default function PengaturanPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [audit, setAudit] = useState<any[]>([]);
  const [newRole, setNewRole] = useState<string>("");
  const [assign, setAssign] = useState<{user?: string; role?: string}>({});
  const [permObj, setPermObj] = useState<string>("");
  const [permAct, setPermAct] = useState<string>("");

  // Integrate API: roles basic list/create/delete, simple assign
  useEffect(() => {
    (async () => {
      try {
        const res = await listRoles({ limit: 100 });
        if (res.success) {
          const list = res.data || [];
          setRoles(list);
          if (list.length && !selectedRoleId) setSelectedRoleId(list[0].id);
        }
      } catch {
        setRoles([]);
      }
    })();
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Role</CardTitle>
            <CardDescription>Kelola peran pengguna</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input placeholder="Nama role" value={newRole} onChange={(e) => setNewRole(e.target.value)} />
                <Button onClick={async () => {
                  if (!newRole) return;
                  try {
                    const res = await createRole({ name: newRole });
                    if (res.success) {
                      toast.success("Role ditambahkan");
                      const list = await listRoles({ limit: 100 });
                      if (list.success) {
                        setRoles(list.data || []);
                        if (!selectedRoleId && list.data?.[0]?.id) setSelectedRoleId(list.data[0].id);
                      }
                    }
                  } finally {
                    setNewRole("");
                  }
                }}>Tambah</Button>
              </div>
              <ul className="text-sm space-y-1">
                {roles.map((r: any) => (
                  <li key={String(r.id ?? r.name)} className="flex items-center justify-between p-2 border rounded">
                    <button className={`text-left flex-1 ${selectedRoleId === r.id ? 'font-semibold' : ''}`} onClick={() => setSelectedRoleId(r.id)}>{r.name}</button>
                    <Button variant="outline" size="sm" onClick={async () => {
                      if (!r.id) return;
                      await deleteRole(r.id);
                      const list = await listRoles({ limit: 100 });
                      if (list.success) setRoles(list.data || []);
                    }}>Hapus</Button>
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
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input placeholder="Obj (contoh: transactions)" value={permObj} onChange={(e) => setPermObj(e.target.value)} />
                <Input placeholder="Act (contoh: read|write)" value={permAct} onChange={(e) => setPermAct(e.target.value)} />
                <Button disabled={!selectedRoleId || !permObj || !permAct} onClick={async () => {
                  if (!selectedRoleId) return;
                  await addRolePermission(selectedRoleId, { obj: permObj, act: permAct });
                  setPermObj(""); setPermAct("");
                  const res = await listRolePermissions(selectedRoleId, { limit: 200 });
                  if (res.success) setPermissions(res.data || []);
                }}>Tambah</Button>
              </div>
              <div className="space-y-2">
                {permissions.map((p: any) => (
                  <div key={String(p.id ?? `${p.obj}:${p.act}`)} className="flex items-center justify-between p-2 border rounded">
                    <div className="text-sm">{p.obj} : {p.act}</div>
                    <Button size="sm" variant="outline" onClick={async () => {
                      if (!selectedRoleId || !p.id) return;
                      await deleteRolePermission(selectedRoleId, p.id);
                      const res = await listRolePermissions(selectedRoleId, { limit: 200 });
                      if (res.success) setPermissions(res.data || []);
                    }}>Hapus</Button>
                  </div>
                ))}
                {!permissions.length && (
                  <div className="text-sm text-muted-foreground italic">Belum ada permission</div>
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
              <Input placeholder="User ID" value={assign.user || ''} onChange={(e) => setAssign((s) => ({...s, user: e.target.value}))} />
              <Select onValueChange={(v) => setAssign((s) => ({...s, role: v}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.name} value={r.name}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button disabled={!assign.user || !assign.role} onClick={async () => {
                try {
                  const role = roles.find((r: any) => r.name === assign.role);
                  const userId = Number(assign.user);
                  if (!role?.id || !userId) return;
                  await assignRole(userId, { role_id: role.id });
                  toast.success("Role diassign");
                } catch (e: any) {
                  toast.error(e?.message || "Gagal assign role");
                }
              }}>Simpan</Button>
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
              <div key={i} className="text-sm p-2 border rounded">{a.message}</div>
            ))}
            {!audit.length && (
              <div className="text-sm text-muted-foreground italic">Belum ada audit log</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
