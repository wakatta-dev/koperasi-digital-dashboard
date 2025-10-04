/** @format */

"use client";

import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useVendorDashboardFilters,
  type VendorSubscriptionStatusFilter,
  type VendorTenantTypeFilter,
} from "./vendor-dashboard-filter-context";

const tenantTypeOptions: Array<{ label: string; value: VendorTenantTypeFilter }> = [
  { label: "Semua Tenant", value: "all" },
  { label: "Koperasi", value: "koperasi" },
  { label: "BUMDes", value: "bumdes" },
  { label: "UMKM", value: "umkm" },
];

const subscriptionStatusOptions: Array<{
  label: string;
  value: VendorSubscriptionStatusFilter;
}> = [
  { label: "Semua Status", value: "all" },
  { label: "Aktif", value: "active" },
  { label: "Masa Uji Coba", value: "trial" },
  { label: "Dibatalkan", value: "cancelled" },
  { label: "Kedaluwarsa", value: "expired" },
];

export function VendorDashboardGlobalFilters() {
  const {
    filters,
    setDateRange,
    setTenantType,
    setSubscriptionStatus,
    reset,
  } = useVendorDashboardFilters();

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 py-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <DateRangePicker
            label="Rentang Tanggal"
            value={{
              start: filters.dateRange?.from,
              end: filters.dateRange?.to,
            }}
            onChange={(_, __, dates) => {
              setDateRange(
                dates?.start || dates?.end
                  ? { from: dates?.start, to: dates?.end }
                  : null,
              );
            }}
            triggerClassName="sm:w-[260px]"
          />

          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">
              Tipe Tenant
            </span>
            <Select
              value={filters.tenantType}
              onValueChange={(value: VendorTenantTypeFilter) => setTenantType(value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Pilih tipe tenant" />
              </SelectTrigger>
              <SelectContent>
                {tenantTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">
              Status Langganan
            </span>
            <Select
              value={filters.subscriptionStatus}
              onValueChange={(value: VendorSubscriptionStatusFilter) =>
                setSubscriptionStatus(value)
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                {subscriptionStatusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            className="gap-2"
          >
            <RefreshCcw className="h-4 w-4" /> Reset
          </Button>
          <div className="rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground">
            Filter diterapkan secara global untuk semua widget
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
