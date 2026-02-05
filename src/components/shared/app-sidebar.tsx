/** @format */

"use client";

import * as React from "react";
import { IconInnerShadowTop } from "@tabler/icons-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface SidebarData {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  navMain: {
    title: string;
    url: string;
    icon?: React.ReactNode;
    items?: {
      title: string;
      url: string;
      icon?: React.ReactNode;
      items?: {
        title: string;
        url: string;
        icon?: React.ReactNode;
      }[];
    }[];
  }[];
  navSecondary: {
    title: string;
    url: string;
    icon?: React.ReactNode;
  }[];
  documents: {
    title: string;
    url: string;
    icon?: React.ReactNode;
  }[];
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  data: SidebarData;
}

export function AppSidebar({ data, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="px-4 pb-3 pt-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="!h-auto !p-0 hover:bg-transparent data-[active=true]:bg-transparent"
            >
              <a href="#">
                <span className="flex size-10 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                  <IconInnerShadowTop className="size-5" />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-base font-semibold text-slate-900 dark:text-white">
                    Digicorp
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Enterprise
                  </span>
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-6 px-3 pb-4">
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter className="border-t border-slate-200/80 px-4 py-3 dark:border-slate-800">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
