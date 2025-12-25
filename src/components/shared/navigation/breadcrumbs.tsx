/** @format */

import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  label: string;
  href?: string;
  active?: boolean;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  separator?: string;
  className?: string;
};

export function Breadcrumbs({
  items,
  separator = "/",
  className,
}: BreadcrumbsProps) {
  return (
    <nav
      className={cn(
        "flex mb-8 text-sm text-muted-foreground overflow-x-auto whitespace-nowrap pb-2",
        className
      )}
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        const content = item.href && !isLast ? (
          <a className="hover:text-indigo-600 dark:hover:text-indigo-400 transition" href={item.href}>
            {item.label}
          </a>
        ) : (
          <span
            className={cn(
              "font-medium",
              item.active || isLast
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            {item.label}
          </span>
        );

        return (
          <span key={`${item.label}-${idx}`} className="inline-flex items-center">
            {content}
            {!isLast ? <span className="mx-2">{separator}</span> : null}
          </span>
        );
      })}
    </nav>
  );
}
