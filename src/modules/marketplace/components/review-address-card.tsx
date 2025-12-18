/** @format */

import { REVIEW_ADDRESS } from "../constants";

export function ReviewAddressCard() {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <span className="material-icons-outlined text-gray-400">local_shipping</span>
            Alamat Pengiriman
          </h2>
          <button className="text-[#4338ca] text-sm font-bold hover:underline transition">Ubah</button>
        </div>
        <div className="pl-8 border-l-2 border-gray-100 dark:border-gray-700 ml-2">
          <p className="font-bold text-gray-900 dark:text-white">
            {REVIEW_ADDRESS.name}{" "}
            <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-2">({REVIEW_ADDRESS.label})</span>
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{REVIEW_ADDRESS.addressLine1}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{REVIEW_ADDRESS.addressLine2}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">{REVIEW_ADDRESS.phone}</p>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-800">
              {REVIEW_ADDRESS.courierTag}
            </span>
            <span className="text-xs text-gray-500">{REVIEW_ADDRESS.courierEta}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
