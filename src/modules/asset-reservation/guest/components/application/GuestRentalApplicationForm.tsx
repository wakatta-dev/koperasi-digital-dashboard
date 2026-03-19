/** @format */

"use client";

import { Button } from "@/components/ui/button";
import { DatePickerField } from "@/components/shared/inputs/date-picker-field";
import { InputField } from "@/components/shared/inputs/input-field";
import { TextareaField } from "@/components/shared/inputs/textarea-field";
import { parseLocalDateInput } from "@/lib/date-only";

export type GuestRentalApplicationFormValues = {
  fullName: string;
  phone: string;
  email: string;
  purpose: string;
  startDate: string;
  endDate: string;
};

type GuestRentalApplicationFormProps = Readonly<{
  values: GuestRentalApplicationFormValues;
  onValuesChange: (next: GuestRentalApplicationFormValues) => void;
  onSubmit: (values?: GuestRentalApplicationFormValues) => void;
  submitting?: boolean;
}>;

export function GuestRentalApplicationForm({
  values,
  onValuesChange,
  onSubmit,
  submitting,
}: GuestRentalApplicationFormProps) {
  return (
    <div
      className="space-y-6"
      data-testid="asset-rental-application-form"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
          <InputField
            id="full-name"
            name="full-name"
            type="text"
            label="Nama Lengkap"
            size="lg"
            startIcon={
              <span className="material-symbols-outlined text-xl">person</span>
            }
            value={values.fullName}
            onValueChange={(next) => onValuesChange({ ...values, fullName: next })}
            placeholder="Masukkan nama lengkap Anda sesuai KTP"
            autoComplete="name"
            data-testid="asset-rental-application-full-name-input"
          />
        </div>

        <div>
          <InputField
            id="phone"
            name="phone"
            type="tel"
            label="No. Handphone / WhatsApp"
            size="lg"
            startIcon={<span className="material-symbols-outlined text-xl">call</span>}
            value={values.phone}
            onValueChange={(next) => onValuesChange({ ...values, phone: next })}
            placeholder="Contoh: 08123456789"
            autoComplete="tel"
            data-testid="asset-rental-application-phone-input"
          />
        </div>

        <div>
          <InputField
            id="email"
            name="email"
            type="email"
            label="Alamat Email"
            size="lg"
            startIcon={<span className="material-symbols-outlined text-xl">mail</span>}
            value={values.email}
            onValueChange={(next) => onValuesChange({ ...values, email: next })}
            placeholder="Contoh: nama@email.com"
            autoComplete="email"
            data-testid="asset-rental-application-email-input"
          />
        </div>

        <div className="col-span-2">
          <TextareaField
            id="purpose"
            name="purpose"
            label="Tujuan Penggunaan"
            size="lg"
            startIcon={
              <span className="material-symbols-outlined text-xl">edit_note</span>
            }
            value={values.purpose}
            onValueChange={(next) => onValuesChange({ ...values, purpose: next })}
            placeholder="Jelaskan secara singkat kegiatan yang akan dilaksanakan..."
            rows={3}
            data-testid="asset-rental-application-purpose-textarea"
          />
        </div>

        <div className="col-span-2 space-y-2">
          <p className="text-sm font-medium">Rentang Tanggal Sewa</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DatePickerField
              id="start-date"
              name="start-date"
              ariaLabel="Mulai sewa"
              value={values.startDate}
              onValueChange={(next) =>
                onValuesChange({ ...values, startDate: next })
              }
              helperText="Mulai Sewa"
              placeholder="Pilih tanggal mulai"
              dialogTitle="Pilih Tanggal Mulai Sewa"
              minDate={new Date()}
              data-testid="asset-rental-application-start-date-input"
            />
            <DatePickerField
              id="end-date"
              name="end-date"
              ariaLabel="Selesai sewa"
              value={values.endDate}
              onValueChange={(next) => onValuesChange({ ...values, endDate: next })}
              helperText="Selesai Sewa"
              placeholder="Pilih tanggal selesai"
              dialogTitle="Pilih Tanggal Selesai Sewa"
              minDate={
                values.startDate
                  ? parseLocalDateInput(values.startDate) ?? new Date()
                  : new Date()
              }
              data-testid="asset-rental-application-end-date-input"
            />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
        <Button
          type="button"
          disabled={Boolean(submitting)}
          data-testid="asset-rental-application-submit-button"
          className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-bold text-white bg-brand-primary hover:bg-brand-primary-hover focus-visible:ring-2 focus-visible:ring-brand-primary transition-all hover:-translate-y-0.5"
          onClick={() =>
            onSubmit({
              fullName: values.fullName,
              phone: values.phone,
              email: values.email,
              purpose: values.purpose,
              startDate: values.startDate,
              endDate: values.endDate,
            })
          }
        >
          Kirim Pengajuan
        </Button>
      </div>
    </div>
  );
}
