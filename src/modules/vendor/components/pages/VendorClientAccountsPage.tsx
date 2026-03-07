/** @format */

"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminTenantAccountActions, useAdminTenantAccounts, useRoles } from "@/hooks/queries";
import { userLifecycleStatusLabel } from "../../utils/format";

const FALLBACK_ROLE_OPTIONS = ["CLIENT_ADMIN", "FINANCE", "STAFF", "VIEWER"];

type VendorClientAccountsPageProps = {
  tenantId: string;
};

export function VendorClientAccountsPage({
  tenantId,
}: VendorClientAccountsPageProps) {
  const [search, setSearch] = useState("");
  const accountsQuery = useAdminTenantAccounts(tenantId, {
    limit: 50,
    search: search.trim() || undefined,
  });
  const rolesQuery = useRoles({ limit: 100 });
  const actions = useAdminTenantAccountActions(tenantId);

  const rows = accountsQuery.data?.data?.items ?? [];
  const availableInviteRoles = useMemo(() => {
    const mapped = (rolesQuery.data ?? []).filter((role) =>
      FALLBACK_ROLE_OPTIONS.includes(role.name.toUpperCase())
    );
    return mapped;
  }, [rolesQuery.data]);

  const [inviteForm, setInviteForm] = useState({
    email_baru: "",
    role: "",
    reason: "",
    otp: "",
  });
  const [emailChangeForm, setEmailChangeForm] = useState({
    userId: "",
    email_baru: "",
    reason: "",
    otp: "",
  });
  const [roleDrafts, setRoleDrafts] = useState<Record<number, string>>({});
  const [statusReason, setStatusReason] = useState<Record<number, string>>({});

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Invite Tenant Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                value={inviteForm.email_baru}
                onChange={(event) =>
                  setInviteForm((current) => ({
                    ...current,
                    email_baru: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={inviteForm.role}
                onValueChange={(value) =>
                  setInviteForm((current) => ({
                    ...current,
                    role: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role tenant" />
                </SelectTrigger>
                <SelectContent>
                  {availableInviteRoles.map((role) => (
                    <SelectItem key={role.id} value={String(role.id)}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-reason">Reason</Label>
              <Input
                id="invite-reason"
                value={inviteForm.reason}
                onChange={(event) =>
                  setInviteForm((current) => ({
                    ...current,
                    reason: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-otp">OTP</Label>
              <Input
                id="invite-otp"
                value={inviteForm.otp}
                onChange={(event) =>
                  setInviteForm((current) => ({
                    ...current,
                    otp: event.target.value,
                  }))
                }
              />
            </div>
            <Button
              className="w-full"
              disabled={actions.invite.isPending || !inviteForm.role}
              onClick={() =>
                actions.invite.mutate(
                  {
                    tenant_id: Number(tenantId),
                    email_baru: inviteForm.email_baru,
                    role: Number(inviteForm.role),
                    reason: inviteForm.reason,
                    otp: inviteForm.otp,
                  },
                  {
                    onSuccess: () => {
                      setInviteForm({
                        email_baru: "",
                        role: "",
                        reason: "",
                        otp: "",
                      });
                    },
                  }
                )
              }
            >
              Kirim Undangan
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Email Change</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>User</Label>
              <Select
                value={emailChangeForm.userId}
                onValueChange={(value) =>
                  setEmailChangeForm((current) => ({
                    ...current,
                    userId: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih user tenant" />
                </SelectTrigger>
                <SelectContent>
                  {rows.map((row) => (
                    <SelectItem key={row.id} value={String(row.id)}>
                      {row.full_name} · {row.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="change-email">Email Baru</Label>
              <Input
                id="change-email"
                value={emailChangeForm.email_baru}
                onChange={(event) =>
                  setEmailChangeForm((current) => ({
                    ...current,
                    email_baru: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="change-reason">Reason</Label>
              <Input
                id="change-reason"
                value={emailChangeForm.reason}
                onChange={(event) =>
                  setEmailChangeForm((current) => ({
                    ...current,
                    reason: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="change-otp">OTP</Label>
              <Input
                id="change-otp"
                value={emailChangeForm.otp}
                onChange={(event) =>
                  setEmailChangeForm((current) => ({
                    ...current,
                    otp: event.target.value,
                  }))
                }
              />
            </div>
            <Button
              className="w-full"
              disabled={actions.changeEmail.isPending || !emailChangeForm.userId}
              onClick={() =>
                actions.changeEmail.mutate(
                  {
                    userId: emailChangeForm.userId,
                    payload: {
                      email_baru: emailChangeForm.email_baru,
                      reason: emailChangeForm.reason,
                      otp: emailChangeForm.otp,
                    },
                  },
                  {
                    onSuccess: () => {
                      setEmailChangeForm({
                        userId: "",
                        email_baru: "",
                        reason: "",
                        otp: "",
                      });
                    },
                  }
                )
              }
            >
              Jadwalkan Perubahan Email
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Tenant Accounts</CardTitle>
          <Input
            className="sm:max-w-sm"
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </CardHeader>
        <CardContent>
          {accountsQuery.error ? (
            <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {(accountsQuery.error as Error).message}
            </div>
          ) : null}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => {
                const currentRole = row.role?.toUpperCase();
                const nextRole = roleDrafts[row.id] ?? currentRole;
                const currentStatus = row.status?.toUpperCase();
                const nextStatus =
                  currentStatus === "ACTIVE" ? "DEACTIVATED" : "ACTIVE";
                return (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{row.full_name}</div>
                        <div className="text-xs text-muted-foreground">{row.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="space-y-2">
                      <Select
                        value={nextRole}
                        onValueChange={(value) =>
                          setRoleDrafts((current) => ({
                            ...current,
                            [row.id]: value,
                          }))
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Pilih role" />
                        </SelectTrigger>
                        <SelectContent>
                          {FALLBACK_ROLE_OPTIONS.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{userLifecycleStatusLabel(row.status)}</Badge>
                    </TableCell>
                    <TableCell className="space-y-2 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actions.updateRole.isPending || !nextRole}
                          onClick={() =>
                            actions.updateRole.mutate({
                              userId: row.id,
                              payload: {
                                role: nextRole,
                                reason: "Updated from vendor console",
                              },
                            })
                          }
                        >
                          Simpan Role
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actions.resetPassword.isPending}
                          onClick={() => actions.resetPassword.mutate(row.id)}
                        >
                          Reset Password
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actions.updateStatus.isPending}
                          onClick={() =>
                            actions.updateStatus.mutate({
                              userId: row.id,
                              payload: {
                                status: nextStatus,
                                reason:
                                  statusReason[row.id] ||
                                  "Updated from vendor client account console",
                              },
                            })
                          }
                        >
                          {currentStatus === "ACTIVE" ? "Nonaktifkan" : "Aktifkan"}
                        </Button>
                      </div>
                      <Input
                        value={statusReason[row.id] ?? ""}
                        placeholder="Reason untuk status change"
                        onChange={(event) =>
                          setStatusReason((current) => ({
                            ...current,
                            [row.id]: event.target.value,
                          }))
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
              {!rows.length ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                    Tidak ada akun tenant.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
