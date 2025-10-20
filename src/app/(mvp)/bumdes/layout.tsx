/** @format */

"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { DashboardLayout } from "@/components/shared/dashboard-layout";
import {
  BarChart3,
  Package,
  Users,
  FileText,
  Bell,
  Ticket,
  Shield,
} from "lucide-react";

// Sidebar navigation for Vendor section (PRD-aligned)
const navigation = [
  {
    name: "Dashboard",
    href: "/bumdes/dashboard",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    name: "Plans",
    href: "/bumdes/plans",
    icon: <Package className="h-4 w-4" />,
  },
  {
    name: "Clients",
    href: "/bumdes/clients",
    icon: <Users className="h-4 w-4" />,
  },
  {
    name: "Invoices",
    href: "/bumdes/invoices",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    name: "User Management",
    href: "/bumdes/users",
    icon: <Users className="h-4 w-4" />,
  },
  {
    name: "Role Management",
    href: "/bumdes/roles",
    icon: <Shield className="h-4 w-4" />,
  },
  {
    name: "Notifications",
    href: "/bumdes/notifications",
    icon: <Bell className="h-4 w-4" />,
  },
  {
    name: "Trouble Tickets",
    href: "/bumdes/tickets",
    icon: <Ticket className="h-4 w-4" />,
  },
];

const titleMap: Record<string, string> = {
  "/bumdes/dashboard": "Vendor Dashboard",
  "/bumdes/plans": "Plans Management",
  "/bumdes/clients": "Clients Management",
  "/bumdes/invoices": "Invoices Management",
  "/bumdes/users": "User Management",
  "/bumdes/roles": "Role Management",
  "/bumdes/notifications": "Notifications",
  "/bumdes/tickets": "Trouble Tickets",
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
