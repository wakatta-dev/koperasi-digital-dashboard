/** @format */

import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { SettingsStickyActionBar } from "../shared/SettingsStickyActionBar";
import { settingsHeaderClassName, settingsSurfaceClassName } from "../../lib/settings";
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
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Aktivasi Modul</h2>
        <p className="mt-1 text-sm text-gray-500">Aktifkan atau nonaktifkan fitur utama untuk bisnis Anda.</p>
      </div>
      <CardContent className="p-0">
        <ul className="divide-y divide-gray-200 dark:divide-gray-800">
          {moduleItems.map((item) => (
            <li
              key={item.key}
              className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <div className="pr-6">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <Switch
                checked={Boolean(value[item.key])}
                disabled={disabled}
                onCheckedChange={(checked) => onChange({ ...value, [item.key]: checked })}
                className="data-[state=checked]:bg-indigo-600"
              />
            </li>
          ))}
        </ul>
        <div className="px-6 pb-0">
          <SettingsStickyActionBar
            onReset={onReset}
            onSave={onSave}
            saveLabel="Simpan Pengaturan"
            resetDisabled={disabled || !dirty || saving}
            saveDisabled={disabled || !dirty || saving}
            saving={saving}
          />
        </div>
      </CardContent>
    </Card>
  );
}

