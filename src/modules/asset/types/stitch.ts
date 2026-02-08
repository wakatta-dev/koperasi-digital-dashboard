/** @format */

export type AssetStatusLabel = "Tersedia" | "Dipinjam" | "Maintenance" | "Arsip";

export type AssetListItem = Readonly<{
  id: string;
  assetTag: string;
  name: string;
  category: string;
  status: AssetStatusLabel;
  location: string;
  thumbnailIcon: string | null;
  quickFlags: string[];
}>;

export type SummaryCard = Readonly<{
  id: string;
  label: string;
  value: string;
  trendLabel: string | null;
  trendType: "positive" | "warning" | "neutral" | null;
}>;

export type KeyValueSpec = Readonly<{
  key: string;
  value: string;
}>;

export type ActivityRow = Readonly<{
  id: string;
  renterName: string;
  renterContact: string;
  startDate: string;
  endDate: string;
  duration: string;
  status: string;
}>;

export type AssetDetailModel = Readonly<{
  assetId: string;
  name: string;
  photoUrl: string;
  assetTag: string;
  status: string;
  category: string;
  location: string;
  summaryCards: SummaryCard[];
  specifications: KeyValueSpec[];
  activityRows: ActivityRow[];
}>;

export type AssetAttribute = Readonly<{
  id: string;
  label: string;
  value: string;
}>;

export type AssetFormModel = Readonly<{
  mode: "create" | "edit";
  name: string;
  photoUrl: string;
  imageFile: File | null;
  assetTag: string;
  serialNumber: string;
  category: string;
  status: string;
  location: string;
  assignedTo: string;
  purchaseDate: string;
  vendor: string;
  priceDisplay: string;
  warrantyEndDate: string;
  attributes: AssetAttribute[];
}>;
