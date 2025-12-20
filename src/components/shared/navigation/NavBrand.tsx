/** @format */

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type NavBrandProps = {
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
};

export function NavBrand({ icon, title, subtitle, className }: NavBrandProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {icon ? <span className="flex items-center justify-center">{icon}</span> : null}
      <div className="flex flex-col">
        <span className="font-bold text-xl text-gray-900 dark:text-white leading-tight">
          {title}
        </span>
        {subtitle ? (
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {subtitle}
          </span>
        ) : null}
      </div>
    </div>
  );
}
