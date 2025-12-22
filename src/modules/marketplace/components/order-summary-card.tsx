/** @format */

import Link from "next/link";

import {
  CheckoutSummaryBase,
  type SummaryRow,
} from "@/components/shared/data-display/CheckoutSummaryBase";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/format";
import { CART_SUMMARY } from "../constants";

type Props = {
  subtotal?: number;
  total?: number;
  itemCount?: number;
};

export function OrderSummaryCard({ subtotal = 0, total = 0, itemCount = 0 }: Props) {
  const rows: SummaryRow[] = [
    { label: "Subtotal", value: formatCurrency(subtotal) ?? "-" },
    { label: "Biaya Pengiriman", value: "Belum dihitung" },
    { label: "Diskon", value: "Rp 0" },
  ];

  const headerSlot = (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        Estimasi Pengiriman
      </label>
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Input
            placeholder={CART_SUMMARY.shippingPlaceholder}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-sm pl-8 py-2 h-10 focus-visible:border-[#4338ca] focus-visible:ring-[#4338ca]/40"
          />
          <span className="material-icons-outlined absolute left-2.5 top-2.5 text-gray-400 text-base">
            location_on
          </span>
        </div>
        <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 rounded-lg text-sm font-bold transition">
          Cek
        </button>
      </div>
    </div>
  );

  const footerSlot = (
    <>
      <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
        {itemCount > 0 ? `${itemCount} item` : CART_SUMMARY.itemsCountLabel}
      </p>
      <Link
        href="/marketplace/pengiriman"
        className="w-full bg-[#4338ca] hover:bg-[#3730a3] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition flex items-center justify-center gap-2 group text-center"
      >
        Lanjutkan ke Pengiriman
        <span className="material-icons-outlined text-lg group-hover:translate-x-1 transition-transform">
          arrow_forward
        </span>
      </Link>
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
        <span className="material-icons-outlined text-base text-green-600">verified_user</span>
        {CART_SUMMARY.secureNote}
      </div>
    </>
  );

  return (
    <CheckoutSummaryBase
      title="Ringkasan Pesanan"
      rows={rows}
      total={{
        label: "Total Pembayaran",
        value: formatCurrency(total || subtotal) ?? "-",
      }}
      headerSlot={headerSlot}
      footerSlot={footerSlot}
      stickyTop={112}
    />
  );
}
