/** @format */

"use client";

import type { ReactNode } from "react";
import { type TenantSettingsSectionId } from "../../lib/settings";

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
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-8">
      <div className="space-y-6">{children}</div>
    </div>
  );
}
