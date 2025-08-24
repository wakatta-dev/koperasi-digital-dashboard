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
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();

  const sidebarData = {
    user: {
      name: session?.user?.name ?? "",
      email: session?.user?.email ?? "",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: navigation.map((item) => ({
      title: item.name,
      url: item.href,
      icon: item.icon,
    })),
    navSecondary: [
      { title: "Settings", url: "#", icon: <IconSettings /> },
      { title: "Get Help", url: "#", icon: <IconHelp /> },
      { title: "Search", url: "#", icon: <IconSearch /> },
    ],
    documents: [
      { title: "Data Library", url: "#", icon: <IconDatabase /> },
      { title: "Reports", url: "#", icon: <IconReport /> },
      { title: "Word Assistant", url: "#", icon: <IconFileWord /> },
    ],
  };

  return (
    <React.Fragment>
      <AppSidebar variant="inset" data={sidebarData} />
      <SidebarInset className="flex flex-col h-full">
        <SiteHeader />
        <div className="h-full overflow-y-auto p-4">{children}</div>
      </SidebarInset>
    </React.Fragment>
  );
}
