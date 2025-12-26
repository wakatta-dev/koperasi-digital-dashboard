/** @format */

import { Button } from "@/components/ui/button";
import type { ReservationSummary } from "../../types";

type RepaymentSidebarProps = {
  reservation: ReservationSummary;
  sessionPayBy?: string;
};

function formatCurrency(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return `Rp${value.toLocaleString("id-ID")}`;
}

export function RepaymentSidebar({ reservation, sessionPayBy }: RepaymentSidebarProps) {
  const totalCost = formatCurrency(reservation.amounts?.total);
  const dpPaid = formatCurrency(reservation.amounts?.dp);
  const remaining = formatCurrency(reservation.amounts?.remaining);
  const dueText = sessionPayBy
    ? `Bayar sebelum ${new Date(sessionPayBy).toLocaleString("id-ID")}`
    : "Batas waktu belum tersedia.";

  return (
    <div className="sticky top-28 space-y-6">
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">Ringkasan Pembayaran</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Detail tagihan pelunasan Anda</p>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">ID Reservasi</span>
            <span className="text-sm font-mono font-medium text-gray-900 dark:text-white">
              {reservation.reservationId}
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total Biaya Sewa</span>
              <span className="font-medium text-gray-900 dark:text-white">{totalCost}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Biaya Layanan</span>
              <span className="font-medium text-gray-900 dark:text-white">-</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">DP yang Sudah Dibayar</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                - {dpPaid}
              </span>
            </div>
            <div className="pt-4 border-t border-dashed border-gray-200 dark:border-gray-700 mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-base font-bold text-gray-900 dark:text-white">Sisa Pembayaran</span>
                <span className="text-xl font-bold text-[#4338ca]">{remaining}</span>
              </div>
              <p className="text-xs text-right text-gray-500 dark:text-gray-400">Harga sudah termasuk pajak</p>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800 flex gap-2 items-start mt-2">
            <span className="material-icons-outlined text-blue-600 dark:text-blue-400 text-lg mt-0.5">info</span>
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              Pastikan melakukan pembayaran sebelum <span className="font-bold">{dueText}</span>{" "}
              untuk menghindari pembatalan otomatis.
            </p>
          </div>
          <Button
            className="w-full mt-4 bg-[#4338ca] hover:bg-indigo-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
            disabled
          >
            <span>Selesaikan Pelunasan</span>
            <span className="material-icons-outlined text-lg group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Button>
          <div className="text-center pt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Dengan membayar, Anda menyetujui{" "}
              <a className="text-[#4338ca] hover:underline" href="#">
                Syarat &amp; Ketentuan
              </a>{" "}
              BUMDes.
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
        <span className="material-icons-outlined text-base">lock</span>
        <span>Pembayaran Aman &amp; Terenkripsi SSL</span>
      </div>
    </div>
  );
}
