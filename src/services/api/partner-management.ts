/** @format */

import { API_PREFIX, api } from "./base";
import type { ApiResponse } from "@/types/api";
import type {
  PartnerManagementSellerItem,
  PartnerManagementSellerListResponse,
} from "@/types/api/partner-management";

const BASE = "/partner-management";

export function listPartnerManagementSellers(): Promise<
  ApiResponse<PartnerManagementSellerListResponse>
> {
  return api.get<PartnerManagementSellerListResponse>(
    `${API_PREFIX}${BASE}/sellers`
  );
}

export function getPartnerManagementSeller(
  sellerId: string | number
): Promise<ApiResponse<PartnerManagementSellerItem>> {
  return api.get<PartnerManagementSellerItem>(
    `${API_PREFIX}${BASE}/sellers/${encodeURIComponent(String(sellerId))}`
  );
}
