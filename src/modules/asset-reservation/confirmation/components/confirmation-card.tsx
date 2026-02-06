/** @format */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { humanizeReservationStatus } from "../../utils/status";
import type { ReservationSummary } from "../../types";

type ConfirmationCardProps = {
  reservation: ReservationSummary;
};

export function ConfirmationCard({ reservation }: ConfirmationCardProps) {
  const statusLabel = humanizeReservationStatus(reservation.status);
  const isConfirmed =
    reservation.status === "confirmed_full" || reservation.status === "confirmed_dp";
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
  const paymentTotal =
    typeof reservation.amounts?.dp === "number"
      ? `Rp${reservation.amounts.dp.toLocaleString("id-ID")}`
      : "Tidak tersedia";

  return (
    <div className="bg-white dark:bg-surface-card-dark rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-400" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-50 dark:bg-green-900/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="relative mb-8">
        <div className="inline-flex items-center justify-center p-6 bg-green-50 dark:bg-green-900/20 rounded-full mb-2 ring-1 ring-green-100 dark:ring-green-800">
          <span className="material-icons-outlined text-6xl md:text-8xl text-emerald-500 animate-[bounce_1s_ease-in-out_1]">
            check_circle
          </span>
        </div>
      </div>

      <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">
        {isConfirmed ? "Pembayaran Berhasil Dikonfirmasi!" : "Konfirmasi Reservasi"}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed">
        {isConfirmed
          ? "Reservasi aset Anda telah aktif. Detail pembayaran dapat dilihat pada halaman status."
          : "Status reservasi Anda akan diperbarui setelah pembayaran dikonfirmasi."}
      </p>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-dashed border-gray-300 dark:border-gray-600 mb-8 max-w-md mx-auto relative group">
        <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold mb-2">
          Nomor Reservasi Anda
        </p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-xl md:text-2xl font-mono font-bold text-brand-primary dark:text-indigo-400">
            {reservation.reservationId}
          </span>
          <button
            className="text-gray-400 hover:text-brand-primary transition"
            type="button"
            title="Salin Kode"
          >
            <span className="material-icons-outlined text-lg">content_copy</span>
          </button>
        </div>
      </div>

      <div className="text-left bg-gray-50 dark:bg-gray-800/30 rounded-2xl p-6 mb-10 border border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="material-icons-outlined text-brand-primary text-lg">receipt_long</span>
          Ringkasan Reservasi
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Aset</p>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">
              {reservation.assetName || "Aset belum tersedia"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tanggal Sewa</p>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">
              {dateRange}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Pembayaran (DP)</p>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">
              {paymentTotal}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
            <p className="font-semibold text-emerald-500 text-sm flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              {statusLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <Button
          asChild
          className="w-full md:w-auto px-8 py-3.5 bg-brand-primary hover:bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition transform active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Link href="/penyewaan-aset/status">
            <span className="material-icons-outlined">calendar_month</span>
            Lihat Reservasi Saya
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="w-full md:w-auto px-8 py-3.5 bg-white dark:bg-transparent border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-semibold transition flex items-center justify-center gap-2"
        >
          <Link href="/">Kembali ke Beranda</Link>
        </Button>
      </div>

      <div className="mt-8">
        <Link
          className="text-sm text-brand-primary hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium hover:underline inline-flex items-center gap-1"
          href="/penyewaan-aset"
        >
          <span className="material-icons-outlined text-base">arrow_back</span>
          Kembali ke Halaman Aset
        </Link>
      </div>
    </div>
  );
}
