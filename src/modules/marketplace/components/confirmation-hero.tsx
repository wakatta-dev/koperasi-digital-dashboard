/** @format */

import { CONFIRMATION_INFO } from "../constants";

export function ConfirmationHero() {
  return (
    <div className="text-center">
      <div className="mb-8 relative inline-block">
        <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full animate-ping opacity-75"></div>
        <div className="relative rounded-full bg-green-100 dark:bg-green-900/30 p-6 ring-8 ring-green-50 dark:ring-green-900/10">
          <span className="material-icons-outlined text-6xl text-green-600 dark:text-green-400" style={{ fontSize: 64 }}>
            check_circle
          </span>
        </div>
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
        {CONFIRMATION_INFO.thankYouTitle}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
        {CONFIRMATION_INFO.thankYouDescription}
      </p>
      <div className="inline-flex items-center justify-center gap-2 bg-white dark:bg-[#1e293b] px-5 py-2.5 rounded-full mb-12 shadow-sm border border-gray-200 dark:border-gray-700 group cursor-pointer transition hover:border-[#4338ca]/50">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Nomor Pesanan</span>
        <span className="text-base font-bold text-[#4338ca] dark:text-indigo-400">{CONFIRMATION_INFO.orderNumber}</span>
        <span className="material-icons-outlined text-gray-400 group-hover:text-[#4338ca] text-sm transition">
          content_copy
        </span>
      </div>
    </div>
  );
}
