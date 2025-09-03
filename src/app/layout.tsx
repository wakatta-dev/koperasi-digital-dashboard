/** @format */

import type React from "react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";

import "./globals.css";
import SessionProviderWrapper from "@/components/session-provider";
import { LanguageProvider } from "@/contexts/language-context";
import QueryProvider from "@/components/query-provider";
import { ConfirmDialogProvider } from "@/components/shared/confirm-dialog-provider";
import FcmInitializer from "@/components/fcm-initializer";

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
    <html lang="en" suppressHydrationWarning className={geist.className}>
      <head></head>
      <body>
        <SessionProviderWrapper>
          <QueryProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <LanguageProvider>
                <ConfirmDialogProvider>
                  <FcmInitializer />
                  {children}
                </ConfirmDialogProvider>
              </LanguageProvider>
            </ThemeProvider>
          </QueryProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
