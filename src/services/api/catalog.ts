/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse, CatalogModule } from "@/types/api";
import { api, API_PREFIX } from "./base";

export function listModules(): Promise<ApiResponse<CatalogModule[]>> {
  return api.get<CatalogModule[]>(
    `${API_PREFIX}${API_ENDPOINTS.catalog.modules}`
  );
}
