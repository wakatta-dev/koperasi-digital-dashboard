/** @format */

import { Button } from "@/components/ui/button";
import type { ReservationSummary } from "../../types";
import { formatPublicReservationIdentifier } from "../../guest/utils/public-status";

type PaymentSidebarProps = {
  reservation: ReservationSummary;
  sessionAmount?: number;
  sessionPayBy?: string;
  ownershipToken?: string;
};

export function PaymentSidebar({
  reservation,
  sessionAmount,
  sessionPayBy,
  ownershipToken,
}: PaymentSidebarProps) {
  const serviceFee = 2500;
  const dpDue = sessionAmount ?? reservation.amounts.dp;
  const remaining = reservation.amounts.remaining;
  const total = reservation.amounts.total;
  const dueText = sessionPayBy
    ? `Bayar sebelum ${new Date(sessionPayBy).toLocaleString("id-ID")}`
    : "Segera selesaikan pembayaran sebelum batas waktu yang ditentukan.";
  const confirmationHref =
    reservation.reservationId
      ? `/penyewaan-aset/status/${encodeURIComponent(String(reservation.reservationId))}${
          ownershipToken ? `?sig=${encodeURIComponent(ownershipToken)}` : ""
        }`
      : null;
  const statusButtonLabel =
    reservation.status === "awaiting_payment_verification"
      ? "Lihat Status Verifikasi"
      : "Lihat Status Pengajuan";

  return (
    <div className="bg-white dark:bg-surface-card-dark rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl sticky top-24 overflow-hidden ring-1 ring-gray-900/5">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
        <h3 className="font-bold text-gray-900 dark:text-white text-lg">Ringkasan Pembayaran</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Nomor Tiket: {formatPublicReservationIdentifier(reservation.reservationId)}
        </p>
      </div>
      <div className="p-6">
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Total Biaya Sewa</span>
            <span className="font-medium text-gray-900 dark:text-white">
              Rp{total.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Biaya Layanan</span>
            <span className="font-medium text-gray-900 dark:text-white">
              Rp{serviceFee.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="pt-3 border-t border-dashed border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">DP yang Harus Dibayar</span>
              <span className="font-bold text-brand-primary text-xl">
                Rp{(dpDue + serviceFee).toLocaleString("id-ID")}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-right italic">
              (Termasuk biaya layanan)
            </p>
          </div>
          <div className="flex justify-between text-xs text-gray-500 pt-2">
            <span>Sisa Pembayaran (Pelunasan)</span>
            <span className="font-medium">Rp{remaining.toLocaleString("id-ID")}</span>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-xs text-amber-800 dark:text-amber-200 flex gap-2">
            <span className="material-icons-outlined text-sm">schedule</span>
            <div>
              <p className="font-semibold">Batas waktu</p>
              <p>{dueText}</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-6 border border-blue-100 dark:border-blue-800/30 flex gap-3">
          <span className="material-icons-outlined text-blue-600 dark:text-blue-400 text-xl flex-shrink-0">security</span>
          <p className="text-xs text-blue-800 dark:text-blue-300 leading-tight">
            Pembayaran Anda aman dan terenkripsi. Dana akan diteruskan ke BUMDes setelah dikonfirmasi.
          </p>
        </div>
        <div className="mb-6 rounded-xl border border-indigo-100 dark:border-indigo-800/60 bg-gradient-to-br from-indigo-50 via-white to-sky-50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-sky-950/30 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md shadow-indigo-500/30">
              <span className="material-icons-outlined text-[18px]">flag</span>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Langkah terakhir di halaman ini
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  Selesaikan transfer lalu unggah bukti pembayaran pada panel metode pembayaran di sebelah kiri.
                </p>
              </div>
              <div className="space-y-2 text-xs text-slate-700 dark:text-slate-200">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white dark:bg-white dark:text-slate-900">
                    1
                  </span>
                  Transfer sesuai nominal dan metode yang dipilih.
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white dark:bg-white dark:text-slate-900">
                    2
                  </span>
                  Unggah bukti pembayaran agar admin bisa memverifikasi.
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white dark:bg-white dark:text-slate-900">
                    3
                  </span>
                  Gunakan tombol di bawah untuk memantau status pengajuan.
                </div>
              </div>
            </div>
          </div>
        </div>
        <Button
          className="w-full border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-950 text-indigo-700 dark:text-indigo-100 py-4 rounded-xl font-bold shadow-md shadow-indigo-500/10 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition transform active:scale-[0.98] flex items-center justify-center gap-2 group"
          disabled={!confirmationHref}
          asChild={Boolean(confirmationHref)}
        >
          {confirmationHref ? (
            <a href={confirmationHref}>
              <span
                aria-hidden="true"
                className="material-icons-outlined group-hover:scale-110 transition"
              >
                query_stats
              </span>
              {statusButtonLabel}
            </a>
          ) : (
            <>
              <span
                aria-hidden="true"
                className="material-icons-outlined group-hover:scale-110 transition"
              >
                query_stats
              </span>
              {statusButtonLabel}
            </>
          )}
        </Button>
        <p className="mt-3 text-center text-xs leading-relaxed text-gray-500 dark:text-gray-400">
          Tombol ini tidak mengirim bukti pembayaran. Pengiriman bukti dilakukan dari form upload di panel metode pembayaran.
        </p>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Dengan membayar, Anda menyetujui{" "}
          <a className="text-brand-primary hover:underline" href="#">
            Syarat &amp; Ketentuan
          </a>{" "}
          sewa aset BUMDes Sukamaju.
        </p>
      </div>
    </div>
  );
}
