/** @format */

"use client";

import { useState } from "react";

import { PAYMENT_METHOD_GROUPS } from "../constants";

export function PaymentMethods() {
  const [selected, setSelected] = useState(PAYMENT_METHOD_GROUPS[0].options[0].value);

  return (
    <section className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-800">
        <span className="material-icons-outlined text-[#4338ca]">payments</span>
        Pilih Metode Pembayaran
      </h2>
      <div className="space-y-4">
        {PAYMENT_METHOD_GROUPS.map((group) => (
          <div key={group.title} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <span className="material-icons-outlined text-gray-500 text-sm">{group.icon}</span>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">{group.title}</h3>
            </div>
            <div className="p-4 space-y-3">
              {group.options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-[#4338ca] hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition group"
                >
                  <input
                    className="form-radio h-4 w-4 text-[#4338ca] border-gray-300 focus:ring-[#4338ca]"
                    name="payment_method"
                    type="radio"
                    value={option.value}
                    checked={selected === option.value}
                    onChange={() => setSelected(option.value)}
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#4338ca]">
                        {option.label}
                      </span>
                      {option.badge ? (
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {option.badge}
                        </span>
                      ) : option.icon ? (
                        <span className="material-icons-outlined text-gray-400">{option.icon}</span>
                      ) : null}
                    </div>
                    {option.account ? (
                      <>
                        <p className="text-xs text-gray-500">{option.account}</p>
                        <p className="text-xs text-gray-500">{option.holder}</p>
                      </>
                    ) : null}
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
