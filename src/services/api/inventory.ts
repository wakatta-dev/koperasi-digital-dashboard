/** @format */

import { API_PREFIX, api } from "./base";
import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import type {
  CreateInventoryProductRequest,
  CreateInventoryVariantGroupRequest,
  CreateInventoryVariantOptionRequest,
  InventoryAdjustmentRequest,
  InventoryInitialStockRequest,
  InventoryProductListResponse,
  InventoryProductResponse,
  InventoryProductVariantsResponse,
  InventoryVariantGroupResponse,
  InventoryVariantOptionResponse,
  UpdateInventoryProductRequest,
  UpdateInventoryVariantGroupRequest,
  UpdateInventoryVariantOptionRequest,
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
  payload: UpdateInventoryProductRequest
): Promise<ApiResponse<InventoryProductResponse>> {
  return api.put<InventoryProductResponse>(`${API_PREFIX}${E.product(id)}`, payload);
}

export function uploadInventoryProductImage(
  id: string | number,
  file: File
): Promise<ApiResponse<InventoryProductResponse>> {
  const formData = new FormData();
  formData.append("image", file);
  return api.post<InventoryProductResponse>(`${API_PREFIX}${E.image(id)}`, formData);
}

export function getInventoryProductVariants(
  id: string | number
): Promise<ApiResponse<InventoryProductVariantsResponse>> {
  return api.get<InventoryProductVariantsResponse>(`${API_PREFIX}${E.variants(id)}`);
}

export function createInventoryVariantGroup(
  id: string | number,
  payload: CreateInventoryVariantGroupRequest
): Promise<ApiResponse<InventoryVariantGroupResponse>> {
  return api.post<InventoryVariantGroupResponse>(`${API_PREFIX}${E.variantGroups(id)}`, payload);
}

export function updateInventoryVariantGroup(
  id: string | number,
  groupId: string | number,
  payload: UpdateInventoryVariantGroupRequest
): Promise<ApiResponse<InventoryVariantGroupResponse>> {
  return api.patch<InventoryVariantGroupResponse>(
    `${API_PREFIX}${E.variantGroup(id, groupId)}`,
    payload
  );
}

export function uploadInventoryVariantGroupImage(
  id: string | number,
  groupId: string | number,
  file: File
): Promise<ApiResponse<InventoryVariantGroupResponse>> {
  const formData = new FormData();
  formData.append("image", file);
  return api.post<InventoryVariantGroupResponse>(
    `${API_PREFIX}${E.variantGroupImage(id, groupId)}`,
    formData
  );
}

export function archiveInventoryVariantGroup(
  id: string | number,
  groupId: string | number
): Promise<ApiResponse<null>> {
  return api.delete<null>(`${API_PREFIX}${E.variantGroup(id, groupId)}`);
}

export function createInventoryVariantOption(
  id: string | number,
  groupId: string | number,
  payload: CreateInventoryVariantOptionRequest
): Promise<ApiResponse<InventoryVariantOptionResponse>> {
  return api.post<InventoryVariantOptionResponse>(
    `${API_PREFIX}${E.variantGroupOptions(id, groupId)}`,
    payload
  );
}

export function updateInventoryVariantOption(
  id: string | number,
  optionId: string | number,
  payload: UpdateInventoryVariantOptionRequest
): Promise<ApiResponse<InventoryVariantOptionResponse>> {
  return api.patch<InventoryVariantOptionResponse>(
    `${API_PREFIX}${E.variantOption(id, optionId)}`,
    payload
  );
}

export function archiveInventoryVariantOption(
  id: string | number,
  optionId: string | number
): Promise<ApiResponse<null>> {
  return api.delete<null>(`${API_PREFIX}${E.variantOption(id, optionId)}`);
}

export function archiveInventoryProduct(
  id: string | number
): Promise<ApiResponse<null>> {
  return api.post<null>(`${API_PREFIX}${E.archive(id)}`);
}

export function unarchiveInventoryProduct(
  id: string | number
): Promise<ApiResponse<null>> {
  return api.post<null>(`${API_PREFIX}${E.unarchive(id)}`);
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
