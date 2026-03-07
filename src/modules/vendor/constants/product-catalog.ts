/** @format */

import type { SupportOperationalSettings } from "@/types/api";

export type VendorProductCatalogStatus = "active" | "inactive" | "configured";

export type VendorProductCatalogEntry = {
  id: string;
  code: string;
  name: string;
  summary: string;
  description: string;
  billing_cycle: string;
  audiences: string[];
  capabilities: string[];
  status: VendorProductCatalogStatus;
  status_helper: string;
};

type CatalogBlueprint = Omit<
  VendorProductCatalogEntry,
  "status" | "status_helper"
> & {
  getStatus: (
    settings?: SupportOperationalSettings
  ) => Pick<VendorProductCatalogEntry, "status" | "status_helper">;
};

const PRODUCT_BLUEPRINTS: CatalogBlueprint[] = [
  {
    id: "vendor-admin-console",
    code: "vendor-admin-console",
    name: "Vendor Admin Console",
    summary: "Kontrol tenant, invoice, role internal, dan operasional vendor.",
    description:
      "Module inti untuk pemilik SaaS mengelola tenant lintas organisasi melalui admin tenant management, account management, invoicing, dan settings operasional.",
    billing_cycle: "Platform Core",
    audiences: ["Vendor owner", "Support", "Finance"],
    capabilities: [
      "Tenant list dan detail",
      "Tenant account management",
      "Invoice lifecycle SaaS",
      "Internal role dan permission management",
    ],
    getStatus: () => ({
      status: "configured",
      status_helper: "Selalu aktif sebagai workspace operasional vendor.",
    }),
  },
  {
    id: "accounting-billing-suite",
    code: "accounting-billing-suite",
    name: "Accounting & Billing Suite",
    summary: "AR invoicing, payment tracking, dan kebijakan accounting dasar.",
    description:
      "Paket accounting dan billing yang menopang invoice SaaS, payment status, payment terms, dan preference accounting tenant/vendor.",
    billing_cycle: "Monthly / Annual",
    audiences: ["Finance", "Owner"],
    capabilities: [
      "Invoice AR",
      "Payment status tracking",
      "Accounting defaults",
      "Billing operations snapshot",
    ],
    getStatus: (settings) => ({
      status: settings?.marketplace_accounting?.accounting ? "configured" : "inactive",
      status_helper: settings?.marketplace_accounting?.accounting
        ? "Konfigurasi accounting tersedia di support operational settings."
        : "Belum ada konfigurasi accounting yang dapat dibaca.",
    }),
  },
  {
    id: "marketplace-commerce",
    code: "marketplace-commerce",
    name: "Marketplace Commerce",
    summary: "Katalog produk, order lifecycle, pelanggan, dan pembayaran manual.",
    description:
      "Capability commerce untuk tenant yang menjalankan marketplace, termasuk pengaturan guest checkout, low stock threshold, dan payment window.",
    billing_cycle: "Addon",
    audiences: ["BUMDes", "Koperasi", "UMKM"],
    capabilities: [
      "Catalog dan order management",
      "Customer management",
      "Manual payment control",
      "Marketplace operations settings",
    ],
    getStatus: (settings) =>
      settings?.modules.feature_flags.marketplace_enabled
        ? {
            status: "active",
            status_helper: "Feature flag marketplace aktif pada workspace saat ini.",
          }
        : {
            status: "inactive",
            status_helper: "Feature flag marketplace belum diaktifkan.",
          },
  },
  {
    id: "inventory-pos",
    code: "inventory-pos",
    name: "Inventory & POS",
    summary: "Master stok, tracking inventory, dan dukungan titik penjualan.",
    description:
      "Capability untuk pengelolaan stok dan POS, termasuk inventory listing dan readiness untuk operasi produk yang lebih intensif.",
    billing_cycle: "Addon",
    audiences: ["Retail tenant", "BUMDes", "UMKM"],
    capabilities: [
      "Inventory management",
      "Stock monitoring",
      "POS readiness",
      "Operational enablement",
    ],
    getStatus: (settings) =>
      settings?.modules.feature_flags.inventory_enabled ||
      settings?.modules.feature_flags.pos_enabled
        ? {
            status: "active",
            status_helper: "Inventory atau POS feature flag aktif pada workspace saat ini.",
          }
        : {
            status: "inactive",
            status_helper: "Inventory dan POS belum diaktifkan.",
          },
  },
  {
    id: "asset-rental",
    code: "asset-rental",
    name: "Asset Rental",
    summary: "Manajemen aset, reservasi, approval, dan pengaturan deposit.",
    description:
      "Module asset rental untuk tenant yang menyewakan aset dengan dukungan approval policy, default slot duration, dan fee operasional.",
    billing_cycle: "Addon",
    audiences: ["BUMDes", "Koperasi"],
    capabilities: [
      "Asset management",
      "Reservation workflow",
      "Approval control",
      "Late fee dan DP configuration",
    ],
    getStatus: (settings) =>
      settings?.modules.feature_flags.asset_rental_enabled
        ? {
            status: "active",
            status_helper: "Feature flag asset rental aktif pada workspace saat ini.",
          }
        : {
            status: "inactive",
            status_helper: "Asset rental belum diaktifkan.",
          },
  },
  {
    id: "analytics-reporting",
    code: "analytics-reporting",
    name: "Analytics & Reporting",
    summary: "Dashboard KPI, rangkuman performa, dan laporan operasional.",
    description:
      "Capability reporting untuk tenant dan vendor dengan dukungan KPI summary, laporan operasional, dan visibility performa lintas module.",
    billing_cycle: "Included / Addon",
    audiences: ["Owner", "Manager", "Finance"],
    capabilities: [
      "KPI dashboard",
      "Summary reporting",
      "Operational insight",
      "Cross-module visibility",
    ],
    getStatus: (settings) =>
      settings?.modules.feature_flags.reports_enabled
        ? {
            status: "active",
            status_helper: "Feature flag reports aktif pada workspace saat ini.",
          }
        : {
            status: "inactive",
            status_helper: "Reporting belum diaktifkan.",
          },
  },
  {
    id: "notifications-ops",
    code: "notifications-ops",
    name: "Notification Ops",
    summary: "Monitoring delivery channel dan broadcast operasional vendor.",
    description:
      "Capability notifikasi untuk memantau delivery notification lintas channel dan menjalankan komunikasi terstruktur berbasis template email.",
    billing_cycle: "Platform Core",
    audiences: ["Support", "Operations"],
    capabilities: [
      "Notification metrics",
      "Channel monitoring",
      "Mark read workflow",
      "Template based broadcast email",
    ],
    getStatus: () => ({
      status: "configured",
      status_helper: "Didukung endpoint notifications dan support email yang sudah tersedia.",
    }),
  },
];

export function getVendorProductCatalog(
  settings?: SupportOperationalSettings
): VendorProductCatalogEntry[] {
  return PRODUCT_BLUEPRINTS.map((item) => ({
    ...item,
    ...item.getStatus(settings),
  }));
}

export function getVendorProductByCode(
  code: string,
  settings?: SupportOperationalSettings
) {
  return getVendorProductCatalog(settings).find((item) => item.code === code);
}
