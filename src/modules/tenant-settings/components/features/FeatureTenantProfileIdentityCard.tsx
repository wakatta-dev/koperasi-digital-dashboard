/** @format */

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SettingsStickyActionBar } from "../shared/SettingsStickyActionBar";
import { settingsHeaderClassName, settingsSurfaceClassName } from "../../lib/settings";
import type { ProfileIdentityFormState } from "../../types/forms";

type FeatureTenantProfileIdentityCardProps = {
  value: ProfileIdentityFormState;
  disabled: boolean;
  dirty: boolean;
  saving: boolean;
  onChange: (next: ProfileIdentityFormState) => void;
  onReset: () => void;
  onSave: () => void;
};

const fieldClassName =
  "border-gray-300 focus-visible:border-indigo-600 focus-visible:ring-indigo-600/30 dark:border-gray-700";

export function FeatureTenantProfileIdentityCard({
  value,
  disabled,
  dirty,
  saving,
  onChange,
  onReset,
  onSave,
}: FeatureTenantProfileIdentityCardProps) {
  return (
    <Card className={settingsSurfaceClassName}>
      <div className={settingsHeaderClassName}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Identitas Usaha</h2>
      </div>
      <CardContent className="p-6">
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="business_name">Nama Usaha</Label>
            <Input
              id="business_name"
              className={fieldClassName}
              value={value.business_name}
              disabled={disabled}
              onChange={(event) => onChange({ ...value, business_name: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="business_type">Jenis Tenant</Label>
            <Input
              id="business_type"
              className="border-gray-300 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-800/50"
              value={value.business_type}
              disabled
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="business_category">Kategori Bisnis</Label>
            <Input
              id="business_category"
              className={fieldClassName}
              value={value.business_category}
              disabled={disabled}
              onChange={(event) =>
                onChange({ ...value, business_category: event.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input
              id="logo_url"
              className={fieldClassName}
              value={value.logo_url}
              placeholder="https://example.com/logo.png"
              disabled={disabled}
              onChange={(event) => onChange({ ...value, logo_url: event.target.value })}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              URL gambar untuk logo usaha Anda (format disarankan: PNG/SVG).
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea
            id="description"
            className={`${fieldClassName} min-h-28`}
            rows={4}
            value={value.description}
            disabled={disabled}
            onChange={(event) => onChange({ ...value, description: event.target.value })}
          />
        </div>
        <SettingsStickyActionBar
          onReset={onReset}
          onSave={onSave}
          saveLabel="Simpan Perubahan"
          resetDisabled={disabled || !dirty || saving}
          saveDisabled={disabled || !dirty || saving}
          saving={saving}
        />
      </CardContent>
    </Card>
  );
}

