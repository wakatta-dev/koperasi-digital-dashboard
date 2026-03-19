/** @format */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  usePermissionCatalog,
  useRoleActions,
  useRolePermissions,
  useRoles,
  useUserActions,
  useUsers,
} from "@/hooks/queries";
import { FeatureAccessCreateRoleCard } from "../features/FeatureAccessCreateRoleCard";
import { FeatureAccessRolePermissionWorkspace } from "../features/FeatureAccessRolePermissionWorkspace";
import { FeatureAccessUserManagementCard } from "../features/FeatureAccessUserManagementCard";
import { SettingsErrorBanner } from "../shared/SettingsErrorBanner";
import { SettingsReadOnlyAlert } from "../shared/SettingsReadOnlyAlert";
import { TenantSettingsShell } from "../shared/TenantSettingsShell";
import {
  buildQueryString,
  canManageTenantSettings,
  getSettingsTenantType,
  isRoleProtected,
} from "../../lib/settings";

type AccessAuthorizationSettingsPageProps = {
  queryString?: string;
};

export function AccessAuthorizationSettingsPage({
  queryString = "",
}: AccessAuthorizationSettingsPageProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useMemo(
    () => new URLSearchParams(queryString),
    [queryString],
  );
  const { data: session } = useSession();
  const canManage = canManageTenantSettings((session?.user as { role?: string } | undefined)?.role);
  const tenantType = getSettingsTenantType(
    (session?.user as { jenis_tenant?: string } | undefined)?.jenis_tenant
  );
  const requestedRoleId = searchParams.get("role") ?? "";

  const [search, setSearch] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [editRoleName, setEditRoleName] = useState("");
  const [editRoleDescription, setEditRoleDescription] = useState("");
  const [assignRoleByUser, setAssignRoleByUser] = useState<Record<number, string>>({});
  const [selectedPermissionAlias, setSelectedPermissionAlias] = useState("");

  const usersQuery = useUsers({ term: search || undefined, limit: 100 });
  const rolesQuery = useRoles({ limit: 100 });
  const permissionCatalogQuery = usePermissionCatalog();
  const userActions = useUserActions();
  const roleActions = useRoleActions();

  const roles = useMemo(() => rolesQuery.data ?? [], [rolesQuery.data]);
  const users = useMemo(() => usersQuery.data ?? [], [usersQuery.data]);
  const selectedRole = useMemo(
    () => roles.find((role) => String(role.id) === selectedRoleId) ?? null,
    [roles, selectedRoleId]
  );
  const rolePermissionsQuery = useRolePermissions(selectedRoleId || undefined, { limit: 200 });
  const permissions = useMemo(() => rolePermissionsQuery.data ?? [], [rolePermissionsQuery.data]);

  const syncRoleQuery = useCallback(
    (roleId: string) => {
      const nextQuery = buildQueryString(searchParams, { role: roleId });
      if (nextQuery === searchParams.toString()) {
        return;
      }
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const handleSelectRole = useCallback(
    (roleId: string) => {
      setSelectedRoleId(roleId);
      syncRoleQuery(roleId);
    },
    [syncRoleQuery]
  );

  useEffect(() => {
    let nextRoleId = selectedRoleId;
    if (!roles.length) {
      nextRoleId = "";
    } else if (
      requestedRoleId &&
      roles.some((role) => String(role.id) === requestedRoleId)
    ) {
      nextRoleId = requestedRoleId;
    } else if (
      !selectedRoleId ||
      !roles.some((role) => String(role.id) === selectedRoleId)
    ) {
      const firstEditable =
        roles.find((role) => !isRoleProtected(role)) ?? roles[0];
      nextRoleId = String(firstEditable.id);
    }

    if (nextRoleId === selectedRoleId) {
      return;
    }

    setSelectedRoleId(nextRoleId);
    if (nextRoleId) {
      syncRoleQuery(nextRoleId);
    }
  }, [requestedRoleId, roles, selectedRoleId, syncRoleQuery]);

  const syncSelectedRoleDraft = useCallback((role: typeof selectedRole) => {
    if (!role) {
      setEditRoleName("");
      setEditRoleDescription("");
      return;
    }
    setEditRoleName(role.name);
    setEditRoleDescription(role.description ?? "");
  }, []);

  useEffect(() => {
    syncSelectedRoleDraft(selectedRole);
  }, [selectedRole, syncSelectedRoleDraft]);

  const assignedAliases = useMemo(
    () => new Set(permissions.map((permission) => permission.alias)),
    [permissions]
  );
  const availablePermissionCatalog = useMemo(
    () =>
      (permissionCatalogQuery.data ?? []).filter((item) => !assignedAliases.has(item.alias)),
    [assignedAliases, permissionCatalogQuery.data]
  );

  useEffect(() => {
    if (!availablePermissionCatalog.length) {
      setSelectedPermissionAlias("");
      return;
    }
    if (!selectedPermissionAlias || !availablePermissionCatalog.some((item) => item.alias === selectedPermissionAlias)) {
      setSelectedPermissionAlias(availablePermissionCatalog[0].alias);
    }
  }, [availablePermissionCatalog, selectedPermissionAlias]);

  return (
    <TenantSettingsShell
      sectionId="akses-otorisasi"
      title="Akses & Otorisasi"
      description="Kelola user, role, dan permission tenant dengan workspace yang lebih fokus dan mudah ditinjau ulang."
      summaryTitle="Ringkasan Akses"
      summaryDescription="Snapshot cepat jumlah user, role, dan konteks role yang sedang Anda kelola."
      summaryItems={[
        {
          label: "User Tercatat",
          value: `${users.length} User`,
          helper: search ? `Hasil pencarian untuk “${search}”` : "Menampilkan daftar user tenant",
        },
        {
          label: "Role Tersedia",
          value: `${roles.length} Role`,
          helper: selectedRole ? `Role aktif: ${selectedRole.name}` : "Belum ada role dipilih",
        },
        {
          label: "Mode Akses",
          value: canManage ? "Editable" : "Read-Only",
          helper: canManage ? "Anda dapat mengubah role dan permission" : "Role Anda hanya dapat meninjau konfigurasi",
        },
      ]}
    >
      <SettingsReadOnlyAlert message="Beberapa pengaturan peran sistem (Super Admin) dilindungi dan tidak dapat dimodifikasi tanpa eskalasi hak istimewa." />

      {usersQuery.error ? <SettingsErrorBanner message={(usersQuery.error as Error).message} /> : null}
      {rolesQuery.error ? <SettingsErrorBanner message={(rolesQuery.error as Error).message} /> : null}
      {permissionCatalogQuery.error ? (
        <SettingsErrorBanner message={(permissionCatalogQuery.error as Error).message} />
      ) : null}
      {rolePermissionsQuery.error ? (
        <SettingsErrorBanner message={(rolePermissionsQuery.error as Error).message} />
      ) : null}

      <FeatureAccessUserManagementCard
        users={users}
        roles={roles}
        search={search}
        disabled={!canManage}
        savingRole={userActions.setPrimaryRole.isPending}
        savingStatus={userActions.patchStatus.isPending}
        roleByUser={assignRoleByUser}
        onSearchChange={setSearch}
        onRoleChange={(userId, roleId) =>
          setAssignRoleByUser((prev) => ({ ...prev, [userId]: roleId }))
        }
        onSaveRole={(userId, roleId) => userActions.setPrimaryRole.mutate({ userId, roleId })}
        onToggleStatus={(userId, nextStatus) =>
          userActions.patchStatus.mutate({ id: userId, status: nextStatus })
        }
      />

      <FeatureAccessCreateRoleCard
        name={newRoleName}
        description={newRoleDescription}
        disabled={!canManage}
        saving={roleActions.create.isPending}
        onNameChange={setNewRoleName}
        onDescriptionChange={setNewRoleDescription}
        onCreate={() => {
          roleActions.create.mutate({
            name: newRoleName.trim(),
            description: newRoleDescription.trim(),
            display_name: newRoleName.trim(),
            tenant_type: tenantType,
            is_custom: true,
          });
          setNewRoleName("");
          setNewRoleDescription("");
        }}
      />

      <FeatureAccessRolePermissionWorkspace
        roles={roles}
        selectedRoleId={selectedRoleId}
        selectedRole={selectedRole}
        editRoleName={editRoleName}
        editRoleDescription={editRoleDescription}
        selectedPermissionAlias={selectedPermissionAlias}
        permissions={permissions}
        permissionCatalog={availablePermissionCatalog}
        disabled={!canManage}
        updatingRole={roleActions.update.isPending}
        deletingRole={roleActions.remove.isPending}
        mutatingPermission={
          roleActions.addPermission.isPending || roleActions.removePermission.isPending
        }
        onSelectRole={handleSelectRole}
        onEditRoleName={setEditRoleName}
        onEditRoleDescription={setEditRoleDescription}
        onSaveRole={() =>
          selectedRole &&
          roleActions.update.mutate({
            id: selectedRole.id,
            payload: {
              name: editRoleName.trim(),
              description: editRoleDescription.trim(),
              display_name: editRoleName.trim(),
              tenant_type: selectedRole.jenis_tenant,
            },
          })
        }
        onDeleteRole={() => selectedRole && roleActions.remove.mutate(selectedRole.id)}
        onSelectPermissionAlias={setSelectedPermissionAlias}
        onAddPermission={() =>
          selectedRole &&
          selectedPermissionAlias &&
          roleActions.addPermission.mutate({
            id: selectedRole.id,
            alias: selectedPermissionAlias,
          })
        }
        onRemovePermission={(alias) =>
          selectedRole &&
          roleActions.removePermission.mutate({
            roleId: selectedRole.id,
            alias,
          })
        }
      />
    </TenantSettingsShell>
  );
}
