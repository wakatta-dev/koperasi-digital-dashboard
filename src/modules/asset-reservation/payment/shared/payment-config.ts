/** @format */

import type { PaymentMode } from "../../types";

export type PaymentDisplayConfig = {
  mode: PaymentMode;
  title: string;
  subtitle?: string;
  amountLabel: string;
  amountValue: string;
  dueText?: string;
  proofNote?: string;
  confirmationHref?: string;
};

export function buildPaymentDisplayConfig(
  mode: PaymentMode,
  overrides: Partial<PaymentDisplayConfig> = {}
): PaymentDisplayConfig {
  const base: PaymentDisplayConfig =
    mode === "dp"
      ? {
          mode,
          title: "Pembayaran DP",
          subtitle: "Bayar DP untuk mengamankan reservasi aset Anda.",
          amountLabel: "Pembayaran DP",
          amountValue: "",
          dueText: "",
        }
      : {
          mode,
          title: "Pelunasan",
          subtitle: "Selesaikan pelunasan sebelum jadwal mulai.",
          amountLabel: "Sisa Tagihan",
          amountValue: "",
          dueText: "",
        };

  return { ...base, ...overrides };
}
