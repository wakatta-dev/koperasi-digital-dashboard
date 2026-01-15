/** @format */

"use client";

import type { ReactNode } from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: ReactNode;
    items?: {
      title: string;
      url: string;
      icon?: ReactNode;
    }[];
  }[];
}) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const hasChildren =
              Array.isArray(item.items) && item.items.length > 0;
            const isParentActive =
              pathname === item.url ||
              pathname.startsWith(item.url + "/") ||
              (hasChildren &&
                item.items!.some(
                  (child) =>
                    pathname === child.url ||
                    pathname.startsWith(child.url + "/")
                ));

            if (!hasChildren) {
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isParentActive}
                  >
                    <Link href={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            }

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isParentActive}
                >
                  <Link href={item.url}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {item.items!.map((child) => {
                    const isChildActive =
                      pathname === child.url ||
                      pathname.startsWith(child.url + "/");
                    return (
                      <SidebarMenuSubItem key={child.title}>
                        <SidebarMenuSubButton asChild isActive={isChildActive}>
                          <Link href={child.url}>
                            {child.icon}
                            <span>{child.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
