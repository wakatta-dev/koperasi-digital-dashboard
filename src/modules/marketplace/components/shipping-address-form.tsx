/** @format */

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SHIPPING_ADDRESS } from "../constants";

export function ShippingAddressForm() {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-bold text-xl text-gray-900 dark:text-white">Alamat Tujuan</h2>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300" htmlFor="fullname">
                Nama Lengkap
              </label>
              <div className="relative">
                <Input
                  id="fullname"
                  defaultValue={SHIPPING_ADDRESS.fullName}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus-visible:ring-[#4338ca]/40 focus-visible:border-[#4338ca] pl-10 py-3 h-auto"
                />
                <span className="material-icons-outlined absolute left-3 top-3 text-gray-400">person</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300" htmlFor="phone">
                Nomor Telepon / WA
              </label>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  defaultValue={SHIPPING_ADDRESS.phone}
                  placeholder="Contoh: 08123456789"
                  className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus-visible:ring-[#4338ca]/40 focus-visible:border-[#4338ca] pl-10 py-3 h-auto"
                />
                <span className="material-icons-outlined absolute left-3 top-3 text-gray-400">call</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300" htmlFor="label">
              Label Alamat
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 border border-[#4338ca] text-[#4338ca] text-sm font-semibold rounded-lg"
              >
                Rumah
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium rounded-lg transition"
              >
                Kantor
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium rounded-lg transition"
              >
                Lainnya
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300" htmlFor="address">
              Alamat Lengkap
            </label>
            <Textarea
              id="address"
              defaultValue={SHIPPING_ADDRESS.address}
              placeholder="Nama Jalan, Nomor Rumah, RT/RW, Patokan"
              rows={3}
              className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus-visible:ring-[#4338ca]/40 focus-visible:border-[#4338ca] p-3"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField label="Provinsi" defaultValue={SHIPPING_ADDRESS.province}>
              <option>Jawa Barat</option>
              <option>Jawa Tengah</option>
              <option>Jawa Timur</option>
            </SelectField>
            <SelectField label="Kota / Kabupaten" defaultValue={SHIPPING_ADDRESS.city}>
              <option>Kab. Bogor</option>
              <option>Kota Bogor</option>
            </SelectField>
            <SelectField label="Kecamatan" defaultValue={SHIPPING_ADDRESS.district}>
              <option>Kec. Cibinong</option>
              <option>Kec. Citeureup</option>
            </SelectField>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Kode Pos</label>
              <Input
                defaultValue={SHIPPING_ADDRESS.postalCode}
                placeholder="16914"
                className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus-visible:ring-[#4338ca]/40 focus-visible:border-[#4338ca] py-3 h-auto"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function SelectField({
  label,
  defaultValue,
  children,
}: {
  label: string;
  defaultValue: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">{label}</label>
      <select
        defaultValue={defaultValue}
        className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm focus:ring-[#4338ca] focus:border-[#4338ca] py-3"
      >
        {children}
      </select>
    </div>
  );
}
