/** @format */

import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { SettingsStickyActionBar } from "../shared/SettingsStickyActionBar";
import {
  settingsHeaderClassName,
  settingsMutedTextClassName,
  settingsSectionTitleClassName,
  settingsSurfaceClassName,
} from "../../lib/settings";
import type { OperationalModulesFormState } from "../../types/forms";

type FeatureOperationalModulesCardProps = {
  value: OperationalModulesFormState;
  disabled: boolean;
  dirty: boolean;
  saving: boolean;
  onChange: (next: OperationalModulesFormState) => void;
  onReset: () => void;
  onSave: () => void;
};

const moduleItems: Array<{
  key: keyof OperationalModulesFormState;
  title: string;
  description: string;
}> = [
  {
    key: "asset_rental_enabled",
    title: "Asset & Rental",
    description: "Manajemen peminjaman dan penyewaan aset dengan tracking status.",
  },
  {
    key: "marketplace_enabled",
    title: "Marketplace",
    description: "Toko online dan katalog produk untuk pelanggan umum.",
  },
  {
    key: "inventory_enabled",
    title: "Inventory",
    description: "Manajemen stok, pergerakan barang, dan gudang.",
  },
  {
    key: "reports_enabled",
    title: "Reporting",
    description: "Akses ke laporan analitik lanjutan dan export data.",
  },
      {
    key: "pos_enabled",
    title: "Point of Sale (POS)",
    description: "Antarmuka kasir untuk transaksi offline di lokasi.",
  },
];

export function FeatureOperationalModulesCard({
  value,
  disabled,
  dirty,
  saving,
  onChange,
  onReset,
  onSave,
}: FeatureOperationalModulesCardProps) {
  return (
    <Card className={`${settingsSurfaceClassName} overflow-hidden`}>
      <div className={settingsHeaderClassName}>
        <div className="space-y-1">
          <h2 className={settingsSectionTitleClassName}>Aktivasi Modul</h2>
          <p className={settingsMutedTextClassName}>
            Nyalakan hanya modul yang relevan agar workspace tetap fokus dan lebih mudah dioperasikan.
          </p>
        </div>
      </div>
      <CardContent className="p-0">
        <ul className="grid gap-4 p-6 md:grid-cols-2">
          {moduleItems.map((item) => (
            <li
              key={item.key}
              className="rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-4 transition-colors hover:bg-white dark:border-slate-800 dark:bg-slate-900/70 dark:hover:bg-slate-950"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 pr-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-950 dark:text-white">{item.title}</p>
                    <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                      {value[item.key] ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {item.description}
                  </p>
                </div>
                <Switch
                  checked={Boolean(value[item.key])}
                  disabled={disabled}
                  onCheckedChange={(checked) => onChange({ ...value, [item.key]: checked })}
                  className="mt-1 data-[state=checked]:bg-slate-950 dark:data-[state=checked]:bg-white"
                />
              </div>
            </li>
          ))}
        </ul>
        <div className="px-6 pb-6 pt-0">
          <SettingsStickyActionBar
            onReset={onReset}
            onSave={onSave}
            saveLabel="Simpan Pengaturan"
            dirty={dirty}
            resetDisabled={disabled || !dirty || saving}
            saveDisabled={disabled || !dirty || saving}
            saving={saving}
          />
        </div>
      </CardContent>
    </Card>
  );
}
