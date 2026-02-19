/** @format */

import { API_PREFIX, api } from "./base";
import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import type {
  MarketplaceCartResponse,
  MarketplaceCheckoutRequest,
  MarketplaceGuestOrderStatusDetailResponse,
  MarketplaceGuestTrackRequest,
  MarketplaceGuestTrackResponse,
  MarketplaceOrderDetailResponse,
  MarketplaceOrderListResponse,
  MarketplaceOrderManualPaymentResponse,
  MarketplaceManualPaymentDecisionRequest,
  MarketplaceOrderReviewSubmitRequest,
  MarketplaceOrderResponse,
  MarketplaceOrderStatusUpdateRequest,
  MarketplaceProductListResponse,
  MarketplaceProductResponse,
  MarketplaceProductVariantsResponse,
  MarketplaceCustomerSummaryResponse,
  MarketplaceCustomerListResponse,
  MarketplaceCustomerDetailResponse,
  MarketplaceCustomerCreateRequest,
} from "@/types/api/marketplace";

const E = API_ENDPOINTS.marketplace;

const MARKETPLACE_CODE_TO_STATUS: Record<string, number> = {
  MARKETPLACE_DISABLED: 403,
  MARKETPLACE_FLAG_UNAVAILABLE: 503,
  FORBIDDEN_ROLE: 403,
  FORBIDDEN_TENANT: 403,
  FORBIDDEN_OWNERSHIP: 403,
  INVALID_TRACKING_TOKEN: 403,
  REVIEW_NOT_ELIGIBLE: 409,
  VALIDATION_ERROR: 400,
  RESOURCE_NOT_FOUND: 404,
  STATE_CONFLICT: 409,
  SERVICE_UNAVAILABLE: 503,
};

const DENY_CODES = new Set([
  "MARKETPLACE_DISABLED",
  "MARKETPLACE_FLAG_UNAVAILABLE",
  "FORBIDDEN_ROLE",
  "FORBIDDEN_TENANT",
  "FORBIDDEN_OWNERSHIP",
  "INVALID_TRACKING_TOKEN",
]);

const MARKETPLACE_DENY_REASON_MESSAGES: Partial<
  Record<MarketplaceErrorCode, string>
> = {
  MARKETPLACE_DISABLED:
    "Marketplace sedang dinonaktifkan untuk sementara oleh kebijakan sistem.",
  MARKETPLACE_FLAG_UNAVAILABLE:
    "Status feature flag marketplace tidak tersedia, sehingga akses dibatasi demi keamanan.",
  FORBIDDEN_ROLE:
    "Peran akun Anda tidak memiliki izin untuk aksi ini.",
  FORBIDDEN_TENANT:
    "Akses ditolak karena konteks tenant tidak sesuai.",
  FORBIDDEN_OWNERSHIP:
    "Akses ditolak karena pesanan ini tidak terkait dengan identitas pelacakan Anda.",
  INVALID_TRACKING_TOKEN:
    "Token pelacakan tidak valid atau sudah kedaluwarsa.",
};

export type MarketplaceErrorCode = keyof typeof MARKETPLACE_CODE_TO_STATUS;

export type MarketplaceApiErrorKind =
  | "deny"
  | "not_found"
  | "conflict"
  | "service_unavailable"
  | "validation"
  | "unknown";

export function getMarketplaceDenyReasonMessage(
  code?: MarketplaceErrorCode
): string | null {
  if (!code || !DENY_CODES.has(code)) {
    return null;
  }

  return MARKETPLACE_DENY_REASON_MESSAGES[code] ?? null;
}

export function withMarketplaceDenyReasonMessage(params: {
  fallbackMessage: string;
  code?: MarketplaceErrorCode;
}): string {
  const reason = getMarketplaceDenyReasonMessage(params.code);
  if (!reason) {
    return params.fallbackMessage;
  }
  return `${params.fallbackMessage} Alasan: ${reason}`;
}

export class MarketplaceApiError extends Error {
  readonly statusCode: number;
  readonly code?: MarketplaceErrorCode;
  readonly isDeny: boolean;
  readonly response?: ApiResponse<unknown>;

  constructor(params: {
    message: string;
    statusCode: number;
    code?: MarketplaceErrorCode;
    response?: ApiResponse<unknown>;
  }) {
    super(params.message);
    this.name = "MarketplaceApiError";
    this.statusCode = params.statusCode;
    this.code = params.code;
    this.isDeny = Boolean(params.code && DENY_CODES.has(params.code));
    this.response = params.response;
  }
}

function normalizeMarketplaceErrorCode(raw: unknown): MarketplaceErrorCode | undefined {
  if (typeof raw !== "string") {
    return undefined;
  }
  const normalized = raw.trim().toUpperCase();
  if (!normalized) {
    return undefined;
  }
  return normalized in MARKETPLACE_CODE_TO_STATUS
    ? (normalized as MarketplaceErrorCode)
    : undefined;
}

function extractMarketplaceErrorCode<T>(res: ApiResponse<T>): MarketplaceErrorCode | undefined {
  const fromPayload = normalizeMarketplaceErrorCode(res.error?.code);
  if (fromPayload) {
    return fromPayload;
  }

  const fromErrors = Object.keys(res.errors ?? {})
    .map((key) => normalizeMarketplaceErrorCode(key))
    .find(Boolean);
  if (fromErrors) {
    return fromErrors;
  }

  return normalizeMarketplaceErrorCode(res.message);
}

function inferMarketplaceStatusCode<T>(
  res: ApiResponse<T>,
  code?: MarketplaceErrorCode
): number {
  if (typeof res.meta?.status_code === "number" && res.meta.status_code > 0) {
    return res.meta.status_code;
  }
  if (code) {
    return MARKETPLACE_CODE_TO_STATUS[code];
  }
  return 500;
}

function buildMarketplaceErrorMessage<T>(res: ApiResponse<T>): string {
  const flattened =
    Object.entries(res.errors ?? {})
      .flatMap(([, errs]) => errs)
      .filter(Boolean)
      .join("; ") || "";
  return flattened || res.message || "Marketplace request failed.";
}

export function ensureMarketplaceSuccess<T>(res: ApiResponse<T>): T {
  if (res.success) {
    return res.data as T;
  }

  const code = extractMarketplaceErrorCode(res);
  throw new MarketplaceApiError({
    message: buildMarketplaceErrorMessage(res),
    statusCode: inferMarketplaceStatusCode(res, code),
    code,
    response: res as ApiResponse<unknown>,
  });
}

export function toMarketplaceApiError(err: unknown): MarketplaceApiError {
  if (err instanceof MarketplaceApiError) {
    return err;
  }
  if (err instanceof Error) {
    return new MarketplaceApiError({
      message: err.message,
      statusCode: 500,
    });
  }
  return new MarketplaceApiError({
    message: "Marketplace request failed.",
    statusCode: 500,
  });
}

export function classifyMarketplaceApiError(err: unknown): {
  kind: MarketplaceApiErrorKind;
  statusCode: number;
  code?: MarketplaceErrorCode;
  message: string;
  isDeny: boolean;
} {
  const parsed = toMarketplaceApiError(err);

  const kind: MarketplaceApiErrorKind = (() => {
    if (parsed.isDeny || parsed.statusCode === 403) return "deny";
    if (parsed.statusCode === 404) return "not_found";
    if (parsed.statusCode === 409) return "conflict";
    if (parsed.statusCode === 503) return "service_unavailable";
    if (parsed.statusCode === 400) return "validation";
    return "unknown";
  })();

  return {
    kind,
    statusCode: parsed.statusCode,
    code: parsed.code,
    message: parsed.message,
    isDeny: parsed.isDeny || parsed.statusCode === 403,
  };
}

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
    keepalive: true,
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

export function trackMarketplaceOrder(
  payload: MarketplaceGuestTrackRequest
): Promise<ApiResponse<MarketplaceGuestTrackResponse>> {
  return api.post<MarketplaceGuestTrackResponse>(`${API_PREFIX}${E.orderTrack}`, payload, {
    credentials: "include",
  });
}

export function getMarketplaceGuestOrderStatus(
  id: string | number,
  trackingToken: string
): Promise<ApiResponse<MarketplaceGuestOrderStatusDetailResponse>> {
  const query = new URLSearchParams({ tracking_token: trackingToken });
  return api.get<MarketplaceGuestOrderStatusDetailResponse>(
    `${API_PREFIX}${E.orderGuestStatus(id)}?${query.toString()}`,
    {
      credentials: "include",
    }
  );
}

export function submitMarketplaceOrderReview(
  id: string | number,
  payload: MarketplaceOrderReviewSubmitRequest
): Promise<ApiResponse<null>> {
  return api.post<null>(`${API_PREFIX}${E.orderReviews(id)}`, payload, {
    credentials: "include",
  });
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

export function createMarketplaceCustomer(
  payload: MarketplaceCustomerCreateRequest
): Promise<ApiResponse<MarketplaceCustomerSummaryResponse>> {
  return api.post<MarketplaceCustomerSummaryResponse>(`${API_PREFIX}${E.customers}`, payload);
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

export function decideMarketplaceManualPayment(
  id: string | number,
  payload: MarketplaceManualPaymentDecisionRequest
): Promise<ApiResponse<MarketplaceOrderDetailResponse>> {
  return api.patch<MarketplaceOrderDetailResponse>(
    `${API_PREFIX}${E.orderManualPaymentDecision(id)}`,
    payload
  );
}

export function submitMarketplaceManualPayment(
  id: string | number,
  payload: {
    file: File;
    tracking_token?: string;
    note?: string;
    bank_name?: string;
    account_name?: string;
    transfer_amount?: number;
    transfer_date?: string;
  }
): Promise<ApiResponse<MarketplaceOrderManualPaymentResponse>> {
  const formData = new FormData();
  formData.append("file", payload.file);
  if (payload.tracking_token) formData.append("tracking_token", payload.tracking_token);
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
