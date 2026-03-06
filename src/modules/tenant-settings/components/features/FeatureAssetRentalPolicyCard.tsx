/** @format */

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SettingsStickyActionBar } from "../shared/SettingsStickyActionBar";
import { parseNumberInput } from "../../lib/forms";
import { settingsHeaderClassName, settingsSurfaceClassName } from "../../lib/settings";
import type { AssetRentalPolicyFormState } from "../../types/forms";

type FeatureAssetRentalPolicyCardProps = {
  value: AssetRentalPolicyFormState;
  disabled: boolean;
  dirty: boolean;
  saving: boolean;
  onChange: (next: AssetRentalPolicyFormState) => void;
  onReset: () => void;
  onSave: () => void;
};

const fieldClassName =
  "border-gray-300 focus-visible:border-indigo-600 focus-visible:ring-indigo-600/30 dark:border-gray-700";

export function FeatureAssetRentalPolicyCard({
  value,
  disabled,
  dirty,
  saving,
  onChange,
  onReset,
  onSave,
}: FeatureAssetRentalPolicyCardProps) {
  return (
    <Card className={`${settingsSurfaceClassName} overflow-hidden`}>
      <div className={settingsHeaderClassName}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Kebijakan Asset & Rental
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Aturan standar untuk proses peminjaman dan penyewaan.
        </p>
      </div>
      <CardContent className="space-y-6 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Persetujuan wajib sebelum sewa aktif
            </p>
            <p className="text-sm text-gray-500">
              Setiap request sewa memerlukan approval admin.
            </p>
          </div>
          <Switch
            checked={value.approval_required}
            disabled={disabled}
            onCheckedChange={(checked) => onChange({ ...value, approval_required: checked })}
            className="data-[state=checked]:bg-indigo-600"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 border-t border-gray-100 pt-4 dark:border-gray-800 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Durasi slot default (menit)</Label>
            <Input
              type="number"
              className={fieldClassName}
              value={String(value.default_slot_minutes)}
              disabled={disabled}
              onChange={(event) =>
                onChange({
                  ...value,
                  default_slot_minutes: parseNumberInput(event.target.value, value.default_slot_minutes),
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Minimal DP (%)</Label>
            <Input
              type="number"
              className={fieldClassName}
              value={String(value.min_dp_percent)}
              disabled={disabled}
              onChange={(event) =>
                onChange({
                  ...value,
                  min_dp_percent: parseNumberInput(event.target.value, value.min_dp_percent),
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Grace period keterlambatan (jam)</Label>
            <Input
              type="number"
              className={fieldClassName}
              value={String(value.grace_period_hours)}
              disabled={disabled}
              onChange={(event) =>
                onChange({
                  ...value,
                  grace_period_hours: parseNumberInput(event.target.value, value.grace_period_hours),
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Denda keterlambatan per jam (IDR)</Label>
            <Input
              type="number"
              className={fieldClassName}
              value={String(value.late_fee_per_hour)}
              disabled={disabled}
              onChange={(event) =>
                onChange({
                  ...value,
                  late_fee_per_hour: parseNumberInput(event.target.value, value.late_fee_per_hour),
                })
              }
            />
          </div>
        </div>

        <SettingsStickyActionBar
          onReset={onReset}
          onSave={onSave}
          saveLabel="Simpan Pengaturan"
          resetDisabled={disabled || !dirty || saving}
          saveDisabled={disabled || !dirty || saving}
          saving={saving}
        />
      </CardContent>
    </Card>
  );
}

