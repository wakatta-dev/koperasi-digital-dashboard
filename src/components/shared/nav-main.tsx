/** @format */

"use client";

import * as React from "react";

import {
  SidebarGroup,
  SidebarGroupLabel,
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
import { ChevronDown } from "lucide-react";

export function NavMain({
  items,
}: {
  items: NavItem[];
}) {
  const pathname = usePathname();
  const submenuIdPrefix = React.useId();
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({});

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
    [submenuIdPrefix],
  );

  const isItemActive = React.useCallback(
    (item: NavItem): boolean => {
      if (pathname === item.url || pathname.startsWith(item.url + "/")) {
        return true;
      }
      return (
        Array.isArray(item.items) &&
        item.items.some((child) => isItemActive(child))
      );
    },
    [pathname],
  );

  const renderSubItems = React.useCallback(
    (subItems: NavItem[], parentKey: string, level = 0) => {
      if (!subItems || subItems.length === 0) return null;
      return (
        <SidebarMenuSub
          id={level === 0 ? parentKey : undefined}
          className={
            level > 0
              ? "mx-0 translate-x-0 gap-0.5 border-l border-slate-200/80 pl-3 ml-2"
              : "mx-0 translate-x-0 border-0 px-3 pb-2 pt-1 gap-0.5"
          }
        >
          {subItems.map((child) => {
            const hasChildren =
              Array.isArray(child.items) && child.items.length > 0;
            const isChildActive = isItemActive(child);
            const childKey = `${parentKey}-${child.url}`;
            const childIsOpen = openItems[childKey] ?? isChildActive;
            const childSubmenuId = getSubmenuId(childKey);
            return (
              <SidebarMenuSubItem key={child.title}>
                <SidebarMenuSubButton
                  asChild
                  isActive={isChildActive}
                  size={level > 0 ? "sm" : "md"}
                  data-state={childIsOpen ? "open" : "closed"}
                  aria-expanded={hasChildren ? childIsOpen : undefined}
                  aria-controls={hasChildren ? childSubmenuId : undefined}
                  className={
                    level > 0
                      ? "!h-7 !text-xs text-slate-500"
                      : "!h-8 !text-sm text-slate-500"
                  }
                >
                  {hasChildren ? (
                    <button
                      type="button"
                      className="flex w-full items-center gap-2"
                      onClick={() => setItemOpen(childKey, !childIsOpen)}
                    >
                      {child.icon}
                      <span>{child.title}</span>
                      <ChevronDown
                        className={`ml-auto size-4 transition-transform ${
                          childIsOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <Link href={child.url}>
                      {child.icon}
                      <span>{child.title}</span>
                    </Link>
                  )}
                </SidebarMenuSubButton>
                {hasChildren && childIsOpen
                  ? renderSubItems(child.items!, childSubmenuId, level + 1)
                  : null}
              </SidebarMenuSubItem>
            );
          })}
        </SidebarMenuSub>
      );
    },
    [getSubmenuId, isItemActive, openItems, setItemOpen],
  );

  return (
    <SidebarGroup className="p-0">
      <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        Platform
      </SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-1">
        <SidebarMenu>
          {items.map((item) => {
            const hasChildren =
              Array.isArray(item.items) && item.items.length > 0;
            const isParentActive = isItemActive(item);
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
                    className="!h-10 !gap-3 !rounded-lg !px-3 !py-2 font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 data-[active=true]:bg-indigo-50 data-[active=true]:text-indigo-700 data-[active=true]:ring-1 data-[active=true]:ring-indigo-200 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white dark:data-[active=true]:bg-indigo-900/30 dark:data-[active=true]:text-indigo-200 dark:data-[active=true]:ring-indigo-500/40 [&>svg]:size-5 [&>svg]:text-slate-500 dark:[&>svg]:text-slate-400 data-[active=true]:[&>svg]:text-indigo-600 dark:data-[active=true]:[&>svg]:text-indigo-200"
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
                  tooltip={item.title}
                  isActive={isParentActive}
                  data-state={isOpen ? "open" : "closed"}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={submenuId}
                  onClick={() => setItemOpen(itemKey, !isOpen)}
                  className="!h-10 !gap-3 !rounded-lg !px-3 !py-2 font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 data-[active=true]:bg-indigo-50 data-[active=true]:text-indigo-700 data-[active=true]:ring-1 data-[active=true]:ring-indigo-200 data-[state=open]:bg-slate-100/70 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white dark:data-[active=true]:bg-indigo-900/30 dark:data-[active=true]:text-indigo-200 dark:data-[active=true]:ring-indigo-500/40 dark:data-[state=open]:bg-slate-800/60 [&>svg]:size-5 [&>svg]:text-slate-500 dark:[&>svg]:text-slate-400 data-[active=true]:[&>svg]:text-indigo-600 dark:data-[active=true]:[&>svg]:text-indigo-200"
                >
                  {item.icon}
                  <span>{item.title}</span>
                  <ChevronDown
                    className={`ml-auto size-4 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </SidebarMenuButton>
                {isOpen
                  ? renderSubItems(item.items!, submenuId, 0)
                  : null}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

type NavItem = {
  title: string;
  url: string;
  icon?: React.ReactNode;
  items?: NavItem[];
};
