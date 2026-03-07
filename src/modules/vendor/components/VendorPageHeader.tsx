/** @format */

import type { ReactNode } from "react";

type VendorPageHeaderProps = {
  title: string;
  description: string;
  actions?: ReactNode;
};

export function VendorPageHeader({
  title,
  description,
  actions,
}: VendorPageHeaderProps) {
  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </section>
  );
}
