/** @format */

"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
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
  createCursorPaginationMeta,
  TableShell,
} from "@/components/shared/data-display/TableShell";
import { useCursorStack } from "@/hooks/use-cursor-stack";
import {
  useAdminTenantAccountActions,
  useAdminTenantAccounts,
  useRoles,
} from "@/hooks/queries";
import { userLifecycleStatusLabel } from "../../utils/format";

const FALLBACK_ROLE_OPTIONS = ["CLIENT_ADMIN", "FINANCE", "STAFF", "VIEWER"];

type VendorClientAccountsPageProps = {
  tenantId: string;
};

export function VendorClientAccountsPage({
  tenantId,
}: VendorClientAccountsPageProps) {
  const [uiState, setUiState] = useState({
    search: "",
    inviteForm: {
      email_baru: "",
      role: "",
      reason: "",
      otp: "",
    },
    emailChangeForm: {
      userId: "",
      email_baru: "",
      reason: "",
      otp: "",
    },
  });
  const { search, inviteForm, emailChangeForm } = uiState;
  const patchUiState = (
    updates: Partial<typeof uiState> | ((current: typeof uiState) => typeof uiState),
  ) => {
    setUiState((current) =>
      typeof updates === "function" ? updates(current) : { ...current, ...updates },
    );
  };
  const cursorPagination = useCursorStack<string>();
  const accountsQuery = useAdminTenantAccounts(tenantId, {
    cursor: cursorPagination.currentCursor,
    limit: 50,
    search: search.trim() || undefined,
  });
  const rolesQuery = useRoles({ limit: 100 });
  const actions = useAdminTenantAccountActions(tenantId);

  const rows = accountsQuery.data?.data?.items ?? [];
  const accountsTablePagination = createCursorPaginationMeta(
    accountsQuery.data?.meta?.pagination,
    {
      itemCount: rows.length,
      hasPrev: cursorPagination.canGoBack,
      hasNext: Boolean(accountsQuery.data?.meta?.pagination?.next_cursor),
    },
  );
  const availableInviteRoles = useMemo(() => {
    const mapped = (rolesQuery.data ?? []).filter((role) =>
      FALLBACK_ROLE_OPTIONS.includes(role.name.toUpperCase()),
    );
    return mapped;
  }, [rolesQuery.data]);

  const [roleDrafts, setRoleDrafts] = useState<Record<number, string>>({});
  const [statusReason, setStatusReason] = useState<Record<number, string>>({});
  const columns: ColumnDef<(typeof rows)[number], unknown>[] = [
    {
      id: "user",
      header: "User",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium">{row.original.full_name}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.email}
          </div>
        </div>
      ),
    },
    {
      id: "role",
      header: "Role",
      cell: ({ row }) => {
        const currentRole = row.original.role?.toUpperCase();
        const nextRole = roleDrafts[row.original.id] ?? currentRole;
        return (
          <div className="space-y-2">
            <Select
              value={nextRole}
              onValueChange={(value) =>
                setRoleDrafts((current) => ({
                  ...current,
                  [row.original.id]: value,
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
          </div>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="outline">
          {userLifecycleStatusLabel(row.original.status)}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      meta: {
        align: "right",
        headerClassName: "text-right",
      },
      cell: ({ row }) => {
        const currentRole = row.original.role?.toUpperCase();
        const nextRole = roleDrafts[row.original.id] ?? currentRole;
        const currentStatus = row.original.status?.toUpperCase();
        const nextStatus =
          currentStatus === "ACTIVE" ? "DEACTIVATED" : "ACTIVE";
        return (
          <div className="space-y-2 text-right">
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={actions.updateRole.isPending || !nextRole}
                onClick={() =>
                  actions.updateRole.mutate({
                    userId: row.original.id,
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
                onClick={() => actions.resetPassword.mutate(row.original.id)}
              >
                Reset Password
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={actions.updateStatus.isPending}
                onClick={() =>
                  actions.updateStatus.mutate({
                    userId: row.original.id,
                    payload: {
                      status: nextStatus,
                      reason:
                        statusReason[row.original.id] ||
                        "Updated from vendor client account console",
                    },
                  })
                }
              >
                {currentStatus === "ACTIVE" ? "Nonaktifkan" : "Aktifkan"}
              </Button>
            </div>
            <Input
              value={statusReason[row.original.id] ?? ""}
              placeholder="Reason untuk status change"
              onChange={(event) =>
                setStatusReason((current) => ({
                  ...current,
                  [row.original.id]: event.target.value,
                }))
              }
            />
          </div>
        );
      },
    },
  ];

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
                  patchUiState((current) => ({
                    ...current,
                    inviteForm: {
                      ...current.inviteForm,
                      email_baru: event.target.value,
                    },
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={inviteForm.role}
                onValueChange={(value) =>
                  patchUiState((current) => ({
                    ...current,
                    inviteForm: {
                      ...current.inviteForm,
                      role: value,
                    },
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
                  patchUiState((current) => ({
                    ...current,
                    inviteForm: {
                      ...current.inviteForm,
                      reason: event.target.value,
                    },
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
                  patchUiState((current) => ({
                    ...current,
                    inviteForm: {
                      ...current.inviteForm,
                      otp: event.target.value,
                    },
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
                      patchUiState({
                        inviteForm: {
                          email_baru: "",
                          role: "",
                          reason: "",
                          otp: "",
                        },
                      });
                    },
                  },
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
                  patchUiState((current) => ({
                    ...current,
                    emailChangeForm: {
                      ...current.emailChangeForm,
                      userId: value,
                    },
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
                  patchUiState((current) => ({
                    ...current,
                    emailChangeForm: {
                      ...current.emailChangeForm,
                      email_baru: event.target.value,
                    },
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
                  patchUiState((current) => ({
                    ...current,
                    emailChangeForm: {
                      ...current.emailChangeForm,
                      reason: event.target.value,
                    },
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
                  patchUiState((current) => ({
                    ...current,
                    emailChangeForm: {
                      ...current.emailChangeForm,
                      otp: event.target.value,
                    },
                  }))
                }
              />
            </div>
            <Button
              className="w-full"
              disabled={
                actions.changeEmail.isPending || !emailChangeForm.userId
              }
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
                      patchUiState({
                        emailChangeForm: {
                          userId: "",
                          email_baru: "",
                          reason: "",
                          otp: "",
                        },
                      });
                    },
                  },
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
            onChange={(event) => {
              patchUiState({ search: event.target.value });
              cursorPagination.reset();
            }}
          />
        </CardHeader>
        <CardContent>
          {accountsQuery.error ? (
            <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {(accountsQuery.error as Error).message}
            </div>
          ) : null}

          <TableShell
            columns={columns}
            data={rows}
            getRowId={(row) => String(row.id)}
            loading={accountsQuery.isPending}
            loadingState="Memuat akun tenant..."
            emptyState="Tidak ada akun tenant."
            pagination={accountsTablePagination}
            onPrevPage={
              cursorPagination.canGoBack ? cursorPagination.goBack : undefined
            }
            onNextPage={() => {
              const nextCursor =
                accountsQuery.data?.meta?.pagination?.next_cursor;
              if (!nextCursor) return;
              cursorPagination.goNext(nextCursor);
            }}
            paginationInfo={`Menampilkan ${rows.length} akun tenant`}
          />
        </CardContent>
      </Card>
    </div>
  );
}
