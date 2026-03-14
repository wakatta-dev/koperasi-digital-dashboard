/** @format */

import type { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TableShell } from "@/components/shared/data-display/TableShell";
import type { Role, User } from "@/types/api";
import {
  getUserPrimaryRoleId,
  getUserPrimaryRoleName,
  settingsHeaderClassName,
  settingsMutedTextClassName,
  settingsSectionTitleClassName,
  settingsSurfaceClassName,
} from "../../lib/settings";

type FeatureAccessUserManagementCardProps = {
  users: User[];
  roles: Role[];
  search: string;
  disabled: boolean;
  savingRole: boolean;
  savingStatus: boolean;
  roleByUser: Record<number, string>;
  onSearchChange: (value: string) => void;
  onRoleChange: (userId: number, roleId: string) => void;
  onSaveRole: (userId: number, roleId: string) => void;
  onToggleStatus: (userId: number, nextStatus: boolean) => void;
};

export function FeatureAccessUserManagementCard({
  users,
  roles,
  search,
  disabled,
  savingRole,
  savingStatus,
  roleByUser,
  onSearchChange,
  onRoleChange,
  onSaveRole,
  onToggleStatus,
}: FeatureAccessUserManagementCardProps) {
  const columns: ColumnDef<User, unknown>[] = [
    {
      id: "name",
      header: "Nama",
      meta: {
        headerClassName: "px-6 py-3",
        cellClassName: "px-6 py-4 font-medium text-slate-950 dark:text-white",
      },
      cell: ({ row }) => row.original.full_name,
    },
    {
      id: "email",
      header: "Email",
      meta: {
        headerClassName: "px-6 py-3",
        cellClassName: "px-6 py-4 text-slate-500 dark:text-slate-400",
      },
      cell: ({ row }) => (
        <span className="block max-w-[220px] truncate">
          {row.original.email}
        </span>
      ),
    },
    {
      id: "role",
      header: "Role",
      meta: {
        headerClassName: "px-6 py-3",
        cellClassName: "px-6 py-4",
      },
      cell: ({ row }) => {
        const currentRoleId = getUserPrimaryRoleId(row.original);
        const selectedRoleId =
          roleByUser[row.original.id] ??
          (currentRoleId ? String(currentRoleId) : "");

        return (
          <Select
            value={selectedRoleId}
            disabled={disabled}
            onValueChange={(next) => onRoleChange(row.original.id, next)}
          >
            <SelectTrigger className="h-8 w-44 border-slate-300 text-xs dark:border-slate-700">
              <SelectValue placeholder={getUserPrimaryRoleName(row.original)} />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role, roleIndex) => (
                <SelectItem
                  key={`${role.id}-${roleIndex}`}
                  value={String(role.id)}
                >
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      meta: {
        headerClassName: "px-6 py-3",
        cellClassName: "px-6 py-4",
      },
      cell: ({ row }) => (
        <Badge
          className={
            row.original.status
              ? "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "border-transparent bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          }
        >
          {row.original.status ? "Aktif" : "Nonaktif"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      meta: {
        align: "right",
        headerClassName: "px-6 py-3 text-right",
        cellClassName: "px-6 py-4 text-right",
      },
      cell: ({ row }) => {
        const currentRoleId = getUserPrimaryRoleId(row.original);
        const selectedRoleId =
          roleByUser[row.original.id] ??
          (currentRoleId ? String(currentRoleId) : "");

        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8 border-slate-300 px-3 py-1 text-xs dark:border-slate-700"
              disabled={
                disabled ||
                !selectedRoleId ||
                String(currentRoleId ?? "") === selectedRoleId ||
                savingRole
              }
              onClick={() => onSaveRole(row.original.id, selectedRoleId)}
            >
              Simpan Role
            </Button>
            <Switch
              checked={row.original.status}
              disabled={disabled || savingStatus}
              onCheckedChange={(checked) =>
                onToggleStatus(row.original.id, checked)
              }
              className="data-[state=checked]:bg-slate-950 dark:data-[state=checked]:bg-white"
            />
          </div>
        );
      },
    },
  ];

  return (
    <Card className={`${settingsSurfaceClassName} overflow-hidden gap-y-0`}>
      <div className={settingsHeaderClassName}>
        <div className="mb-4">
          <h2 className={settingsSectionTitleClassName}>Manajemen User</h2>
          <p className={`mt-1 ${settingsMutedTextClassName}`}>
            Kelola anggota tim dan tetapkan peran (Role) yang sesuai.
          </p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search
            aria-hidden="true"
            className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"
          />
          <Input
            name="user_search"
            autoComplete="off"
            value={search}
            placeholder="Cari nama atau email pengguna…"
            className="border-slate-300 pl-9 focus-visible:border-slate-900 focus-visible:ring-slate-900/15 dark:border-slate-700"
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
      </div>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <TableShell
            columns={columns}
            data={users}
            getRowId={(row, userIndex) => `${row.id}-${userIndex}`}
            emptyState="Tidak ada user ditemukan."
            headerRowClassName="border-b border-slate-200 bg-slate-50/80 uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400"
            rowClassName="border-slate-200 hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-900/60"
          />
        </div>
      </CardContent>
    </Card>
  );
}
