/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
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
import { SettingsSectionHeading } from "../shared/SettingsSectionHeading";
import {
  canManageTenantSettings,
  getSettingsTenantType,
  isRoleProtected,
} from "../../lib/settings";

export function AccessAuthorizationSettingsPage() {
  const { data: session } = useSession();
  const canManage = canManageTenantSettings((session?.user as { role?: string } | undefined)?.role);
  const tenantType = getSettingsTenantType(
    (session?.user as { jenis_tenant?: string } | undefined)?.jenis_tenant
  );

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

  useEffect(() => {
    if (!roles.length) {
      setSelectedRoleId("");
      return;
    }
    if (!selectedRoleId || !roles.some((role) => String(role.id) === selectedRoleId)) {
      const firstEditable = roles.find((role) => !isRoleProtected(role)) ?? roles[0];
      setSelectedRoleId(String(firstEditable.id));
    }
  }, [roles, selectedRoleId]);

  useEffect(() => {
    if (!selectedRole) {
      setEditRoleName("");
      setEditRoleDescription("");
      return;
    }
    setEditRoleName(selectedRole.name);
    setEditRoleDescription(selectedRole.description ?? "");
  }, [selectedRole]);

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
    <div className="max-w-6xl space-y-8">
      <SettingsSectionHeading
        title="Akses & Otorisasi"
        description="Manajemen pengguna, peran sistem, dan izin akses untuk kontrol keamanan tingkat lanjut."
      />

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
        onSelectRole={setSelectedRoleId}
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
    </div>
  );
}
