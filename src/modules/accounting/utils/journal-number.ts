/** @format */

export function normalizeJournalNumber(value?: string): string {
  let normalized = (value ?? "").trim();

  if (!normalized) {
    return "";
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const decoded = decodeURIComponent(normalized);
      if (decoded === normalized) {
        break;
      }
      normalized = decoded.trim();
    } catch {
      break;
    }
  }

  return normalized;
}
