/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import { api, API_PREFIX } from "./base";

// UI Settings (theme/layout)
export function getUISettings(): Promise<ApiResponse<any>> {
  return api.get(`${API_PREFIX}${API_ENDPOINTS.branding.base}`);
}

export function updateUISettings(payload: Record<string, unknown>): Promise<ApiResponse<any>> {
  return api.put(`${API_PREFIX}${API_ENDPOINTS.branding.base}`, payload);
}

// Landing content leverages branding sections
export function getLandingContent(): Promise<ApiResponse<any>> {
  return getUISettings();
}

export function updateLandingContent(payload: Record<string, unknown>): Promise<ApiResponse<any>> {
  return updateUISettings(payload);
}
