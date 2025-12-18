/** @format */

export type AssetStatus = "available" | "rented" | "maintenance";

export type AssetItem = {
  id: string;
  category: string;
  title: string;
  description: string;
  price: string;
  unit: string;
  status: AssetStatus;
  imageUrl: string;
};
