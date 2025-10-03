/** @format */
"use client";

import { useEffect, useMemo, useState } from "react";
import { CreditCard, FileText, Layers, Ticket } from "lucide-react";
import {
  useClients,
  useClientActions,
  useClientActivity,
} from "@/hooks/queries/clients";
import {
  useTenant,
  useTenantModules,
  useTenantUsers,
  useTenantActions,
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
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Client, TenantUser } from "@/types/api";
import { useConfirm } from "@/hooks/use-confirm";

export function ClientsListClient({ rows }: { rows: Client[] }) {
  const [selectedId, setSelectedId] = useState<Client["id"] | null>(null);
  const [q, setQ] = useState("");
  const listParams = useMemo(
    () => ({ limit: rows?.length || 10 }),
    [rows?.length]
  );
  const { data: live } = useClients(
    listParams,
    rows as Client[] | undefined,
    { refetchInterval: 300000 }
  );
  const list = (live?.length ? live : rows) as Client[];
  const filtered = list.filter((t) => {
    const query = q.trim().toLowerCase();
    if (!query) return true;
    return (
      (t.name || "").toLowerCase().includes(query) ||
      (t.domain || "").toLowerCase().includes(query) ||
      (t.type || "").toLowerCase().includes(query)
    );
  });
  const selected = useMemo(() => {
    if (selectedId == null) return null;
    return (
      list.find((item) => String(item.id) === String(selectedId)) ??
      rows.find((item) => String(item.id) === String(selectedId)) ??
      null
    );
  }, [list, rows, selectedId]);

  return (
    <>
      <div className="mb-4">
        <Input
          placeholder="Cari nama / domain / tipe..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="rounded-md border overflow-auto max-h-[60vh]">
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
              <TableRow
                key={String(t.id)}
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => setSelectedId(t.id)}
              >
                <TableCell>{t.name}</TableCell>
                <TableCell className="capitalize">{t.type}</TableCell>
                <TableCell>{t.domain}</TableCell>
                <TableCell>
                  <Badge
                    variant={t.status === "active" ? "default" : "secondary"}
                  >
                    {t.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(t.id);
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelectedId(null)}>
        <DialogContent className="max-w-3xl p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Client Detail</DialogTitle>
          </DialogHeader>
          <ScrollArea className="px-6 py-4 max-h-[75vh]">
            {selected && (
              <TenantDetail tenantId={selected.id} client={selected} />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

function TenantDetail({
  tenantId,
  client,
}: {
  tenantId: number | string;
  client: Client;
}) {
  const { data: session } = useSession();
  const isSuperAdmin =
    ((session?.user as any)?.role?.name ?? "") === "Super Admin";
  const { data: tenant } = useTenant(tenantId);
  const { data: users = [] } = useTenantUsers(tenantId);
  const { data: modules = [] } = useTenantModules(tenantId);
  const { updateModule, addUser } = useTenantActions();
  const { updateStatus } = useClientActions();
  const activityParams = useMemo(() => ({ limit: 10 }), []);
  const { data: activities = [] } = useClientActivity(tenantId, activityParams);
  const { data: roles = [] } = useRoles({ limit: 100 });
  const confirm = useConfirm();

  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    password: "",
    tenant_role_id: "",
  });
  const [moduleStatuses, setModuleStatuses] = useState<
    Record<string, "aktif" | "nonaktif">
  >({});

  useEffect(() => {
    const next: Record<string, "aktif" | "nonaktif"> = {};
    modules.forEach((m) => {
      const key = String(m.module_id ?? m.id);
      if (m.status === "aktif" || m.status === "nonaktif") {
        next[key] = m.status;
      }
    });
    setModuleStatuses(next);
  }, [modules]);

  const status = client?.status ?? tenant?.status;
  const activePlan = client?.active_plan;
  const amountFormatter = useMemo(
    () =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }),
    []
  );
  const activityIcons = useMemo(
    () =>
      ({
        plan: Layers,
        payment: CreditCard,
        ticket: Ticket,
      } as const),
    []
  );

  return (
    <div className="space-y-6 text-sm">
      {/* --- Basic Info --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Info label="Name" value={tenant?.name ?? client?.name} />
        <Info label="Type" value={tenant?.type ?? client?.type} capitalize />
        <Info label="Domain" value={tenant?.domain ?? client?.domain} />
        <div className="flex items-center gap-2">
          <Badge variant={status === "active" ? "default" : "secondary"}>
            {status ?? "-"}
          </Badge>
          {isSuperAdmin && (
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                const nextStatus = status === "active" ? "inactive" : "active";
                const ok = await confirm({
                  variant: "edit",
                  title: `${
                    nextStatus === "active" ? "Aktifkan" : "Nonaktifkan"
                  } client?`,
                  description: `Status akan berubah menjadi ${nextStatus}.`,
                  confirmText: "Simpan",
                });
                if (!ok) return;
                updateStatus.mutate({
                  id: tenantId,
                  status: nextStatus,
                });
              }}
            >
              {status === "active" ? "Deactivate" : "Activate"}
            </Button>
          )}
        </div>
        {activePlan && (
          <>
            <Info
              label="Plan"
              value={`${activePlan.plan_name} (${activePlan.plan_type})`}
            />
            <Info
              label="Plan Period"
              value={`${activePlan.start_date}${
                activePlan.end_date ? ` - ${activePlan.end_date}` : ""
              }`}
            />
          </>
        )}
      </div>

      {/* --- Users --- */}
      <Section title="Users">
        <div className="space-y-2">
          {(users as TenantUser[]).map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between border rounded p-2"
            >
              <div>
                <div className="font-medium">{u.full_name}</div>
                <div className="text-muted-foreground text-xs">{u.email}</div>
              </div>
              <div className="text-xs text-muted-foreground">
                role: {u.tenant_role_id}
              </div>
            </div>
          ))}
          {!users?.length && (
            <div className="text-muted-foreground italic text-xs">
              No users.
            </div>
          )}

          {isSuperAdmin && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end mt-2">
              <Input
                placeholder="Nama"
                value={newUser.full_name}
                onChange={(e) =>
                  setNewUser((s) => ({ ...s, full_name: e.target.value }))
                }
              />
              <Input
                placeholder="email@domain"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser((s) => ({ ...s, email: e.target.value }))
                }
              />
              <Select
                value={newUser.tenant_role_id}
                onValueChange={(v) =>
                  setNewUser((s) => ({ ...s, tenant_role_id: v }))
                }
              >
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={String(r.id)}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Input
                  placeholder="Password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser((s) => ({ ...s, password: e.target.value }))
                  }
                />
                <Button
                  onClick={async () => {
                    const { email, full_name, password, tenant_role_id } =
                      newUser;
                    if (!email || !full_name || !password || !tenant_role_id)
                      return;
                    const ok = await confirm({
                      variant: "create",
                      title: "Tambah pengguna tenant?",
                      description: `Akun ${email} akan dibuat.`,
                      confirmText: "Tambah",
                    });
                    if (!ok) return;
                    await addUser.mutateAsync({
                      id: tenantId,
                      payload: {
                        email,
                        full_name,
                        password,
                        tenant_role_id: Number(tenant_role_id),
                      },
                    });
                    setNewUser({
                      full_name: "",
                      email: "",
                      password: "",
                      tenant_role_id: "",
                    });
                  }}
                >
                  Tambah
                </Button>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* --- Modules --- */}
      <Section title="Modules">
        <div className="space-y-2">
          {modules.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between border rounded p-2 gap-2"
            >
              <div className="font-medium">
                {m.name}{" "}
                <span className="text-muted-foreground text-sm">
                  ({m.code})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={m.status === "aktif" ? "default" : "secondary"}>
                  {m.status}
                </Badge>
                {isSuperAdmin && (
                  <Select
                    value={
                      moduleStatuses[String(m.module_id ?? m.id)] ?? m.status
                    }
                    onValueChange={async (next: "aktif" | "nonaktif") => {
                      const key = String(m.module_id ?? m.id);
                      const current =
                        moduleStatuses[key] ?? (m.status as "aktif" | "nonaktif");
                      if (next === current) return;
                      const ok = await confirm({
                        variant: "edit",
                        title: "Ubah status modul?",
                        description: `${m.name} akan ${
                          next === "aktif" ? "diaktifkan" : "dinonaktifkan"
                        }.`,
                        confirmText: "Simpan",
                      });
                      if (!ok) {
                        setModuleStatuses((prev) => ({ ...prev }));
                        return;
                      }
                      setModuleStatuses((prev) => ({
                        ...prev,
                        [key]: next,
                      }));
                      await updateModule.mutateAsync({
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
            <div className="text-xs text-muted-foreground italic">
              No modules.
            </div>
          )}
        </div>
      </Section>

      {/* --- Activity --- */}
      <Section title="Activity">
        <div className="space-y-2">
          {activities.length ? (
            activities.map((entry, idx) => {
              const occurredAt = entry.occurred_at
                ? new Date(entry.occurred_at)
                : null;
              const occurredAtText =
                occurredAt && !Number.isNaN(occurredAt.valueOf())
                  ? occurredAt.toLocaleString()
                  : entry.occurred_at;
              const Icon =
                activityIcons[entry.type as keyof typeof activityIcons] ??
                FileText;

              return (
                <Card key={`${entry.occurred_at}-${idx}`}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-sm capitalize">
                        {entry.type}
                      </CardTitle>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {occurredAtText}
                    </span>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm text-muted-foreground">
                    <p>{entry.action}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {entry.status && (
                        <Badge variant="outline">{entry.status}</Badge>
                      )}
                      {entry.reference && <span>Ref: {entry.reference}</span>}
                      {typeof entry.amount === "number" && (
                        <span>{amountFormatter.format(entry.amount)}</span>
                      )}
                    </div>
                    {entry.message && (
                      <p className="text-xs italic">{entry.message}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="text-muted-foreground italic text-xs">
              No activity.
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}

function Info({
  label,
  value,
  capitalize,
}: {
  label: string;
  value?: string;
  capitalize?: boolean;
}) {
  return (
    <div>
      <div className="text-muted-foreground text-xs">{label}</div>
      <div className={`font-medium ${capitalize ? "capitalize" : ""}`}>
        {value || "-"}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t pt-4">
      <h4 className="font-semibold text-sm mb-2">{title}</h4>
      {children}
    </div>
  );
}
