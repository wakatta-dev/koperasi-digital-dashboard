/** @format */

import { getSession } from "next-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export class ApiError extends Error {
  status: number;
  data: any;
  constructor(status: number, data: any) {
    super(`Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function request(path: string, options: RequestInit = {}) {
  const session = await getSession();
  const token = (session as any)?.accessToken;
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let body = options.body;
  if (body && typeof body !== "string" && !(body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers, body });

  const contentType = res.headers.get("content-type");
  const data = contentType && contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("accessToken");
    }
    throw new ApiError(res.status, data);
  }

  return data;
}

export const api = {
  get: (path: string, options?: RequestInit) =>
    request(path, { ...options, method: "GET" }),
  post: (path: string, body?: any, options?: RequestInit) =>
    request(path, { ...options, method: "POST", body }),
  put: (path: string, body?: any, options?: RequestInit) =>
    request(path, { ...options, method: "PUT", body }),
  delete: (path: string, options?: RequestInit) =>
    request(path, { ...options, method: "DELETE" }),
};

export default api;
