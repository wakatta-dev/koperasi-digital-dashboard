/** @format */

export type InventoryItem = {
  id: string;
  listingId?: string | number;
  name: string;
  sku: string;
  price: number;
  product: any;
  stock: number;
  status: string;
  categoryClassName: string;
  showInMarketplace: boolean;
  trackStock: boolean;
  category?: string;
  image?: string;
  sellerId?: string | number;
  ownershipMode?: string;
  channelTarget?: string;
  publishabilityState?: string;
  sourceStockType?: string;
  sourceStockReference?: string;
  images?: Array<{
    id: number;
    url: string;
    is_primary: boolean;
    sort_order: number;
  }>;
  brand?: string;
  weightKg?: number;
  createdAt?: number;
  description?: string;
  minStock?: number;
  costPrice?: number;
  marketplaceEligible: boolean;
  ineligibleReasons: string[];
  marketplacePublicationReady: boolean;
  marketplacePublicationIssues: string[];
};
