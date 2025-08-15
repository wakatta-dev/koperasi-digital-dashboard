/** @format */

"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { useAuth } from "./auth-provider";
import React from "react";
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
  title,
  navigation,
}: DashboardLayoutProps) {
  const { user, logout } = useAuth();

  return (
    <React.Fragment>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-4">{children}</div>
      </SidebarInset>
    </React.Fragment>
  );
}
