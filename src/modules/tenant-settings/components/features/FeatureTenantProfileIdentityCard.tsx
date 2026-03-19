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
        <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <h2 className={settingsSectionTitleClassName}>Identitas Usaha</h2>
            <p className={settingsMutedTextClassName}>
              Pastikan identitas tenant mudah dikenali oleh pengguna internal maupun publik.
            </p>
          </div>
          {value.logo_url ? (
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 dark:border-slate-700 dark:bg-slate-950/70">
              <img
                src={value.logo_url}
                alt={`Logo ${value.business_name || "tenant"}`}
                width={48}
                height={48}
                loading="lazy"
                className="h-12 w-12 rounded-2xl object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                  Preview Logo
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  Akan tampil pada area yang menggunakan identitas tenant.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <CardContent className={settingsCardContentClassName}>
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="business_name">Nama Usaha</Label>
            <Input
              id="business_name"
              name="business_name"
              autoComplete="organization"
              className={settingsFieldClassName}
              value={value.business_name}
              disabled={disabled}
              onChange={(event) => onChange({ ...value, business_name: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="business_type">Jenis Tenant</Label>
            <Input
              id="business_type"
              name="business_type"
              className={settingsReadOnlyFieldClassName}
              value={value.business_type}
              disabled
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="business_category">Kategori Bisnis</Label>
            <Input
              id="business_category"
              name="business_category"
              autoComplete="organization-title"
              className={settingsFieldClassName}
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
              name="logo_url"
              type="url"
              inputMode="url"
              spellCheck={false}
              className={settingsFieldClassName}
              value={value.logo_url}
              placeholder="https://example.com/logo.png"
              disabled={disabled}
              onChange={(event) => onChange({ ...value, logo_url: event.target.value })}
            />
            <p className={settingsHelperTextClassName}>
              URL gambar untuk logo usaha Anda (format disarankan: PNG/SVG).
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea
            id="description"
            name="description"
            autoComplete="off"
            className={`${settingsFieldClassName} min-h-28`}
            rows={4}
            value={value.description}
            disabled={disabled}
            onChange={(event) => onChange({ ...value, description: event.target.value })}
          />
        </div>
        <SettingsStickyActionBar
          onReset={onReset}
          onSave={onSave}
          resetTestId="bumdes-settings-profile-identity-reset-button"
          saveTestId="bumdes-settings-profile-identity-save-button"
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
