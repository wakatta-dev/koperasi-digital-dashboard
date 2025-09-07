/** @format */

export function formatDateTime(value?: string) {
  try {
    const d = value ? new Date(value) : null;
    if (!d || isNaN(d.getTime())) return "-";
    return d.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return "-";
  }
}

