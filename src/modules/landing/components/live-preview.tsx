/** @format */

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type LandingLivePreviewProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  titleClassName?: string;
  headerExtra?: ReactNode;
  contentClassName?: string;
  sticky?: boolean;
};

export function LandingLivePreview({
  title = "Live Preview",
  description,
  children,
  className,
  headerClassName,
  titleClassName,
  headerExtra,
  contentClassName,
  sticky = false,
}: LandingLivePreviewProps) {
  const content = (
    <div
      className={cn(
        "bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden",
        className
      )}
    >
      <div
        className={cn(
          "p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center",
          headerClassName
        )}
      >
        <h3
          className={cn(
            "text-sm font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider",
            titleClassName
          )}
        >
          {title}
        </h3>
        {headerExtra ?? (
          <span className="material-symbols-outlined text-gray-400 text-sm">preview</span>
        )}
      </div>
      <div
        className={cn(
          "p-8 bg-gray-100 dark:bg-gray-900/50 flex flex-col items-center",
          contentClassName
        )}
      >
        {children}
        {description ? (
          <div className="text-center mt-4 px-2">
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark leading-relaxed">
              {description}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );

  if (!sticky) return content;

  return <div className="sticky top-6">{content}</div>;
}
