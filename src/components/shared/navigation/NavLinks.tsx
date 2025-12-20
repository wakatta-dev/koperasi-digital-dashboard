/** @format */

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type NavLinkItem = {
  key?: string;
  content: ReactNode;
  active?: boolean;
  className?: string;
};

type NavLinksProps = {
  items: NavLinkItem[];
  orientation?: "horizontal" | "vertical";
  className?: string;
  itemClassName?: string;
  activeClassName?: string;
};

export function NavLinks({
  items,
  orientation = "horizontal",
  className,
  itemClassName,
  activeClassName,
}: NavLinksProps) {
  const base =
    orientation === "vertical"
      ? "flex flex-col gap-2"
      : "flex items-center gap-5 xl:gap-8";

  return (
    <div className={cn(base, className)}>
      {items.map((item, idx) => (
        <div
          key={item.key ?? idx}
          className={cn(
            itemClassName,
            item.active ? activeClassName : undefined,
          )}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
