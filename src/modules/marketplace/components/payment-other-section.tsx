/** @format */

import { PAYMENT_OTHER_OPTIONS } from "../constants";

export function PaymentOtherSection() {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 lg:p-8">
        <h2 className="font-bold text-xl text-gray-900 dark:text-white mb-6">E-Wallet &amp; Lainnya</h2>
        <div className="space-y-4">
          {PAYMENT_OTHER_OPTIONS.map((option) => (
            <label
              key={option.id}
              className="relative flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center h-5">
                <input
                  className="h-5 w-5 text-[#4338ca] border-gray-300 focus:ring-[#4338ca]"
                  name="payment_method"
                  type="radio"
                />
              </div>
              <div className="ml-4 flex flex-1 justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`${option.bgColor ?? ""} p-2 rounded-lg`}>
                    <span className={`material-icons-outlined ${option.iconColor ?? ""}`}>{option.icon}</span>
                  </div>
                  <div>
                    <span className="block font-bold text-gray-900 dark:text-white">{option.title}</span>
                    <span className="block text-sm text-gray-500 mt-1">{option.subtitle}</span>
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
