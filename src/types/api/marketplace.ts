/** @format */

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
  product_id: number;
  product_name: string;
  product_sku: string;
  product_photo?: string;
  quantity: number;
  price: number;
  subtotal: number;
};

export type MarketplaceOrderSummaryResponse = {
  id: number;
  order_number: string;
  status: string;
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
  status: string;
  timestamp: number;
};

export type MarketplaceOrderResponse = {
  id: number;
  status: string;
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
  status: string;
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
  payment_method?: string;
  payment_reference?: string;
  shipping_method?: string;
  shipping_tracking_number?: string;
};

export type MarketplaceOrderStatusUpdateRequest = {
  status: string;
  reason?: string;
};
