/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import type { Module } from "@/types/api/tenant";
import { api, API_PREFIX } from "./base";

export function listModules(): Promise<ApiResponse<Module[]>> {
  return api.get<Module[]>(`${API_PREFIX}${API_ENDPOINTS.catalog.modules}`);
}

