/** @format */

"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getTenantId } from "@/services/api";
import type { ApiResponse } from "@/types/api";

export async function apiRequest<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const session = (await getServerSession(authOptions)) as any;
  const tenantId = await getTenantId();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api${endpoint}`,
    {
      cache: "no-store",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(session?.accessToken
          ? { Authorization: `Bearer ${session.accessToken}` }
          : {}),
        ...(tenantId ? { "X-Tenant-ID": tenantId } : {}),
        ...(options?.headers || {}),
      },
    }
  );

  const json = (await res.json().catch(() => null)) as ApiResponse<T>;
  return json;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const json = await apiRequest<T>(endpoint, options);
  return json?.data as T;
}

export function ensureSuccess<T>(res: ApiResponse<T>): T {
  if (!res.success) {
    const msg =
      Object.entries(res.errors ?? {})
        .map(([field, errs]) => `${field}: ${errs.join(', ')}`)
        .join('; ') || res.message;
    throw new Error(msg);
  }
  return res.data as T;
}
