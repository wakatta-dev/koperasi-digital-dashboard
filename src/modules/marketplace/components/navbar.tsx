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
      className="border-b border-border bg-background/90 backdrop-blur-md"
      left={
        <NavBrand
          icon={<span className="material-icons-outlined text-primary text-3xl">token</span>}
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
                    <Button
                      key={link.label}
                      asChild
                      className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:bg-primary/90"
                    >
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
                      className="group flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                    >
                      {link.label}
                      <Badge className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground ring-1 ring-inset ring-border transition group-hover:bg-primary/10 group-hover:text-primary">
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
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
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
            <div className="h-6 w-px bg-border" />
            <Link
              href="/marketplace/keranjang"
              className="relative rounded-full bg-primary/10 p-2 text-primary transition hover:bg-primary/20"
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
            className="relative mr-2 text-primary transition"
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
            className="text-muted-foreground hover:text-primary"
          >
            <span className="material-icons-outlined text-3xl">menu</span>
          </Button>
        </div>
      }
    />
  );
}
