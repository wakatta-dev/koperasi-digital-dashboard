/** @format */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type DetailRentalFormProps = {
  price: string;
  unit: string;
  onSubmit?: () => void;
};

export function DetailRentalForm({ price, unit, onSubmit }: DetailRentalFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.();
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg sticky top-24">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Ajukan Sewa</h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mulai Sewa
            </label>
            <Input
              type="date"
              defaultValue="2024-10-12"
              className="w-full text-sm rounded-lg border-[#4338ca] dark:border-[#4338ca]/50 dark:bg-gray-800 focus-visible:border-[#4338ca] focus-visible:ring-[#4338ca] text-gray-900 dark:text-white font-medium bg-[#4338ca]/5 dark:bg-[#4338ca]/10"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Selesai Sewa
            </label>
            <Input
              type="date"
              defaultValue="2024-10-14"
              className="w-full text-sm rounded-lg border-[#4338ca] dark:border-[#4338ca]/50 dark:bg-gray-800 focus-visible:border-[#4338ca] focus-visible:ring-[#4338ca] text-gray-900 dark:text-white font-medium bg-[#4338ca]/5 dark:bg-[#4338ca]/10"
            />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-dashed border-gray-300 dark:border-gray-600">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Ringkasan Sewa
          </h4>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-300">
              {price}
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{unit}</span> x 3 Hari
            </span>
            <span className="text-gray-900 dark:text-white font-medium">Rp1.050.000</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-300">Biaya Kebersihan</span>
            <span className="text-gray-900 dark:text-white font-medium">Rp50.000</span>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2 flex justify-between items-center">
            <span className="font-bold text-gray-900 dark:text-white">Total Estimasi</span>
            <span className="font-bold text-[#4338ca] text-lg">Rp1.100.000</span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nama Lengkap
            </label>
            <Input
              type="text"
              placeholder="Nama Anda"
              className="w-full text-sm rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus-visible:border-[#4338ca] focus-visible:ring-[#4338ca] text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nomor Telepon (WhatsApp)
            </label>
            <Input
              type="tel"
              placeholder="0812..."
              className="w-full text-sm rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus-visible:border-[#4338ca] focus-visible:ring-[#4338ca] text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <Input
              type="email"
              placeholder="email@contoh.com"
              className="w-full text-sm rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus-visible:border-[#4338ca] focus-visible:ring-[#4338ca] text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tujuan Sewa
            </label>
            <Textarea
              placeholder="Jelaskan acara atau kebutuhan Anda..."
              rows={3}
              className="w-full text-sm rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus-visible:border-[#4338ca] focus-visible:ring-[#4338ca] text-gray-900 dark:text-white resize-none"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#4338ca] hover:bg-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition transform active:scale-95 flex items-center justify-center gap-2"
        >
          <span className="material-icons-outlined">send</span>
          Minta Penawaran
        </Button>
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
          Tim BUMDes akan menghubungi Anda untuk konfirmasi ketersediaan dan pembayaran.
        </p>
      </form>
    </div>
  );
}
