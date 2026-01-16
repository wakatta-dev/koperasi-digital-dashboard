/** @format */

"use client";

import * as React from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ReactNode;
    items?: {
      title: string;
      url: string;
      icon?: React.ReactNode;
    }[];
  }[];
}) {
  const pathname = usePathname();
  const submenuIdPrefix = React.useId();
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>(
    {}
  );

  const setItemOpen = React.useCallback((key: string, nextOpen: boolean) => {
    setOpenItems((prev) => {
      if (prev[key] === nextOpen) {
        return prev;
      }
      return { ...prev, [key]: nextOpen };
    });
  }, []);

  const getSubmenuId = React.useCallback(
    (value: string) => {
      const sanitized = value.replace(/[^a-zA-Z0-9_-]/g, "-");
      return `${submenuIdPrefix}-${sanitized}`;
    },
    [submenuIdPrefix]
  );
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
            const itemKey = item.url;
            const isOpen = openItems[itemKey] ?? isParentActive;
            const submenuId = getSubmenuId(itemKey);

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
                  data-state={isOpen ? "open" : "closed"}
                >
                  <Link href={item.url}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuAction
                  type="button"
                  aria-label={
                    isOpen
                      ? `Minimize ${item.title} menu`
                      : `Expand ${item.title} menu`
                  }
                  aria-expanded={isOpen}
                  aria-controls={submenuId}
                  data-state={isOpen ? "open" : "closed"}
                  onClick={() => setItemOpen(itemKey, !isOpen)}
                >
                  <ChevronDown
                    className={`size-4 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </SidebarMenuAction>
                <SidebarMenuSub id={submenuId} hidden={!isOpen}>
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
