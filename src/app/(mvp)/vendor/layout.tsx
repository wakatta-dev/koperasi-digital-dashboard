/** @format */

"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { BarChart3 } from "lucide-react";

// Sidebar navigation for Vendor section (PRD-aligned)
const navigation = [
  {
    name: "Account",
    href: "/vendor/account",
    icon: <BarChart3 className="h-4 w-4" />,
  },
];

const titleMap: Record<string, string> = {
  "/vendor/account": "User Management",
};

export default function VendorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const title = titleMap[pathname] ?? "Vendor";

  return (
    <ProtectedRoute requiredRole="vendor">
      <DashboardLayout title={title} navigation={navigation}>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
