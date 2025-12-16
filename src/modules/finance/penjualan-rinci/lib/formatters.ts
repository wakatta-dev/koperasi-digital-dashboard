/** @format */

import { formatCurrency, formatNumber } from "@/lib/format";

export function formatRupiah(value: number, opts?: Intl.NumberFormatOptions) {
  return formatCurrency(value, {
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...opts,
  });
}

export function formatInteger(value: number, opts?: Intl.NumberFormatOptions) {
  return formatNumber(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...opts,
  });
}
