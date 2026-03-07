/** @format */

"use client";

import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/shared/protected-route";

const SETTINGS_ALLOWED_ROLES = [
  "admin",
  "super_admin",
  "tenant admin",
  "manajer_bumdes",
  "support",
];

export default function BumdesSettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute
      requiredRole="bumdes"
      allowedRoles={SETTINGS_ALLOWED_ROLES}
    >
      {children}
    </ProtectedRoute>
  );
}
