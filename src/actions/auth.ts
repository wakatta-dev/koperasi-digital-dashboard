/** @format */

"use server";

import { apiFetch } from "./api";
import { API_ENDPOINTS } from "@/constants/api";
import { ensureSuccess } from "@/lib/api";
import {
  login as loginService,
  logout as logoutService,
  refreshToken as refreshTokenService,
} from "@/services/api";
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
  try {
    const res = await loginService(payload);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export type LoginActionResult = Awaited<ReturnType<typeof loginAction>>;

export async function refreshTokenAction(payload: { refresh_token: string }) {
  try {
    const res = await refreshTokenService(payload);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export type RefreshTokenActionResult = Awaited<
  ReturnType<typeof refreshTokenAction>
>;

export async function logoutAction() {
  let refreshToken: string | undefined;
  try {
    refreshToken = (await cookies()).get("refresh_token")?.value;
  } catch {
    refreshToken = undefined;
  }
  if (!refreshToken) {
    return null;
  }
  try {
    const res = await logoutService({ refresh_token: refreshToken });
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export type LogoutActionResult = Awaited<ReturnType<typeof logoutAction>>;
