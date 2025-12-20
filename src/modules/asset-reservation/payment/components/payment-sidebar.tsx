/** @format */

import { Button } from "@/components/ui/button";
import { PAYMENT_BREADCRUMB } from "../constants";
import type { ReservationSummary } from "../../types";

type PaymentSidebarProps = {
  reservation: ReservationSummary;
  sessionAmount?: number;
  sessionPayBy?: string;
};

export function PaymentSidebar({ reservation, sessionAmount, sessionPayBy }: PaymentSidebarProps) {
  const serviceFee = 2500;
  const dpDue = sessionAmount ?? reservation.amounts.dp;
  const remaining = reservation.amounts.remaining;
  const total = reservation.amounts.total;
  const dueText = sessionPayBy
    ? `Bayar sebelum ${new Date(sessionPayBy).toLocaleString("id-ID")}`
    : "Segera selesaikan pembayaran sebelum batas waktu yang ditentukan.";
  const confirmationSig = process.env.NEXT_PUBLIC_RESERVATION_SIG || "secure-token";
  const confirmationHref = `/penyewaan-aset/status-reservasi?state=done&id=${encodeURIComponent(
    reservation.reservationId
  )}&sig=${encodeURIComponent(confirmationSig)}`;

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl sticky top-24 overflow-hidden ring-1 ring-gray-900/5">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
        <h3 className="font-bold text-gray-900 dark:text-white text-lg">Ringkasan Pembayaran</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          ID Reservasi: #{reservation.reservationId}
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
              <span className="font-bold text-[#4338ca] text-xl">
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
        <Button
          className="w-full bg-[#4338ca] hover:bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition transform active:scale-[0.98] flex items-center justify-center gap-2 group"
          asChild
        >
          <a href={confirmationHref}>
            <span className="material-icons-outlined group-hover:scale-110 transition">lock</span>
            Selesaikan Pembayaran
          </a>
        </Button>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Dengan membayar, Anda menyetujui{" "}
          <a className="text-[#4338ca] hover:underline" href="#">
            Syarat &amp; Ketentuan
          </a>{" "}
          sewa aset BUMDes Sukamaju.
        </p>
      </div>
    </div>
  );
}
