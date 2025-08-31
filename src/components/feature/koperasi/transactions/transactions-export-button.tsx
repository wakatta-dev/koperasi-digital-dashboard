/** @format */

"use client";

import { Button } from "@/components/ui/button";
import { getTenantId } from "@/services/api";
import { getAccessToken } from "@/services/auth";
import { getTransactionsExportPath } from "@/services/api/transactions";
import { Download } from "lucide-react";

type Props = { params?: Record<string, string | number>; format?: "csv" | "xlsx" };

export function TransactionsExportButton({ params, format = "csv" }: Props) {
  async function handleExport() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const path = getTransactionsExportPath({ ...(params ?? {}), format });
    const url = `${baseUrl}${path}`;
    const token = await getAccessToken();
    const tenantId = await getTenantId();
    const res = await fetch(url, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(tenantId ? { "X-Tenant-ID": String(tenantId) } : {}),
      },
    });
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `transactions.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <Button variant="outline" onClick={handleExport}>
      <Download className="h-4 w-4 mr-2" /> Export {format.toUpperCase()}
    </Button>
  );
}

