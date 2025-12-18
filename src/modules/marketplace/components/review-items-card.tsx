/** @format */

import { REVIEW_ITEMS } from "../constants";

export function ReviewItemsCard() {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <span className="material-icons-outlined text-gray-400">shopping_bag</span>
            Rincian Barang
          </h2>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            3 Barang
          </span>
        </div>

        <div className="space-y-6">
          {REVIEW_ITEMS.map((item, index) => (
            <div
              key={item.id}
              className={`${index > 0 ? "pt-6 border-t border-gray-100 dark:border-gray-800" : ""} flex gap-4`}
            >
              {item.image ? (
                <img
                  alt={item.title}
                  src={item.image}
                  className="w-20 h-20 rounded-xl object-cover border border-gray-100 dark:border-gray-800 bg-gray-50"
                />
              ) : (
                <div
                  className={`w-20 h-20 rounded-xl flex items-center justify-center ${item.iconBg ?? ""}`}
                >
                  <span className="material-icons-outlined text-3xl">{item.icon}</span>
                </div>
              )}

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.subtitle}</p>
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white">{item.price}</p>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                  <button className="text-[#4338ca] text-xs font-semibold hover:underline">Edit</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
