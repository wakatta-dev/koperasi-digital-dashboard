/** @format */

"use server";

import { apiFetch } from "./api";
import { API_ENDPOINTS } from "@/constants/api";
import { ensureSuccess } from "@/lib/api";
import { login as loginService, logout as logoutService } from "@/services/api";
import { cookies } from "next/headers";

export async function login(payload: { email: string; password: string }) {
  return apiFetch(API_ENDPOINTS.auth.login, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function refresh(payload: { refresh_token: string }) {
  return apiFetch(API_ENDPOINTS.auth.refresh, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logout(payload: { refresh_token: string }) {
  return apiFetch(API_ENDPOINTS.auth.logout, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginAction(payload: { email: string; password: string }) {
  const res = await loginService(payload);
  return ensureSuccess(res);
}

export type LoginActionResult = Awaited<ReturnType<typeof loginAction>>;

export async function logoutAction() {
  let refreshToken: string | undefined;
  try {
    refreshToken = (await cookies()).get("refresh_token")?.value;
  } catch {
    refreshToken = undefined;
  }
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }
  const res = await logoutService({ refresh_token: refreshToken });
  return ensureSuccess(res);
}

export type LogoutActionResult = Awaited<ReturnType<typeof logoutAction>>;
