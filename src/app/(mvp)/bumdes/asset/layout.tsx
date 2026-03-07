/** @format */

"use client";

import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/shared/protected-route";

const ASSET_ALLOWED_ROLES = [
  "operator",
  "admin_unit",
  "kasir",
  "kasir_unit",
  "pemilik_toko",
  "admin",
  "super_admin",
  "tenant admin",
  "manajer_bumdes",
];

export default function BumdesAssetLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="bumdes" allowedRoles={ASSET_ALLOWED_ROLES}>
      {children}
    </ProtectedRoute>
  );
}
