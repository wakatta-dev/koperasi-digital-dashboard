/** @format */

"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
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
      { titleKey: "dashboard", url: "/dashboard", icon: IconDashboard },
      { titleKey: "assets", url: "/assets", icon: IconDatabase },
      { titleKey: "billing", url: "/billing", icon: IconReport },
      { titleKey: "financing", url: "/financing", icon: IconFileDescription },
      { titleKey: "loans", url: "/loans", icon: IconListDetails },
      { titleKey: "members", url: "/members", icon: IconUsers },
      { titleKey: "notifications", url: "/notifications", icon: IconBell },
      { titleKey: "rat", url: "/rat", icon: IconFileWord },
      { titleKey: "savings", url: "/savings", icon: IconFolder },
      { titleKey: "shu", url: "/shu", icon: IconChartBar },
      { titleKey: "transactions", url: "/transactions", icon: IconFileAi },
    ],
  };

  export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { data: session } = useSession();
    const role = (session as any)?.user?.role;
    const basePath = role === "admin_user" ? "/admin-user" : "/admin-owner";
    const navItems = (role === "admin_user"
      ? data.navMain.filter((item) => item.titleKey === "dashboard")
      : data.navMain
    ).map((item) => ({ ...item, url: `${basePath}${item.url}` }));

    return (
      <Sidebar collapsible="icon" {...props}>
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
          <NavMain items={navItems} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>
    );
  }
