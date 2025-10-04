/** @format */

import { listRoles, listRolePermissions } from "@/services/api";
import PengaturanClient from "./pengaturanClient";
import type {
  ListRolesResponse,
  ListPermissionsResponse,
  Permission,
  Role,
} from "@/types/api";

export const dynamic = "force-dynamic";

export default async function PengaturanPage() {
  const rolesRes: ListRolesResponse | null = await listRoles({
    limit: 100,
  }).catch(() => null);

  const roles: Role[] = Array.isArray(rolesRes?.data) && rolesRes?.success
    ? (rolesRes.data as Role[])
    : [];
  const firstRoleId = roles.at(0)?.id;

  let permissions: Permission[] = [];
  if (firstRoleId) {
    const permsRes: ListPermissionsResponse | null = await listRolePermissions(
      firstRoleId,
      { limit: 200 }
    ).catch(() => null);
    permissions = Array.isArray(permsRes?.data) && permsRes?.success
      ? (permsRes.data as Permission[])
      : [];
  }

  const errorMessage = rolesRes && !rolesRes.success ? rolesRes.message : null;

  return (
    <PengaturanClient
      initialRoles={roles}
      initialSelectedRoleId={firstRoleId}
      initialPermissions={permissions}
      initialError={errorMessage ?? undefined}
    />
  );
}
