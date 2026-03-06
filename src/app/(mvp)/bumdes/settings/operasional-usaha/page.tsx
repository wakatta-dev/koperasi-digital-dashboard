/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSupportGlobalConfig, useSupportTenantConfig, useSupportTenantConfigActions } from "@/hooks/queries";
import {
  areTenantConfigsEqual,
  buildEffectiveTenantConfig,
  canManageSettings,
  DEFAULT_SETTINGS_OPERATIONAL_CONFIGS,
  DEFAULT_SETTINGS_FEATURE_FLAGS,
} from "../helpers";

type OperasionalFormState = {
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

const DEFAULT_FORM: OperasionalFormState = {
  timezone: "Asia/Jakarta",
  currency: "IDR",
  locale: "id-ID",
  theme: "default",
  feature_flags: { ...DEFAULT_SETTINGS_FEATURE_FLAGS },
  configs: {
    asset_rental: { ...DEFAULT_SETTINGS_OPERATIONAL_CONFIGS.asset_rental },
    marketplace: { ...DEFAULT_SETTINGS_OPERATIONAL_CONFIGS.marketplace },
    accounting: { ...DEFAULT_SETTINGS_OPERATIONAL_CONFIGS.accounting },
  },
};

function toPositiveNumber(value: string, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return parsed;
}

export default function SettingsOperasionalUsahaPage() {
  const { data: session } = useSession();
  const canManage = canManageSettings((session?.user as any)?.role);
  const globalQuery = useSupportGlobalConfig();
  const tenantQuery = useSupportTenantConfig();
  const { saveTenantConfig } = useSupportTenantConfigActions();
  const [form, setForm] = useState<OperasionalFormState>(DEFAULT_FORM);
  const effectiveConfig = useMemo(
    () => buildEffectiveTenantConfig(tenantQuery.data, globalQuery.data),
    [globalQuery.data, tenantQuery.data]
  );

  useEffect(() => {
    if (!tenantQuery.data) return;
    setForm({
      timezone: effectiveConfig.timezone,
      currency: effectiveConfig.currency,
      locale: effectiveConfig.locale,
      theme: effectiveConfig.theme,
      feature_flags: { ...effectiveConfig.feature_flags },
      configs: {
        asset_rental: { ...effectiveConfig.configs.asset_rental },
        marketplace: { ...effectiveConfig.configs.marketplace },
        accounting: { ...effectiveConfig.configs.accounting },
      },
    });
  }, [effectiveConfig, tenantQuery.data]);

  const isBusy = saveTenantConfig.isPending || tenantQuery.isLoading;
  const isDirty = useMemo(() => {
    if (!tenantQuery.data) return false;
    return !areTenantConfigsEqual(
      effectiveConfig,
      {
        ...effectiveConfig,
        timezone: form.timezone,
        currency: form.currency,
        locale: form.locale,
        theme: form.theme,
        feature_flags: form.feature_flags,
        configs: form.configs,
      }
    );
  }, [effectiveConfig, form, tenantQuery.data]);

  const onSave = async () => {
    await saveTenantConfig.mutateAsync({
      timezone: form.timezone,
      currency: form.currency,
      locale: form.locale,
      theme: form.theme,
      feature_flags: form.feature_flags,
      configs: form.configs,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Operasional Usaha</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Atur preferensi tenant, aktivasi modul, dan kebijakan operasional per unit usaha.
        </p>
      </div>

      {!canManage ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertCircle className="mr-2 inline h-4 w-4" />
          Mode baca saja: hanya admin tenant yang dapat mengubah pengaturan operasional.
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Preferensi Tenant</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input
              id="timezone"
              value={form.timezone}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, timezone: event.target.value }))
              }
              disabled={!canManage || isBusy}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              value={form.currency}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, currency: event.target.value.toUpperCase() }))
              }
              disabled={!canManage || isBusy}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="locale">Locale</Label>
            <Input
              id="locale"
              value={form.locale}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, locale: event.target.value }))
              }
              disabled={!canManage || isBusy}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Input
              id="theme"
              value={form.theme}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, theme: event.target.value }))
              }
              disabled={!canManage || isBusy}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aktivasi Modul</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {[
            { key: "asset_rental_enabled", label: "Asset & Rental" },
            { key: "marketplace_enabled", label: "Marketplace" },
            { key: "inventory_enabled", label: "Inventory" },
            { key: "reports_enabled", label: "Reporting" },
            { key: "pos_enabled", label: "POS" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between rounded-md border p-3">
              <span className="text-sm font-medium">{item.label}</span>
              <Switch
                checked={Boolean(form.feature_flags[item.key as keyof typeof form.feature_flags])}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({
                    ...prev,
                    feature_flags: {
                      ...prev.feature_flags,
                      [item.key]: checked,
                    },
                  }))
                }
                disabled={!canManage || isBusy}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kebijakan Asset Rental</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center justify-between rounded-md border p-3 md:col-span-2">
            <span className="text-sm font-medium">Persetujuan wajib sebelum sewa aktif</span>
            <Switch
              checked={form.configs.asset_rental.approval_required}
              onCheckedChange={(checked) =>
                setForm((prev) => ({
                  ...prev,
                  configs: {
                    ...prev.configs,
                    asset_rental: { ...prev.configs.asset_rental, approval_required: checked },
                  },
                }))
              }
              disabled={!canManage || isBusy}
            />
          </div>
          <div className="space-y-2">
            <Label>Durasi slot default (menit)</Label>
            <Input
              value={String(form.configs.asset_rental.default_slot_minutes)}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  configs: {
                    ...prev.configs,
                    asset_rental: {
                      ...prev.configs.asset_rental,
                      default_slot_minutes: toPositiveNumber(
                        event.target.value,
                        prev.configs.asset_rental.default_slot_minutes
                      ),
                    },
                  },
                }))
              }
              disabled={!canManage || isBusy}
            />
          </div>
          <div className="space-y-2">
            <Label>Minimal DP (%)</Label>
            <Input
              value={String(form.configs.asset_rental.min_dp_percent)}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  configs: {
                    ...prev.configs,
                    asset_rental: {
                      ...prev.configs.asset_rental,
                      min_dp_percent: toPositiveNumber(
                        event.target.value,
                        prev.configs.asset_rental.min_dp_percent
                      ),
                    },
                  },
                }))
              }
              disabled={!canManage || isBusy}
            />
          </div>
          <div className="space-y-2">
            <Label>Grace period keterlambatan (jam)</Label>
            <Input
              value={String(form.configs.asset_rental.grace_period_hours)}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  configs: {
                    ...prev.configs,
                    asset_rental: {
                      ...prev.configs.asset_rental,
                      grace_period_hours: toPositiveNumber(
                        event.target.value,
                        prev.configs.asset_rental.grace_period_hours
                      ),
                    },
                  },
                }))
              }
              disabled={!canManage || isBusy}
            />
          </div>
          <div className="space-y-2">
            <Label>Denda keterlambatan per jam</Label>
            <Input
              value={String(form.configs.asset_rental.late_fee_per_hour)}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  configs: {
                    ...prev.configs,
                    asset_rental: {
                      ...prev.configs.asset_rental,
                      late_fee_per_hour: toPositiveNumber(
                        event.target.value,
                        prev.configs.asset_rental.late_fee_per_hour
                      ),
                    },
                  },
                }))
              }
              disabled={!canManage || isBusy}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kebijakan Marketplace & Accounting</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Window pembayaran manual (menit)</Label>
            <Input
              value={String(form.configs.marketplace.manual_payment_window_min)}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  configs: {
                    ...prev.configs,
                    marketplace: {
                      ...prev.configs.marketplace,
                      manual_payment_window_min: toPositiveNumber(
                        event.target.value,
                        prev.configs.marketplace.manual_payment_window_min
                      ),
                    },
                  },
                }))
              }
              disabled={!canManage || isBusy}
            />
          </div>
          <div className="space-y-2">
            <Label>Auto-cancel unpaid (jam)</Label>
            <Input
              value={String(form.configs.marketplace.auto_cancel_unpaid_hours)}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  configs: {
                    ...prev.configs,
                    marketplace: {
                      ...prev.configs.marketplace,
                      auto_cancel_unpaid_hours: toPositiveNumber(
                        event.target.value,
                        prev.configs.marketplace.auto_cancel_unpaid_hours
                      ),
                    },
                  },
                }))
              }
              disabled={!canManage || isBusy}
            />
          </div>
          <div className="space-y-2">
            <Label>Batas stok rendah</Label>
            <Input
              value={String(form.configs.marketplace.low_stock_threshold)}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  configs: {
                    ...prev.configs,
                    marketplace: {
                      ...prev.configs.marketplace,
                      low_stock_threshold: toPositiveNumber(
                        event.target.value,
                        prev.configs.marketplace.low_stock_threshold
                      ),
                    },
                  },
                }))
              }
              disabled={!canManage || isBusy}
            />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <span className="text-sm font-medium">Izinkan guest checkout</span>
            <Switch
              checked={form.configs.marketplace.allow_guest_checkout}
              onCheckedChange={(checked) =>
                setForm((prev) => ({
                  ...prev,
                  configs: {
                    ...prev.configs,
                    marketplace: {
                      ...prev.configs.marketplace,
                      allow_guest_checkout: checked,
                    },
                  },
                }))
              }
              disabled={!canManage || isBusy}
            />
          </div>
          <div className="space-y-2">
            <Label>Prefix invoice</Label>
            <Input
              value={form.configs.accounting.invoice_prefix}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  configs: {
                    ...prev.configs,
                    accounting: {
                      ...prev.configs.accounting,
                      invoice_prefix: event.target.value.toUpperCase(),
                    },
                  },
                }))
              }
              disabled={!canManage || isBusy}
            />
          </div>
          <div className="space-y-2">
            <Label>Awal tahun fiskal (bulan)</Label>
            <Input
              value={String(form.configs.accounting.fiscal_year_start_month)}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  configs: {
                    ...prev.configs,
                    accounting: {
                      ...prev.configs.accounting,
                      fiscal_year_start_month: toPositiveNumber(
                        event.target.value,
                        prev.configs.accounting.fiscal_year_start_month
                      ),
                    },
                  },
                }))
              }
              disabled={!canManage || isBusy}
            />
          </div>
          <div className="space-y-2">
            <Label>Default payment terms (hari)</Label>
            <Input
              value={String(form.configs.accounting.default_payment_terms_days)}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  configs: {
                    ...prev.configs,
                    accounting: {
                      ...prev.configs.accounting,
                      default_payment_terms_days: toPositiveNumber(
                        event.target.value,
                        prev.configs.accounting.default_payment_terms_days
                      ),
                    },
                  },
                }))
              }
              disabled={!canManage || isBusy}
            />
          </div>
          <div className="space-y-2">
            <Label>Lock period setelah tutup buku (hari)</Label>
            <Input
              value={String(form.configs.accounting.period_lock_after_days)}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  configs: {
                    ...prev.configs,
                    accounting: {
                      ...prev.configs.accounting,
                      period_lock_after_days: toPositiveNumber(
                        event.target.value,
                        prev.configs.accounting.period_lock_after_days
                      ),
                    },
                  },
                }))
              }
              disabled={!canManage || isBusy}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="button" onClick={onSave} disabled={!canManage || !isDirty || isBusy}>
          {saveTenantConfig.isPending ? "Menyimpan..." : "Simpan Pengaturan Operasional"}
        </Button>
      </div>
    </div>
  );
}
