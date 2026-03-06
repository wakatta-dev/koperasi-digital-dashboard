/** @format */

import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Role, User } from "@/types/api";
import { getUserPrimaryRoleId, getUserPrimaryRoleName, settingsHeaderClassName, settingsSurfaceClassName } from "../../lib/settings";

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
    <Card className={`${settingsSurfaceClassName} overflow-hidden`}>
      <div className={settingsHeaderClassName}>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Manajemen User</h2>
          <p className="mt-1 text-sm text-gray-500">
            Kelola anggota tim dan tetapkan peran (Role) yang sesuai.
          </p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            value={search}
            placeholder="Cari nama atau email pengguna..."
            className="border-gray-300 pl-9 focus-visible:border-indigo-600 focus-visible:ring-indigo-600/30 dark:border-gray-700"
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
      </div>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 bg-gray-50 uppercase text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
                <TableHead className="px-6 py-3">Nama</TableHead>
                <TableHead className="px-6 py-3">Email</TableHead>
                <TableHead className="px-6 py-3">Role</TableHead>
                <TableHead className="px-6 py-3">Status</TableHead>
                <TableHead className="px-6 py-3 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const currentRoleId = getUserPrimaryRoleId(user);
                const selectedRoleId =
                  roleByUser[user.id] ?? (currentRoleId ? String(currentRoleId) : "");

                return (
                  <TableRow
                    key={user.id}
                    className="border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                  >
                    <TableCell className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {user.full_name}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-500">{user.email}</TableCell>
                    <TableCell className="px-6 py-4">
                      <Select
                        value={selectedRoleId}
                        disabled={disabled}
                        onValueChange={(next) => onRoleChange(user.id, next)}
                      >
                        <SelectTrigger className="h-8 w-44 border-gray-300 text-xs dark:border-gray-700">
                          <SelectValue placeholder={getUserPrimaryRoleName(user)} />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={String(role.id)}>
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
                            ? "border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "border-transparent bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
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
                          className="h-8 border-gray-300 px-3 py-1 text-xs dark:border-gray-700"
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
                          onCheckedChange={(checked) => onToggleStatus(user.id, checked)}
                          className="data-[state=checked]:bg-indigo-600"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-sm text-gray-500">
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

