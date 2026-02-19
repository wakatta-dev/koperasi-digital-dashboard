/** @format */

import {
  BarChart3,
  Calculator,
  FileText,
  Package,
  Settings,
  ShoppingBag,
} from "lucide-react";

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
    name: "Asset & Rental",
    href: "/bumdes/asset",
    icon: <Package className="h-4 w-4" />,
    items: [
      {
        name: "Daftar Aset",
        href: "/bumdes/asset/manajemen",
      },
      {
        name: "Penyewaan",
        href: "/bumdes/asset/penyewaan",
      },
      {
        name: "Pengajuan Sewa",
        href: "/bumdes/asset/pengajuan-sewa",
      },
      {
        name: "Pengembalian",
        href: "/bumdes/asset/pengembalian",
      },
      {
        name: "Master Data",
        href: "/bumdes/asset/master-data",
      },
    ],
  },
  {
    name: "Penjualan",
    href: "/bumdes/marketplace",
    icon: <ShoppingBag className="h-4 w-4" />,
    items: [
      {
        name: "Produk",
        href: "/bumdes/marketplace/inventory",
        items: [
          { name: "Daftar Produk", href: "/bumdes/marketplace/inventory" },
          {
            name: "Kategori Produk",
            href: "/bumdes/marketplace/inventory/categories",
          },
        ],
      },
      { name: "Pesanan", href: "/bumdes/marketplace/order" },
      { name: "Pelanggan", href: "/bumdes/marketplace/pelanggan" },
    ],
  },
  {
    name: "Accounting",
    href: "/bumdes/accounting/dashboard",
    icon: <Calculator className="h-4 w-4" />,
    items: [
      { name: "Dashboard", href: "/bumdes/accounting/dashboard" },
      { name: "Invoicing (AR)", href: "/bumdes/accounting/invoicing-ar" },
      { name: "Vendor Bills (AP)", href: "/bumdes/accounting/vendor-bills-ap" },
      {
        name: "Bank & Cash",
        href: "/bumdes/accounting/bank-cash",
        items: [
          { name: "Overview", href: "/bumdes/accounting/bank-cash/overview" },
          {
            name: "Rekonsiliasi",
            href: "/bumdes/accounting/bank-cash/reconciliation",
          },
        ],
      },
      { name: "Journal", href: "/bumdes/accounting/journal" },
      {
        name: "Tax",
        href: "/bumdes/accounting/tax",
        items: [
          { name: "Summary & Period", href: "/bumdes/accounting/tax" },
          { name: "PPN Details", href: "/bumdes/accounting/tax/ppn-details" },
          { name: "PPh Records", href: "/bumdes/accounting/tax/pph-records" },
          { name: "Export History", href: "/bumdes/accounting/tax/export-history" },
          { name: "e-Faktur Export", href: "/bumdes/accounting/tax/e-faktur-export" },
        ],
      },
      {
        name: "Reporting",
        href: "/bumdes/accounting/reporting",
        items: [
          { name: "Profit and Loss", href: "/bumdes/accounting/reporting/profit-loss" },
          { name: "Cash Flow Statement", href: "/bumdes/accounting/reporting/cash-flow" },
          { name: "Balance Sheet", href: "/bumdes/accounting/reporting/balance-sheet" },
          {
            name: "P&L Comparative",
            href: "/bumdes/accounting/reporting/p-and-l-comparative",
          },
          { name: "Trial Balance", href: "/bumdes/accounting/reporting/trial-balance" },
          { name: "General Ledger", href: "/bumdes/accounting/reporting/general-ledger" },
          { name: "Account Ledger", href: "/bumdes/accounting/reporting/account-ledger" },
        ],
      },
      {
        name: "Settings",
        href: "/bumdes/accounting/settings",
        items: [
          {
            name: "Chart of Accounts",
            href: "/bumdes/accounting/settings/chart-of-accounts",
          },
          {
            name: "Taxes",
            href: "/bumdes/accounting/settings/taxes",
          },
          {
            name: "Currencies",
            href: "/bumdes/accounting/settings/currencies",
          },
          {
            name: "Analytic & Budget",
            href: "/bumdes/accounting/settings/analytic-budgets",
          },
        ],
      },
    ],
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
  {
    name: "Pengaturan",
    href: "/bumdes/settings/general",
    icon: <Settings className="h-4 w-4" />,
    items: [
      { name: "General", href: "/bumdes/settings/general" },
      { name: "Users & Roles", href: "/bumdes/settings/users-roles" },
      { name: "Permissions", href: "/bumdes/settings/permissions" },
      { name: "Company Profile", href: "/bumdes/settings/company-profile" },
    ],
  },
];

export const bumdesTitleMap: Record<string, string> = {
  "/bumdes/dashboard": "Dashboard",
  "/bumdes/asset": "Asset & Rental",
  "/bumdes/asset/manajemen": "Asset & Rental - Daftar Aset",
  "/bumdes/asset/manajemen/tambah": "Asset & Rental - Tambah Aset",
  "/bumdes/asset/manajemen/edit": "Asset & Rental - Edit Aset",
  "/bumdes/asset/penyewaan": "Asset & Rental - Penyewaan",
  "/bumdes/asset/pengajuan-sewa": "Asset & Rental - Pengajuan Sewa",
  "/bumdes/asset/pengembalian": "Asset & Rental - Pengembalian",
  "/bumdes/asset/master-data": "Asset & Rental - Master Data",
  "/bumdes/asset/jadwal": "Asset & Rental - Penyewaan",
  "/bumdes/marketplace/inventory": "Penjualan - Produk",
  "/bumdes/marketplace/inventory/categories": "Penjualan - Kategori Produk",
  "/bumdes/marketplace/order": "Penjualan - Pesanan",
  "/bumdes/marketplace/pelanggan": "Penjualan - Pelanggan",
  "/bumdes/marketplace": "Penjualan",
  "/bumdes/accounting/dashboard": "Accounting - Dashboard",
  "/bumdes/accounting/invoicing-ar": "Accounting - Invoicing (AR)",
  "/bumdes/accounting/vendor-bills-ap": "Accounting - Vendor Bills (AP)",
  "/bumdes/accounting/vendor-bills-ap/[billNumber]":
    "Accounting - Vendor Bills (AP) - Bill Detail",
  "/bumdes/accounting/vendor-bills-ap/batch-payment":
    "Accounting - Vendor Bills (AP) - Batch Payment",
  "/bumdes/accounting/vendor-bills-ap/ocr-review":
    "Accounting - Vendor Bills (AP) - OCR Review",
  "/bumdes/accounting/vendor-bills-ap/payment-confirmation":
    "Accounting - Vendor Bills (AP) - Payment Confirmation",
  "/bumdes/accounting/bank-cash": "Accounting - Bank & Cash",
  "/bumdes/accounting/bank-cash/reconciliation":
    "Accounting - Bank & Cash - Reconciliation",
  "/bumdes/accounting/bank-cash/overview": "Accounting - Bank & Cash - Overview",
  "/bumdes/accounting/bank-cash/accounts/[accountId]/transactions":
    "Accounting - Bank & Cash - Account Transactions",
  "/bumdes/accounting/journal": "Accounting - Journal",
  "/bumdes/accounting/journal/new": "Accounting - Journal - New Entry",
  "/bumdes/accounting/journal/[journalNumber]":
    "Accounting - Journal - Entry Detail",
  "/bumdes/accounting/journal/audit-log": "Accounting - Journal - Audit Log",
  "/bumdes/accounting/tax": "Accounting - Tax",
  "/bumdes/accounting/tax/ppn-details": "Accounting - Tax - PPN Details",
  "/bumdes/accounting/tax/pph-records": "Accounting - Tax - PPh Records",
  "/bumdes/accounting/tax/export-history": "Accounting - Tax - Export History",
  "/bumdes/accounting/tax/e-faktur-export": "Accounting - Tax - e-Faktur Export",
  "/bumdes/accounting/reporting": "Accounting - Reporting",
  "/bumdes/accounting/reporting/profit-loss": "Accounting - Reporting - Profit and Loss",
  "/bumdes/accounting/reporting/cash-flow": "Accounting - Reporting - Cash Flow Statement",
  "/bumdes/accounting/reporting/balance-sheet": "Accounting - Reporting - Balance Sheet",
  "/bumdes/accounting/reporting/p-and-l-comparative":
    "Accounting - Reporting - P&L Comparative",
  "/bumdes/accounting/reporting/trial-balance": "Accounting - Reporting - Trial Balance",
  "/bumdes/accounting/reporting/general-ledger": "Accounting - Reporting - General Ledger",
  "/bumdes/accounting/reporting/account-ledger": "Accounting - Reporting - Account Ledger",
  "/bumdes/accounting/settings": "Accounting - Settings",
  "/bumdes/accounting/settings/chart-of-accounts":
    "Accounting - Settings - Chart of Accounts",
  "/bumdes/accounting/settings/taxes": "Accounting - Settings - Taxes",
  "/bumdes/accounting/settings/currencies": "Accounting - Settings - Currencies",
  "/bumdes/accounting/settings/analytic-budgets":
    "Accounting - Settings - Analytic & Budget",
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
  "/bumdes/settings/general": "Pengaturan - General",
  "/bumdes/settings/users-roles": "Pengaturan - Users & Roles",
  "/bumdes/settings/permissions": "Pengaturan - Permissions",
  "/bumdes/settings/company-profile": "Pengaturan - Company Profile",
};
