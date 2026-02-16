/** @format */

import type { ReactNode } from "react";

type FeatureSectionCardProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function FeatureSectionCard({
  title,
  description,
  icon,
  children,
  className,
}: FeatureSectionCardProps) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-border bg-card shadow-sm ${
        className ?? ""
      }`}
    >
      <header className="flex items-center gap-3 border-b border-border p-6">
        {icon ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            {icon}
          </div>
        ) : null}
        <div>
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          {description ? (
            <p className="text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </header>
      <div className="p-6">{children}</div>
    </section>
  );
}
