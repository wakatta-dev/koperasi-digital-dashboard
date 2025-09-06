/** @format */

import { listRoles, listRolePermissions } from "@/services/api";
import PengaturanClient from "./pengaturanClient";

export const dynamic = "force-dynamic";

export default async function PengaturanPage() {
  const rolesRes = await listRoles({ limit: 100 }).catch(() => null);
  const roles = rolesRes && rolesRes.success ? (rolesRes.data as any[]) : [];
  const firstRoleId = roles.length ? roles[0].id : null;
  const permsRes = firstRoleId
    ? await listRolePermissions(firstRoleId, { limit: 200 }).catch(() => null)
    : null;
  const permissions = permsRes && permsRes.success ? (permsRes.data as any[]) : [];
  return (
    <PengaturanClient initialRoles={roles} initialSelectedRoleId={firstRoleId ?? undefined} initialPermissions={permissions} />
  );
}
