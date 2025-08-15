/** @format */

"use client";

import type { ReactNode } from "react";
import React from "react";
import {
  IconDatabase,
  IconFileWord,
  IconHelp,
  IconReport,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";
import { useAuth } from "./auth-provider";
import { SidebarInset } from "../ui/sidebar";
import { SiteHeader } from "./site-header";
import { AppSidebar } from "./app-sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  navigation: Array<{
    name: string;
    href: string;
    icon?: ReactNode;
  }>;
}

export function DashboardLayout({
  children,
  navigation,
}: DashboardLayoutProps) {
  const { user } = useAuth();

  const sidebarData = {
    user: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: navigation.map((item) => ({
      title: item.name,
      url: item.href,
      icon: item.icon,
    })),
    navSecondary: [
      { title: "Settings", url: "#", icon: IconSettings },
      { title: "Get Help", url: "#", icon: IconHelp },
      { title: "Search", url: "#", icon: IconSearch },
    ],
    documents: [
      { name: "Data Library", url: "#", icon: IconDatabase },
      { name: "Reports", url: "#", icon: IconReport },
      { name: "Word Assistant", url: "#", icon: IconFileWord },
    ],
  };

  return (
    <React.Fragment>
      <AppSidebar variant="inset" data={sidebarData} />
      <SidebarInset>
        <SiteHeader />
        <div className="p-4">{children}</div>
      </SidebarInset>
    </React.Fragment>
  );
}
