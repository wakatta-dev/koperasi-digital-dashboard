/** @format */

"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConfirmDialog from "@/components/shared/confirm-dialog";
import type { Permission, PermissionCatalogItem, Role } from "@/types/api";
import {
  isRoleProtected,
  settingsFieldClassName,
  settingsHeaderClassName,
  settingsMutedTextClassName,
  settingsSectionTitleClassName,
  settingsSurfaceClassName,
} from "../../lib/settings";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const protectedRole = isRoleProtected(selectedRole);
  const canMutateRole = !disabled && Boolean(selectedRole) && !protectedRole;

  return (
    <>
      <Card className={`${settingsSurfaceClassName} gap-0`}>
        <div className={settingsHeaderClassName}>
          <div className="space-y-1">
            <h2 className={settingsSectionTitleClassName}>
              Workspace Role &amp; Permission
            </h2>
            <p className={settingsMutedTextClassName}>
              Kelola detail role kustom dan akses granularnya dari satu
              workspace yang konsisten.
            </p>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="grid gap-0 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="border-b border-slate-200 bg-slate-50/70 lg:flex lg:flex-col lg:border-b-0 lg:border-r lg:border-slate-200 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                <h3 className="text-sm font-semibold tracking-tight text-slate-950 dark:text-white">
                  Daftar Role
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Pilih role untuk meninjau profil akses dan permission aktif.
                </p>
              </div>

              <ul className="max-h-[420px] space-y-2 overflow-y-auto p-3 lg:min-h-0 lg:max-h-none lg:flex-1">
                {roles.map((role) => {
                  const active = String(role.id) === selectedRoleId;
                  const protectedItem = isRoleProtected(role);

                  return (
                    <li key={role.id}>
                      <button
                        type="button"
                        aria-pressed={active}
                        className={[
                          "flex w-full items-start gap-3 rounded-2xl border px-4 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15",
                          active
                            ? "border-slate-950 bg-slate-950 text-white dark:border-white dark:bg-white dark:text-slate-950"
                            : "border-slate-200 bg-white hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900",
                        ].join(" ")}
                        onClick={() => onSelectRole(String(role.id))}
                      >
                        <span
                          className={[
                            "mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border text-xs font-semibold uppercase tracking-[0.18em]",
                            active
                              ? "border-white/15 bg-white/10 text-white dark:border-slate-300 dark:bg-slate-100 dark:text-slate-950"
                              : "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
                          ].join(" ")}
                        >
                          {role.name.slice(0, 2)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="truncate text-sm font-semibold tracking-tight">
                              {role.name}
                            </span>
                            {protectedItem ? (
                              <Badge className="border-transparent bg-slate-100 text-[10px] uppercase tracking-wider text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                                Sistem Terproteksi
                              </Badge>
                            ) : null}
                          </span>
                          <span
                            className={[
                              "mt-1 block line-clamp-2 text-xs leading-5",
                              active
                                ? "text-white/75 dark:text-slate-600"
                                : "text-slate-500 dark:text-slate-400",
                            ].join(" ")}
                          >
                            {role.description || "Belum ada deskripsi role."}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>

            <section className="flex min-w-0 flex-col">
              <div className="border-b border-slate-200 bg-white/80 px-6 py-5 dark:border-slate-800 dark:bg-slate-950/80">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold tracking-tight text-slate-950 dark:text-white">
                      {selectedRole
                        ? selectedRole.name
                        : "Pilih role terlebih dahulu"}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {selectedRole
                        ? protectedRole
                          ? "Role ini dilindungi sistem. Anda tetap dapat meninjau permission aktif, tetapi tidak bisa mengubah profil role atau menghapusnya."
                          : "Edit identitas role dan sesuaikan permission yang relevan untuk tim Anda."
                        : "Pilih salah satu role pada panel kiri untuk mulai mengelola detail akses."}
                    </p>
                  </div>

                  {selectedRole ? (
                    <div className="flex flex-wrap gap-2">
                      <Badge className="border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                        {permissions.length} Permission
                      </Badge>
                      <Badge className="border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                        {protectedRole ? "Protected" : "Editable"}
                      </Badge>
                    </div>
                  ) : null}
                </div>
              </div>

              {!selectedRole ? (
                <div className="flex min-h-[360px] items-center justify-center px-6 py-16">
                  <div className="max-w-md text-center">
                    <p className="text-base font-semibold tracking-tight text-slate-950 dark:text-white">
                      Belum ada role yang dipilih
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      Pilih role dari panel kiri untuk meninjau permission,
                      mengubah nama role, atau menambahkan akses baru.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid min-w-0 gap-6 p-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                  <section className="flex min-w-0 self-start flex-col space-y-4 rounded-[22px] border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/60">
                    <div>
                      <h4 className="text-sm font-semibold tracking-tight text-slate-950 dark:text-white">
                        Profil Role
                      </h4>
                      <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                        Perbarui nama dan deskripsi role agar mudah dipahami
                        oleh admin lain.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-role-name">Nama Role</Label>
                      <Input
                        id="edit-role-name"
                        name="edit_role_name"
                        autoComplete="off"
                        value={editRoleName}
                        disabled={!canMutateRole}
                        className={settingsFieldClassName}
                        onChange={(event) => onEditRoleName(event.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-role-description">Deskripsi</Label>
                      <Input
                        id="edit-role-description"
                        name="edit_role_description"
                        autoComplete="off"
                        value={editRoleDescription}
                        disabled={!canMutateRole}
                        className={settingsFieldClassName}
                        onChange={(event) =>
                          onEditRoleDescription(event.target.value)
                        }
                      />
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        type="button"
                        className="bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                        disabled={!canMutateRole || updatingRole}
                        onClick={onSaveRole}
                      >
                        {updatingRole ? "Menyimpan…" : "Simpan Role"}
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        disabled={!canMutateRole || deletingRole}
                        onClick={() => setDeleteDialogOpen(true)}
                      >
                        {deletingRole ? "Menghapus…" : "Hapus Role"}
                      </Button>
                    </div>
                  </section>

                  <section className="bg-white flex h-[32rem] min-w-0 flex-col space-y-3 overflow-hidden rounded-[22px] border border-slate-200 px-3 py-5 dark:border-slate-800 md:h-[36rem] xl:h-[42rem]">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold tracking-tight text-slate-950 dark:text-white">
                          Permission Aktif
                        </h4>
                        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                          Tinjau izin yang saat ini dimiliki role ini dan
                          tambahkan yang masih diperlukan.
                        </p>
                      </div>
                    </div>

                    <div className="min-h-0 min-w-0 flex-1 space-y-3 overflow-y-auto pr-1 overscroll-contain">
                      {permissions.map((permission, index) => (
                        <div
                          key={`${permission.alias}-${index}`}
                          className="flex min-w-0 flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:flex-row sm:items-start sm:justify-between dark:border-slate-800 dark:bg-slate-900/60"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-950 dark:text-white">
                              {permission.label}
                            </p>
                            <p className="mt-1 truncate font-mono text-xs text-slate-500 dark:text-slate-400">
                              {permission.alias}
                            </p>
                            {permission.description ? (
                              <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                {permission.description}
                              </p>
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

                      {permissions.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center dark:border-slate-700">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            Belum ada permission aktif
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Tambahkan permission agar role ini dapat menjalankan
                            proses yang dibutuhkan.
                          </p>
                        </div>
                      ) : null}
                    </div>

                    <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                      <h5 className="text-sm font-semibold tracking-tight text-slate-950 dark:text-white">
                        Tambah Permission Baru
                      </h5>
                      <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                        Pilih permission yang belum dimiliki role ini untuk
                        memperluas cakupan akses.
                      </p>
                      <div className="mt-4 flex min-w-0 flex-col gap-3 sm:flex-row">
                        <div className="min-w-0 flex-1">
                          <Select
                            value={selectedPermissionAlias}
                            disabled={!canMutateRole}
                            onValueChange={onSelectPermissionAlias}
                          >
                            <SelectTrigger className="border-slate-300 dark:border-slate-700 max-w-64">
                              <SelectValue placeholder="Pilih alias permission" />
                            </SelectTrigger>
                            <SelectContent>
                              {permissionCatalog.map((item, index) => (
                                <SelectItem
                                  key={`${item.alias}-${index}`}
                                  value={item.alias}
                                >
                                  {item.label} ({item.alias})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="whitespace-nowrap border-slate-300 dark:border-slate-700"
                          disabled={
                            !canMutateRole ||
                            !selectedPermissionAlias ||
                            mutatingPermission
                          }
                          onClick={onAddPermission}
                        >
                          {mutatingPermission ? "Memproses…" : "Tambah"}
                        </Button>
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </section>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        variant="delete"
        title={`Hapus role ${selectedRole?.name ?? ""}?`}
        description="Role kustom ini akan dihapus permanen. Pastikan tidak ada workflow penting yang masih bergantung padanya."
        confirmText="Hapus Role"
        onConfirm={onDeleteRole}
      />
    </>
  );
}
