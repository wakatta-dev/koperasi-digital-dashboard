/** @format */

"use client";

import { useState } from "react";
import { useRoles, useRolePermissions, useRoleActions } from "@/hooks/queries/roles";
import type { Role } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useConfirm } from "@/hooks/use-confirm";

type RolesManagerProps = {
  initialData?: Role[];
};

export function RolesManager({ initialData }: RolesManagerProps) {
  const { data: roles = [] } = useRoles({ limit: 100 }, initialData);
  const { create, update, remove, addPermission, removePermission } = useRoleActions();
  const confirm = useConfirm();
  const [newRole, setNewRole] = useState({ name: "", description: "" });
  const [expandedId, setExpandedId] = useState<number | null>(null);
  // state for adding permission is handled inside RolePermissions component

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Buat Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <Input placeholder="Nama role" value={newRole.name} onChange={(e) => setNewRole((s) => ({ ...s, name: e.target.value }))} />
            <Input placeholder="Deskripsi" value={newRole.description} onChange={(e) => setNewRole((s) => ({ ...s, description: e.target.value }))} />
            <div />
            <Button type="button" onClick={async () => { if (!newRole.name.trim() || !newRole.description.trim()) return; const ok = await confirm({ variant: "create", title: "Buat role baru?", description: `Role ${newRole.name.trim()} akan dibuat.`, confirmText: "Buat" }); if (!ok) return; await create.mutateAsync({ name: newRole.name, description: newRole.description }); setNewRole({ name: "", description: "" }); }}>Simpan</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roles.map((r: any) => (
              <div key={r.id} className="border rounded p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.description ?? "-"}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                      {expandedId === r.id ? "Sembunyikan" : "Permissions"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={async () => {
                      const next = prompt("Nama role baru", r.name) || r.name;
                      if (!next) return;
                      if (next === r.name) return;
                      const ok = await confirm({ variant: "edit", title: "Simpan perubahan role?", description: `Role ${r.name} akan menjadi ${next}.`, confirmText: "Simpan" });
                      if (!ok) return;
                      await update.mutateAsync({ id: r.id, payload: { name: next } });
                    }}>Ubah</Button>
                    <Button variant="destructive" size="sm" onClick={async () => {
                      const ok = await confirm({ variant: "delete", title: "Hapus role?", description: r.name, confirmText: "Hapus" });
                      if (!ok) return;
                      remove.mutate(r.id);
                    }}>Hapus</Button>
                  </div>
                </div>
                {expandedId === r.id && (
                  <RolePermissions roleId={r.id} onAdd={(obj, act) => addPermission.mutateAsync({ id: r.id, obj, act })} onRemove={(pid) => removePermission.mutateAsync({ roleId: r.id, permissionId: pid })} />
                )}
              </div>
            ))}
            {!roles.length && (
              <div className="text-sm text-muted-foreground italic">Belum ada role</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RolePermissions({ roleId, onAdd, onRemove }: { roleId: number; onAdd: (obj: string, act: string) => Promise<unknown> | void; onRemove: (pid: string | number) => Promise<unknown> | void }) {
  const { data: perms = [] } = useRolePermissions(roleId, { limit: 200 });
  const [obj, setObj] = useState("");
  const [act, setAct] = useState("");
  const confirm = useConfirm();
  return (
    <div className="mt-3 border-t pt-3 space-y-3">
      <div className="flex items-center gap-2">
        <Input placeholder="obj (resource)" value={obj} onChange={(e) => setObj(e.target.value)} />
        <Input placeholder="act (action)" value={act} onChange={(e) => setAct(e.target.value)} />
        <Button type="button" onClick={async () => { if (!obj || !act) return; const ok = await confirm({ variant: "create", title: "Tambah permission?", description: `${obj}/${act} akan ditambahkan.`, confirmText: "Tambah" }); if (!ok) return; await onAdd(obj, act); setObj(""); setAct(""); }}>Tambah</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {perms.map((p: any) => (
          <Badge key={p.id} variant="outline" className="flex items-center gap-2">
            <span>{p.obj}</span>
            <span className="text-muted-foreground">/</span>
            <span>{p.act}</span>
            <button className="text-red-600 text-xs" onClick={async () => {
              const ok = await confirm({ variant: "delete", title: "Hapus permission?", description: `${p.obj}/${p.act} akan dihapus.`, confirmText: "Hapus" });
              if (!ok) return;
              await onRemove(p.id);
            }}>hapus</button>
          </Badge>
        ))}
        {!perms.length && (
          <div className="text-xs text-muted-foreground italic">Belum ada permission</div>
        )}
      </div>
    </div>
  );
}
