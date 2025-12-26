/** @format */

import type { ReservationSummary } from "../../types";

type RepaymentSummaryCardProps = {
  reservation: ReservationSummary;
};

export function RepaymentSummaryCard({ reservation }: RepaymentSummaryCardProps) {
  const dateRange =
    reservation.startDate && reservation.endDate
      ? `${new Date(reservation.startDate).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })} - ${new Date(reservation.endDate).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}`
      : "Tanggal belum tersedia";
  const durationLabel = (() => {
    if (!reservation.startDate || !reservation.endDate) return "Durasi belum tersedia";
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return "Durasi belum tersedia";
    }
    const diffMs = Math.max(0, end.getTime() - start.getTime());
    const diffDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    return `${diffDays} Hari`;
  })();
  const totalCost =
    typeof reservation.amounts?.total === "number"
      ? `Rp${reservation.amounts.total.toLocaleString("id-ID")}`
      : "-";
  const dpPaid =
    typeof reservation.amounts?.dp === "number"
      ? `Rp${reservation.amounts.dp.toLocaleString("id-ID")}`
      : "-";
  const remaining =
    typeof reservation.amounts?.remaining === "number"
      ? `Rp${reservation.amounts.remaining.toLocaleString("id-ID")}`
      : "-";

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 flex justify-between items-center">
        <h2 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
          <span className="material-icons-outlined text-[#4338ca]">apartment</span>
          Ringkasan Sewa Aset
        </h2>
        <span className="text-xs font-mono bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 px-2 py-1 rounded border border-indigo-100 dark:border-indigo-800">
          {reservation.reservationId}
        </span>
      </div>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          <div className="w-full sm:w-32 flex-shrink-0">
            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-sm relative group bg-gray-100">
              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400 dark:text-gray-500">
                Tidak ada foto
              </div>
            </div>
          </div>
          <div className="flex-grow space-y-2">
            <div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                {reservation.assetName || "Aset belum tersedia"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                <span className="material-icons-outlined text-base">location_on</span>
                Lokasi belum tersedia
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700">
                <span className="material-icons-outlined text-lg text-indigo-500">calendar_month</span>
                <span className="font-medium">{dateRange}</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700">
                <span className="material-icons-outlined text-lg text-indigo-500">schedule</span>
                <span className="font-medium">{durationLabel}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Biaya Sewa</p>
            <p className="font-bold text-gray-900 dark:text-white text-lg">{totalCost}</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-4 border border-emerald-100 dark:border-emerald-900/30">
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
              <span className="material-icons-outlined text-sm">check_circle</span>
              DP Dibayar
            </p>
            <p className="font-bold text-emerald-700 dark:text-emerald-300 text-lg">{dpPaid}</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-4 border border-amber-100 dark:border-amber-900/30 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-16 h-16 bg-amber-500/10 rounded-bl-full -mr-4 -mt-4" />
            <p className="text-xs text-amber-700 dark:text-amber-400 mb-1 font-semibold">Sisa Pembayaran</p>
            <p className="font-bold text-amber-700 dark:text-amber-400 text-xl">{remaining}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
