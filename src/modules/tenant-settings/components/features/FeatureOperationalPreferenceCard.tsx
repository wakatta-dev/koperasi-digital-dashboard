/** @format */

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SettingsStickyActionBar } from "../shared/SettingsStickyActionBar";
import { settingsHeaderClassName, settingsSurfaceClassName } from "../../lib/settings";
import type { OperationalPreferencesFormState } from "../../types/forms";

type FeatureOperationalPreferenceCardProps = {
  value: OperationalPreferencesFormState;
  disabled: boolean;
  dirty: boolean;
  saving: boolean;
  onChange: (next: OperationalPreferencesFormState) => void;
  onReset: () => void;
  onSave: () => void;
};

const triggerClassName =
  "border-gray-300 focus:ring-indigo-600 dark:border-gray-700";

const timezoneOptions = [
  { value: "Asia/Jakarta", label: "Asia/Jakarta (WIB)" },
  { value: "Asia/Makassar", label: "Asia/Makassar (WITA)" },
  { value: "Asia/Jayapura", label: "Asia/Jayapura (WIT)" },
];

const currencyOptions = [
  { value: "IDR", label: "IDR (Indonesian Rupiah)" },
  { value: "USD", label: "USD (US Dollar)" },
];

const localeOptions = [
  { value: "id-ID", label: "id-ID (Indonesian)" },
  { value: "en-US", label: "en-US (English)" },
];

const themeOptions = [
  { value: "default", label: "System Default" },
  { value: "light", label: "Light Mode" },
  { value: "dark", label: "Dark Mode" },
];

function withCurrentOption(
  options: Array<{ value: string; label: string }>,
  value: string
) {
  if (!value || options.some((option) => option.value === value)) {
    return options;
  }
  return [{ value, label: value }, ...options];
}

export function FeatureOperationalPreferenceCard({
  value,
  disabled,
  dirty,
  saving,
  onChange,
  onReset,
  onSave,
}: FeatureOperationalPreferenceCardProps) {
  const timezoneItems = withCurrentOption(timezoneOptions, value.timezone);
  const currencyItems = withCurrentOption(currencyOptions, value.currency);
  const localeItems = withCurrentOption(localeOptions, value.locale);
  const themeItems = withCurrentOption(themeOptions, value.theme);

  return (
    <Card className={`${settingsSurfaceClassName} overflow-hidden`}>
      <div className={settingsHeaderClassName}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Preferensi Tenant</h2>
        <p className="mt-1 text-sm text-gray-500">Pengaturan dasar regional dan preferensi tampilan.</p>
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select
              value={value.timezone || timezoneItems[0]?.value}
              disabled={disabled}
              onValueChange={(next) => onChange({ ...value, timezone: next })}
            >
              <SelectTrigger className={triggerClassName}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezoneItems.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <Select
              value={value.currency || currencyItems[0]?.value}
              disabled={disabled}
              onValueChange={(next) => onChange({ ...value, currency: next })}
            >
              <SelectTrigger className={triggerClassName}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencyItems.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Locale</Label>
            <Select
              value={value.locale || localeItems[0]?.value}
              disabled={disabled}
              onValueChange={(next) => onChange({ ...value, locale: next })}
            >
              <SelectTrigger className={triggerClassName}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {localeItems.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select
              value={value.theme || themeItems[0]?.value}
              disabled={disabled}
              onValueChange={(next) => onChange({ ...value, theme: next })}
            >
              <SelectTrigger className={triggerClassName}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themeItems.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

