/** @format */

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FilterSectionProps = {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  withDivider?: boolean;
};

export function FilterSection({
  title,
  children,
  className,
  titleClassName,
  withDivider,
}: FilterSectionProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {title ? (
        <h3 className={cn("font-bold text-gray-900 dark:text-white text-sm", titleClassName)}>
          {title}
        </h3>
      ) : null}
      <div className="space-y-3">{children}</div>
      {withDivider ? <div className="h-px bg-gray-200 dark:bg-gray-700" /> : null}
    </div>
  );
}
