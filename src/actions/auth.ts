/** @format */

"use server";

import { apiFetch } from "./api";
import { API_ENDPOINTS } from "@/constants/api";

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
