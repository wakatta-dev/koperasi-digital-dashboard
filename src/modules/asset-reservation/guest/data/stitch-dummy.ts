/** @format */

import type { GuestAssetCardItem, GuestAssetCategoryChip } from "../types";

export const STITCH_GUEST_CATEGORIES: ReadonlyArray<GuestAssetCategoryChip> = [
  { key: "all", label: "Semua", icon: "grid_view", tone: "primary" },
  { key: "Pertanian", label: "Pertanian", icon: "agriculture", tone: "orange" },
  { key: "Properti", label: "Properti", icon: "apartment", tone: "blue" },
  { key: "Transportasi", label: "Transportasi", icon: "local_shipping", tone: "emerald" },
  { key: "Perlengkapan", label: "Perlengkapan", icon: "chair", tone: "purple" },
] as const;

export const STITCH_GUEST_ASSETS: ReadonlyArray<GuestAssetCardItem> = [
  {
    id: 99210,
    category: "Pertanian",
    statusLabel: "Tersedia",
    statusTone: "available",
    title: "Traktor Roda Empat",
    description:
      "Traktor berkapasitas besar untuk membajak sawah dengan efisien. Cocok untuk lahan luas.",
    priceLabel: "Rp 150rb",
    unitLabel: "/hari",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAwSGMYcLZtj4PM-djQq2tRLg0RxjvGsPtm2xF8jrmFKoYqXOmD2jdkld3WdcS3q0uszZbcK5WEbxeFwBCXX7Uua3p6LpYnRnPWTDgjR_9hWqeWAgUFWPHNqnV__Od6dszJjpGgb6we_VrbbOzmkiBd7TeWlGMb_kx5TUlGwgeQ9bMcrBxTONcvwMHeEMgra10p5EwKtx4G0MxOFT5DV8OytHVd3idENFDm8LwwlEaIdQ-c8VOJSay3YRlg1gPlxtpFME1fRzVKh_0",
    featured: false,
  },
  {
    id: 99211,
    category: "Properti",
    statusLabel: "Tersedia",
    statusTone: "available",
    title: "Gedung Serbaguna Desa",
    description:
      "Gedung serbaguna untuk acara pernikahan, rapat, dan kegiatan masyarakat. Kapasitas hingga 200 orang.",
    priceLabel: "Rp 500.000",
    unitLabel: "/hari",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAA8TCGhlTf_5KcXBgjl-368biE5rqlzDNqAnQM45epP81e-opj1AwfwhpiJ8OmtOG9Iw5Fk6tyk5oPhD6oLz4PwXkxKG74yFMJ2en37xFhfh_sjeriVdQFBjPJ7zxW-ak91muQCrYz8ZV-v-73vKq4rBKJAe9Ygr3jIPKPjGUFKYeL7OOMeocuhY-Oxk-DZiK4rZYzfzcB8T6zm5I5sW4AOr0qOWOCFBA03uiL0ogZipam2lEhXHN4TgZ9u22CLMfxysVuge5AeAM",
    featured: true,
  },
] as const;

