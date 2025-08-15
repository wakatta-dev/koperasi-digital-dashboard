/** @format */

"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { useAuth } from "./auth-provider";

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
    <div className="min-h-screen bg-muted/50">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="text-sm">
                <p className="font-medium">{user.name}</p>
                <p className="text-muted-foreground capitalize">{user.role}</p>
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-background border-r border-border min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
              >
                {item.icon}
                {item.name}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
