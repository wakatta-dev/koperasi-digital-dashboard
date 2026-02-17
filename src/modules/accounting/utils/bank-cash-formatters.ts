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

export type BankCashAccountIdentity = {
  account_id: string;
  account_name: string;
  bank_name: string;
};

function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function resolveBankCashAccountId(
  rawAccountKey: string | undefined,
  accounts: BankCashAccountIdentity[] | undefined
): string | undefined {
  const normalizedKey = (rawAccountKey ?? "").trim();
  const accountItems = accounts ?? [];

  if (accountItems.length === 0) {
    if (/^\d+$/.test(normalizedKey)) {
      return normalizedKey;
    }
    return undefined;
  }

  if (!normalizedKey) {
    return accountItems[0]?.account_id;
  }

  const direct = accountItems.find((item) => item.account_id === normalizedKey);
  if (direct) {
    return direct.account_id;
  }

  const keySlug = toSlug(normalizedKey);
  const bySlug = accountItems.find(
    (item) =>
      toSlug(item.account_name) === keySlug ||
      toSlug(item.bank_name) === keySlug ||
      toSlug(`${item.bank_name} ${item.account_name}`) === keySlug
  );
  if (bySlug) {
    return bySlug.account_id;
  }

  if (/^\d+$/.test(normalizedKey)) {
    return normalizedKey;
  }

  return accountItems[0]?.account_id;
}
