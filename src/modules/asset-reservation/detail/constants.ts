/** @format */

import type { AssetItem } from "../types";
import { ASSET_ITEMS } from "../constants";

export type FacilityItem = {
  icon: string;
  label: string;
};

export type CalendarCellType =
  | "blank"
  | "disabled"
  | "available"
  | "booked"
  | "start"
  | "end"
  | "range"
  | "ellipsis";

export type CalendarCell = {
  type: CalendarCellType;
  label?: string;
};

export const DETAIL_ASSET = {
  id: "asset-1",
  title: "Gedung Serbaguna Kartika Runa Wijaya",
  category: "Gedung & Ruangan",
  price: "Rp350.000",
  unit: "/hari",
  status: "available" as const,
  location: "Jl. Persaudaraan no. 2 RT 004/002, Desa Sukamaju",
  heroImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAIKy98Qr9BaKfa4F9wbOvLAcsVleQBczGsYAKZQ2T_wf47SjNMo-A1iCxiEt2b1Qcb7swn3EeJOriZ9QIgLV6dsKdFFXxNHGCbkZh2DYDHMO2IdwdLrEQhTSt8Zp3XzFjgV8UOAAR0wcKQiez2mSN-mj3mQc1Z4Ydh8oSmyxdBgZySLhsgp_GulmDJideGh0Hnl3YfOoDtXN-xynfBdjWWS0xGk07vrVmNQdmNDXX1dZj5QGZe2rsxzABDybTlCCopy1RJD8vkmVE",
  thumbnails: [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAIKy98Qr9BaKfa4F9wbOvLAcsVleQBczGsYAKZQ2T_wf47SjNMo-A1iCxiEt2b1Qcb7swn3EeJOriZ9QIgLV6dsKdFFXxNHGCbkZh2DYDHMO2IdwdLrEQhTSt8Zp3XzFjgV8UOAAR0wcKQiez2mSN-mj3mQc1Z4Ydh8oSmyxdBgZySLhsgp_GulmDJideGh0Hnl3YfOoDtXN-xynfBdjWWS0xGk07vrVmNQdmNDXX1dZj5QGZe2rsxzABDybTlCCopy1RJD8vkmVE",
    "placeholder",
    "placeholder",
    "more",
  ],
  descriptions: [
    "Gedung Serbaguna Kartika Runa Wijaya adalah fasilitas desa yang dirancang untuk mengakomodasi berbagai kegiatan masyarakat dalam skala besar maupun menengah. Terletak strategis di pusat desa, gedung ini menawarkan akses yang mudah bagi seluruh warga.",
    "Dengan luas bangunan mencapai 400 meter persegi, gedung ini sangat ideal untuk penyelenggaraan resepsi pernikahan, pertemuan warga, seminar, pelatihan, maupun acara kesenian. Pencahayaan alami yang baik serta sirkulasi udara yang optimal menjamin kenyamanan pengguna.",
  ],
  facilities: [
    { icon: "ac_unit", label: "Air Conditioner (4 PK)" },
    { icon: "chair", label: "100 Kursi Lipat" },
    { icon: "table_restaurant", label: "10 Meja Panjang" },
    { icon: "speaker", label: "Sound System Standar" },
    { icon: "wc", label: "Toilet (Pria/Wanita)" },
    { icon: "local_parking", label: "Area Parkir Luas" },
  ] as FacilityItem[],
};

export const CALENDAR_MONTH = {
  label: "Oktober 2024",
  days: [
    { type: "blank" },
    { type: "blank" },
    { type: "disabled", label: "1" },
    { type: "disabled", label: "2" },
    { type: "available", label: "3" },
    { type: "booked", label: "4" },
    { type: "available", label: "5" },
    { type: "available", label: "6" },
    { type: "available", label: "7" },
    { type: "available", label: "8" },
    { type: "booked", label: "9" },
    { type: "booked", label: "10" },
    { type: "available", label: "11" },
    { type: "start", label: "12" },
    { type: "range", label: "13" },
    { type: "end", label: "14" },
    { type: "available", label: "15" },
    { type: "ellipsis", label: "..." },
    { type: "blank" },
    { type: "blank" },
    { type: "blank" },
  ] as CalendarCell[],
};

export const SELECTED_RANGE = {
  start: "12 Okt",
  end: "14 Okt",
  duration: "3 Hari",
};

export const getRecommendedAssets = (currentId?: string): AssetItem[] =>
  ASSET_ITEMS.filter((asset) => asset.id !== currentId).slice(0, 3);
