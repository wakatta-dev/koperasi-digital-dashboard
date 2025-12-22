/** @format */

export type InventoryProductResponse = {
  id: number;
  name: string;
  sku: string;
  price_sell: number;
  track_stock: boolean;
  category?: string;
  photo_url?: string;
  cost_price?: number;
  status: string;
  stock: number;
  description?: string;
  min_stock?: number;
  show_in_marketplace: boolean;
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
  photo_url?: string;
  cost_price?: number;
  sku?: string;
  description?: string;
  min_stock?: number;
  show_in_marketplace?: boolean;
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
