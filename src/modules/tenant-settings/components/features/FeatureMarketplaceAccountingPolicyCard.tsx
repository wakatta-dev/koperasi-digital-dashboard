/** @format */

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { SettingsStickyActionBar } from "../shared/SettingsStickyActionBar";
import { parseNumberInput } from "../../lib/forms";
import { settingsHeaderClassName, settingsSurfaceClassName } from "../../lib/settings";
import type { MarketplaceAccountingFormState } from "../../types/forms";

type FeatureMarketplaceAccountingPolicyCardProps = {
  value: MarketplaceAccountingFormState;
  disabled: boolean;
  dirty: boolean;
  saving: boolean;
  onChange: (next: MarketplaceAccountingFormState) => void;
  onReset: () => void;
  onSave: () => void;
};

const fieldClassName =
  "border-gray-300 focus-visible:border-indigo-600 focus-visible:ring-indigo-600/30 dark:border-gray-700";

const selectClassName = "border-gray-300 focus:ring-indigo-600 dark:border-gray-700";

const fiscalYearOptions = [
  { value: "1", label: "Januari" },
  { value: "4", label: "April" },
  { value: "7", label: "Juli" },
  { value: "10", label: "Oktober" },
];

const paymentTermsOptions = [
  { value: "0", label: "Due on Receipt" },
  { value: "15", label: "Net 15" },
  { value: "30", label: "Net 30" },
];

export function FeatureMarketplaceAccountingPolicyCard({
  value,
  disabled,
  dirty,
  saving,
  onChange,
  onReset,
  onSave,
}: FeatureMarketplaceAccountingPolicyCardProps) {
  const manualPaymentWindowHours = Number(
    (value.marketplace.manual_payment_window_min / 60).toFixed(2)
  );

  return (
    <Card className={`${settingsSurfaceClassName} overflow-hidden`}>
      <div className={settingsHeaderClassName}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Kebijakan Marketplace & Accounting
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Pengaturan transaksi, e-commerce, dan pencatatan keuangan.
        </p>
      </div>
      <CardContent className="space-y-8 p-6">
        <div>
          <h3 className="mb-4 text-md font-medium text-gray-900 dark:text-white">Marketplace</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Manual payment window (jam)</Label>
              <Input
                type="number"
                step="0.5"
                className={fieldClassName}
                value={String(manualPaymentWindowHours)}
                disabled={disabled}
                onChange={(event) =>
                  onChange({
                    ...value,
                    marketplace: {
                      ...value.marketplace,
                      manual_payment_window_min: Math.max(
                        1,
                        Math.round(parseNumberInput(event.target.value, manualPaymentWindowHours) * 60)
                      ),
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Batas stok rendah</Label>
              <Input
                type="number"
                className={fieldClassName}
                value={String(value.marketplace.low_stock_threshold)}
                disabled={disabled}
                onChange={(event) =>
                  onChange({
                    ...value,
                    marketplace: {
                      ...value.marketplace,
                      low_stock_threshold: parseNumberInput(
                        event.target.value,
                        value.marketplace.low_stock_threshold
                      ),
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between md:col-span-2">
              <div className="pr-6">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Auto-cancel unpaid orders
                </p>
                <p className="text-sm text-gray-500">
                  Tetap aktif selama nilai batas jam belum diubah menjadi 0 di backend.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min="1"
                  className={`${fieldClassName} w-24`}
                  value={String(value.marketplace.auto_cancel_unpaid_hours)}
                  disabled={disabled}
                  onChange={(event) =>
                    onChange({
                      ...value,
                      marketplace: {
                        ...value.marketplace,
                        auto_cancel_unpaid_hours: parseNumberInput(
                          event.target.value,
                          value.marketplace.auto_cancel_unpaid_hours
                        ),
                      },
                    })
                  }
                />
                <span className="text-sm text-gray-500">jam</span>
              </div>
            </div>
            <div className="flex items-center justify-between md:col-span-2">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Guest checkout toggle
                </p>
              </div>
              <Switch
                checked={value.marketplace.allow_guest_checkout}
                disabled={disabled}
                onCheckedChange={(checked) =>
                  onChange({
                    ...value,
                    marketplace: { ...value.marketplace, allow_guest_checkout: checked },
                  })
                }
                className="data-[state=checked]:bg-indigo-600"
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-800" />

        <div>
          <h3 className="mb-4 text-md font-medium text-gray-900 dark:text-white">Accounting</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Prefix Invoice</Label>
              <Input
                className={fieldClassName}
                value={value.accounting.invoice_prefix}
                disabled={disabled}
                onChange={(event) =>
                  onChange({
                    ...value,
                    accounting: { ...value.accounting, invoice_prefix: event.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Awal tahun fiskal</Label>
              <Select
                value={String(value.accounting.fiscal_year_start_month || 1)}
                disabled={disabled}
                onValueChange={(next) =>
                  onChange({
                    ...value,
                    accounting: {
                      ...value.accounting,
                      fiscal_year_start_month: parseNumberInput(next, value.accounting.fiscal_year_start_month),
                    },
                  })
                }
              >
                <SelectTrigger className={selectClassName}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fiscalYearOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Default payment terms</Label>
              <Select
                value={String(value.accounting.default_payment_terms_days ?? 0)}
                disabled={disabled}
                onValueChange={(next) =>
                  onChange({
                    ...value,
                    accounting: {
                      ...value.accounting,
                      default_payment_terms_days: parseNumberInput(
                        next,
                        value.accounting.default_payment_terms_days
                      ),
                    },
                  })
                }
              >
                <SelectTrigger className={selectClassName}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentTermsOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Lock period (tanggal tutup buku)</Label>
              <Input
                type="number"
                className={fieldClassName}
                value={String(value.accounting.period_lock_after_days)}
                disabled={disabled}
                onChange={(event) =>
                  onChange({
                    ...value,
                    accounting: {
                      ...value.accounting,
                      period_lock_after_days: parseNumberInput(
                        event.target.value,
                        value.accounting.period_lock_after_days
                      ),
                    },
                  })
                }
              />
            </div>
          </div>
        </div>

        <SettingsStickyActionBar
          onReset={onReset}
          onSave={onSave}
          saveLabel="Simpan Pengaturan Operasional"
          resetDisabled={disabled || !dirty || saving}
          saveDisabled={disabled || !dirty || saving}
          saving={saving}
        />
      </CardContent>
    </Card>
  );
}

