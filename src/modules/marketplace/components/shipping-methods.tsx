/** @format */

import { SHIPPING_OPTIONS } from "../constants";

export function ShippingMethods() {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 lg:p-8">
        <h2 className="font-bold text-xl text-gray-900 dark:text-white mb-6">Pilih Jasa Pengiriman</h2>
        <div className="space-y-4">
          {SHIPPING_OPTIONS.map((option) => (
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
                  name="shipping_method"
                  type="radio"
                />
              </div>
              <div className="ml-4 flex flex-1 justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="block font-bold text-gray-900 dark:text-white">{option.title}</span>
                    {option.recommended ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-bold text-green-700 dark:text-green-400">
                        Rekomendasi
                      </span>
                    ) : null}
                  </div>
                  <span className="block text-sm text-gray-500 mt-1">{option.subtitle}</span>
                </div>
                <span
                  className={`font-bold text-lg ${
                    option.free ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"
                  }`}
                >
                  {option.price}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
