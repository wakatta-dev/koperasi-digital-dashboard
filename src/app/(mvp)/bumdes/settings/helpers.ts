/** @format */

import type { SupportGlobalConfig, SupportTenantConfig } from "@/types/api";

const MANAGE_ROLES = new Set(["admin", "tenant admin", "super_admin", "support"]);
const SETTINGS_TENANT_TYPE_FALLBACK = "bumdes";

export const DEFAULT_SETTINGS_FEATURE_FLAGS = {
  asset_rental_enabled: false,
  marketplace_enabled: false,
  inventory_enabled: false,
  reports_enabled: false,
  pos_enabled: false,
} as const;

export const DEFAULT_SETTINGS_OPERATIONAL_CONFIGS = {
  asset_rental: {
    approval_required: true,
    default_slot_minutes: 60,
    min_dp_percent: 20,
    grace_period_hours: 2,
    late_fee_per_hour: 25000,
  },
  marketplace: {
    manual_payment_window_min: 0,
    auto_cancel_unpaid_hours: 0,
    low_stock_threshold: 0,
    allow_guest_checkout: false,
  },
  accounting: {
    invoice_prefix: "",
    fiscal_year_start_month: 0,
    default_payment_terms_days: 0,
    period_lock_after_days: 0,
  },
} as const;

export type EffectiveTenantConfig = {
  business_name: string;
  business_type: string;
  business_category: string;
  description: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  domain: string;
  custom_domain: string;
  logo_url: string;
  timezone: string;
  currency: string;
  locale: string;
  theme: string;
  feature_flags: {
    asset_rental_enabled: boolean;
    marketplace_enabled: boolean;
    inventory_enabled: boolean;
    reports_enabled: boolean;
    pos_enabled: boolean;
  };
  configs: {
    asset_rental: {
      approval_required: boolean;
      default_slot_minutes: number;
      min_dp_percent: number;
      grace_period_hours: number;
      late_fee_per_hour: number;
    };
    marketplace: {
      manual_payment_window_min: number;
      auto_cancel_unpaid_hours: number;
      low_stock_threshold: number;
      allow_guest_checkout: boolean;
    };
    accounting: {
      invoice_prefix: string;
      fiscal_year_start_month: number;
      default_payment_terms_days: number;
      period_lock_after_days: number;
    };
  };
};

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

export function getSettingsTenantType(role: unknown): string {
  const normalized = normalizeRoleName(role);
  return normalized || SETTINGS_TENANT_TYPE_FALLBACK;
}

export function getUserPrimaryRoleName(
  user: { role?: string; tenant_role?: { role?: { name?: string } } } | null | undefined
): string {
  return user?.role ?? user?.tenant_role?.role?.name ?? "-";
}

export function getUserPrimaryRoleId(
  user:
    | {
        role_id?: number;
        tenant_role?: { role_id?: number; role?: { id?: number } };
      }
    | null
    | undefined
): number | undefined {
  return user?.role_id ?? user?.tenant_role?.role_id ?? user?.tenant_role?.role?.id;
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return value as Record<string, unknown>;
}

function toStringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function toNumberValue(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function toBooleanValue(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export function buildEffectiveTenantConfig(
  tenant?: SupportTenantConfig | null,
  global?: SupportGlobalConfig | null
): EffectiveTenantConfig {
  const tenantConfigs = asRecord(tenant?.configs);
  const assetRental = asRecord(tenantConfigs.asset_rental);
  const marketplace = asRecord(tenantConfigs.marketplace);
  const accounting = asRecord(tenantConfigs.accounting);
  const globalFeatureFlags = global?.feature_flags_default ?? {};

  return {
    business_name: tenant?.business_name ?? "",
    business_type: tenant?.business_type ?? "",
    business_category: tenant?.business_category ?? "",
    description: tenant?.description ?? "",
    contact_email: tenant?.contact_email ?? "",
    contact_phone: tenant?.contact_phone ?? "",
    address: tenant?.address ?? "",
    domain: tenant?.domain ?? "",
    custom_domain: tenant?.custom_domain ?? "",
    logo_url: tenant?.logo_url ?? "",
    timezone: tenant?.timezone || global?.timezone_default || "",
    currency: tenant?.currency || global?.currency_default || "",
    locale: tenant?.locale || global?.locale_default || "",
    theme: tenant?.theme || "",
    feature_flags: {
      asset_rental_enabled:
        tenant?.feature_flags?.asset_rental_enabled ??
        toBooleanValue(
          globalFeatureFlags.asset_rental_enabled,
          DEFAULT_SETTINGS_FEATURE_FLAGS.asset_rental_enabled
        ),
      marketplace_enabled:
        tenant?.feature_flags?.marketplace_enabled ??
        toBooleanValue(
          globalFeatureFlags.marketplace_enabled,
          DEFAULT_SETTINGS_FEATURE_FLAGS.marketplace_enabled
        ),
      inventory_enabled:
        tenant?.feature_flags?.inventory_enabled ??
        toBooleanValue(
          globalFeatureFlags.inventory_enabled,
          DEFAULT_SETTINGS_FEATURE_FLAGS.inventory_enabled
        ),
      reports_enabled:
        tenant?.feature_flags?.reports_enabled ??
        toBooleanValue(
          globalFeatureFlags.reports_enabled,
          DEFAULT_SETTINGS_FEATURE_FLAGS.reports_enabled
        ),
      pos_enabled:
        tenant?.feature_flags?.pos_enabled ??
        toBooleanValue(
          globalFeatureFlags.pos_enabled,
          DEFAULT_SETTINGS_FEATURE_FLAGS.pos_enabled
        ),
    },
    configs: {
      asset_rental: {
        approval_required: toBooleanValue(
          assetRental.approval_required,
          DEFAULT_SETTINGS_OPERATIONAL_CONFIGS.asset_rental.approval_required
        ),
        default_slot_minutes: toNumberValue(
          assetRental.default_slot_minutes,
          DEFAULT_SETTINGS_OPERATIONAL_CONFIGS.asset_rental.default_slot_minutes
        ),
        min_dp_percent: toNumberValue(
          assetRental.min_dp_percent,
          DEFAULT_SETTINGS_OPERATIONAL_CONFIGS.asset_rental.min_dp_percent
        ),
        grace_period_hours: toNumberValue(
          assetRental.grace_period_hours,
          DEFAULT_SETTINGS_OPERATIONAL_CONFIGS.asset_rental.grace_period_hours
        ),
        late_fee_per_hour: toNumberValue(
          assetRental.late_fee_per_hour,
          DEFAULT_SETTINGS_OPERATIONAL_CONFIGS.asset_rental.late_fee_per_hour
        ),
      },
      marketplace: {
        manual_payment_window_min: toNumberValue(
          marketplace.manual_payment_window_min,
          DEFAULT_SETTINGS_OPERATIONAL_CONFIGS.marketplace.manual_payment_window_min
        ),
        auto_cancel_unpaid_hours: toNumberValue(
          marketplace.auto_cancel_unpaid_hours,
          DEFAULT_SETTINGS_OPERATIONAL_CONFIGS.marketplace.auto_cancel_unpaid_hours
        ),
        low_stock_threshold: toNumberValue(
          marketplace.low_stock_threshold,
          DEFAULT_SETTINGS_OPERATIONAL_CONFIGS.marketplace.low_stock_threshold
        ),
        allow_guest_checkout: toBooleanValue(
          marketplace.allow_guest_checkout,
          DEFAULT_SETTINGS_OPERATIONAL_CONFIGS.marketplace.allow_guest_checkout
        ),
      },
      accounting: {
        invoice_prefix: toStringValue(accounting.invoice_prefix)
          || DEFAULT_SETTINGS_OPERATIONAL_CONFIGS.accounting.invoice_prefix,
        fiscal_year_start_month: toNumberValue(
          accounting.fiscal_year_start_month,
          DEFAULT_SETTINGS_OPERATIONAL_CONFIGS.accounting.fiscal_year_start_month
        ),
        default_payment_terms_days: toNumberValue(
          accounting.default_payment_terms_days,
          DEFAULT_SETTINGS_OPERATIONAL_CONFIGS.accounting.default_payment_terms_days
        ),
        period_lock_after_days: toNumberValue(
          accounting.period_lock_after_days,
          DEFAULT_SETTINGS_OPERATIONAL_CONFIGS.accounting.period_lock_after_days
        ),
      },
    },
  };
}

export function areTenantConfigsEqual(
  left: Pick<
    EffectiveTenantConfig,
    | "business_name"
    | "business_type"
    | "business_category"
    | "description"
    | "contact_email"
    | "contact_phone"
    | "address"
    | "domain"
    | "custom_domain"
    | "logo_url"
    | "timezone"
    | "currency"
    | "locale"
    | "theme"
    | "feature_flags"
    | "configs"
  >,
  right: Pick<
    EffectiveTenantConfig,
    | "business_name"
    | "business_type"
    | "business_category"
    | "description"
    | "contact_email"
    | "contact_phone"
    | "address"
    | "domain"
    | "custom_domain"
    | "logo_url"
    | "timezone"
    | "currency"
    | "locale"
    | "theme"
    | "feature_flags"
    | "configs"
  >
): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}
