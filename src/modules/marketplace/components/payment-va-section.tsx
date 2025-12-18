/** @format */

import { PAYMENT_BANK_LOGOS, PAYMENT_VA_OPTIONS } from "../constants";

export function PaymentVaSection() {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-bold text-xl text-gray-900 dark:text-white">Transfer Virtual Account</h2>
          <div className="flex gap-2 opacity-60">
            {PAYMENT_BANK_LOGOS.map((src, idx) => (
              <img key={src + idx} alt="Bank Logos" src={src} className="h-5 object-contain" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {PAYMENT_VA_OPTIONS.map((option) => (
            <label
              key={option.id}
              className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${
                option.recommended
                  ? "hover:bg-gray-50 dark:hover:bg-gray-800/50 border-[#4338ca] bg-indigo-50/20 dark:bg-indigo-900/10"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800/50 border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="flex items-center h-5">
                <input
                  defaultChecked={option.recommended}
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
                {option.badgeText ? (
                  <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                    {option.badgeText}
                  </span>
                ) : null}
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
