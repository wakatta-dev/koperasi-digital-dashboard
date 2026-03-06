/** @format */

export function formatVendorDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(date);
}

export function formatVendorDateTime(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatVendorCurrency(value?: number | null) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

export function normalizeTenantStatus(status?: string | null, isActive?: boolean) {
  if (typeof isActive === "boolean") {
    return isActive ? "ACTIVE" : "DEACTIVATED";
  }
  return (status ?? "").toUpperCase() || "-";
}

export function tenantStatusBadgeClass(status?: string | null, isActive?: boolean) {
  const normalized = normalizeTenantStatus(status, isActive);
  if (normalized === "ACTIVE") {
    return "border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  }
  if (normalized === "DEACTIVATED") {
    return "border-transparent bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  }
  return "border-transparent bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

export function userLifecycleStatusLabel(status?: string | null) {
  const normalized = (status ?? "").toUpperCase();
  if (normalized === "ACTIVE") return "Aktif";
  if (normalized === "DEACTIVATED") return "Nonaktif";
  return status || "-";
}
