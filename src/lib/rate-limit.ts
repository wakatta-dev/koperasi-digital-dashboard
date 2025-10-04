/** @format */

import type { SWRConfiguration } from "swr";

function normalizeMessage(value: unknown): string {
  if (!value) return "";
  if (value instanceof Error) {
    return value.message ?? "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

export function isRateLimitError(error: unknown): boolean {
  const message = normalizeMessage(error).toLowerCase();
  if (!message) return false;
  return message.includes("rate limit") || message.includes("too many requests");
}

const shouldRetryOnError: SWRConfiguration["shouldRetryOnError"] = (err) => {
  return !isRateLimitError(err);
};

export const swrRateLimitOptions: Pick<
  SWRConfiguration,
  "errorRetryCount" | "errorRetryInterval" | "shouldRetryOnError"
> = {
  errorRetryCount: 1,
  errorRetryInterval: 4000,
  shouldRetryOnError,
};

export function buildReactQueryRetry(maxRetries = 1) {
  return (failureCount: number, error: unknown) => {
    if (isRateLimitError(error)) {
      return false;
    }
    return failureCount <= maxRetries;
  };
}
