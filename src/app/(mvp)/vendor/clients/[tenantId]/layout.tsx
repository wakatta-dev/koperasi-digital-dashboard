/** @format */

import type { ReactNode } from "react";
import { VendorClientDetailShell } from "@/modules/vendor";

type VendorClientLayoutProps = {
  children: ReactNode;
  params: Promise<{
    tenantId: string;
  }>;
};

export default async function VendorClientLayout({
  children,
  params,
}: VendorClientLayoutProps) {
  const { tenantId } = await params;
  return <VendorClientDetailShell tenantId={tenantId}>{children}</VendorClientDetailShell>;
}
