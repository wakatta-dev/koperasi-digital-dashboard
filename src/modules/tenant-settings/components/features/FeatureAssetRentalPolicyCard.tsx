/** @format */

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SettingsStickyActionBar } from "../shared/SettingsStickyActionBar";
import { parseNumberInput } from "../../lib/forms";
import {
  settingsCardContentClassName,
  settingsFieldClassName,
  settingsHeaderClassName,
  settingsMutedTextClassName,
  settingsSectionTitleClassName,
  settingsSurfaceClassName,
} from "../../lib/settings";
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
        <div className="space-y-1">
          <h2 className={settingsSectionTitleClassName}>Kebijakan Asset &amp; Rental</h2>
          <p className={settingsMutedTextClassName}>
            Aturan standar untuk proses peminjaman dan penyewaan yang konsisten di seluruh tenant.
          </p>
        </div>
      </div>
      <CardContent className={`${settingsCardContentClassName} space-y-6`}>
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/60">
          <div>
            <p className="text-sm font-semibold text-slate-950 dark:text-white">
              Persetujuan wajib sebelum sewa aktif
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Setiap request sewa memerlukan approval admin.
            </p>
          </div>
          <Switch
            checked={value.approval_required}
            disabled={disabled}
            onCheckedChange={(checked) => onChange({ ...value, approval_required: checked })}
            className="data-[state=checked]:bg-slate-950 dark:data-[state=checked]:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 rounded-2xl border border-slate-200 p-5 dark:border-slate-800 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Durasi slot default (menit)</Label>
            <Input
              type="number"
              name="default_slot_minutes"
              className={settingsFieldClassName}
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
              name="min_dp_percent"
              className={settingsFieldClassName}
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
              name="grace_period_hours"
              className={settingsFieldClassName}
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
              name="late_fee_per_hour"
              className={settingsFieldClassName}
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
          dirty={dirty}
          resetDisabled={disabled || !dirty || saving}
          saveDisabled={disabled || !dirty || saving}
          saving={saving}
        />
      </CardContent>
    </Card>
  );
}
