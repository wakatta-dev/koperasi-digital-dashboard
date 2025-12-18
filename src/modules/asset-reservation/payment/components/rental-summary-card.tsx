/** @format */

import { PAYMENT_SUMMARY } from "../constants";

export function RentalSummaryCard() {
  return (
    <section className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4338ca] to-indigo-400" />
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-800">
        <span className="material-icons-outlined text-[#4338ca]">receipt_long</span>
        Ringkasan Sewa
      </h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Aset yang Disewa
            </p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {PAYMENT_SUMMARY.assetName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{PAYMENT_SUMMARY.assetAddress}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Mulai Sewa</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{PAYMENT_SUMMARY.startDate}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{PAYMENT_SUMMARY.startTime}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Selesai Sewa</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{PAYMENT_SUMMARY.endDate}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{PAYMENT_SUMMARY.endTime}</p>
            </div>
          </div>
        </div>
        <div className="md:w-1/3 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl p-5 border border-indigo-100 dark:border-indigo-800/30 flex flex-col justify-center">
          <div className="mb-4">
            <p className="text-xs text-indigo-600 dark:text-indigo-300 font-medium mb-1">Total Biaya Sewa</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{PAYMENT_SUMMARY.totalCost}</p>
          </div>
          <div className="mb-2">
            <p className="text-xs text-indigo-600 dark:text-indigo-300 font-medium mb-1">
              {PAYMENT_SUMMARY.dpLabel}
            </p>
            <p className="text-2xl font-extrabold text-[#4338ca]">{PAYMENT_SUMMARY.dpAmount}</p>
          </div>
          <p className="text-[10px] text-indigo-500 dark:text-indigo-400 leading-tight">{PAYMENT_SUMMARY.dpNote}</p>
        </div>
      </div>
    </section>
  );
}
