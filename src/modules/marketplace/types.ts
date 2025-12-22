/** @format */

import type {
  MarketplaceProduct,
  MarketplaceProductDetail as StaticProductDetail,
} from "./constants";

export type MarketplaceRelatedProduct = MarketplaceProduct;

export type MarketplaceProductDetail = StaticProductDetail & {
  id: string;
};
