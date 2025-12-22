/** @format */

export type MarketplaceFilters = {
  categories: string[];
  priceMin?: number;
  priceMax?: number;
  producer?: string;
};

export const DEFAULT_MARKETPLACE_FILTERS: MarketplaceFilters = {
  categories: ["all"],
  producer: "all",
};
