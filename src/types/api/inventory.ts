/** @format */

export type InventoryProductImage = {
  id: number;
  url: string;
  is_primary: boolean;
  sort_order: number;
};

export type InventoryProductResponse = {
  id: number;
  name: string;
  sku: string;
  price_sell: number;
  track_stock: boolean;
  category?: string;
  brand?: string;
  weight_kg?: number;
  photo_url?: string;
  images?: InventoryProductImage[];
  cost_price?: number;
  status: string;
  stock: number;
  description?: string;
  min_stock?: number;
  show_in_marketplace: boolean;
  has_variants?: boolean;
  variants_required?: boolean;
  variant_in_stock?: boolean;
  variant_price_valid?: boolean;
  featured_variant_group_id?: number | null;
  created_at?: number;
  updated_at?: number;
};

export type InventoryProductListResponse = {
  items: InventoryProductResponse[];
  total?: number;
  limit?: number;
  offset?: number;
};

export type CreateInventoryProductRequest = {
  name: string;
  price_sell: number;
  track_stock: boolean;
  category?: string;
  brand?: string;
  weight_kg?: number;
  photo_url?: string;
  cost_price?: number;
  sku?: string;
  description?: string;
  min_stock?: number;
  show_in_marketplace?: boolean;
};

export type UpdateInventoryProductRequest = {
  name?: string;
  price_sell?: number;
  track_stock?: boolean;
  category?: string;
  brand?: string;
  weight_kg?: number;
  photo_url?: string;
  cost_price?: number;
  sku?: string;
  description?: string;
  min_stock?: number;
  show_in_marketplace?: boolean;
  featured_variant_group_id?: number | null;
};

export type InventoryInitialStockRequest = {
  quantity: number;
  note?: string;
};

export type InventoryAdjustmentRequest = {
  physical_count: number;
  note?: string;
};

export type InventoryStockHistoryEntry = {
  id: number;
  type: string;
  reference?: string;
  note?: string;
  quantity: number;
  balance: number;
  timestamp: number;
};

export type InventoryVariantGroupResponse = {
  id: number;
  product_id: number;
  name: string;
  image_url?: string;
  sort_order: number;
  status: string;
  created_at: number;
  updated_at: number;
};

export type InventoryVariantOptionResponse = {
  id: number;
  product_id: number;
  variant_group_id: number;
  sku: string;
  attributes?: Record<string, string>;
  price_override?: number | null;
  stock: number;
  track_stock: boolean;
  image_url?: string;
  status: string;
  created_at: number;
  updated_at: number;
};

export type InventoryProductVariantsResponse = {
  product_id: number;
  variant_groups: InventoryVariantGroupResponse[];
  options: InventoryVariantOptionResponse[];
};

export type CreateInventoryVariantGroupRequest = {
  name: string;
  image_url?: string;
  sort_order?: number;
};

export type UpdateInventoryVariantGroupRequest = {
  name?: string;
  image_url?: string | null;
  sort_order?: number;
};

export type CreateInventoryVariantOptionRequest = {
  variant_group_id: number;
  sku: string;
  attributes?: Record<string, string>;
  price_override?: number | null;
  stock?: number;
  track_stock?: boolean;
  image_url?: string;
};

export type UpdateInventoryVariantOptionRequest = {
  sku?: string;
  attributes?: Record<string, string>;
  price_override?: number | null;
  clear_price_override?: boolean;
  stock?: number;
  track_stock?: boolean;
  image_url?: string;
  clear_image_url?: boolean;
};

export type InventoryCategoryResponse = {
  id: number;
  name: string;
  count: number;
};

export type InventoryProductStatsResponse = {
  product_id: number;
  total_sold: number;
  sold_last_30_days: number;
  sold_previous_30_days: number;
  sales_change_percent: number;
};
