/** @format */

import Link from "next/link";

import {
  CheckoutSummaryBase,
  type SummaryRow,
} from "@/components/shared/data-display/CheckoutSummaryBase";
import { PAYMENT_SUMMARY } from "../constants";

export function PaymentSummaryCard() {
  const rows: SummaryRow[] = [
    { label: PAYMENT_SUMMARY.totalItemsLabel, value: PAYMENT_SUMMARY.totalItemsValue },
    { label: PAYMENT_SUMMARY.shippingLabel, value: PAYMENT_SUMMARY.shippingValue },
    { label: PAYMENT_SUMMARY.serviceFeeLabel, value: PAYMENT_SUMMARY.serviceFeeValue },
    {
      label: PAYMENT_SUMMARY.discountLabel,
      value: PAYMENT_SUMMARY.discountValue,
      valueClassName: "text-green-600 dark:text-green-400",
    },
  ];

  const headerSlot = (
    <div className="flex -space-x-3 overflow-hidden py-2">
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
  );

  const footerSlot = (
    <>
      <Link
        href="/marketplace/ulasan"
        className="w-full bg-[#4338ca] hover:bg-[#3730a3] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition flex items-center justify-center gap-2 group text-center"
      >
        Lanjutkan ke Ulasan Pesanan
        <span className="material-icons-outlined text-lg group-hover:translate-x-1 transition-transform">
          arrow_forward
        </span>
      </Link>
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
        <span className="material-icons-outlined text-base text-green-600">verified_user</span>
        {PAYMENT_SUMMARY.secureNote}
      </div>
    </>
  );

  return (
    <CheckoutSummaryBase
      title="Ringkasan Pesanan"
      headerSlot={headerSlot}
      rows={rows}
      total={{ label: PAYMENT_SUMMARY.totalLabel, value: PAYMENT_SUMMARY.totalValue }}
      footerSlot={footerSlot}
      stickyTop={112}
    />
  );
}
