/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  useSupportDiagnostics,
  useSupportOperationalActions,
  useSupportOperationalSettings,
  useSupportPolicyDefinitions,
  useSupportSystemReadiness,
} from "@/hooks/queries";
import { isDeepEqual } from "../../lib/forms";
import {
  canManageTenantSettings,
  formatSettingsDateTime,
  normalizeRoleName,
} from "../../lib/settings";
import type {
  AssetRentalPolicyFormState,
  MarketplaceAccountingFormState,
  OperationalModulesFormState,
  OperationalPreferencesFormState,
} from "../../types/forms";
import { FeatureAssetRentalPolicyCard } from "../features/FeatureAssetRentalPolicyCard";
import { FeatureMarketplaceAccountingPolicyCard } from "../features/FeatureMarketplaceAccountingPolicyCard";
import { FeatureOperationalModulesCard } from "../features/FeatureOperationalModulesCard";
import { FeatureOperationalPreferenceCard } from "../features/FeatureOperationalPreferenceCard";
import { FeaturePolicyCatalogCard } from "../features/FeaturePolicyCatalogCard";
import { FeatureReadinessDiagnosticsCard } from "../features/FeatureReadinessDiagnosticsCard";
import { FeatureSystemReadinessCard } from "../features/FeatureSystemReadinessCard";
import { SettingsErrorBanner } from "../shared/SettingsErrorBanner";
import { SettingsReadOnlyAlert } from "../shared/SettingsReadOnlyAlert";
import { TenantSettingsShell } from "../shared/TenantSettingsShell";

const emptyPreferences: OperationalPreferencesFormState = {
  timezone: "",
  currency: "",
  locale: "",
  theme: "",
};

const emptyModules: OperationalModulesFormState = {
  asset_rental_enabled: false,
  marketplace_enabled: false,
  inventory_enabled: false,
  reports_enabled: false,
  pos_enabled: false,
};

const emptyAssetRental: AssetRentalPolicyFormState = {
  approval_required: false,
  default_slot_minutes: 0,
  min_dp_percent: 0,
  grace_period_hours: 0,
  late_fee_per_hour: 0,
};

const emptyMarketplaceAccounting: MarketplaceAccountingFormState = {
  marketplace: {
    manual_payment_window_min: 0,
    auto_cancel_unpaid_hours: 0,
    low_stock_threshold: 0,
    allow_guest_checkout: false,
  },
  accounting: {
    invoice_prefix: "",
    fiscal_year_start_month: 1,
    default_payment_terms_days: 0,
    period_lock_after_days: 0,
  },
};

export function BusinessOperationsSettingsPage() {
  const { data: session } = useSession();
  const canManage = canManageTenantSettings((session?.user as { role?: string } | undefined)?.role);
  const normalizedRole = normalizeRoleName((session?.user as { role?: string } | undefined)?.role);
  const showSupportDiagnostics = normalizedRole === "support" || normalizedRole === "super_admin";
  const operationalQuery = useSupportOperationalSettings();
  const policyDefinitionsQuery = useSupportPolicyDefinitions();
  const readinessQuery = useSupportSystemReadiness();
  const diagnosticsQuery = useSupportDiagnostics();
  const {
    savePreferences,
    saveModules,
    saveAssetRental,
    saveMarketplaceAccounting,
  } = useSupportOperationalActions();

  const preferencesInitial = useMemo<OperationalPreferencesFormState>(
    () => operationalQuery.data?.preferences ?? emptyPreferences,
    [operationalQuery.data]
  );
  const modulesInitial = useMemo<OperationalModulesFormState>(
    () => operationalQuery.data?.modules.feature_flags ?? emptyModules,
    [operationalQuery.data]
  );
  const assetRentalInitial = useMemo<AssetRentalPolicyFormState>(
    () => operationalQuery.data?.asset_rental ?? emptyAssetRental,
    [operationalQuery.data]
  );
  const marketplaceAccountingInitial = useMemo<MarketplaceAccountingFormState>(
    () => operationalQuery.data?.marketplace_accounting ?? emptyMarketplaceAccounting,
    [operationalQuery.data]
  );

  const [preferencesForm, setPreferencesForm] =
    useState<OperationalPreferencesFormState>(preferencesInitial);
  const [modulesForm, setModulesForm] = useState<OperationalModulesFormState>(modulesInitial);
  const [assetRentalForm, setAssetRentalForm] =
    useState<AssetRentalPolicyFormState>(assetRentalInitial);
  const [marketplaceAccountingForm, setMarketplaceAccountingForm] =
    useState<MarketplaceAccountingFormState>(marketplaceAccountingInitial);

  useEffect(() => setPreferencesForm(preferencesInitial), [preferencesInitial]);
  useEffect(() => setModulesForm(modulesInitial), [modulesInitial]);
  useEffect(() => setAssetRentalForm(assetRentalInitial), [assetRentalInitial]);
  useEffect(
    () => setMarketplaceAccountingForm(marketplaceAccountingInitial),
    [marketplaceAccountingInitial]
  );

  const enabledModuleCount = Object.values(modulesForm).filter(Boolean).length;
  const readinessLabel =
    readinessQuery.isLoading
      ? "Memeriksa…"
      : readinessQuery.data?.status === "ready"
        ? "Siap"
        : readinessQuery.error
          ? "Tidak tersedia"
          : "Perlu tindak lanjut";

  return (
    <TenantSettingsShell
      sectionId="operasional-usaha"
      title="Operasional Usaha"
      description="Atur baseline operasional tenant, kesiapan sistem, aktivasi modul, dan kebijakan proses inti dari satu workspace."
      summaryTitle="Status Operasional"
      summaryDescription="Ringkasan cepat sebelum Anda menyesuaikan modul, policy, dan readiness tenant."
      summaryItems={[
        {
          label: "Kesiapan Sistem",
          value: readinessLabel,
          helper: readinessQuery.data?.checked_at
            ? `Pemeriksaan terakhir ${formatSettingsDateTime(readinessQuery.data.checked_at)}`
            : "Belum ada timestamp pemeriksaan",
        },
        {
          label: "Modul Aktif",
          value: `${enabledModuleCount} Modul`,
          helper: modulesForm.marketplace_enabled ? "Marketplace aktif" : "Marketplace nonaktif",
        },
        {
          label: "Regional Default",
          value: preferencesForm.timezone || "Belum diatur",
          helper: `${preferencesForm.currency || "-"} • ${preferencesForm.locale || "-"}`,
        },
      ]}
    >
      {!canManage ? (
        <SettingsReadOnlyAlert message="Anda sedang melihat pengaturan dalam mode read-only. Beberapa perubahan membutuhkan persetujuan Super Admin." />
      ) : null}

      {operationalQuery.error ? (
        <SettingsErrorBanner message={(operationalQuery.error as Error).message} />
      ) : null}

      <FeatureSystemReadinessCard
        data={readinessQuery.data}
        isLoading={readinessQuery.isLoading}
        error={readinessQuery.error as Error | null}
      />

      <FeaturePolicyCatalogCard
        data={policyDefinitionsQuery.data}
        isLoading={policyDefinitionsQuery.isLoading}
        error={policyDefinitionsQuery.error as Error | null}
      />

      <FeatureReadinessDiagnosticsCard
        data={diagnosticsQuery.data}
        isLoading={diagnosticsQuery.isLoading}
        error={diagnosticsQuery.error as Error | null}
        showSupportDetails={showSupportDiagnostics}
      />

      <FeatureOperationalPreferenceCard
        value={preferencesForm}
        disabled={!canManage || operationalQuery.isLoading}
        dirty={!isDeepEqual(preferencesForm, preferencesInitial)}
        saving={savePreferences.isPending}
        onChange={setPreferencesForm}
        onReset={() => setPreferencesForm(preferencesInitial)}
        onSave={() =>
          savePreferences.mutate({
            ...preferencesForm,
            expected_updated_at: operationalQuery.data?.preferences.updated_at,
          })
        }
      />

      <FeatureOperationalModulesCard
        value={modulesForm}
        disabled={!canManage || operationalQuery.isLoading}
        dirty={!isDeepEqual(modulesForm, modulesInitial)}
        saving={saveModules.isPending}
        onChange={setModulesForm}
        onReset={() => setModulesForm(modulesInitial)}
        onSave={() =>
          saveModules.mutate({
            feature_flags: modulesForm,
            expected_updated_at: operationalQuery.data?.modules.updated_at,
          })
        }
      />

      <FeatureAssetRentalPolicyCard
        value={assetRentalForm}
        disabled={!canManage || operationalQuery.isLoading}
        dirty={!isDeepEqual(assetRentalForm, assetRentalInitial)}
        saving={saveAssetRental.isPending}
        onChange={setAssetRentalForm}
        onReset={() => setAssetRentalForm(assetRentalInitial)}
        onSave={() =>
          saveAssetRental.mutate({
            ...assetRentalForm,
            expected_updated_at: operationalQuery.data?.asset_rental.updated_at,
          })
        }
      />

      <FeatureMarketplaceAccountingPolicyCard
        value={marketplaceAccountingForm}
        disabled={!canManage || operationalQuery.isLoading}
        dirty={!isDeepEqual(marketplaceAccountingForm, marketplaceAccountingInitial)}
        saving={saveMarketplaceAccounting.isPending}
        onChange={setMarketplaceAccountingForm}
        onReset={() => setMarketplaceAccountingForm(marketplaceAccountingInitial)}
        onSave={() =>
          saveMarketplaceAccounting.mutate({
            ...marketplaceAccountingForm,
            expected_updated_at: operationalQuery.data?.marketplace_accounting.updated_at,
          })
        }
      />
    </TenantSettingsShell>
  );
}
