/** @format */

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
          <label
            className="block text-sm font-medium text-gray-900 dark:text-white mb-1"
            htmlFor="full-name"
          >
            Nama Lengkap
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gray-400 text-xl">
                person
              </span>
            </div>
            <Input
              id="full-name"
              name="full-name"
              type="text"
              value={values.fullName}
              onChange={(e) =>
                onValuesChange({ ...values, fullName: e.target.value })
              }
              className="pl-10 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-card-dark text-gray-900 dark:text-white shadow-sm focus-visible:ring-brand-primary focus-visible:ring-2 focus-visible:border-brand-primary sm:text-sm py-2.5"
              placeholder="Masukkan nama lengkap Anda sesuai KTP"
              autoComplete="name"
            />
          </div>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-900 dark:text-white mb-1"
            htmlFor="phone"
          >
            No. Handphone / WhatsApp
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gray-400 text-xl">
                call
              </span>
            </div>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={values.phone}
              onChange={(e) =>
                onValuesChange({ ...values, phone: e.target.value })
              }
              className="pl-10 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-card-dark text-gray-900 dark:text-white shadow-sm focus-visible:ring-brand-primary focus-visible:ring-2 focus-visible:border-brand-primary sm:text-sm py-2.5"
              placeholder="Contoh: 08123456789"
              autoComplete="tel"
            />
          </div>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-900 dark:text-white mb-1"
            htmlFor="email"
          >
            Alamat Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gray-400 text-xl">
                mail
              </span>
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={(e) =>
                onValuesChange({ ...values, email: e.target.value })
              }
              className="pl-10 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-card-dark text-gray-900 dark:text-white shadow-sm focus-visible:ring-brand-primary focus-visible:ring-2 focus-visible:border-brand-primary sm:text-sm py-2.5"
              placeholder="Contoh: nama@email.com"
              autoComplete="email"
            />
          </div>
        </div>

        <div className="col-span-2">
          <label
            className="block text-sm font-medium text-gray-900 dark:text-white mb-1"
            htmlFor="purpose"
          >
            Tujuan Penggunaan
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <span className="material-symbols-outlined text-gray-400 text-xl">
                edit_note
              </span>
            </div>
            <Textarea
              id="purpose"
              name="purpose"
              value={values.purpose}
              onChange={(e) =>
                onValuesChange({ ...values, purpose: e.target.value })
              }
              className="pl-10 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-card-dark text-gray-900 dark:text-white shadow-sm focus-visible:ring-brand-primary focus-visible:ring-2 focus-visible:border-brand-primary sm:text-sm py-2.5"
              placeholder="Jelaskan secara singkat kegiatan yang akan dilaksanakan..."
              rows={3}
            />
          </div>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
            Rentang Tanggal Sewa
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 text-xl">
                  calendar_today
                </span>
              </div>
              <Input
                id="start-date"
                name="start-date"
                type="date"
                value={values.startDate}
                onChange={(e) =>
                  onValuesChange({ ...values, startDate: e.target.value })
                }
                className="pl-10 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-card-dark text-gray-900 dark:text-white shadow-sm focus-visible:ring-brand-primary focus-visible:ring-2 focus-visible:border-brand-primary sm:text-sm py-2.5"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                Mulai Sewa
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 text-xl">
                  event_busy
                </span>
              </div>
              <Input
                id="end-date"
                name="end-date"
                type="date"
                value={values.endDate}
                onChange={(e) =>
                  onValuesChange({ ...values, endDate: e.target.value })
                }
                className="pl-10 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-card-dark text-gray-900 dark:text-white shadow-sm focus-visible:ring-brand-primary focus-visible:ring-2 focus-visible:border-brand-primary sm:text-sm py-2.5"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                Selesai Sewa
              </span>
            </div>
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

