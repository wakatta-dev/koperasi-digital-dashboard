/** @format */

import type { ReactNode } from "react";

type AssetRentalFeatureShellProps = Readonly<{
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}>;

export function AssetRentalFeatureShell({
  title,
  description,
  actions,
  children,
}: AssetRentalFeatureShellProps) {
  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
            {description ? (
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            ) : null}
          </div>
          {actions}
        </div>
        {children}
      </section>
    </div>
  );
}

