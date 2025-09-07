/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import { api, API_PREFIX } from "./base";

// UI Settings (theme/layout)
export function getUISettings(): Promise<ApiResponse<{
  theme_color?: string;
  accent_color?: string;
  layout?: string;
}>> {
  return api.get(`${API_PREFIX}${API_ENDPOINTS.settings.ui}`);
}

export function updateUISettings(payload: {
  theme_color?: string;
  accent_color?: string;
  layout?: string;
}): Promise<ApiResponse<{ success: boolean }>> {
  return api.post(`${API_PREFIX}${API_ENDPOINTS.settings.ui}`, payload);
}

// Public Landing Content
export function getLandingContent(): Promise<ApiResponse<{
  hero_title?: string;
  hero_subtitle?: string;
  services?: string[];
  testimonials?: string;
  contact?: string;
}>> {
  return api.get(`${API_PREFIX}${API_ENDPOINTS.settings.landing}`);
}

export function updateLandingContent(payload: {
  hero_title?: string;
  hero_subtitle?: string;
  services?: string[];
  testimonials?: string;
  contact?: string;
}): Promise<ApiResponse<{ success: boolean }>> {
  return api.post(`${API_PREFIX}${API_ENDPOINTS.settings.landing}`, payload);
}

