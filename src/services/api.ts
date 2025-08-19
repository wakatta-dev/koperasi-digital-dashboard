/** @format */

import {
  getAccessToken,
  refreshToken as refreshAccessToken,
  logout,
} from "./auth";

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
  let accessToken = await getAccessToken();

  const headers = new Headers(options.headers);
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let body = options.body;
  if (body && typeof body !== "string" && !(body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }

  let res = await fetch(`${BASE_URL}${path}`, { ...options, headers, body });

  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      accessToken = newToken;
      headers.set("Authorization", `Bearer ${accessToken}`);
      res = await fetch(`${BASE_URL}${path}`, { ...options, headers, body });
    } else {
      await logout();
    }
  }

  const contentType = res.headers.get("content-type");
  const data =
    contentType && contentType.includes("application/json")
      ? await res.json()
      : await res.text();

  if (!res.ok) {
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
