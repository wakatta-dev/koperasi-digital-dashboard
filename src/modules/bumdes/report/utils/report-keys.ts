/** @format */

type KeyPart = string | number | null | undefined;

type KeyedItem<T> = T & { rowKey: string };

type RowKeyOptions<T> = {
  prefix?: string;
  stableIdFor?: (item: T) => KeyPart;
};

const normalizePart = (value: KeyPart): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") return value.toString();
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.replace(/\s+/g, "-").toLowerCase();
};

export const createKeyGenerator = (prefix = "row") => {
  const seen = new Map<string, number>();

  return (parts: KeyPart[], fallbackIndex: number): string => {
    const base = parts.map(normalizePart).filter(Boolean).join("-");

    if (!base) {
      return `${prefix}-item-${fallbackIndex}`;
    }

    const baseKey = `${prefix}-${base}`;
    const count = seen.get(baseKey) ?? 0;
    seen.set(baseKey, count + 1);

    if (count === 0) {
      return baseKey;
    }

    return `${baseKey}-${fallbackIndex}`;
  };
};

export const withRowKeys = <T>(
  items: T[],
  partsFor: (item: T) => KeyPart[],
  options?: string | RowKeyOptions<T>
): KeyedItem<T>[] => {
  const resolvedOptions =
    typeof options === "string" ? { prefix: options } : options;
  const keyFor = createKeyGenerator(resolvedOptions?.prefix);

  return items.map((item, index) => {
    const stableId = resolvedOptions?.stableIdFor?.(item);
    const hasStableId =
      stableId !== null &&
      stableId !== undefined &&
      String(stableId).trim() !== "";

    return {
      ...item,
      rowKey: keyFor(hasStableId ? [stableId] : partsFor(item), index),
    };
  });
};
