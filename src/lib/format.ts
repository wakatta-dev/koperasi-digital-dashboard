/** @format */

type CurrencyOptions = {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

export function formatCurrency(
  value: number | null | undefined,
  { currency = "IDR", locale = "id-ID", minimumFractionDigits = 0, maximumFractionDigits = 0 }: CurrencyOptions = {},
): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value);
  } catch {
    return String(value);
  }
}

export function formatNumber(
  value: number | null | undefined,
  { locale = "id-ID", maximumFractionDigits = 1 }: { locale?: string; maximumFractionDigits?: number } = {},
): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  try {
    return new Intl.NumberFormat(locale, { maximumFractionDigits }).format(value);
  } catch {
    return String(value);
  }
}
