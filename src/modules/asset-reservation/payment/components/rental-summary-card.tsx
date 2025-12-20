/** @format */

import type { ReservationSummary } from "../../types";
import { humanizeReservationStatus } from "../../utils/status";

type RentalSummaryCardProps = {
  reservation: ReservationSummary;
};

export function RentalSummaryCard({ reservation }: RentalSummaryCardProps) {
  const startDate = reservation.startDate
    ? new Date(reservation.startDate).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";
  const endDate = reservation.endDate
    ? new Date(reservation.endDate).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

  return (
    <section className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4338ca] to-indigo-400" />
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-800">
        <span className="material-icons-outlined text-[#4338ca]">receipt_long</span>
        Ringkasan Sewa
      </h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Aset yang Disewa
            </p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {reservation.assetName || "Aset tanpa nama"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Status: {humanizeReservationStatus(reservation.status)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Mulai Sewa</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{startDate}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">00:00</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Selesai Sewa</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{endDate}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">23:59</p>
            </div>
          </div>
        </div>
        <div className="md:w-1/3 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl p-5 border border-indigo-100 dark:border-indigo-800/30 flex flex-col justify-center">
          <div className="mb-4">
            <p className="text-xs text-indigo-600 dark:text-indigo-300 font-medium mb-1">Total Biaya Sewa</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              Rp{reservation.amounts.total.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="mb-2">
            <p className="text-xs text-indigo-600 dark:text-indigo-300 font-medium mb-1">
              Pembayaran DP (30%)
            </p>
            <p className="text-2xl font-extrabold text-[#4338ca]">
              Rp{reservation.amounts.dp.toLocaleString("id-ID")}
            </p>
          </div>
          <p className="text-[10px] text-indigo-500 dark:text-indigo-400 leading-tight">
            DP wajib dibayar untuk mengunci jadwal. Pelunasan paling lambat H-3 sebelum penggunaan.
          </p>
        </div>
      </div>
    </section>
  );
}
