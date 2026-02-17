/** @format */

export function formatBankCashCurrency(value: number): string {
  const amount = Number.isFinite(value) ? value : 0;
  return `Rp ${Math.trunc(amount).toLocaleString("id-ID")}`;
}

export function formatBankCashDateLabel(value?: string): string {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function formatBankCashSignedAmount(
  value: number,
  direction: "Credit" | "Debit"
): string {
  const absValue = Math.abs(Number.isFinite(value) ? value : 0);
  const signedPrefix = direction === "Credit" ? "+" : "-";
  return `${signedPrefix}${formatBankCashCurrency(absValue)}`;
}
