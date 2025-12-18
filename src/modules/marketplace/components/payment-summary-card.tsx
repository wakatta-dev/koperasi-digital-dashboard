/** @format */

import Link from "next/link";

import { PAYMENT_SUMMARY } from "../constants";

export function PaymentSummaryCard() {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:p-8 sticky top-28">
      <h2 className="font-bold text-xl text-gray-900 dark:text-white mb-6">Ringkasan Pesanan</h2>

      <div className="mb-6 flex -space-x-3 overflow-hidden py-2">
        {PAYMENT_SUMMARY.avatarImages.map((src, idx) => (
          <img
            key={src + idx}
            alt=""
            src={src}
            className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-gray-800 object-cover"
          />
        ))}
        <div className="h-10 w-10 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400">
          {PAYMENT_SUMMARY.extraCountLabel}
        </div>
      </div>

      <div className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-700">
        <SummaryRow label={PAYMENT_SUMMARY.totalItemsLabel} value={PAYMENT_SUMMARY.totalItemsValue} />
        <SummaryRow label={PAYMENT_SUMMARY.shippingLabel} value={PAYMENT_SUMMARY.shippingValue} />
        <SummaryRow label={PAYMENT_SUMMARY.serviceFeeLabel} value={PAYMENT_SUMMARY.serviceFeeValue} />
        <SummaryRow
          label={PAYMENT_SUMMARY.discountLabel}
          value={PAYMENT_SUMMARY.discountValue}
          valueClass="text-green-600 dark:text-green-400"
        />
      </div>

      <div className="py-6">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-lg text-gray-900 dark:text-white">{PAYMENT_SUMMARY.totalLabel}</span>
          <span className="font-extrabold text-2xl text-[#4338ca] dark:text-indigo-400">
            {PAYMENT_SUMMARY.totalValue}
          </span>
        </div>
      </div>

      <Link
        href="/marketplace/ulasan"
        className="w-full bg-[#4338ca] hover:bg-[#3730a3] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition flex items-center justify-center gap-2 group text-center"
      >
        Lanjutkan ke Ulasan Pesanan
        <span className="material-icons-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
      </Link>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
        <span className="material-icons-outlined text-base text-green-600">verified_user</span>
        {PAYMENT_SUMMARY.secureNote}
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <span className={`font-bold text-gray-900 dark:text-white ${valueClass ?? ""}`}>{value}</span>
    </div>
  );
}
