/** @format */

/** @format */

import type { Metadata } from "next";
import { MarketplacePage } from "@/modules/marketplace";

export const metadata: Metadata = {
  title: "Marketplace - BUMDes Sukamaju",
  description: "Temukan produk lokal terbaik dari desa Sukamaju.",
};

export default function Marketplace() {
  return <MarketplacePage />;
}
