/** @format */

import type {
  AccountingSettingsAnalyticAccountItem,
  AccountingSettingsBudgetItem,
  AccountingSettingsCoaItem,
  AccountingSettingsCurrencyItem,
  AccountingSettingsOverviewItem,
  AccountingSettingsTaxItem,
} from "@/types/api/accounting-settings";

import type {
  AnalyticAccountCard,
  BudgetRow,
  CoaAccountRow,
  CurrencyRow,
  SettingsCardItem,
  TaxRow,
} from "../types/settings";

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function formatCurrency(amount: unknown, currency = "IDR", locale = "id-ID") {
  const numeric = asNumber(amount, 0);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
  }).format(numeric);
}

function formatExchangeRate(value: unknown) {
  return asNumber(value, 0).toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

function formatDateLabel(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toInitials(value: string) {
  const compact = value.trim();
  if (!compact) return "NA";
  const chunks = compact.split(/\s+/);
  if (chunks.length === 1) return chunks[0].slice(0, 2).toUpperCase();
  return `${chunks[0][0] ?? ""}${chunks[1][0] ?? ""}`.toUpperCase();
}

function progressClass(achievement: number) {
  if (achievement >= 80) return "bg-green-500";
  if (achievement >= 40) return "bg-indigo-500";
  return "bg-gray-400";
}

function achievementClass(achievement: number) {
  if (achievement >= 80) return "text-green-600 dark:text-green-400";
  if (achievement >= 40) return "text-indigo-600 dark:text-indigo-400";
  return "text-gray-600 dark:text-gray-400";
}

function currencyBadgeClass(code: string) {
  if (code === "IDR") return "bg-red-100 text-red-700";
  if (code === "USD") return "bg-blue-100 text-blue-700";
  if (code === "EUR") return "bg-yellow-100 text-yellow-700";
  if (code === "SGD") return "bg-orange-100 text-orange-700";
  return "bg-indigo-100 text-indigo-700";
}

export function mapSettingsOverviewCards(items: AccountingSettingsOverviewItem[]): SettingsCardItem[] {
  return items.map((item) => ({
    key: item.key,
    title: item.title,
    description: item.description,
    action_label: item.action_label,
    href: item.href,
  }));
}

export function mapCoaRows(items: AccountingSettingsCoaItem[]): CoaAccountRow[] {
  return items.map((item) => ({
    account_code: item.account_code,
    account_name: item.account_name,
    account_type: item.account_type,
    balance: formatCurrency(item.balance),
    level: item.level,
    is_group: item.level === 0,
    is_expanded: item.level <= 1,
    is_highlighted: item.account_code === "11101",
  }));
}

export function mapTaxRows(items: AccountingSettingsTaxItem[]): TaxRow[] {
  return items.map((item) => ({
    tax_id: item.tax_id,
    tax_name: item.tax_name,
    description: item.description ?? "",
    tax_type: item.tax_type,
    rate_percent: `${asNumber(item.rate_percent, 0).toFixed(2)}%`,
    tax_account: item.tax_account,
    tax_account_description: "",
    is_active: item.is_active,
  }));
}

export function mapCurrencyRows(items: AccountingSettingsCurrencyItem[]): CurrencyRow[] {
  return items.map((item) => ({
    currency_code: item.currency_code,
    symbol: item.symbol,
    exchange_rate: formatExchangeRate(item.exchange_rate),
    last_updated: formatDateLabel(item.last_updated_at),
    is_base: item.is_base,
    badge_class: currencyBadgeClass(item.currency_code),
  }));
}

export function mapBudgetRows(items: AccountingSettingsBudgetItem[]): BudgetRow[] {
  return items.map((item) => {
    const achievement = Math.max(0, Math.min(100, Math.round(asNumber(item.achievement_percent, 0))));

    return {
      budget_id: item.budget_id,
      budget_name: item.budget_name,
      department: item.analytic_account_name,
      analytic_account: item.analytic_account_name,
      period: `${formatDateLabel(item.start_date)} - ${formatDateLabel(item.end_date)}`,
      target_amount: formatCurrency(item.target_amount, item.currency_code, "en-US"),
      practical_amount: formatCurrency(item.practical_amount, item.currency_code, "en-US"),
      achievement_percent: achievement,
      achievement_label: `${achievement}%`,
      progress_class: progressClass(achievement),
      achievement_class: achievementClass(achievement),
      avatar: toInitials(item.analytic_account_name),
      avatar_class: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    };
  });
}

export function mapAnalyticAccountCards(
  items: AccountingSettingsAnalyticAccountItem[]
): AnalyticAccountCard[] {
  return items.map((item) => {
    const normalizedStatus = item.status.toLowerCase();
    const isActive = normalizedStatus === "active" || normalizedStatus === "enabled";

    return {
      analytic_account_id: item.analytic_account_id,
      account_name: item.account_name,
      reference_code: item.reference_code,
      current_balance: formatCurrency(item.current_balance, "USD", "en-US"),
      active_budgets: item.active_budgets,
      status: isActive ? "Active" : "Inactive",
      icon: "📊",
      icon_class: isActive
        ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
        : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
      balance_class: asNumber(item.current_balance, 0) < 0
        ? "text-red-600 dark:text-red-400"
        : "text-green-600 dark:text-green-400",
    };
  });
}
