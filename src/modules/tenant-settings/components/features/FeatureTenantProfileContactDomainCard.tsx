/** @format */

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SettingsStickyActionBar } from "../shared/SettingsStickyActionBar";
import { settingsHeaderClassName, settingsSurfaceClassName } from "../../lib/settings";
import type { ProfileContactDomainFormState } from "../../types/forms";

type FeatureTenantProfileContactDomainCardProps = {
  value: ProfileContactDomainFormState;
  disabled: boolean;
  dirty: boolean;
  saving: boolean;
  onChange: (next: ProfileContactDomainFormState) => void;
  onReset: () => void;
  onSave: () => void;
};

const fieldClassName =
  "border-gray-300 focus-visible:border-indigo-600 focus-visible:ring-indigo-600/30 dark:border-gray-700";

export function FeatureTenantProfileContactDomainCard({
  value,
  disabled,
  dirty,
  saving,
  onChange,
  onReset,
  onSave,
}: FeatureTenantProfileContactDomainCardProps) {
  return (
    <Card className={settingsSurfaceClassName}>
      <div className={settingsHeaderClassName}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Kontak dan Domain</h2>
      </div>
      <CardContent className="p-6">
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contact_email">Email Kontak</Label>
            <Input
              id="contact_email"
              type="email"
              className={fieldClassName}
              value={value.contact_email}
              disabled={disabled}
              onChange={(event) => onChange({ ...value, contact_email: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_phone">Telepon Kontak</Label>
            <Input
              id="contact_phone"
              type="tel"
              className={fieldClassName}
              value={value.contact_phone}
              disabled={disabled}
              onChange={(event) => onChange({ ...value, contact_phone: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="domain">Domain Aktif</Label>
            <Input
              id="domain"
              className="border-gray-300 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-800/50"
              value={value.domain}
              disabled
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="custom_domain">Custom Domain</Label>
            <Input
              id="custom_domain"
              className={fieldClassName}
              value={value.custom_domain}
              placeholder="contoh: bumdes.desa.id"
              disabled={disabled}
              onChange={(event) => onChange({ ...value, custom_domain: event.target.value })}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Biarkan kosong jika tidak menggunakan domain khusus.
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Alamat</Label>
          <Textarea
            id="address"
            className={`${fieldClassName} min-h-24`}
            rows={3}
            value={value.address}
            disabled={disabled}
            onChange={(event) => onChange({ ...value, address: event.target.value })}
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

