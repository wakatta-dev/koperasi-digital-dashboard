/** @format */

"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NavActions } from "@/components/shared/navigation/NavActions";
import { NavBarShell } from "@/components/shared/navigation/NavBarShell";
import { NavBrand } from "@/components/shared/navigation/NavBrand";
import { NavLinks } from "@/components/shared/navigation/NavLinks";
import { CART_BADGE, MARKETPLACE_NAV_LINKS } from "../constants";

export function MarketplaceNavbar() {
  return (
    <NavBarShell
      className="bg-[#f8fafc]/90 dark:bg-[#0f172a]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
      left={
        <NavBrand
          icon={<span className="material-icons-outlined text-[#4338ca] text-3xl">token</span>}
          title="BUMDes"
          subtitle="Sukamaju"
          className="flex-shrink-0"
        />
      }
      center={
        <div className="hidden lg:flex items-center gap-5 xl:gap-8">
          <NavLinks
            items={MARKETPLACE_NAV_LINKS.map((link) => {
              if (link.cta) {
                return {
                  key: link.label,
                  content: (
                    <Button key={link.label} asChild className="bg-[#4338ca] hover:bg-[#3730a3] text-white px-5 py-2.5 rounded-full font-semibold text-sm transition shadow-lg shadow-indigo-500/30">
                      <Link href={link.href}>{link.label}</Link>
                    </Button>
                  ),
                };
              }

              if (link.badge) {
                return {
                  key: link.label,
                  content: (
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#4338ca] dark:hover:text-[#4338ca] transition"
                    >
                      {link.label}
                      <Badge className="inline-flex items-center rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 ring-1 ring-inset ring-gray-500/10 group-hover:bg-[#4338ca]/10 group-hover:text-[#4338ca] transition">
                        {link.badge}
                      </Badge>
                    </Link>
                  ),
                  active: link.active,
                };
              }

              return {
                key: link.label,
                content: (
                  <Link
                    href={link.href}
                    className={`text-sm font-medium transition ${
                      link.active
                        ? "text-[#4338ca] dark:text-[#4338ca]"
                        : "text-gray-700 dark:text-gray-300 hover:text-[#4338ca] dark:hover:text-[#4338ca]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ),
                active: link.active,
              };
            })}
          />
          <NavActions className="items-center gap-5 xl:gap-8">
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
            <Link
              href="/marketplace/keranjang"
              className="text-[#4338ca] transition relative bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
              title="Keranjang"
            >
              <span className="material-icons-outlined fill-current">shopping_cart</span>
              {CART_BADGE ? (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {CART_BADGE}
                </span>
              ) : null}
            </Link>
          </NavActions>
        </div>
      }
      right={
        <div className="lg:hidden flex items-center">
          <Link
            href="/marketplace/keranjang"
            className="text-[#4338ca] transition relative mr-2"
            title="Keranjang"
          >
            <span className="material-icons-outlined">shopping_cart</span>
            {CART_BADGE ? (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                {CART_BADGE}
              </span>
            ) : null}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-700 dark:text-gray-300 hover:text-[#4338ca]"
          >
            <span className="material-icons-outlined text-3xl">menu</span>
          </Button>
        </div>
      }
    />
  );
}
