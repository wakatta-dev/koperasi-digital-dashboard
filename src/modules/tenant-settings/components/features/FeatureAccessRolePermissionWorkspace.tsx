/** @format */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Permission, PermissionCatalogItem, Role } from "@/types/api";
import { isRoleProtected, settingsHeaderClassName, settingsSurfaceClassName } from "../../lib/settings";

type FeatureAccessRolePermissionWorkspaceProps = {
  roles: Role[];
  selectedRoleId: string;
  selectedRole: Role | null;
  editRoleName: string;
  editRoleDescription: string;
  selectedPermissionAlias: string;
  permissions: Permission[];
  permissionCatalog: PermissionCatalogItem[];
  disabled: boolean;
  updatingRole: boolean;
  deletingRole: boolean;
  mutatingPermission: boolean;
  onSelectRole: (roleId: string) => void;
  onEditRoleName: (value: string) => void;
  onEditRoleDescription: (value: string) => void;
  onSaveRole: () => void;
  onDeleteRole: () => void;
  onSelectPermissionAlias: (alias: string) => void;
  onAddPermission: () => void;
  onRemovePermission: (alias: string) => void;
};

export function FeatureAccessRolePermissionWorkspace({
  roles,
  selectedRoleId,
  selectedRole,
  editRoleName,
  editRoleDescription,
  selectedPermissionAlias,
  permissions,
  permissionCatalog,
  disabled,
  updatingRole,
  deletingRole,
  mutatingPermission,
  onSelectRole,
  onEditRoleName,
  onEditRoleDescription,
  onSaveRole,
  onDeleteRole,
  onSelectPermissionAlias,
  onAddPermission,
  onRemovePermission,
}: FeatureAccessRolePermissionWorkspaceProps) {
  const protectedRole = isRoleProtected(selectedRole);
  const canMutateRole = !disabled && Boolean(selectedRole) && !protectedRole;

  return (
    <Card className={`${settingsSurfaceClassName} overflow-hidden`}>
      <div className={settingsHeaderClassName}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Workspace Role & Permission
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Definisikan secara granular akses tiap peran terhadap objek sistem.
        </p>
      </div>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="w-full border-r border-gray-200 md:w-1/3 dark:border-gray-800">
            <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/30">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Daftar Role</h3>
            </div>
            <ul className="max-h-[500px] divide-y divide-gray-200 overflow-y-auto dark:divide-gray-800">
              {roles.map((role) => {
                const active = String(role.id) === selectedRoleId;
                const protectedItem = isRoleProtected(role);

                return (
                  <li
                    key={role.id}
                    className={[
                      "cursor-pointer p-4 transition-colors",
                      active
                        ? "border-l-4 border-indigo-600 bg-indigo-600/5 dark:bg-indigo-600/10"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                    ].join(" ")}
                    onClick={() => onSelectRole(String(role.id))}
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <h4
                        className={[
                          "text-sm font-medium",
                          active ? "text-indigo-600 dark:text-indigo-400" : "text-gray-900 dark:text-white",
                        ].join(" ")}
                      >
                        {role.name}
                      </h4>
                      {protectedItem ? (
                        <Badge className="border-transparent bg-gray-100 text-[10px] uppercase tracking-wider text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                          Sistem Terproteksi
                        </Badge>
                      ) : null}
                    </div>
                    {active ? (
                      <div className="space-y-3">
                        <div>
                          <Label className="mb-1 block text-xs text-gray-500">Nama Role</Label>
                          <Input
                            value={editRoleName}
                            disabled={!canMutateRole}
                            className="h-8 border-gray-300 text-sm dark:border-gray-700"
                            onChange={(event) => onEditRoleName(event.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="mb-1 block text-xs text-gray-500">Deskripsi</Label>
                          <Input
                            value={editRoleDescription}
                            disabled={!canMutateRole}
                            className="h-8 border-gray-300 text-sm dark:border-gray-700"
                            onChange={(event) => onEditRoleDescription(event.target.value)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            className="bg-indigo-600 text-white hover:bg-indigo-500"
                            disabled={!canMutateRole || updatingRole}
                            onClick={onSaveRole}
                          >
                            Simpan Role
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            disabled={!canMutateRole || deletingRole}
                            onClick={onDeleteRole}
                          >
                            Hapus Role
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="truncate text-xs text-gray-500">{role.description || "-"}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex w-full flex-col md:w-2/3">
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/30">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {selectedRole
                  ? `Panel Permission Role: ${selectedRole.name}`
                  : "Panel Permission Role"}
              </h3>
            </div>

            <div className="max-h-[400px] flex-1 space-y-3 overflow-y-auto p-6">
              {permissions.map((permission) => (
                <div
                  key={permission.alias}
                  className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {permission.label}
                    </p>
                    <p className="mt-0.5 text-xs font-mono text-gray-500">{permission.alias}</p>
                    {permission.description ? (
                      <p className="mt-1 text-xs text-gray-500">{permission.description}</p>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-8 px-2 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                    disabled={!canMutateRole || mutatingPermission}
                    onClick={() => onRemovePermission(permission.alias)}
                  >
                    Hapus
                  </Button>
                </div>
              ))}

              {selectedRole && permissions.length === 0 ? (
                <p className="text-sm text-gray-500">Belum ada permission untuk role ini.</p>
              ) : null}

              {!selectedRole ? (
                <p className="text-sm text-gray-500">Pilih role untuk mengelola permission.</p>
              ) : null}
            </div>

            <div className="border-t border-gray-200 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-gray-800/10">
              <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                Tambah Izin Baru
              </h4>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex-1">
                  <Select
                    value={selectedPermissionAlias}
                    disabled={!canMutateRole}
                    onValueChange={onSelectPermissionAlias}
                  >
                    <SelectTrigger className="border-gray-300 dark:border-gray-700">
                      <SelectValue placeholder="Pilih alias permission" />
                    </SelectTrigger>
                    <SelectContent>
                      {permissionCatalog.map((item) => (
                        <SelectItem key={item.alias} value={item.alias}>
                          {item.label} ({item.alias})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="whitespace-nowrap border-gray-300 dark:border-gray-700"
                  disabled={!canMutateRole || !selectedPermissionAlias || mutatingPermission}
                  onClick={onAddPermission}
                >
                  Tambah Permission
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

