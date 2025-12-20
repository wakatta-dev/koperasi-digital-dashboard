/** @format */

import Link from "next/link";

import {
  CheckoutSummaryBase,
  type SummaryRow,
} from "@/components/shared/data-display/CheckoutSummaryBase";
import { SHIPPING_SUMMARY } from "../constants";

export function ShippingSummaryCard() {
  const rows: SummaryRow[] = [
    { label: SHIPPING_SUMMARY.totalItemsLabel, value: SHIPPING_SUMMARY.totalItemsValue },
    { label: SHIPPING_SUMMARY.shippingLabel, value: SHIPPING_SUMMARY.shippingValue },
    { label: SHIPPING_SUMMARY.serviceFeeLabel, value: SHIPPING_SUMMARY.serviceFeeValue },
    {
      label: SHIPPING_SUMMARY.discountLabel,
      value: SHIPPING_SUMMARY.discountValue,
      valueClassName: "text-green-600 dark:text-green-400",
    },
  ];

  const headerSlot = (
    <div className="flex -space-x-3 overflow-hidden py-2">
      {SHIPPING_SUMMARY.avatarImages.map((src, idx) => (
        <img
          key={src + idx}
          alt=""
          src={src}
          className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-gray-800 object-cover"
        />
      ))}
      <div className="h-10 w-10 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400">
        {SHIPPING_SUMMARY.extraCountLabel}
      </div>
    </div>
  );

  const footerSlot = (
    <>
      <Link
        href="/marketplace/pembayaran"
        className="w-full bg-[#4338ca] hover:bg-[#3730a3] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition flex items-center justify-center gap-2 group text-center"
      >
        Lanjutkan ke Pembayaran
        <span className="material-icons-outlined text-lg group-hover:translate-x-1 transition-transform">
          arrow_forward
        </span>
      </Link>
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
        <span className="material-icons-outlined text-base text-green-600">verified_user</span>
        {SHIPPING_SUMMARY.secureNote}
      </div>
    </>
  );

  return (
    <CheckoutSummaryBase
      title="Ringkasan Pesanan"
      headerSlot={headerSlot}
      rows={rows}
      total={{ label: SHIPPING_SUMMARY.totalLabel, value: SHIPPING_SUMMARY.totalValue }}
      footerSlot={footerSlot}
      stickyTop={112}
    />
  );
}
