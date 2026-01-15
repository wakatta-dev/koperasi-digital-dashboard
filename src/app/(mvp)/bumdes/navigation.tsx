/** @format */

import { BarChart3, Package, FileText, ShoppingBag } from "lucide-react";
import { IconUsersGroup } from "@tabler/icons-react";

// Sidebar navigation for BUMDes MVP section
export const bumdesNavigation = [
  {
    name: "Dashboard",
    href: "/bumdes/dashboard",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    name: "Landing Page",
    href: "/bumdes/landing-page",
    icon: <FileText className="h-4 w-4" />,
    items: [
      {
        name: "Identitas & Navigasi",
        href: "/bumdes/landing-page/identitas-navigasi",
      },
      { name: "Hero Section", href: "/bumdes/landing-page/hero-section" },
      { name: "Tentang BUMDes", href: "/bumdes/landing-page/tentang-bumdes" },
      { name: "Unit Usaha", href: "/bumdes/landing-page/unit-usaha" },
      { name: "Produk Unggulan", href: "/bumdes/landing-page/produk-unggulan" },
      { name: "Keunggulan", href: "/bumdes/landing-page/keunggulan" },
      { name: "Testimoni", href: "/bumdes/landing-page/testimoni" },
      { name: "Footer & Kontak", href: "/bumdes/landing-page/footer-kontak" },
    ],
  },
  {
    name: "Manajemen Aset",
    href: "/bumdes/asset/manajemen",
    icon: <Package className="h-4 w-4" />,
  },
  {
    name: "Marketplace",
    href: "/bumdes/marketplace",
    icon: <ShoppingBag className="h-4 w-4" />,
    items: [
      { name: "Inventaris", href: "/bumdes/marketplace/inventory" },
      { name: "Pesanan", href: "/bumdes/marketplace/order" },
    ],
  },
  {
    name: "Team",
    href: "/bumdes/team",
    icon: <IconUsersGroup className="h-4 w-4" />,
  },
  {
    name: "Laporan Keuangan",
    href: "/bumdes/report/ringkasan",
    icon: <FileText className="h-4 w-4" />,
    items: [
      { name: "Ringkasan", href: "/bumdes/report/ringkasan" },
      { name: "Laba/Rugi", href: "/bumdes/report/laba-rugi" },
      { name: "Arus Kas", href: "/bumdes/report/arus-kas" },
      { name: "Neraca", href: "/bumdes/report/neraca" },
      { name: "Penjualan Rinci", href: "/bumdes/report/penjualan-rinci" },
    ],
  },
];

export const bumdesTitleMap: Record<string, string> = {
  "/bumdes/dashboard": "Dashboard",
  "/bumdes/asset": "Asset",
  "/bumdes/marketplace/inventory": "Marketplace - Inventaris",
  "/bumdes/marketplace/order": "Marketplace - Pesanan",
  "/bumdes/marketplace": "Marketplace",
  "/bumdes/pos": "Point of Sales",
  "/bumdes/rent": "Rent",
  "/bumdes/landing-page": "Landing Page",
  "/bumdes/landing-page/identitas-navigasi":
    "Landing Page - Identitas & Navigasi",
  "/bumdes/landing-page/hero-section": "Landing Page - Hero Section",
  "/bumdes/landing-page/tentang-bumdes": "Landing Page - Tentang BUMDes",
  "/bumdes/landing-page/unit-usaha": "Landing Page - Unit Usaha",
  "/bumdes/landing-page/produk-unggulan": "Landing Page - Produk Unggulan",
  "/bumdes/landing-page/keunggulan": "Landing Page - Keunggulan",
  "/bumdes/landing-page/testimoni": "Landing Page - Testimoni",
  "/bumdes/landing-page/footer-kontak": "Landing Page - Footer & Kontak",
  "/bumdes/report": "Report",
  "/bumdes/report/ringkasan": "Report - Ringkasan",
  "/bumdes/report/laba-rugi": "Report - Laba/Rugi",
  "/bumdes/report/arus-kas": "Report - Arus Kas",
  "/bumdes/report/neraca": "Report - Neraca",
  "/bumdes/report/penjualan-rinci": "Report - Penjualan Rinci",
};
