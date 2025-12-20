/** @format */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "../constants";

type LandingNavbarProps = {
  activeLabel?: string;
  showCart?: boolean;
  cartCount?: number;
  cartHref?: string;
  className?: string;
};

export function LandingNavbar({
  activeLabel,
  showCart = false,
  cartCount = 0,
  cartHref = "/marketplace/keranjang",
  className,
}: LandingNavbarProps) {
  const [showShortcutLinks, setShowShortcutLinks] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "l" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        setShowShortcutLinks((prev) => !prev);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const links = NAV_LINKS.filter((link) => !link.requiresShortcut || showShortcutLinks);

  return (
    <nav
      className={cn(
        "fixed w-full z-50 bg-[#f8fafc]/90 dark:bg-[#0f172a]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="material-icons-outlined text-[#4338ca] text-3xl">token</span>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-900 dark:text-white leading-tight">BUMDes</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sukamaju</span>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-5 xl:gap-8">
            {links.map((link) => {
              const isActive = activeLabel && link.label === activeLabel;

              if (link.cta) {
                return (
                  <Button
                    key={link.label}
                    asChild
                    className="bg-[#4338ca] hover:bg-[#3730a3] text-white px-5 py-2.5 rounded-full font-semibold text-sm transition shadow-lg shadow-indigo-500/30"
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
                    className={cn(
                      "group flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#4338ca] dark:hover:text-[#4338ca] transition",
                      isActive && "text-[#4338ca] dark:text-[#4338ca]"
                    )}
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
                  className={cn(
                    "text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#4338ca] dark:hover:text-[#4338ca] transition",
                    isActive && "text-[#4338ca] dark:text-[#4338ca]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            {showCart ? (
              <>
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
                <Link
                  href={cartHref}
                  className="text-[#4338ca] transition relative bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
                  title="Keranjang"
                >
                  <span className="material-icons-outlined fill-current">shopping_cart</span>
                  {cartCount ? (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  ) : null}
                </Link>
              </>
            ) : null}
          </div>
          <div className="lg:hidden flex items-center">
            {showCart ? (
              <Link href={cartHref} className="text-[#4338ca] transition relative mr-2" title="Keranjang">
                <span className="material-icons-outlined">shopping_cart</span>
                {cartCount ? (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                ) : null}
              </Link>
            ) : null}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-700 dark:text-gray-300 hover:text-[#4338ca]"
                  aria-label="Buka menu"
                >
                  <span className="material-icons-outlined text-3xl">menu</span>
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="bg-[#f8fafc] dark:bg-[#0f172a] px-0 py-0 border-l border-gray-200/70 dark:border-gray-800"
              >
                <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
                <SheetHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="material-icons-outlined text-[#4338ca] text-3xl">token</span>
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-lg text-gray-900 dark:text-white leading-tight">BUMDes</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sukamaju</span>
                    </div>
                  </div>
                  {showCart ? (
                    <Link
                      href={cartHref}
                      className="text-[#4338ca] transition relative bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
                      title="Keranjang"
                    >
                      <span className="material-icons-outlined fill-current">shopping_cart</span>
                      {cartCount ? (
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                          {cartCount}
                        </span>
                      ) : null}
                    </Link>
                  ) : null}
                </SheetHeader>

                <div className="flex flex-col gap-1 px-6 pb-4">
                  {links.map((link) => {
                    const isActive = activeLabel && link.label === activeLabel;

                    if (link.cta) {
                      return (
                        <SheetClose key={link.label} asChild>
                          <Button
                            asChild
                            className="w-full justify-center bg-[#4338ca] hover:bg-[#3730a3] text-white px-5 py-3 rounded-xl font-semibold text-sm transition shadow-lg shadow-indigo-500/20"
                          >
                            <Link href={link.href}>{link.label}</Link>
                          </Button>
                        </SheetClose>
                      );
                    }

                    return (
                      <SheetClose key={link.label} asChild>
                        <Link
                          href={link.href}
                          className={cn(
                            "group flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/60 transition",
                            isActive && "bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-900/60 text-[#4338ca] dark:text-[#c7d2fe]"
                          )}
                        >
                          <span className="flex items-center gap-2">
                            {link.label}
                            {link.badge ? (
                              <Badge className="inline-flex items-center rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 ring-1 ring-inset ring-gray-500/10">
                                {link.badge}
                              </Badge>
                            ) : null}
                          </span>
                          <span className="material-icons-outlined text-lg text-gray-400 group-hover:text-[#4338ca]">chevron_right</span>
                        </Link>
                      </SheetClose>
                    );
                  })}
                </div>

                <SheetFooter className="px-6 pb-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="rounded-2xl border border-dashed border-indigo-200 dark:border-indigo-900/60 bg-white/70 dark:bg-slate-900/50 p-4">
                    <p className="font-semibold text-gray-800 dark:text-gray-100">Shortcut Link (Ctrl/Cmd + L)</p>
                    <p className="mt-1 leading-relaxed">
                      Tampilkan atau sembunyikan tautan khusus staff langsung dari keyboard, tetap ringkas di layar kecil.
                    </p>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
