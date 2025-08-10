/** @format */

"use client";

import * as React from "react";
import {
  IconBell,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconUsers,
} from "@tabler/icons-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
    { title: "Assets", url: "/assets", icon: IconDatabase },
    { title: "Billing", url: "/billing", icon: IconReport },
    { title: "Financing", url: "/financing", icon: IconFileDescription },
    { title: "Loans", url: "/loans", icon: IconListDetails },
    { title: "Members", url: "/members", icon: IconUsers },
    { title: "Notifications", url: "/notifications", icon: IconBell },
    { title: "RAT", url: "/rat", icon: IconFileWord },
    { title: "Savings", url: "/savings", icon: IconFolder },
    { title: "SHU", url: "/shu", icon: IconChartBar },
    { title: "Transactions", url: "/transactions", icon: IconFileAi },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">
                  Koperasi Digital
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
