/** @format */

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SearchHeroBaseProps = {
  title?: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  inputSlot: ReactNode;
  ctaSlot?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function SearchHeroBase({
  title,
  description,
  badge,
  inputSlot,
  ctaSlot,
  children,
  className,
}: SearchHeroBaseProps) {
  return (
    <div className={cn("mb-10", className)}>
      {badge ? <div className="mb-3">{badge}</div> : null}
      {title ? (
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          {title}
        </h1>
      ) : null}
      {description ? (
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
          {description}
        </p>
      ) : null}

      <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">{inputSlot}</div>
        {ctaSlot ? <div className="flex gap-2">{ctaSlot}</div> : null}
      </div>

      {children}
    </div>
  );
}
