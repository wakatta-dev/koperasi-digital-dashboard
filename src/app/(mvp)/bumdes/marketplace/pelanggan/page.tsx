/** @format */

import type { Metadata } from "next";

import { ProtectedRoute } from "@/components/shared/protected-route";
import { CustomerListPage } from "@/modules/marketplace/components/penjualan/CustomerListPage";

const MARKETPLACE_ADMIN_ALLOWED_ROLES = ["operator", "admin", "super_admin"];

export const metadata: Metadata = {
  title: "BUMDes - Marketplace - Pelanggan - Koperasi Digital",
  description: "BUMDes marketplace pelanggan page.",
};

export default function MarketplacePelangganPage() {
  return (
    <ProtectedRoute
      requiredRole="bumdes"
      allowedRoles={MARKETPLACE_ADMIN_ALLOWED_ROLES}
      fallbackPath="/bumdes/dashboard"
    >
      <div data-testid="marketplace-admin-customer-route-root">
        <CustomerListPage />
      </div>
    </ProtectedRoute>
  );
}
