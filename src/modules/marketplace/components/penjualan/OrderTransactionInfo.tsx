/** @format */

"use client";

import { Badge } from "@/components/ui/badge";

export type OrderTransactionInfoProps = Readonly<{
  paymentBrand: string;
  paymentMasked: string;
  paymentStatus: string;
  shippingCourier: string;
  trackingNumber?: string | null;
}>;

export function OrderTransactionInfo({
  paymentBrand,
  paymentMasked,
  paymentStatus,
  shippingCourier,
  trackingNumber,
}: OrderTransactionInfoProps) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden p-6">
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
            <span className="text-sm text-gray-900 dark:text-white font-medium">
              {paymentMasked}
            </span>
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
            <span className="text-sm text-gray-900 dark:text-white font-medium">
              {shippingCourier}
            </span>
            {trackingNumber ? (
              <span className="text-xs text-gray-500">(Resi: {trackingNumber})</span>
            ) : null}
          </div>
          <button className="text-xs text-indigo-600 hover:text-indigo-700 mt-1 block" type="button">
            Lacak Paket
          </button>
        </div>
      </div>
    </div>
  );
}
