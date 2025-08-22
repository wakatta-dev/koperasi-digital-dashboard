/** @format */

// utils/api.ts
import type { ApiResponse } from "@/types/api";

export function ensureSuccess<T>(res: ApiResponse<T>): T {
  if (!res.success) {
    const msg =
      Object.entries(res.errors ?? {})
        .map(([field, errs]) => `${field}: ${errs.join(", ")}`)
        .join("; ") || res.message;
    throw new Error(msg);
  }
  return res.data as T;
}
