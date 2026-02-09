/** @format */

"use client";

import { Button } from "@/components/ui/button";
import { InputField } from "@/components/shared/inputs/input-field";
import { TextareaField } from "@/components/shared/inputs/textarea-field";

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
  onSubmit: () => void;
  submitting?: boolean;
}>;

export function GuestRentalApplicationForm({
  values,
  onValuesChange,
  onSubmit,
  submitting,
}: GuestRentalApplicationFormProps) {
  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
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
          />
        </div>

        <div className="col-span-2 space-y-2">
          <p className="text-sm font-medium">Rentang Tanggal Sewa</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              id="start-date"
              name="start-date"
              type="date"
              ariaLabel="Mulai sewa"
              size="lg"
              startIcon={
                <span className="material-symbols-outlined text-xl">
                  calendar_today
                </span>
              }
              value={values.startDate}
              onValueChange={(next) =>
                onValuesChange({ ...values, startDate: next })
              }
              helperText="Mulai Sewa"
            />
            <InputField
              id="end-date"
              name="end-date"
              type="date"
              ariaLabel="Selesai sewa"
              size="lg"
              startIcon={
                <span className="material-symbols-outlined text-xl">
                  event_busy
                </span>
              }
              value={values.endDate}
              onValueChange={(next) => onValuesChange({ ...values, endDate: next })}
              helperText="Selesai Sewa"
            />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
        <Button
          type="submit"
          disabled={Boolean(submitting)}
          className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-bold text-white bg-brand-primary hover:bg-brand-primary-hover focus-visible:ring-2 focus-visible:ring-brand-primary transition-all hover:-translate-y-0.5"
        >
          Kirim Pengajuan
        </Button>
      </div>
    </form>
  );
}
