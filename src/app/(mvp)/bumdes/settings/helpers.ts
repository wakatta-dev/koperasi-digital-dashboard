/** @format */

const MANAGE_ROLES = new Set(["admin", "tenant admin", "super_admin", "support"]);

export function normalizeRoleName(role: unknown): string {
  return String(role ?? "").trim().toLowerCase();
}

export function canManageSettings(role: unknown): boolean {
  const normalized = normalizeRoleName(role);
  return MANAGE_ROLES.has(normalized);
}

export function isProtectedSystemRole(role: string): boolean {
  const normalized = normalizeRoleName(role);
  return new Set([
    "super_admin",
    "admin",
    "support",
    "finance",
    "sales",
    "viewer",
    "operator",
    "tenant admin",
  ]).has(normalized);
}
