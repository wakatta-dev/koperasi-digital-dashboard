/** @format */

import { API_PREFIX, api } from "./base";
import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import type {
  MarketplaceCartResponse,
  MarketplaceCheckoutRequest,
  MarketplaceOrderDetailResponse,
  MarketplaceOrderListResponse,
  MarketplaceOrderManualPaymentResponse,
  MarketplaceOrderResponse,
  MarketplaceOrderStatusUpdateRequest,
  MarketplaceProductListResponse,
  MarketplaceProductResponse,
  MarketplaceProductVariantsResponse,
  MarketplaceCustomerListResponse,
  MarketplaceCustomerDetailResponse,
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

export function getMarketplaceProductVariants(
  id: string | number
): Promise<ApiResponse<MarketplaceProductVariantsResponse>> {
  return api.get<MarketplaceProductVariantsResponse>(
    `${API_PREFIX}${E.productVariants(id)}`
  );
}

export function getMarketplaceCart(): Promise<ApiResponse<MarketplaceCartResponse>> {
  return api.get<MarketplaceCartResponse>(`${API_PREFIX}${E.cart}`, {
    credentials: "include",
  });
}

export function addMarketplaceCartItem(payload: {
  product_id: number;
  quantity: number;
  variant_group_id?: number;
  variant_option_id?: number;
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

export function listMarketplaceOrders(params?: {
  q?: string;
  status?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
  sort?: string;
}): Promise<ApiResponse<MarketplaceOrderListResponse>> {
  const search = new URLSearchParams();
  if (params?.q) search.set("q", params.q);
  if (params?.status) search.set("status", params.status);
  if (params?.from) search.set("from", params.from);
  if (params?.to) search.set("to", params.to);
  if (params?.limit !== undefined) search.set("limit", String(params.limit));
  if (params?.offset !== undefined) search.set("offset", String(params.offset));
  if (params?.sort) search.set("sort", params.sort);
  const query = search.toString() ? `?${search.toString()}` : "";
  return api.get<MarketplaceOrderListResponse>(`${API_PREFIX}${E.orders}${query}`);
}

export function listMarketplaceCustomers(params?: {
  q?: string;
  status?: string;
  min_orders?: number;
  max_orders?: number;
  limit?: number;
  offset?: number;
  sort?: string;
}): Promise<ApiResponse<MarketplaceCustomerListResponse>> {
  const search = new URLSearchParams();
  if (params?.q) search.set("q", params.q);
  if (params?.status) search.set("status", params.status);
  if (params?.min_orders !== undefined)
    search.set("min_orders", String(params.min_orders));
  if (params?.max_orders !== undefined)
    search.set("max_orders", String(params.max_orders));
  if (params?.limit !== undefined) search.set("limit", String(params.limit));
  if (params?.offset !== undefined) search.set("offset", String(params.offset));
  if (params?.sort) search.set("sort", params.sort);
  const query = search.toString() ? `?${search.toString()}` : "";
  return api.get<MarketplaceCustomerListResponse>(`${API_PREFIX}${E.customers}${query}`);
}

export function getMarketplaceCustomerDetail(
  id: string | number
): Promise<ApiResponse<MarketplaceCustomerDetailResponse>> {
  return api.get<MarketplaceCustomerDetailResponse>(`${API_PREFIX}${E.customer(id)}`);
}

export function getMarketplaceOrderDetail(
  id: string | number
): Promise<ApiResponse<MarketplaceOrderDetailResponse>> {
  return api.get<MarketplaceOrderDetailResponse>(`${API_PREFIX}${E.order(id)}`);
}

export function updateMarketplaceOrderStatus(
  id: string | number,
  payload: MarketplaceOrderStatusUpdateRequest
): Promise<ApiResponse<MarketplaceOrderDetailResponse>> {
  return api.patch<MarketplaceOrderDetailResponse>(
    `${API_PREFIX}${E.orderStatus(id)}`,
    payload
  );
}

export function submitMarketplaceManualPayment(
  id: string | number,
  payload: {
    file: File;
    note?: string;
    bank_name?: string;
    account_name?: string;
    transfer_amount?: number;
    transfer_date?: string;
  }
): Promise<ApiResponse<MarketplaceOrderManualPaymentResponse>> {
  const formData = new FormData();
  formData.append("file", payload.file);
  if (payload.note) formData.append("note", payload.note);
  if (payload.bank_name) formData.append("bank_name", payload.bank_name);
  if (payload.account_name) formData.append("account_name", payload.account_name);
  if (payload.transfer_amount !== undefined)
    formData.append("transfer_amount", String(payload.transfer_amount));
  if (payload.transfer_date) formData.append("transfer_date", payload.transfer_date);

  return api.post<MarketplaceOrderManualPaymentResponse>(
    `${API_PREFIX}${E.orderManualPayment(id)}`,
    formData,
    { credentials: "include" }
  );
}
