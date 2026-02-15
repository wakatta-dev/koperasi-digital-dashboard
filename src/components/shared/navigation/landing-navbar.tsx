/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
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
import type { NavigationConfig } from "@/types/landing-page";
import { cn } from "@/lib/utils";
import { NavActions } from "./NavActions";
import { NavBarShell } from "./NavBarShell";
import { NavBrand } from "./NavBrand";
import { NavLinks, type NavLinkItem } from "./NavLinks";

const DEFAULT_BRAND_NAME = "BUMDes Sukamaju";
const DEFAULT_CTA_LABEL = "Hubungi Kami";
const DEFAULT_CTA_URL = "/kontak";

type BaseNavItem = {
  label: string;
  href: string;
  badge?: string;
  requiresShortcut?: boolean;
  cta?: boolean;
};

const PUBLIC_NAV_ITEMS: BaseNavItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Penyewaan Aset", href: "/penyewaan-aset" },
];

const SHORTCUT_NAV_ITEMS: BaseNavItem[] = [
  { label: "POS", href: "/login", badge: "Staff", requiresShortcut: true },
  { label: "Login", href: "/login", requiresShortcut: true, cta: true },
];

const GUARANTEED_MODULE_ITEMS: BaseNavItem[] = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Penyewaan Aset", href: "/penyewaan-aset" },
];

type LocalNavItem = {
  label: string;
  href: string;
  badge?: string;
  order: number;
};

export type LandingNavbarProps = {
  activeLabel?: string;
  showCart?: boolean;
  cartCount?: number;
  cartHref?: string;
  className?: string;
  navigation?: NavigationConfig;
};

function isItemActive(params: {
  activeLabel?: string;
  pathname?: string | null;
  itemLabel: string;
  itemHref?: string;
}) {
  const pathname = params.pathname ?? "";
  const labelMatch = Boolean(
    params.activeLabel &&
      params.activeLabel.trim().toLowerCase() ===
        params.itemLabel.trim().toLowerCase()
  );
  if (labelMatch) {
    return true;
  }
  if (!params.itemHref) {
    return false;
  }
  if (params.itemHref === "/") {
    return pathname === "/";
  }
  return pathname.startsWith(params.itemHref);
}

export function LandingNavbar({
  activeLabel,
  showCart = false,
  cartCount = 0,
  cartHref = "/marketplace/keranjang",
  className,
  navigation,
}: LandingNavbarProps) {
  const [showShortcutLinks, setShowShortcutLinks] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const safePathname = typeof pathname === "string" ? pathname : "";

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

  const navConfig = navigation;
  const baseItems: LocalNavItem[] =
    navConfig?.items && navConfig.items.length > 0
      ? navConfig.items.map((item, index) => ({
          label: item.label,
          href: item.url,
          order: item.order || index + 1,
        }))
      : PUBLIC_NAV_ITEMS.map((item, index) => ({
          label: item.label,
          href: item.href,
          badge: item.badge,
          order: index + 1,
        }));

  const shortcutItems: LocalNavItem[] = showShortcutLinks
    ? SHORTCUT_NAV_ITEMS.map((item, index) => ({
        label: item.label,
        href: item.href,
        badge: item.badge,
        order: baseItems.length + index + 1,
      }))
    : [];

  const extraItems: LocalNavItem[] = GUARANTEED_MODULE_ITEMS.map(
    (item, index) => ({
      label: item.label,
      href: item.href,
      badge: item.badge,
      order: baseItems.length + shortcutItems.length + index + 1,
    })
  );

  const navItems = useMemo(() => {
    const merged: LocalNavItem[] = [...baseItems];
    const seenKeys = new Set(
      baseItems.map((item) => `${item.href || ""}::${item.label}`.toLowerCase())
    );

    [...shortcutItems, ...extraItems].forEach((item) => {
      const key = `${item.href || ""}::${item.label}`.toLowerCase();
      if (!seenKeys.has(key)) {
        merged.push(item);
        seenKeys.add(key);
      }
    });

    return merged.sort((a, b) => a.order - b.order);
  }, [baseItems, shortcutItems, extraItems]);

  const ctaLabel = navConfig?.cta_label || DEFAULT_CTA_LABEL;
  const ctaUrl = navConfig?.cta_url || DEFAULT_CTA_URL;
  const brandName = navConfig?.brand_name || DEFAULT_BRAND_NAME;
  const [brandTitle, ...subtitleParts] = brandName.split(" ");
  const brandSubtitle = subtitleParts.join(" ");
  const logoUrl = navConfig?.logo_light_url;

  const shortcutCta = showShortcutLinks
    ? SHORTCUT_NAV_ITEMS.find((item) => item.cta && item.requiresShortcut)
    : undefined;
  const hasShortcutCta = Boolean(shortcutCta?.href && shortcutCta?.label);
  const isDuplicateCta = Boolean(
    shortcutCta?.href && ctaUrl && shortcutCta.href === ctaUrl
  );

  const linkItems: NavLinkItem[] = navItems.map((item) => {
    const active = isItemActive({
      activeLabel,
      pathname: safePathname,
      itemLabel: item.label,
      itemHref: item.href,
    });
    if (item.badge) {
      return {
        key: item.label,
        active,
        content: (
          <Link
            href={item.href ?? "#"}
            className={cn(
              "group flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary transition",
              active && "text-brand-primary dark:text-brand-primary"
            )}
          >
            {item.label}
            <Badge className="inline-flex items-center rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 ring-1 ring-inset ring-gray-500/10 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition">
              {item.badge}
            </Badge>
          </Link>
        ),
      };
    }
    return {
      key: item.label,
      active,
      content: (
        <Link
          href={item.href ?? "#"}
          className={cn(
            "text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary transition",
            active && "text-brand-primary dark:text-brand-primary"
          )}
        >
          {item.label}
        </Link>
      ),
    };
  });

  if (ctaLabel && ctaUrl) {
    linkItems.push({
      key: "cta",
      content: (
        <Button
          asChild
          className="bg-brand-primary hover:bg-brand-primary-hover text-white px-5 py-2.5 rounded-full font-semibold text-sm transition shadow-lg shadow-indigo-500/30"
        >
          <Link href={ctaUrl}>{ctaLabel}</Link>
        </Button>
      ),
    });
  }

  if (hasShortcutCta && !isDuplicateCta) {
    linkItems.push({
      key: "shortcut-cta",
      content: (
        <Button
          asChild
          variant="outline"
          className="border-indigo-200 text-brand-primary hover:border-indigo-400 hover:bg-indigo-50 px-5 py-2.5 rounded-full font-semibold text-sm transition"
        >
          <Link href={shortcutCta?.href ?? "/login"}>
            {shortcutCta?.label ?? "Login"}
          </Link>
        </Button>
      ),
    });
  }

  return (
    <NavBarShell
      className={cn(
        "bg-surface-subtle/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800",
        className
      )}
      left={
        <NavBrand
          icon={
            logoUrl ? (
              <Image
                src={logoUrl}
                alt={brandName}
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
            ) : (
              <span className="material-icons-outlined text-brand-primary text-3xl">
                token
              </span>
            )
          }
          title={brandTitle || "BUMDes"}
          subtitle={brandSubtitle || "Desa"}
          className="flex-shrink-0"
        />
      }
      center={
        <div className="hidden lg:flex items-center gap-5 xl:gap-8">
          <NavLinks items={linkItems} className="items-center" />
          {showCart ? (
            <NavActions className="items-center gap-5 xl:gap-8">
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
              <Link
                href={cartHref}
                className="text-brand-primary transition relative bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
                data-cart-target="marketplace"
                title="Keranjang"
              >
                <span className="material-icons-outlined fill-current">
                  shopping_cart
                </span>
                {cartCount ? (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                ) : null}
              </Link>
            </NavActions>
          ) : null}
        </div>
      }
      right={
        <div className="lg:hidden flex items-center">
          {showCart ? (
            <Link
              href={cartHref}
              className="text-brand-primary transition relative mr-2"
              title="Keranjang"
              data-cart-target="marketplace"
            >
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
                className="text-gray-700 dark:text-gray-300 hover:text-brand-primary"
                aria-label="Buka menu"
              >
                <span className="material-icons-outlined text-3xl">menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="bg-surface-subtle dark:bg-surface-dark px-0 py-0 border-l border-gray-200/70 dark:border-gray-800"
            >
              <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
              <SheetHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-4">
                <NavBrand
                  icon={
                    logoUrl ? (
                      <Image
                        src={logoUrl}
                        alt={brandName}
                        width={32}
                        height={32}
                        className="h-8 w-8 object-contain"
                      />
                    ) : (
                      <span className="material-icons-outlined text-brand-primary text-3xl">
                        token
                      </span>
                    )
                  }
                  title={brandTitle || "BUMDes"}
                  subtitle={brandSubtitle || "Desa"}
                  className="gap-3"
                />
                {showCart ? (
                  <Link
                    href={cartHref}
                    className="text-brand-primary transition relative bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
                    title="Keranjang"
                  >
                    <span className="material-icons-outlined fill-current">
                      shopping_cart
                    </span>
                    {cartCount ? (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                        {cartCount}
                      </span>
                    ) : null}
                  </Link>
                ) : null}
              </SheetHeader>

              <div className="flex flex-col gap-1 px-6 pb-4">
                {navItems.map((item) => {
                  const active = isItemActive({
                    activeLabel,
                    pathname,
                    itemLabel: item.label,
                    itemHref: item.href,
                  });
                  return (
                    <SheetClose key={`${item.href || ""}-${item.label}`} asChild>
                      <Link
                        href={item.href ?? "#"}
                        className={cn(
                          "group flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/60 transition",
                          active &&
                            "bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-900/60 text-brand-primary dark:text-surface-text-dark"
                        )}
                      >
                        <span className="flex items-center gap-2">
                          {item.label}
                          {item.badge ? (
                            <Badge className="inline-flex items-center rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 ring-1 ring-inset ring-gray-500/10">
                              {item.badge}
                            </Badge>
                          ) : null}
                        </span>
                        <span className="material-icons-outlined text-lg text-gray-400 group-hover:text-brand-primary">
                          chevron_right
                        </span>
                      </Link>
                    </SheetClose>
                  );
                })}

                {ctaLabel && ctaUrl ? (
                  <SheetClose asChild>
                    <Button
                      asChild
                      className="w-full justify-center bg-brand-primary hover:bg-brand-primary-hover text-white px-5 py-3 rounded-xl font-semibold text-sm transition shadow-lg shadow-indigo-500/20"
                    >
                      <Link href={ctaUrl}>{ctaLabel}</Link>
                    </Button>
                  </SheetClose>
                ) : null}

                {hasShortcutCta && !isDuplicateCta ? (
                  <SheetClose asChild>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full justify-center border-indigo-200 text-brand-primary hover:border-indigo-400 hover:bg-indigo-50 px-5 py-3 rounded-xl font-semibold text-sm transition"
                    >
                      <Link href={shortcutCta?.href ?? "/login"}>
                        {shortcutCta?.label ?? "Login"}
                      </Link>
                    </Button>
                  </SheetClose>
                ) : null}
              </div>

              <SheetFooter className="px-6 pb-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="rounded-2xl border border-dashed border-indigo-200 dark:border-indigo-900/60 bg-white/70 dark:bg-slate-900/50 p-4">
                  <p className="font-semibold text-gray-800 dark:text-gray-100">
                    Shortcut Link (Ctrl/Cmd + L)
                  </p>
                  <p className="mt-1 leading-relaxed">
                    Tampilkan atau sembunyikan tautan khusus staff langsung dari
                    keyboard, tetap ringkas di layar kecil.
                  </p>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      }
    />
  );
}
