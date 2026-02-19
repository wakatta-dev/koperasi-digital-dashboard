/** @format */

export const MARKETPLACE_CANONICAL_ORDER_STATUSES = [
  "PENDING_PAYMENT",
  "PAYMENT_VERIFICATION",
  "PROCESSING",
  "IN_DELIVERY",
  "COMPLETED",
  "CANCELED",
] as const;

export type MarketplaceOrderStatus =
  (typeof MARKETPLACE_CANONICAL_ORDER_STATUSES)[number];

export type MarketplaceLegacyOrderStatus =
  | "NEW"
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "CANCELED";

export type MarketplaceOrderStatusInput =
  | MarketplaceOrderStatus
  | MarketplaceLegacyOrderStatus;

export type MarketplaceReviewState = "not_eligible" | "eligible" | "submitted";
export type MarketplaceManualPaymentStatus =
  | "MANUAL_PAYMENT_SUBMITTED"
  | "WAITING_MANUAL_CONFIRMATION"
  | "CONFIRMED"
  | "REJECTED";

export type MarketplaceProductResponse = {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  track_stock: boolean;
  photo_url?: string;
  description?: string;
  show_in_marketplace: boolean;
  in_stock: boolean;
  has_variants?: boolean;
  variants_required?: boolean;
  primary_variant_group_id?: number;
  display_image_url?: string;
  min_price?: number;
  max_price?: number;
};

export type MarketplaceProductListResponse = {
  items: MarketplaceProductResponse[];
  total?: number;
  limit?: number;
  offset?: number;
  next_cursor?: string;
};

export type MarketplaceCartItemResponse = {
  id: number;
  product_id: number;
  product_name: string;
  product_sku: string;
  product_photo?: string;
  variant_group_id?: number;
  variant_group_name?: string;
  variant_option_id?: number;
  variant_attributes?: Record<string, string>;
  variant_sku?: string;
  variant_image_url?: string;
  quantity: number;
  price: number;
  subtotal: number;
  track_stock: boolean;
  stock: number;
  in_stock: boolean;
};

export type MarketplaceCartResponse = {
  id: number;
  status: string;
  items: MarketplaceCartItemResponse[];
  total: number;
  item_count: number;
};

export type MarketplaceCheckoutRequest = {
  fulfillment_method: "PICKUP" | "DELIVERY" | string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address?: string;
  notes?: string;
};

export type MarketplaceOrderItemResponse = {
  order_item_id?: number;
  product_id: number;
  product_name: string;
  product_sku: string;
  product_photo?: string;
  variant_group_id?: number;
  variant_group_name?: string;
  variant_option_id?: number;
  variant_attributes?: Record<string, string>;
  variant_sku?: string;
  variant_image_url?: string;
  quantity: number;
  price: number;
  subtotal: number;
};

export type MarketplaceOrderSummaryResponse = {
  id: number;
  order_number: string;
  status: MarketplaceOrderStatusInput;
  fulfillment_method: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  total: number;
  created_at: number;
};

export type MarketplaceOrderListResponse = {
  items: MarketplaceOrderSummaryResponse[];
  total?: number;
  limit?: number;
  offset?: number;
};

export type MarketplaceOrderStatusHistoryResponse = {
  status: MarketplaceOrderStatusInput;
  timestamp: number;
  reason?: string;
};

export type MarketplaceOrderManualPaymentResponse = {
  status: MarketplaceManualPaymentStatus;
  proof_url: string;
  proof_filename?: string;
  note?: string;
  bank_name?: string;
  account_name?: string;
  transfer_amount?: number;
  transfer_date?: string;
  submitted_by?: number;
  created_at: number;
  updated_at: number;
};

export type MarketplaceOrderResponse = {
  id: number;
  status: MarketplaceOrderStatusInput;
  fulfillment_method: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address?: string;
  notes?: string;
  total: number;
  items: MarketplaceOrderItemResponse[];
  created_at: number;
};

export type MarketplaceOrderDetailResponse = {
  id: number;
  order_number: string;
  status: MarketplaceOrderStatusInput;
  fulfillment_method: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address?: string;
  notes?: string;
  total: number;
  items: MarketplaceOrderItemResponse[];
  created_at: number;
  updated_at: number;
  status_history?: MarketplaceOrderStatusHistoryResponse[];
  manual_payment?: MarketplaceOrderManualPaymentResponse;
  payment_method?: string;
  payment_reference?: string;
  shipping_method?: string;
  shipping_tracking_number?: string;
  guest_tracking_enabled?: boolean;
  tracking_token?: string;
  review_state?: MarketplaceReviewState;
  review_submitted_at?: number;
};

export type MarketplaceOrderStatusUpdateRequest = {
  status: MarketplaceOrderStatusInput;
  reason?: string;
};

export type MarketplaceManualPaymentDecisionRequest = {
  status: MarketplaceManualPaymentStatus;
  reason?: string;
};

export type MarketplaceGuestTrackRequest = {
  order_number: string;
  contact: string;
};

export type MarketplaceGuestTrackResponse = {
  order_id: number;
  order_number: string;
  status: MarketplaceOrderStatusInput;
  tracking_token: string;
};

export type MarketplaceGuestOrderStatusDetailResponse = {
  id: number;
  order_number: string;
  status: MarketplaceOrderStatusInput;
  total: number;
  payment_method?: string;
  shipping_method?: string;
  shipping_tracking_number?: string;
  items: MarketplaceOrderItemResponse[];
  status_history: MarketplaceOrderStatusHistoryResponse[];
  review_state: MarketplaceReviewState;
};

export type MarketplaceOrderReviewItemSubmitRequest = {
  order_item_id: number;
  rating: number;
  comment?: string;
};

export type MarketplaceOrderReviewSubmitRequest = {
  tracking_token: string;
  overall_comment?: string;
  items: MarketplaceOrderReviewItemSubmitRequest[];
};

export type MarketplaceOrderReviewResponse = {
  order_id: number;
  review_state: MarketplaceReviewState;
  review_submitted_at: number;
};

export type MarketplaceVariantOptionResponse = {
  id: number;
  sku: string;
  attributes?: Record<string, string>;
  price: number;
  stock: number;
  track_stock: boolean;
};

export type MarketplaceVariantGroupResponse = {
  id: number;
  name: string;
  image_url?: string;
  options?: MarketplaceVariantOptionResponse[];
};

export type MarketplaceProductVariantsResponse = {
  product_id: number;
  cover_image?: string;
  groups?: MarketplaceVariantGroupResponse[];
};

export type MarketplaceCustomerSummaryResponse = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  member_since?: string;
  total_orders: number;
  total_spend: number;
  avg_spend: number;
  status: string;
  initials: string;
};

export type MarketplaceCustomerOrderSummaryResponse = {
  order_id: string;
  date: number;
  status: string;
  total: number;
};

export type MarketplaceCustomerActivityResponse = {
  id: string;
  title: string;
  timestamp: number;
  description: string;
  quote?: string;
  metadata?: string;
  type: string;
};

export type MarketplaceCustomerPaymentMethodResponse = {
  id: string;
  type: string;
  label: string;
  masked: string;
  expiry?: string;
  is_default: boolean;
};

export type MarketplaceCustomerDetailResponse = {
  customer: MarketplaceCustomerSummaryResponse;
  address?: string;
  orders?: MarketplaceCustomerOrderSummaryResponse[];
  activity?: MarketplaceCustomerActivityResponse[];
  payment_methods?: MarketplaceCustomerPaymentMethodResponse[];
};

export type MarketplaceCustomerListResponse = {
  items: MarketplaceCustomerSummaryResponse[];
  total?: number;
  limit?: number;
  offset?: number;
};

export type MarketplaceCustomerCreateRequest = {
  name: string;
  customer_type: "INDIVIDU" | "PERUSAHAAN";
  email?: string;
  phone?: string;
  address?: string;
  npwp?: string;
  status?: "ACTIVE" | "INACTIVE";
};
