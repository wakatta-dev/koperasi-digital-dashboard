/** @format */

"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MARKETPLACE_NAV_LINKS } from "../constants";

export function MarketplaceNavbar() {
  return (
    <nav className="fixed w-full z-50 bg-[#f8fafc]/90 dark:bg-[#0f172a]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="material-icons-outlined text-[#4338ca] text-3xl">token</span>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-900 dark:text-white leading-tight">
                BUMDes
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Sukamaju
              </span>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-5 xl:gap-8">
            {MARKETPLACE_NAV_LINKS.map((link) => {
              if (link.cta) {
                return (
                  <Button
                    key={link.label}
                    asChild
                    className="ml-2 bg-[#4338ca] hover:bg-[#3730a3] text-white px-5 py-2.5 rounded-full font-semibold text-sm transition shadow-lg shadow-indigo-500/30"
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                );
              }

              if (link.badge) {
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="group flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#4338ca] dark:hover:text-[#4338ca] transition"
                  >
                    {link.label}
                    <Badge className="inline-flex items-center rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 ring-1 ring-inset ring-gray-500/10 group-hover:bg-[#4338ca]/10 group-hover:text-[#4338ca] transition">
                      {link.badge}
                    </Badge>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-medium transition ${
                    link.active
                      ? "text-[#4338ca] dark:text-[#4338ca]"
                      : "text-gray-700 dark:text-gray-300 hover:text-[#4338ca] dark:hover:text-[#4338ca]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="lg:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-700 dark:text-gray-300 hover:text-[#4338ca]"
            >
              <span className="material-icons-outlined text-3xl">menu</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
