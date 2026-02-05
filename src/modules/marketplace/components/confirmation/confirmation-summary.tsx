/** @format */

import { CONFIRMATION_INFO } from "../../constants";

export function ConfirmationSummary() {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden text-left mb-10 max-w-2xl mx-auto">
      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">Dikirim ke</h3>
          <p className="font-bold text-gray-900 dark:text-white">{CONFIRMATION_INFO.shippingTo}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{CONFIRMATION_INFO.shippingAddress}</p>
        </div>
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">Estimasi Tiba</h3>
          <p className="font-bold text-gray-900 dark:text-white text-lg">{CONFIRMATION_INFO.arrivalEstimate}</p>
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            <span className="material-icons-outlined text-base">local_shipping</span>
            <span>{CONFIRMATION_INFO.courier}</span>
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">Total Pembayaran</h3>
          <p className="font-extrabold text-2xl text-[#4338ca] dark:text-indigo-400">{CONFIRMATION_INFO.totalPayment}</p>
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            <span className="material-icons-outlined text-base">credit_card</span>
            <span>{CONFIRMATION_INFO.paymentMethod}</span>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex items-start gap-3">
        <span className="material-icons-outlined text-blue-600 dark:text-blue-400 text-xl flex-shrink-0">info</span>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-snug">
          Silakan lakukan pembayaran ke Virtual Account BCA{" "}
          <span className="font-mono font-bold">{CONFIRMATION_INFO.vaNumber}</span> sebelum{" "}
          <span className="font-bold text-gray-900 dark:text-white">{CONFIRMATION_INFO.paymentDeadline}</span>.
        </p>
      </div>
    </div>
  );
}
