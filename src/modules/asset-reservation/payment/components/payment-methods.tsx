/** @format */

"use client";

import { useState } from "react";

import type { PaymentMode } from "../../types";
import { PAYMENT_METHOD_GROUPS } from "../constants";

type MethodGroup = (typeof PAYMENT_METHOD_GROUPS)[number];

type PaymentMethodsProps = {
  mode: PaymentMode;
  methodGroups?: MethodGroup[];
};

type PaymentStatus = "initiated" | "pending_verification" | "succeeded" | "failed";

export function PaymentMethods({
  mode,
  methodGroups = PAYMENT_METHOD_GROUPS,
}: PaymentMethodsProps) {
  const [selected, setSelected] = useState(methodGroups[0].options[0].value);
  const [status, setStatus] = useState<PaymentStatus>("initiated");
  const [proof, setProof] = useState<string | null>(null);

  return (
    <section className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-800">
        <span className="material-icons-outlined text-[#4338ca]">payments</span>
        {mode === "dp" ? "Pilih Metode Pembayaran DP" : "Pilih Metode Pelunasan"}
      </h2>
      <div className="space-y-4">
        {methodGroups.map((group) => (
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

      <div className="mt-6 space-y-3 bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
          <span className="material-icons-outlined text-[#4338ca]">verified</span>
          Status Pembayaran:{" "}
          <span
            className={
              status === "succeeded"
                ? "text-green-600 dark:text-green-400"
                : status === "pending_verification"
                ? "text-amber-600 dark:text-amber-400"
                : status === "failed"
                ? "text-red-600 dark:text-red-400"
                : "text-gray-700 dark:text-gray-300"
            }
          >
            {status === "initiated"
              ? "Menunggu tindakan"
              : status === "pending_verification"
              ? "Menunggu verifikasi"
              : status === "succeeded"
              ? "Berhasil"
              : "Gagal"}
          </span>
        </div>

        {selected.includes("bank_") ? (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Unggah bukti transfer (jpg/png/pdf)
            </label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setProof(file.name);
                  setStatus("pending_verification");
                }
              }}
              className="text-xs"
            />
            {proof ? (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Bukti diunggah: <strong>{proof}</strong> — menunggu verifikasi.
              </p>
            ) : null}
            <div className="flex gap-2">
              <button
                type="button"
                className="px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:border-[#4338ca] hover:text-[#4338ca]"
                onClick={() => setStatus("pending_verification")}
              >
                Tandai menunggu verifikasi
              </button>
              <button
                type="button"
                className="px-3 py-2 text-xs rounded-lg border border-green-500 bg-green-50 text-green-700 hover:bg-green-100"
                onClick={() => setStatus("succeeded")}
              >
                Verifikasi & konfirmasi
              </button>
              <button
                type="button"
                className="px-3 py-2 text-xs rounded-lg border border-red-500 bg-red-50 text-red-700 hover:bg-red-100"
                onClick={() => setStatus("failed")}
              >
                Tandai gagal
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              className="px-4 py-2 text-sm rounded-lg bg-[#4338ca] text-white font-semibold shadow hover:bg-indigo-600 transition"
              onClick={() => setStatus("succeeded")}
            >
              Bayar sekarang
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:border-[#4338ca] hover:text-[#4338ca]"
              onClick={() => setStatus("failed")}
            >
              Simulasikan gagal
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
