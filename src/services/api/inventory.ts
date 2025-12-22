/** @format */

import { API_PREFIX, api } from "./base";
import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import type {
  CreateInventoryProductRequest,
  InventoryAdjustmentRequest,
  InventoryInitialStockRequest,
  InventoryProductListResponse,
  InventoryProductResponse,
} from "@/types/api/inventory";
import type { InventoryStockHistoryEntry } from "@/types/api/inventory";

const E = API_ENDPOINTS.inventory;

export function listInventoryProducts(params?: {
  q?: string;
  status?: string;
  show_in_marketplace?: boolean;
  limit?: number;
  offset?: number;
  sort?: string;
}): Promise<ApiResponse<InventoryProductListResponse>> {
  const search = new URLSearchParams();
  if (params?.q) search.set("q", params.q);
  if (params?.status) search.set("status", params.status);
  if (params?.show_in_marketplace !== undefined) {
    search.set("show_in_marketplace", params.show_in_marketplace ? "true" : "false");
  }
  if (params?.limit !== undefined) search.set("limit", String(params.limit));
  if (params?.offset !== undefined) search.set("offset", String(params.offset));
  if (params?.sort) search.set("sort", params.sort);
  const query = search.toString() ? `?${search.toString()}` : "";
  return api.get<InventoryProductListResponse>(`${API_PREFIX}${E.products}${query}`);
}

export function getInventoryProduct(
  id: string | number
): Promise<ApiResponse<InventoryProductResponse>> {
  return api.get<InventoryProductResponse>(`${API_PREFIX}${E.product(id)}`);
}

export function createInventoryProduct(
  payload: CreateInventoryProductRequest
): Promise<ApiResponse<InventoryProductResponse>> {
  return api.post<InventoryProductResponse>(`${API_PREFIX}${E.products}`, payload);
}

export function updateInventoryProduct(
  id: string | number,
  payload: Partial<CreateInventoryProductRequest>
): Promise<ApiResponse<InventoryProductResponse>> {
  return api.put<InventoryProductResponse>(`${API_PREFIX}${E.product(id)}`, payload);
}

export function archiveInventoryProduct(
  id: string | number
): Promise<ApiResponse<null>> {
  return api.post<null>(`${API_PREFIX}${E.archive(id)}`);
}

export function setInitialInventoryStock(
  id: string | number,
  payload: InventoryInitialStockRequest
): Promise<ApiResponse<null>> {
  return api.post<null>(`${API_PREFIX}${E.stockInitial(id)}`, payload);
}

export function adjustInventoryStock(
  id: string | number,
  payload: InventoryAdjustmentRequest
): Promise<ApiResponse<null>> {
  return api.post<null>(`${API_PREFIX}${E.stockAdjust(id)}`, payload);
}

export function getInventoryStockHistory(
  id: string | number
): Promise<ApiResponse<InventoryStockHistoryEntry[]>> {
  return api.get<InventoryStockHistoryEntry[]>(`${API_PREFIX}${E.history(id)}`);
}
