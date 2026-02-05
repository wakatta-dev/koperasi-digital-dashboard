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
  navigation: Array<NavItem>;
  showHeader?: boolean;
  contentClassName?: string;
}

type NavItem = {
  name: string;
  href: string;
  icon?: ReactNode;
  items?: NavItem[];
};

export function DashboardLayout({
  children,
  navigation,
  showHeader = true,
  contentClassName,
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
      items: item.items?.map((child) => ({
        title: child.name,
        url: child.href,
        icon: child.icon,
        items: child.items?.map((grandchild) => ({
          title: grandchild.name,
          url: grandchild.href,
          icon: grandchild.icon,
        })),
      })),
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
      <SidebarInset className="flex h-full min-w-0 flex-col">
        {showHeader ? <SiteHeader /> : null}
        <div
          className={
            contentClassName ??
            "h-full min-w-0 w-full overflow-x-hidden overflow-y-auto p-4 md:py-6 lg:px-6"
          }
        >
          {children}
        </div>
      </SidebarInset>
    </React.Fragment>
  );
}
