/** @format */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  tenantSettingsSections,
  type TenantSettingsSectionId,
} from "../../lib/settings";

type TenantSettingsSummaryItem = {
  label: string;
  value: string;
  helper?: string;
};

type TenantSettingsShellProps = {
  sectionId: TenantSettingsSectionId;
  title: string;
  description: string;
  summaryTitle?: string;
  summaryDescription?: string;
  summaryItems?: TenantSettingsSummaryItem[];
  children: ReactNode;
};

export function TenantSettingsShell({ children }: TenantSettingsShellProps) {
  const pathname = usePathname();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-8">
      <nav
        aria-label="Navigasi pengaturan tenant"
        className="overflow-x-auto pb-1"
      >
        <div className="inline-flex min-w-full gap-2 rounded-2xl border border-slate-200/80 bg-white/80 p-2 shadow-[0_18px_42px_-38px_rgba(15,23,42,0.7)] dark:border-slate-800 dark:bg-slate-950/85">
          {tenantSettingsSections.map((section) => {
            const Icon = section.icon;
            const isActive =
              pathname === section.href ||
              pathname.startsWith(`${section.href}/`);

            return (
              <Link
                key={section.id}
                href={section.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex min-w-[168px] flex-1 items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15 dark:hover:bg-slate-900",
                  isActive
                    ? "bg-slate-950 text-white shadow-[0_16px_36px_-28px_rgba(15,23,42,0.9)] dark:bg-white dark:text-slate-950"
                    : "text-slate-700 dark:text-slate-200",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition-colors",
                    isActive
                      ? "border-white/20 bg-white/10 text-white dark:border-slate-200 dark:bg-slate-100 dark:text-slate-950"
                      : "border-slate-200 bg-slate-50 text-slate-600 group-hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:group-hover:bg-slate-950",
                  )}
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold tracking-tight">
                    {section.title}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 block truncate text-xs",
                      isActive
                        ? "text-white/75 dark:text-slate-600"
                        : "text-slate-500 dark:text-slate-400",
                    )}
                  >
                    {section.shortTitle}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="space-y-6">{children}</div>
    </div>
  );
}
