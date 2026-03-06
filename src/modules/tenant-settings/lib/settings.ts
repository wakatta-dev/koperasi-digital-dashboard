/** @format */

import type { Role, User } from "@/types/api";

const MANAGE_ROLES = new Set(["admin", "tenant admin", "super_admin", "support"]);
const SETTINGS_TENANT_TYPE_FALLBACK = "bumdes";

export const settingsSurfaceClassName =
  "rounded-lg border border-gray-200 bg-white shadow-elev-1 dark:border-gray-800 dark:bg-gray-900";

export const settingsHeaderClassName =
  "border-b border-gray-100 p-6 dark:border-gray-800";

export function normalizeRoleName(role: unknown): string {
  return String(role ?? "").trim().toLowerCase();
}

export function canManageTenantSettings(role: unknown): boolean {
  return MANAGE_ROLES.has(normalizeRoleName(role));
}

export function getSettingsTenantType(value: unknown): string {
  const normalized = normalizeRoleName(value);
  return normalized || SETTINGS_TENANT_TYPE_FALLBACK;
}

export function getUserPrimaryRoleName(user: User | null | undefined): string {
  return user?.role ?? user?.tenant_role?.role?.name ?? "-";
}

export function getUserPrimaryRoleId(user: User | null | undefined): number | undefined {
  return user?.role_id ?? user?.tenant_role?.role_id ?? user?.tenant_role?.role?.id;
}

export function isRoleProtected(role: Role | null | undefined): boolean {
  if (!role) {
    return false;
  }
  return Boolean(role.is_protected) || role.is_editable === false || role.is_deletable === false;
}

export function asInputString(value: string | null | undefined): string {
  return value ?? "";
}

export function formatRoleStatus(role: Role | null | undefined): string {
  if (!role) {
    return "Tidak Aktif";
  }
  return role.is_active === false ? "Tidak Aktif" : "Aktif";
}

