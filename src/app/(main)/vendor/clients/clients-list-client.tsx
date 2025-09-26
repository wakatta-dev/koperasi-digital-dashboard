/** @format */
"use client";

import { useState } from "react";
import {
  useTenant,
  useTenantModules,
  useTenantUsers,
  useTenantActions,
  useTenants,
} from "@/hooks/queries/tenants";
import { useRoles } from "@/hooks/queries/roles";
import { useSession } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { TenantDetail, TenantModule, TenantUser } from "@/types/api";

type Row = Pick<
  TenantDetail,
  "id" | "name" | "type" | "domain" | "status" | "is_active"
>;

export function ClientsListClient({ rows }: { rows: Row[] }) {
  const [selected, setSelected] = useState<Row | null>(null);
  const [q, setQ] = useState("");
  const { data: live = [] } = useTenants(
    { limit: rows?.length || 10 },
    rows as TenantDetail[] | undefined,
    { refetchInterval: 300000 }
  );
  const list: Row[] = live.length ? live : rows;
  const filtered = list.filter((t) => {
    const query = q.trim().toLowerCase();
    if (!query) return true;
    return (
      (t.name || "").toLowerCase().includes(query) ||
      (t.domain || "").toLowerCase().includes(query) ||
      (t.type || "").toLowerCase().includes(query)
    );
  });

  return (
    <>
      <div className="mb-3">
        <input
          className="border rounded px-3 py-2 w-full text-sm"
          placeholder="Cari nama / domain / tipe..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
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
          {filtered.map((t) => (
            <TableRow key={String(t.id)}>
              <TableCell>{t.name}</TableCell>
              <TableCell className="capitalize">{t.type}</TableCell>
              <TableCell>{t.domain}</TableCell>
              <TableCell>
                <Badge variant={t.status === "active" ? "default" : "secondary"}>
                  {t.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelected(t)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Client Detail</DialogTitle>
          </DialogHeader>
          {selected && <TenantDetail tenantId={selected.id} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

function TenantDetail({ tenantId }: { tenantId: number | string }) {
  const { data: session } = useSession();
  const isSuperAdmin = ((session?.user as any)?.role?.name ?? "") === "Super Admin";
  const { data: tenant } = useTenant(tenantId);
  const { data: users = [] } = useTenantUsers(tenantId);
  const { data: modules = [] } = useTenantModules(tenantId);
  const { updateStatus, updateModule, addUser } = useTenantActions();
  const { data: roles = [] } = useRoles({ limit: 100 });
  const [newUser, setNewUser] = useState({ full_name: "", email: "", password: "", tenant_role_id: "" });

  return (
    <div className="space-y-4 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <div className="text-muted-foreground">Name</div>
          <div className="font-medium">{tenant?.name ?? '-'}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Type</div>
          <div className="font-medium capitalize">{tenant?.type ?? '-'}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Domain</div>
          <div className="font-medium">{tenant?.domain ?? '-'}</div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={tenant?.status === 'active' ? 'default' : 'secondary'}>
            {tenant?.status ?? '-'}
          </Badge>
          {isSuperAdmin && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const nextStatus: "active" | "inactive" =
                tenant?.status === "active" ? "inactive" : "active";
              updateStatus.mutate({ id: tenantId, status: nextStatus });
            }}
          >
            {tenant?.status === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="font-medium">Users</div>
        <div className="space-y-1">
          {(users as TenantUser[]).map((u) => (
            <div key={u.id} className="flex items-center justify-between border rounded p-2">
              <div>
                <div className="font-medium">{u.full_name}</div>
                <div className="text-muted-foreground">{u.email}</div>
              </div>
              <div className="text-xs text-muted-foreground">role: {u.tenant_role_id}</div>
            </div>
          ))}
          {!users?.length && (
            <div className="text-xs text-muted-foreground italic">No users.</div>
          )}
          {isSuperAdmin && (
            <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
              <div>
                <div className="text-xs text-muted-foreground">Nama</div>
                <input className="border rounded px-2 py-1 w-full text-sm" placeholder="Nama" value={newUser.full_name} onChange={(e) => setNewUser((s) => ({ ...s, full_name: e.target.value }))} />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Email</div>
                <input className="border rounded px-2 py-1 w-full text-sm" placeholder="email@domain" value={newUser.email} onChange={(e) => setNewUser((s) => ({ ...s, email: e.target.value }))} />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Role</div>
                <Select
                  value={newUser.tenant_role_id}
                  onValueChange={(v) => setNewUser((s) => ({ ...s, tenant_role_id: v }))}
                >
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    {(roles as any[]).map((r) => (
                      <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <input className="border rounded px-2 py-1 w-full text-sm" type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser((s) => ({ ...s, password: e.target.value }))} />
                <button
                  className="border rounded px-3 py-2 text-sm"
                  onClick={() => {
                    if (!newUser.email || !newUser.full_name || !newUser.password || !newUser.tenant_role_id) return;
                    addUser.mutate({ id: tenantId, payload: { email: newUser.email, full_name: newUser.full_name, password: newUser.password, tenant_role_id: Number(newUser.tenant_role_id) } as any });
                    setNewUser({ full_name: "", email: "", password: "", tenant_role_id: "" });
                  }}
                >
                  Tambah
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="font-medium">Modules</div>
        <div className="space-y-1">
          {(modules as TenantModule[]).map((m) => (
            <div key={m.id} className="flex items-center justify-between border rounded p-2 gap-2">
              <div className="font-medium">
                {m.name} <span className="text-muted-foreground">({m.code})</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={m.status === 'aktif' ? 'default' : 'secondary'}>{m.status}</Badge>
                {isSuperAdmin && (
                  <Select
                    defaultValue={m.status}
                    onValueChange={(next: 'aktif' | 'nonaktif') => {
                      updateModule.mutate({
                        id: tenantId,
                        module_id: m.module_id,
                        status: next,
                      });
                    }}
                  >
                    <SelectTrigger size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aktif">aktif</SelectItem>
                      <SelectItem value="nonaktif">nonaktif</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          ))}
          {!modules?.length && (
            <div className="text-xs text-muted-foreground italic">No modules.</div>
          )}
        </div>
      </div>
    </div>
  );
}
