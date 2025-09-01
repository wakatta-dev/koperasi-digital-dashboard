/** @format */

import { getVendorFinancialReport, getVendorUsageReport, listVendorReportExports } from "@/services/api/vendor";
import VendorReportsClient from "@/components/feature/vendor/reports/vendor-reports-client";

export const dynamic = "force-dynamic";

export default async function VendorReportsPage() {
  const [finRes, useRes, expRes] = await Promise.all([
    getVendorFinancialReport().catch(() => null),
    getVendorUsageReport().catch(() => null),
    listVendorReportExports().catch(() => null),
  ]);

  return (
    <VendorReportsClient
      initialFinancial={finRes?.data}
      initialUsage={useRes?.data}
      initialExports={expRes?.data}
    />
  );
}

