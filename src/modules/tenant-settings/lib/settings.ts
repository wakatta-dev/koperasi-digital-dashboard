/** @format */

import {
  Activity,
  Building2,
  type LucideIcon,
  Mail,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import type { Role, User } from "@/types/api";

const MANAGE_ROLES = new Set([
  "admin",
  "tenant admin",
  "super_admin",
  "support",
]);
const SETTINGS_TENANT_TYPE_FALLBACK = "bumdes";

export const settingsSurfaceClassName =
  "overflow-hidden p-0 rounded-[24px] border border-slate-200/80 bg-white/95 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.35)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/90";

export const settingsHeaderClassName =
  "border-b border-slate-200/80 bg-gradient-to-r from-slate-50 via-white to-slate-50/70 px-6 py-5 dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/80";

export const settingsCardContentClassName = "px-6 py-6";
export const settingsFieldClassName =
  "border-slate-300 bg-white/90 focus-visible:border-slate-900 focus-visible:ring-slate-900/15 dark:border-slate-700 dark:bg-slate-950/70 dark:focus-visible:border-slate-200 dark:focus-visible:ring-slate-200/15";
export const settingsReadOnlyFieldClassName =
  "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400";
export const settingsMutedTextClassName =
  "text-sm leading-6 text-slate-600 dark:text-slate-300";
export const settingsHelperTextClassName =
  "text-xs leading-5 text-slate-500 dark:text-slate-400";
export const settingsSectionTitleClassName =
  "text-lg font-semibold tracking-tight text-slate-950 dark:text-white";

export type TenantSettingsSectionId =
  | "profil-tenant"
  | "operasional-usaha"
  | "akses-otorisasi"
  | "komunikasi-email"
  | "activity-log";

export type TenantSettingsSectionMeta = {
  id: TenantSettingsSectionId;
  title: string;
  shortTitle: string;
  href: string;
  description: string;
  kicker: string;
  icon: LucideIcon;
};

export const tenantSettingsSections: TenantSettingsSectionMeta[] = [
  {
    id: "profil-tenant",
    title: "Profil Tenant",
    shortTitle: "Profil",
    href: "/bumdes/settings/profil-tenant",
    description:
      "Informasi usaha, identitas tenant, dan konfigurasi domain publik.",
    kicker: "Identitas",
    icon: Building2,
  },
  {
    id: "operasional-usaha",
    title: "Operasional Usaha",
    shortTitle: "Operasional",
    href: "/bumdes/settings/operasional-usaha",
    description:
      "Preferensi regional, aktivasi modul, readiness, dan kebijakan operasional.",
    kicker: "Operasional",
    icon: Settings2,
  },
  {
    id: "akses-otorisasi",
    title: "Akses & Otorisasi",
    shortTitle: "Akses",
    href: "/bumdes/settings/akses-otorisasi",
    description:
      "Manajemen user, role, permission, dan perlindungan akses sistem.",
    kicker: "Keamanan",
    icon: ShieldCheck,
  },
  {
    id: "komunikasi-email",
    title: "Komunikasi Email",
    shortTitle: "Email",
    href: "/bumdes/settings/komunikasi-email",
    description:
      "Template komunikasi, placeholder, dan pengujian pengiriman email.",
    kicker: "Komunikasi",
    icon: Mail,
  },
  {
    id: "activity-log",
    title: "Activity Log",
    shortTitle: "Log",
    href: "/bumdes/settings/activity-log",
    description:
      "Audit trail aktivitas tenant beserta filter dan histori tindakan.",
    kicker: "Audit",
    icon: Activity,
  },
];

export function getTenantSettingsSection(
  value: TenantSettingsSectionId | string,
): TenantSettingsSectionMeta {
  return (
    tenantSettingsSections.find((section) => section.id === value) ??
    tenantSettingsSections[0]
  );
}

export function getTenantSettingsSectionByPath(
  pathname: string,
): TenantSettingsSectionMeta {
  return (
    tenantSettingsSections.find(
      (section) =>
        pathname === section.href || pathname.startsWith(`${section.href}/`),
    ) ?? tenantSettingsSections[0]
  );
}

export function buildQueryString(
  current: { get(name: string): string | null; toString(): string },
  updates: Record<string, string | null | undefined>,
): string {
  const next = new URLSearchParams(current.toString());
  for (const [key, value] of Object.entries(updates)) {
    if (!value) {
      next.delete(key);
      continue;
    }
    next.set(key, value);
  }
  return next.toString();
}

export function formatSettingsDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function normalizeRoleName(role: unknown): string {
  return String(role ?? "")
    .trim()
    .toLowerCase();
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

export function getUserPrimaryRoleId(
  user: User | null | undefined,
): number | undefined {
  return (
    user?.role_id ?? user?.tenant_role?.role_id ?? user?.tenant_role?.role?.id
  );
}

export function isRoleProtected(role: Role | null | undefined): boolean {
  if (!role) {
    return false;
  }
  return (
    Boolean(role.is_protected) ||
    role.is_editable === false ||
    role.is_deletable === false
  );
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
