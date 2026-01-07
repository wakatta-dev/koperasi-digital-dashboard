/** @format */

import Link from "next/link";
import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem as UiBreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
  active?: boolean;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
};

export function Breadcrumbs({
  items,
  separator = "/",
  className,
}: BreadcrumbsProps) {
  return (
    <Breadcrumb className={cn("mb-8 overflow-x-auto pb-2", className)}>
      <BreadcrumbList className="flex-nowrap whitespace-nowrap gap-0">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const isActive = item.active || isLast;

          return (
            <Fragment key={`${item.label}-${idx}`}>
              <UiBreadcrumbItem>
                {item.href && !isActive ? (
                  <BreadcrumbLink
                    asChild
                    className="hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : isActive ? (
                  <BreadcrumbPage className="font-medium">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <span className="font-medium text-muted-foreground">
                    {item.label}
                  </span>
                )}
              </UiBreadcrumbItem>
              {!isLast ? (
                <BreadcrumbSeparator className="mx-2">
                  {separator}
                </BreadcrumbSeparator>
              ) : null}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
