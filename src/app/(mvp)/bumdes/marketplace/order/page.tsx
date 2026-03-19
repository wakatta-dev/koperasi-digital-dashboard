/** @format */

import type { Metadata } from "next";

import { ProtectedRoute } from "@/components/shared/protected-route";
import { OrderListPage } from "@/modules/marketplace/components/penjualan/OrderListPage";

const MARKETPLACE_ADMIN_ALLOWED_ROLES = ["operator", "admin", "super_admin"];

export const metadata: Metadata = {
  title: "BUMDes - Marketplace - Order - Koperasi Digital",
  description: "BUMDes marketplace order page.",
};

export default function MarketplaceOrderPage() {
  return (
    <ProtectedRoute
      requiredRole="bumdes"
      allowedRoles={MARKETPLACE_ADMIN_ALLOWED_ROLES}
      fallbackPath="/bumdes/dashboard"
    >
      <div data-testid="marketplace-admin-order-route-root">
        <OrderListPage />
      </div>
    </ProtectedRoute>
  );
}
