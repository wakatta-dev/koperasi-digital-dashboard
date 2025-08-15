/** @format */

import type React from "react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";

import "./globals.css";
import { AuthProvider } from "@/components/shared/auth-provider";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Multi-Tenant Dashboard",
  description: "Dashboard untuk Vendor, Koperasi, UMKM, dan BUMDes",
  generator: "Next.js Dashboard",
};

const geist = Geist({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.className}>
      <head></head>
      <body>
        <AuthProvider>
          <SidebarProvider
            style={
              {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
              } as React.CSSProperties
            }
          >
            {children}
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
