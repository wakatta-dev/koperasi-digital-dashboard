/** @format */

export type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: string;
  showInMarketplace: boolean;
  trackStock: boolean;
  category?: string;
  image?: string;
  description?: string;
  minStock?: number;
  costPrice?: number;
  marketplaceEligible: boolean;
  ineligibleReasons: string[];
};
