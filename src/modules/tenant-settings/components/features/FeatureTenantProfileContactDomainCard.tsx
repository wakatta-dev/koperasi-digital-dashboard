/** @format */

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SettingsStickyActionBar } from "../shared/SettingsStickyActionBar";
import {
  settingsCardContentClassName,
  settingsFieldClassName,
  settingsHeaderClassName,
  settingsHelperTextClassName,
  settingsMutedTextClassName,
  settingsReadOnlyFieldClassName,
  settingsSectionTitleClassName,
  settingsSurfaceClassName,
} from "../../lib/settings";
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
        <div className="space-y-1">
          <h2 className={settingsSectionTitleClassName}>Kontak &amp; Domain</h2>
          <p className={settingsMutedTextClassName}>
            Informasi kontak ini dipakai sebagai titik komunikasi utama dan referensi domain aktif tenant.
          </p>
        </div>
      </div>
      <CardContent className={settingsCardContentClassName}>
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contact_email">Email Kontak</Label>
            <Input
              id="contact_email"
              type="email"
              name="contact_email"
              autoComplete="email"
              inputMode="email"
              spellCheck={false}
              className={settingsFieldClassName}
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
              name="contact_phone"
              autoComplete="tel"
              inputMode="tel"
              className={settingsFieldClassName}
              value={value.contact_phone}
              disabled={disabled}
              onChange={(event) => onChange({ ...value, contact_phone: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="domain">Domain Aktif</Label>
            <Input
              id="domain"
              name="domain"
              className={settingsReadOnlyFieldClassName}
              value={value.domain}
              disabled
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="custom_domain">Custom Domain</Label>
            <Input
              id="custom_domain"
              name="custom_domain"
              autoComplete="off"
              spellCheck={false}
              className={settingsFieldClassName}
              value={value.custom_domain}
              placeholder="contoh: bumdes.desa.id"
              disabled={disabled}
              onChange={(event) => onChange({ ...value, custom_domain: event.target.value })}
            />
            <p className={settingsHelperTextClassName}>
              Biarkan kosong jika tidak menggunakan domain khusus.
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Alamat</Label>
          <Textarea
            id="address"
            name="address"
            autoComplete="street-address"
            className={`${settingsFieldClassName} min-h-24`}
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
          dirty={dirty}
          resetDisabled={disabled || !dirty || saving}
          saveDisabled={disabled || !dirty || saving}
          saving={saving}
        />
      </CardContent>
    </Card>
  );
}
