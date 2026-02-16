/** @format */

"use client";

import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";

export type OrderTransactionInfoProps = Readonly<{
  paymentBrand: string;
  paymentMasked: string;
  paymentStatus: string;
  shippingCourier: string;
  trackingNumber?: string | null;
  guestTrackingEnabled?: boolean;
  trackingToken?: string | null;
  reviewState?: "not_eligible" | "eligible" | "submitted";
  reviewSubmittedAt?: number;
  manualPaymentProofUrl?: string;
  manualPaymentNote?: string;
  manualPaymentBankName?: string;
  manualPaymentAccountName?: string;
  manualPaymentTransferAmount?: number;
  manualPaymentTransferDate?: string;
}>;

const REVIEW_STATE_LABELS: Record<"not_eligible" | "eligible" | "submitted", string> = {
  not_eligible: "Belum Dapat Direview",
  eligible: "Menunggu Ulasan",
  submitted: "Ulasan Terkirim",
};

function formatSubmittedAt(unixTimestamp?: number) {
  if (!unixTimestamp) return "-";
  const date = new Date(unixTimestamp * 1000);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrderTransactionInfo({
  paymentBrand,
  paymentMasked,
  paymentStatus,
  shippingCourier,
  trackingNumber,
  guestTrackingEnabled,
  trackingToken,
  reviewState,
  reviewSubmittedAt,
  manualPaymentProofUrl,
  manualPaymentNote,
  manualPaymentBankName,
  manualPaymentAccountName,
  manualPaymentTransferAmount,
  manualPaymentTransferDate,
}: OrderTransactionInfoProps) {
  return (
    <div className="surface-table p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Informasi Transaksi</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Metode Pembayaran
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-6 bg-white border border-gray-200 rounded px-1 flex items-center justify-center">
              <span className="text-[10px] font-bold text-blue-800">{paymentBrand}</span>
            </div>
            <span className="text-sm text-gray-900 dark:text-white font-medium">{paymentMasked}</span>
            <Badge className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
              {paymentStatus}
            </Badge>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Kurir Pengiriman
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-900 dark:text-white font-medium">{shippingCourier}</span>
            {trackingNumber ? <span className="text-xs text-gray-500">(Resi: {trackingNumber})</span> : null}
          </div>
          <button className="text-xs text-indigo-600 hover:text-indigo-700 mt-1 block" type="button">
            Lacak Paket
          </button>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Akses Tracking Tamu</p>
          <p className="text-gray-900 dark:text-white mt-1">
            {guestTrackingEnabled ? "Aktif" : "Tidak Aktif"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Token Tracking</p>
          <p className="text-gray-900 dark:text-white mt-1 break-all">{trackingToken || "-"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status Review</p>
          <p className="text-gray-900 dark:text-white mt-1">
            {reviewState ? REVIEW_STATE_LABELS[reviewState] : "-"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Review Terkirim</p>
          <p className="text-gray-900 dark:text-white mt-1">{formatSubmittedAt(reviewSubmittedAt)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Bukti Pembayaran</p>
          {manualPaymentProofUrl ? (
            <a
              className="mt-1 inline-flex text-indigo-600 hover:text-indigo-700 underline"
              href={manualPaymentProofUrl}
              target="_blank"
              rel="noreferrer"
            >
              Lihat Bukti
            </a>
          ) : (
            <p className="text-gray-900 dark:text-white mt-1">-</p>
          )}
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Bank / Rekening</p>
          <p className="text-gray-900 dark:text-white mt-1">
            {manualPaymentBankName || "-"}
            {manualPaymentAccountName ? ` (${manualPaymentAccountName})` : ""}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nominal Transfer</p>
          <p className="text-gray-900 dark:text-white mt-1">
            {typeof manualPaymentTransferAmount === "number"
              ? formatCurrency(manualPaymentTransferAmount)
              : "-"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal Transfer</p>
          <p className="text-gray-900 dark:text-white mt-1">{manualPaymentTransferDate || "-"}</p>
        </div>
      </div>

      {manualPaymentNote ? (
        <div className="mt-4 rounded-md bg-gray-50 dark:bg-gray-800/60 p-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Catatan Pembayaran</p>
          <p className="text-sm text-gray-900 dark:text-white mt-1">{manualPaymentNote}</p>
        </div>
      ) : null}
    </div>
  );
}
