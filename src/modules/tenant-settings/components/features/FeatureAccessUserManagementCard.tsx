/** @format */

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-200 bg-slate-50/80 uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400">
                <TableHead className="px-6 py-3">Nama</TableHead>
                <TableHead className="px-6 py-3">Email</TableHead>
                <TableHead className="px-6 py-3">Role</TableHead>
                <TableHead className="px-6 py-3">Status</TableHead>
                <TableHead className="px-6 py-3 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, userIndex) => {
                const currentRoleId = getUserPrimaryRoleId(user);
                const selectedRoleId =
                  roleByUser[user.id] ??
                  (currentRoleId ? String(currentRoleId) : "");

                return (
                  <TableRow
                    key={`${user.id}-${userIndex}`}
                    className="border-slate-200 hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-900/60"
                  >
                    <TableCell className="px-6 py-4 font-medium text-slate-950 dark:text-white">
                      {user.full_name}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      <span className="block max-w-[220px] truncate">
                        {user.email}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Select
                        value={selectedRoleId}
                        disabled={disabled}
                        onValueChange={(next) => onRoleChange(user.id, next)}
                      >
                        <SelectTrigger className="h-8 w-44 border-slate-300 text-xs dark:border-slate-700">
                          <SelectValue
                            placeholder={getUserPrimaryRoleName(user)}
                          />
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
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge
                        className={
                          user.status
                            ? "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : "border-transparent bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }
                      >
                        {user.status ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
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
                          onClick={() => onSaveRole(user.id, selectedRoleId)}
                        >
                          Simpan Role
                        </Button>
                        <Switch
                          checked={user.status}
                          disabled={disabled || savingStatus}
                          onCheckedChange={(checked) =>
                            onToggleStatus(user.id, checked)
                          }
                          className="data-[state=checked]:bg-slate-950 dark:data-[state=checked]:bg-white"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

              {users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-sm text-slate-500 dark:text-slate-400"
                  >
                    Tidak ada user ditemukan.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
