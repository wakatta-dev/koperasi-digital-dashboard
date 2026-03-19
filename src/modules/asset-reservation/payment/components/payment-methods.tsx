/** @format */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { PaymentMode, ReservationSummary } from "../../types";
import {
  createPaymentSession,
  uploadPaymentProof,
} from "@/services/api/reservations";
import type { PaymentSession } from "../../types";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  resolvePublicPaymentProofErrorMessage,
  resolvePublicPaymentSessionErrorMessage,
  validatePublicPaymentProofFile,
} from "../utils/public-payment";

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
  reservationId?: number;
  ownershipToken?: string;
  existingPayment?: ReservationSummary["latestPayment"];
  onStatusChange?: (payload: {
    paymentId: string;
    status: PaymentStatus;
  }) => void;
  onSessionChange?: (session: PaymentSession | null) => void;
};

type PaymentStatus =
  | "initiated"
  | "pending_verification"
  | "succeeded"
  | "failed"
  | "expired";

function toPaymentTestId(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function toReusablePaymentSession(input: {
  existingPayment?: ReservationSummary["latestPayment"];
  reservationId?: number;
  mode: PaymentMode;
}): PaymentSession | null {
  const payment = input.existingPayment;
  if (!payment?.id || !input.reservationId) return null;

  const normalizedType = (payment.type || "").trim().toLowerCase();
  if (normalizedType !== input.mode) return null;

  const normalizedStatus = (payment.status || "").trim().toLowerCase();
  if (normalizedStatus !== "initiated" && normalizedStatus !== "pending_verification") {
    return null;
  }

  const payBy =
    typeof payment.payBy === "number"
      ? new Date(payment.payBy * 1000).toISOString()
      : payment.payBy || "";

  return {
    paymentId: payment.id,
    reservationId: input.reservationId,
    amount: payment.amount,
    type: input.mode,
    method: payment.method || "",
    payBy,
    status: normalizedStatus as PaymentStatus,
  };
}

export function PaymentMethods({
  mode,
  methodGroups,
  reservationId,
  ownershipToken,
  existingPayment,
  onStatusChange,
  onSessionChange,
}: PaymentMethodsProps) {
  const proofInputId = "asset-rental-payment-proof-file";
  const hasMethods = Boolean(methodGroups && methodGroups.length > 0);
  const reusableSession = useMemo(
    () => toReusablePaymentSession({ existingPayment, reservationId, mode }),
    [existingPayment, mode, reservationId],
  );
  const [paymentState, setPaymentState] = useState(() => ({
    selected:
      reusableSession?.method || (methodGroups?.[0]?.options?.[0]?.value ?? ""),
    status: "initiated" as PaymentStatus,
    proofFile: null as File | null,
    session: null as PaymentSession | null,
    isLoading: false,
    sessionError: null as string | null,
  }));
  const { selected, status, proofFile, session, isLoading, sessionError } =
    paymentState;
  const actionsDisabled = !hasMethods || !reservationId || !ownershipToken;
  const onSessionChangeRef = useRef(onSessionChange);
  const onStatusChangeRef = useRef(onStatusChange);

  const patchPaymentState = (
    updates:
      | Partial<typeof paymentState>
      | ((current: typeof paymentState) => typeof paymentState),
  ) => {
    setPaymentState((current) =>
      typeof updates === "function" ? updates(current) : { ...current, ...updates },
    );
  };

  useEffect(() => {
    onSessionChangeRef.current = onSessionChange;
  }, [onSessionChange]);

  useEffect(() => {
    onStatusChangeRef.current = onStatusChange;
  }, [onStatusChange]);

  useEffect(() => {
    if (!reusableSession?.method) return;
    patchPaymentState((current) => ({
      ...current,
      selected: current.selected || reusableSession.method,
    }));
  }, [reusableSession?.method]);

  const payByText = useMemo(() => {
    if (!session?.payBy) return null;
    return new Date(session.payBy).toLocaleString("id-ID");
  }, [session?.payBy]);

  const formattedAmount = useMemo(() => {
    if (!session?.amount) return null;
    return `Rp${session.amount.toLocaleString("id-ID")}`;
  }, [session?.amount]);

  const handleStatusUpdate = (next: PaymentStatus) => {
    patchPaymentState({ status: next });
    if (session?.paymentId) {
      onStatusChangeRef.current?.({ paymentId: session.paymentId, status: next });
    }
  };

  const applyBootstrapFailure = (
    message: string,
    options?: { session?: PaymentSession | null; clearCallback?: boolean },
  ) => {
    if (options && "session" in options) {
      patchPaymentState({ session: options.session ?? null });
    }
    patchPaymentState({ sessionError: message });
    if (options?.clearCallback) {
      onSessionChangeRef.current?.(null);
    }
  };

  const applyBootstrapSession = (nextSession: PaymentSession) => {
    patchPaymentState({
      session: nextSession,
      status: nextSession.status,
      sessionError: null,
    });
    onSessionChangeRef.current?.(nextSession);
  };

  const beginBootstrapRequest = () => {
    patchPaymentState({ isLoading: true, sessionError: null });
  };

  const finishBootstrapRequest = () => {
    patchPaymentState({ isLoading: false });
  };

  const handleSubmitProof = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!session?.paymentId || !proofFile || !reservationId || !ownershipToken) {
      return;
    }
    const validationError = validatePublicPaymentProofFile(proofFile);
    if (validationError) {
      patchPaymentState({ sessionError: validationError });
      return;
    }
    patchPaymentState({ isLoading: true, sessionError: null });
    try {
      const res = await uploadPaymentProof(
        session.paymentId,
        proofFile,
        undefined,
        { reservationId, ownershipToken },
      );
      if (res.success && res.data) {
        patchPaymentState((current) => ({
          ...current,
          session:
          current
            ? {
                ...current,
                status: res?.data?.status as PaymentStatus,
              }
            : current.session,
        }));
        handleStatusUpdate(res.data.status as PaymentStatus);
        return;
      }
      patchPaymentState({
        sessionError:
        resolvePublicPaymentProofErrorMessage(
          res.message || "Tidak dapat mengunggah bukti pembayaran.",
        ),
      });
    } catch (err) {
      patchPaymentState({
        sessionError:
        resolvePublicPaymentProofErrorMessage(
          err instanceof Error
            ? err.message
            : "Tidak dapat mengunggah bukti pembayaran.",
        ),
      });
    } finally {
      patchPaymentState({ isLoading: false });
    }
  };

  useEffect(() => {
    let ignore = false;
    async function bootstrapSession(methodValue: string) {
      if (!hasMethods || !methodValue) {
        applyBootstrapFailure("Metode pembayaran belum tersedia.", {
          session: null,
        });
        return;
      }
      if (!reservationId) {
        applyBootstrapFailure(
          "ID reservasi wajib diisi sebelum membuat sesi pembayaran.",
        );
        return;
      }
      if (!ownershipToken) {
        applyBootstrapFailure(
          "Token kepemilikan reservasi tidak tersedia. Gunakan tautan resmi terbaru.",
        );
        return;
      }
      if (
        reusableSession &&
        reusableSession.method === methodValue &&
        reusableSession.type === mode
      ) {
        applyBootstrapSession(reusableSession);
        return;
      }
      beginBootstrapRequest();
      try {
        const res = await createPaymentSession({
          reservation_id: reservationId,
          type: mode,
          method: methodValue,
          ownership_token: ownershipToken,
        });
        if (ignore) return;
        if (res.success && res.data) {
          applyBootstrapSession({
            paymentId: res.data.payment_id,
            reservationId: res.data.reservation_id,
            amount: res.data.amount,
            type: res.data.type,
            method: res.data.method,
            payBy: res.data.pay_by,
            status: res.data.status,
          });
        } else {
          applyBootstrapFailure(
            resolvePublicPaymentSessionErrorMessage(
              res.message || "Tidak dapat membuat sesi pembayaran",
            ),
            { clearCallback: true },
          );
        }
      } catch (err) {
        if (!ignore) {
          applyBootstrapFailure(
            resolvePublicPaymentSessionErrorMessage(
              err instanceof Error
                ? err.message
                : "Gagal membuat sesi pembayaran",
            ),
            { clearCallback: true },
          );
        }
      } finally {
        if (!ignore) {
          finishBootstrapRequest();
        }
      }
    }
    bootstrapSession(selected);
    return () => {
      ignore = true;
    };
  }, [
    mode,
    reservationId,
    selected,
    hasMethods,
    ownershipToken,
    reusableSession,
  ]);

  return (
    <section
      className="bg-white dark:bg-surface-card-dark rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
      data-testid="asset-rental-payment-methods"
    >
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-800">
        <span className="material-icons-outlined text-brand-primary">
          payments
        </span>
        {mode === "dp"
          ? "Pilih Metode Pembayaran DP"
          : "Pilih Metode Pelunasan"}
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
          <span className="text-base font-bold text-brand-primary">
            {formattedAmount}
          </span>
        </div>
      ) : null}
      {sessionError ? (
        <div className="mb-4 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          {sessionError}
        </div>
      ) : null}
      {hasMethods ? (
        <RadioGroup
          value={selected}
          onValueChange={(value) => patchPaymentState({ selected: value })}
          className="space-y-4"
        >
          {methodGroups?.map((group) => (
            <div
              key={group.title}
              className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
              data-testid={`asset-rental-payment-method-group-${toPaymentTestId(group.title)}`}
            >
              <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <span className="material-icons-outlined text-gray-500 text-sm">
                  {group.icon}
                </span>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                  {group.title}
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {group.options.map((option) => {
                  const id = `payment-${option.value.replace(/\s+/g, "-")}`;
                  return (
                    <Label
                      key={option.value}
                      htmlFor={id}
                      data-testid={`asset-rental-payment-method-option-${toPaymentTestId(option.value)}`}
                      className="flex w-full items-center gap-0 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-brand-primary hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition group"
                    >
                      <RadioGroupItem value={option.value} id={id} />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-brand-primary">
                            {option.label}
                          </span>
                          {option.badge ? (
                            <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              {option.badge}
                            </span>
                          ) : option.icon ? (
                            <span className="material-icons-outlined text-gray-400">
                              {option.icon}
                            </span>
                          ) : null}
                        </div>
                        {option.account ? (
                          <>
                            <p className="text-xs text-gray-500">
                              {option.account}
                            </p>
                            <p className="text-xs text-gray-500">
                              {option.holder}
                            </p>
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
        <div className="rounded-2xl border border-indigo-100 dark:border-indigo-800/60 bg-gradient-to-br from-indigo-50 via-white to-sky-50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-sky-950/30 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/25">
              <span className="material-icons-outlined text-[22px]">upload_file</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold text-slate-900 dark:text-white">
                Kirim bukti pembayaran untuk verifikasi admin
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Setelah transfer selesai, unggah bukti pembayaran di sini. Ini adalah aksi utama yang menyelesaikan langkah pembayaran pada halaman ini.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
          <span className="material-icons-outlined text-brand-primary">
            verified
          </span>
          Status Pembayaran:{" "}
          <span
            data-testid="asset-rental-payment-method-status"
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
                ? "Menunggu Verifikasi Pembayaran"
                : status === "succeeded"
                  ? "Berhasil"
                  : status === "expired"
                    ? "Kedaluwarsa"
                    : "Gagal"}
          </span>
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmitProof}>
          <label
            htmlFor={proofInputId}
            className="text-sm font-semibold text-gray-800 dark:text-gray-200"
          >
            Unggah bukti pembayaran (jpg/png/pdf)
          </label>
          <input
            id={proofInputId}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            data-testid="asset-rental-payment-proof-file-input"
            onChange={(e) => {
              const file = e.target.files?.[0];
              const validationError = validatePublicPaymentProofFile(file);
              if (validationError) {
                patchPaymentState({
                  proofFile: null,
                  sessionError: validationError,
                });
                return;
              }
              patchPaymentState({
                sessionError: null,
                proofFile: file ?? null,
              });
            }}
            className="block w-full rounded-xl border border-dashed border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-950 px-4 py-4 text-sm text-slate-700 dark:text-slate-200 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-indigo-500"
          />
          {proofFile ? (
            <p className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-200">
              Bukti siap dikirim: <strong>{proofFile.name}</strong>
            </p>
          ) : null}
          <div className="space-y-3">
            <button
              type="submit"
              data-testid="asset-rental-payment-submit-button"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300 disabled:shadow-none dark:disabled:bg-indigo-900/40"
              disabled={actionsDisabled || !session?.paymentId || !proofFile || isLoading}
            >
              <span
                aria-hidden="true"
                className="material-icons-outlined text-[18px]"
              >
                {isLoading ? "progress_activity" : "upload"}
              </span>
              {isLoading
                ? "Mengirim bukti pembayaran..."
                : "Kirim Bukti Pembayaran"}
            </button>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Setelah tombol ini diklik, bukti akan dikirim ke admin untuk diverifikasi. Tombol di sidebar hanya digunakan untuk melihat status pengajuan.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
