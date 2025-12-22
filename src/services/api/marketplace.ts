/** @format */

import { API_PREFIX, api } from "./base";
import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import type {
  MarketplaceCartResponse,
  MarketplaceCheckoutRequest,
  MarketplaceOrderResponse,
  MarketplaceProductListResponse,
  MarketplaceProductResponse,
} from "@/types/api/marketplace";

const E = API_ENDPOINTS.marketplace;

export function getMarketplaceProducts(params?: {
  q?: string;
  offset?: number;
  limit?: number;
  include_hidden?: boolean;
  min_price?: number;
  max_price?: number;
  sort?: string;
}): Promise<ApiResponse<MarketplaceProductListResponse>> {
  const search = new URLSearchParams();
  if (params?.q) search.set("q", params.q);
  if (params?.offset !== undefined) search.set("offset", String(params.offset));
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.include_hidden) search.set("include_hidden", "true");
  if (params?.min_price !== undefined) search.set("min_price", String(params.min_price));
  if (params?.max_price !== undefined) search.set("max_price", String(params.max_price));
  if (params?.sort) search.set("sort", params.sort);
  const query = search.toString() ? `?${search.toString()}` : "";
  return api.get<MarketplaceProductListResponse>(`${API_PREFIX}${E.products}${query}`);
}

export function getMarketplaceProductDetail(
  id: string | number
): Promise<ApiResponse<MarketplaceProductResponse>> {
  return api.get<MarketplaceProductResponse>(`${API_PREFIX}${E.product(id)}`);
}

export function getMarketplaceCart(): Promise<ApiResponse<MarketplaceCartResponse>> {
  return api.get<MarketplaceCartResponse>(`${API_PREFIX}${E.cart}`, {
    credentials: "include",
  });
}

export function addMarketplaceCartItem(payload: {
  product_id: number;
  quantity: number;
}): Promise<ApiResponse<null>> {
  return api.post<null>(`${API_PREFIX}${E.cartItem}`, payload, {
    credentials: "include",
  });
}

export function updateMarketplaceCartItem(
  itemId: string | number,
  payload: { quantity: number }
): Promise<ApiResponse<null>> {
  return api.patch<null>(`${API_PREFIX}${E.cartItemById(itemId)}`, payload, {
    credentials: "include",
  });
}

export function removeMarketplaceCartItem(
  itemId: string | number
): Promise<ApiResponse<null>> {
  return api.delete<null>(`${API_PREFIX}${E.cartItemById(itemId)}`, {
    credentials: "include",
  });
}

export function checkoutMarketplace(
  payload: MarketplaceCheckoutRequest
): Promise<ApiResponse<MarketplaceOrderResponse>> {
  return api.post<MarketplaceOrderResponse>(`${API_PREFIX}${E.checkout}`, payload, {
    credentials: "include",
  });
}
