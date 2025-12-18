/** @format */

"use client";

import { useState } from "react";

import { REPAYMENT_METHOD_GROUPS } from "../constants";

export function RepaymentMethods() {
  const [selected, setSelected] = useState(REPAYMENT_METHOD_GROUPS[0].options[0].value);

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
        <h2 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
          <span className="material-icons-outlined text-[#4338ca]">payments</span>
          Metode Pembayaran
        </h2>
      </div>
      <div className="p-6 space-y-8">
        {REPAYMENT_METHOD_GROUPS.map((group) => (
          <div key={group.title} className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
              {group.title}
              {group.badge ? (
                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {group.badge}
                </span>
              ) : null}
            </h3>
            <div className={`grid ${group.title === "Transfer Bank Manual" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"} gap-4`}>
              {group.options.map((option) => {
                const isManual = option.account;
                const isQris = option.icon;
                const logo = option.logo;

                return (
                  <label
                    key={option.value}
                    className="relative flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-[#4338ca] dark:hover:border-[#4338ca] transition group"
                  >
                    <div className="flex items-start gap-4 flex-grow">
                      <div className="w-12 h-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded flex items-center justify-center">
                        {logo ? (
                          <span className={`font-bold text-xs ${logo === "BCA" ? "text-blue-600" : logo === "BRI" ? "text-blue-800" : "text-yellow-600"}`}>
                            {logo}
                          </span>
                        ) : isQris ? (
                          <span className="material-icons-outlined text-lg text-white bg-gray-900 rounded w-full h-full flex items-center justify-center">
                            {option.icon}
                          </span>
                        ) : (
                          <span className="text-red-700 font-bold text-[10px] w-full h-full flex items-center justify-center">JATIM</span>
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center w-full">
                          <span className="block text-sm font-bold text-gray-900 dark:text-white">
                            {option.label}
                          </span>
                          {!isManual ? (
                            <input
                              className="h-5 w-5 text-[#4338ca] border-gray-300 focus:ring-[#4338ca]"
                              name="payment_method"
                              type="radio"
                              checked={selected === option.value}
                              onChange={() => setSelected(option.value)}
                            />
                          ) : null}
                        </div>
                        {option.sub ? (
                          <span className="block text-xs text-gray-500 dark:text-gray-400">
                            {option.sub}
                          </span>
                        ) : null}
                        {isManual ? (
                          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-300">
                            <div className="flex justify-between items-center mb-1">
                              <span>No. Rekening:</span>
                              <span className="font-mono font-bold text-gray-900 dark:text-white">
                                {option.account}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Atas Nama:</span>
                              <span className="font-medium">{option.holder}</span>
                            </div>
                            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-amber-600 dark:text-amber-400 flex items-center gap-1">
                              <span className="material-icons-outlined text-sm">info</span>
                              {option.note}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    {isManual ? (
                      <div className="flex items-center">
                        <input
                          className="h-5 w-5 text-[#4338ca] border-gray-300 focus:ring-[#4338ca]"
                          name="payment_method"
                          type="radio"
                          checked={selected === option.value}
                          onChange={() => setSelected(option.value)}
                        />
                      </div>
                    ) : null}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
