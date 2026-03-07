/** @format */

import type { ReactNode } from "react";
import {
  BellRing,
  CreditCard,
  FolderKanban,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import { VENDOR_ROUTES } from "./routes";

export type VendorNavigationItem = {
  name: string;
  href: string;
  icon?: ReactNode;
  items?: VendorNavigationItem[];
};

export function getVendorNavigation(): VendorNavigationItem[] {
  return [
    {
      name: "Dashboard",
      href: VENDOR_ROUTES.dashboard,
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      name: "Clients",
      href: VENDOR_ROUTES.clients,
      icon: <Users className="h-4 w-4" />,
    },
    {
      name: "Invoices",
      href: VENDOR_ROUTES.invoices,
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      name: "Account",
      href: VENDOR_ROUTES.account,
      icon: <ShieldCheck className="h-4 w-4" />,
    },
    {
      name: "Settings",
      href: VENDOR_ROUTES.settingsProfile,
      icon: <Settings className="h-4 w-4" />,
      items: [
        { name: "Profile", href: VENDOR_ROUTES.settingsProfile },
        { name: "Operations", href: VENDOR_ROUTES.settingsOperations },
        { name: "Email", href: VENDOR_ROUTES.settingsEmail },
        { name: "Activity", href: VENDOR_ROUTES.settingsActivity },
      ],
    },
    {
      name: "Products",
      href: VENDOR_ROUTES.products,
      icon: <FolderKanban className="h-4 w-4" />,
    },
    {
      name: "Notifications",
      href: VENDOR_ROUTES.notifications,
      icon: <BellRing className="h-4 w-4" />,
    },
    {
      name: "Tickets",
      href: VENDOR_ROUTES.tickets,
      icon: <LifeBuoy className="h-4 w-4" />,
    },
  ];
}
