/** @format */

"use client";

import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/shared/protected-route";

const ACCOUNTING_ALLOWED_ROLES = [
  "finance",
  "admin_keuangan",
  "bendahara",
  "auditor",
  "auditor_viewer",
  "admin",
  "super_admin",
  "tenant admin",
  "manajer_bumdes",
];

export default function BumdesAccountingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute
      requiredRole="bumdes"
      allowedRoles={ACCOUNTING_ALLOWED_ROLES}
    >
      {children}
    </ProtectedRoute>
  );
}
