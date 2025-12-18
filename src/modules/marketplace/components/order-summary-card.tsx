/** @format */

import Link from "next/link";

import { Input } from "@/components/ui/input";
import { CART_SUMMARY } from "../constants";

export function OrderSummaryCard() {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:p-8 sticky top-28">
      <h2 className="font-bold text-xl text-gray-900 dark:text-white mb-6">Ringkasan Pesanan</h2>

      <div className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">{CART_SUMMARY.subtotalLabel}</span>
          <span className="font-bold text-gray-900 dark:text-white">{CART_SUMMARY.subtotalValue}</span>
        </div>

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
              <span className="material-icons-outlined absolute left-2.5 top-2.5 text-gray-400 text-base">location_on</span>
            </div>
            <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 rounded-lg text-sm font-bold transition">
              Cek
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm pt-1">
          <span className="text-gray-600 dark:text-gray-400">{CART_SUMMARY.shippingLabel}</span>
          <span className="font-bold text-gray-900 dark:text-white">{CART_SUMMARY.shippingValue}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">{CART_SUMMARY.discountLabel}</span>
          <span className="font-bold text-green-600 dark:text-green-400">{CART_SUMMARY.discountValue}</span>
        </div>
      </div>

      <div className="py-6">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-lg text-gray-900 dark:text-white">{CART_SUMMARY.totalLabel}</span>
          <span className="font-extrabold text-2xl text-[#4338ca] dark:text-indigo-400">{CART_SUMMARY.totalValue}</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-right">{CART_SUMMARY.itemsCountLabel}</p>
      </div>

      <Link
        href="/marketplace/pengiriman"
        className="w-full bg-[#4338ca] hover:bg-[#3730a3] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition flex items-center justify-center gap-2 group text-center"
      >
        Lanjutkan ke Pengiriman
        <span className="material-icons-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
      </Link>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
        <span className="material-icons-outlined text-base text-green-600">verified_user</span>
        {CART_SUMMARY.secureNote}
      </div>
    </div>
  );
}
