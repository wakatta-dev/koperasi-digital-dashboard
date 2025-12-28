/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";

import type { PaymentMode } from "../../types";
import { createPaymentSession, finalizePayment } from "@/services/api/reservations";
import type { PaymentSession } from "../../types";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type PaymentOption = {
  value: string;
  label: string;
  badge?: string;
  icon?: string;
  account?: string;
  holder?: string;
};

type MethodGroup = {
  title: string;
  icon: string;
  options: ReadonlyArray<PaymentOption>;
};

type PaymentMethodsProps = {
  mode: PaymentMode;
  methodGroups?: ReadonlyArray<MethodGroup>;
  reservationId?: string;
  onStatusChange?: (payload: { paymentId: string; status: PaymentStatus }) => void;
  onSessionChange?: (session: PaymentSession | null) => void;
};

type PaymentStatus = "initiated" | "pending_verification" | "succeeded" | "failed" | "expired";

export function PaymentMethods({
  mode,
  methodGroups,
  reservationId,
  onStatusChange,
  onSessionChange,
}: PaymentMethodsProps) {
  const hasMethods = Boolean(methodGroups && methodGroups.length > 0);
  const [selected, setSelected] = useState<string>(() => methodGroups?.[0]?.options?.[0]?.value ?? "");
  const [status, setStatus] = useState<PaymentStatus>("initiated");
  const [proof, setProof] = useState<string | null>(null);
  const [session, setSession] = useState<PaymentSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const actionsDisabled = !hasMethods || !reservationId;

  const payByText = useMemo(() => {
    if (!session?.payBy) return null;
    return new Date(session.payBy).toLocaleString("id-ID");
  }, [session?.payBy]);

  const formattedAmount = useMemo(() => {
    if (!session?.amount) return null;
    return `Rp${session.amount.toLocaleString("id-ID")}`;
  }, [session?.amount]);

  const handleStatusUpdate = (next: PaymentStatus) => {
    setStatus(next);
    if (session?.paymentId) {
      onStatusChange?.({ paymentId: session.paymentId, status: next });
    }
  };

  useEffect(() => {
    let ignore = false;
    async function bootstrapSession(methodValue: string) {
      if (!hasMethods || !methodValue) {
        setSession(null);
        setSessionError("Metode pembayaran belum tersedia.");
        return;
      }
      if (!reservationId) {
        setSessionError("ID reservasi wajib diisi sebelum membuat sesi pembayaran.");
        return;
      }
      setIsLoading(true);
      setSessionError(null);
      try {
        const res = await createPaymentSession({
          reservation_id: reservationId,
          type: mode,
          method: methodValue,
        });
        if (ignore) return;
        if (res.success && res.data) {
          setSession({
            paymentId: res.data.payment_id,
            reservationId: res.data.reservation_id,
            amount: res.data.amount,
            type: res.data.type,
            method: res.data.method,
            payBy: res.data.pay_by,
            status: res.data.status,
          });
          setStatus(res.data.status as PaymentStatus);
          onSessionChange?.({
            paymentId: res.data.payment_id,
            reservationId: res.data.reservation_id,
            amount: res.data.amount,
            type: res.data.type as PaymentMode,
            method: res.data.method,
            payBy: res.data.pay_by,
            status: res.data.status as PaymentStatus,
          });
        } else {
          setSessionError(res.message || "Tidak dapat membuat sesi pembayaran");
          onSessionChange?.(null);
        }
      } catch (err) {
        if (!ignore) {
          setSessionError(err instanceof Error ? err.message : "Gagal membuat sesi pembayaran");
          onSessionChange?.(null);
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }
    bootstrapSession(selected);
    return () => {
      ignore = true;
    };
  }, [mode, reservationId, selected, hasMethods]);

  return (
    <section className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-800">
        <span className="material-icons-outlined text-[#4338ca]">payments</span>
        {mode === "dp" ? "Pilih Metode Pembayaran DP" : "Pilih Metode Pelunasan"}
      </h2>
      {!hasMethods ? (
        <div className="mb-4 text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
          Metode pembayaran belum tersedia.
        </div>
      ) : null}
      {formattedAmount ? (
        <div className="mb-4 text-sm text-gray-700 dark:text-gray-300 flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg px-4 py-3">
          <div className="flex flex-col">
            <span className="font-semibold">Jumlah yang harus dibayar</span>
            {payByText ? (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Bayar sebelum: {payByText}
              </span>
            ) : null}
          </div>
          <span className="text-base font-bold text-[#4338ca]">{formattedAmount}</span>
        </div>
      ) : null}
      {sessionError ? (
        <div className="mb-4 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          {sessionError}
        </div>
      ) : null}
      {hasMethods ? (
        <RadioGroup value={selected} onValueChange={setSelected} className="space-y-4">
          {methodGroups?.map((group) => (
            <div key={group.title} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <span className="material-icons-outlined text-gray-500 text-sm">{group.icon}</span>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{group.title}</h3>
              </div>
              <div className="p-4 space-y-3">
                {group.options.map((option) => {
                  const id = `payment-${option.value.replace(/\s+/g, "-")}`;
                  return (
                    <Label
                      key={option.value}
                      htmlFor={id}
                      className="flex w-full items-center gap-0 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-[#4338ca] hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition group"
                    >
                      <RadioGroupItem value={option.value} id={id} />
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
                    </Label>
                  );
                })}
              </div>
            </div>
          ))}
        </RadioGroup>
      ) : null}

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
                : status === "failed" || status === "expired"
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
              : status === "expired"
              ? "Kedaluwarsa"
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
                  handleStatusUpdate("pending_verification");
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
                onClick={() => handleStatusUpdate("pending_verification")}
                disabled={actionsDisabled}
              >
                Tandai menunggu verifikasi
              </button>
              <button
                type="button"
                className="px-3 py-2 text-xs rounded-lg border border-green-500 bg-green-50 text-green-700 hover:bg-green-100"
                onClick={async () => {
                  if (session?.paymentId) {
                    const res = await finalizePayment(session.paymentId, "succeeded");
                    if (res.success && res.data) {
                      handleStatusUpdate(res.data.status as PaymentStatus);
                      return;
                    }
                  }
                  handleStatusUpdate("succeeded");
                }}
                disabled={actionsDisabled}
              >
                Verifikasi & konfirmasi
              </button>
              <button
                type="button"
                className="px-3 py-2 text-xs rounded-lg border border-red-500 bg-red-50 text-red-700 hover:bg-red-100"
                onClick={async () => {
                  if (session?.paymentId) {
                    const res = await finalizePayment(session.paymentId, "failed");
                    if (res.success && res.data) {
                      handleStatusUpdate(res.data.status as PaymentStatus);
                      return;
                    }
                  }
                  handleStatusUpdate("failed");
                }}
                disabled={actionsDisabled}
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
              disabled={isLoading || status === "expired" || actionsDisabled}
              onClick={async () => {
                if (session?.paymentId) {
                  const res = await finalizePayment(session.paymentId, "succeeded");
                  if (res.success && res.data) {
                    handleStatusUpdate(res.data.status as PaymentStatus);
                    return;
                  }
                }
                handleStatusUpdate("succeeded");
              }}
            >
              {isLoading ? "Mempersiapkan..." : "Bayar sekarang"}
            </button>
            <button
              type="button"
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:border-[#4338ca] hover:text-[#4338ca]"
              disabled={status === "expired" || actionsDisabled}
              onClick={async () => {
                if (session?.paymentId) {
                  const res = await finalizePayment(session.paymentId, "failed");
                  if (res.success && res.data) {
                    handleStatusUpdate(res.data.status as PaymentStatus);
                    return;
                  }
                }
                handleStatusUpdate("failed");
              }}
            >
              Simulasikan gagal
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
