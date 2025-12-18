/** @format */

import { REVIEW_PAYMENT } from "../constants";

export function ReviewPaymentCard() {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <span className="material-icons-outlined text-gray-400">payments</span>
            Metode Pembayaran
          </h2>
          <button className="text-[#4338ca] text-sm font-bold hover:underline transition">Ubah</button>
        </div>
        <div className="pl-8 border-l-2 border-gray-100 dark:border-gray-700 ml-2">
          <div className="flex items-center gap-4">
            <div className="h-10 w-16 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
              <img alt="Bank BRI" src={REVIEW_PAYMENT.logo} className="h-full object-contain" />
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">{REVIEW_PAYMENT.bankName}</p>
              <p className="text-sm text-gray-500">{REVIEW_PAYMENT.note}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
