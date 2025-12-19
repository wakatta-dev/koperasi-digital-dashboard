/** @format */

export type AssetItem = {
  id: string;
  title: string;
  price: string;
  unit: string;
  image: string;
  alt: string;
  status?: string;
  rateType?: string;
  rateAmount?: number;
  description?: string;
};

export type AssetSchedule = {
  id: string;
  assetName: string;
  assetId: string;
  renterCompany: string;
  renterName: string;
  start: string;
  end: string;
  duration: string;
  timeRange?: string;
  backendStatus?: string;
  status:
    | "Confirmed"
    | "Pending"
    | "Reserved"
    | "Finished"
    | "Cancelled"
    | "Dipesan"
    | "Menunggu Pembayaran"
    | "Berlangsung"
    | "Selesai";
  price?: string;
  thumbnail: string;
  faded?: boolean;
};
